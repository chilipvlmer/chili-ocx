import { exec } from 'child_process';
import { readFile, stat, readdir } from 'fs/promises';
import { promisify } from 'util';
import { Skill, SkillStep } from './loader.js';
import { join, basename } from 'path';

const execAsync = promisify(exec);

export interface SkillExecutionContext {
  inputs: Record<string, any>;
  steps: Record<string, any>;
  [key: string]: any;
}

export class SkillRunner {
  private skill: Skill;
  private inputs: Record<string, any>;
  private context: SkillExecutionContext;

  constructor(skill: Skill, inputs: Record<string, any>) {
    this.skill = skill;
    this.inputs = inputs;
    this.context = {
      inputs,
      steps: {}
    };
  }

  /**
   * Execute the skill steps sequentially
   */
  async execute(): Promise<SkillExecutionContext> {
    console.log(`[SkillRunner] Starting execution of skill: ${this.skill.name}`);

    for (const step of this.skill.steps) {
      console.log(`[SkillRunner] Executing step: ${step.name} (${step.type})`);
      
      try {
        const output = await this.executeStep(step);
        this.context.steps[step.name] = output;
      } catch (error: any) {
        if (error.name === 'InteractiveHaltError') {
            console.log(`[SkillRunner] Execution halted for interactive confirmation.`);
            // We treat this as a "success" but with a special final state?
            // Or just return what we have so far, plus the proposal.
            // But the caller expects context.
            // Let's add the proposal to context and stop.
            this.context.halted = true;
            this.context.proposal = error.message;
            return this.context;
        }

        console.error(`[SkillRunner] Step ${step.name} failed:`, error);
        throw error; // Fail fast as per philosophy
      }
    }

    console.log(`[SkillRunner] Execution complete.`);
    return this.context;
  }

  private async executeStep(step: SkillStep): Promise<any> {
    switch (step.type) {
      case 'shell':
        return this.runShellStep(step);
      case 'regex_scan':
        return this.runRegexScanStep(step);
      case 'llm_generate':
        return this.runLlmGenerateStep(step);
      case 'interactive':
        return this.runInteractiveStep(step);
      default:
        console.warn(`[SkillRunner] Unknown step type: ${step.type}. Skipping.`);
        return { skipped: true, reason: 'unknown_type' };
    }
  }

  private resolveVariables(template: string): string {
    if (typeof template !== 'string') return template;
    
    // Replace ${inputs.var} or ${steps.stepName.output} or ${var || default}
    return template.replace(/\$\{([^}]+)\}/g, (_, expression) => {
      const [path, defaultValue] = expression.split('||').map((s: string) => s.trim());
      const value = this.getValueByPath(path);
      
      if (value === undefined || value === null || value === '') {
         if (defaultValue) {
             // Strip quotes if present in default value
             return defaultValue.replace(/^['"]|['"]$/g, '');
         }
         // Task 1: Ensure undefined inputs resolve to empty string
         return '';
      }
      return String(value);
    });
  }

  private getValueByPath(path: string): any {
    const parts = path.split('.');
    let current: any = this.context;
    
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    
    return current;
  }

  private async runShellStep(step: SkillStep): Promise<any> {
    const rawCommand = step.command;
    if (!rawCommand) throw new Error(`Step ${step.name} (shell) missing 'command' property`);

    const command = this.resolveVariables(rawCommand);
    
    // Permission check
    this.checkPermission(command);

    console.log(`[SkillRunner] Shell command: ${command}`);

    // We default to running in CWD unless specified
    const cwd = step.cwd ? this.resolveVariables(step.cwd) : process.cwd();

    try {
      const { stdout, stderr } = await execAsync(command, { cwd });
      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0 // execAsync throws if exitCode != 0
      };
    } catch (error: any) {
      // Return error info instead of throwing if we want to allow handling?
      // "Fail Loud, Fail Fast" -> Throw unless 'ignore_errors' is set.
      if (step.ignore_errors) {
         return {
          stdout: error.stdout?.trim(),
          stderr: error.stderr?.trim(),
          exitCode: error.code,
          error: error.message
        };
      }
      throw error;
    }
  }

  /**
   * Basic permission check for shell commands
   */
  private checkPermission(command: string): void {
    const trimmed = command.trim();
    
    // Explicitly Allow
    if (trimmed.startsWith('git ')) return;
    if (trimmed.startsWith('npm test')) return;
    
    // Explicitly Block (Safety)
    if (trimmed.includes('rm -rf /')) {
        throw new Error(`[Security] Command blocked: ${command}`);
    }
    
    // Allow others with warning (for now)
    console.warn(`[Security] Unchecked command allowed: ${command}`);
  }

  private async runRegexScanStep(step: SkillStep): Promise<any> {
    const rawFile = step.file;
    const rawPattern = step.pattern;
    
    if (!rawFile) throw new Error(`Step ${step.name} (regex_scan) missing 'file' property`);
    if (!rawPattern) throw new Error(`Step ${step.name} (regex_scan) missing 'pattern' property`);

    // Resolve variables (now handles defaults like ${inputs.file || .})
    const filePath = this.resolveVariables(rawFile) || '.';

    const filesToScan: string[] = [];
    const cwd = process.cwd();

    // Strategy: Use git ls-files if possible, otherwise recursive scan
    let usedGit = false;
    
    try {
        // Try git ls-files first as it's safer and respects .gitignore
        // We only use it if we are in a git repo
        const { stdout } = await execAsync('git rev-parse --is-inside-work-tree', { cwd });
        if (stdout.trim() === 'true') {
            // Construct git command
            // If filePath is '.' or directory, git ls-files lists everything in it
            // If filePath is a glob, git ls-files accepts pathspecs
            // INCLUDE UNTRACKED FILES: --others --exclude-standard
            // We also include --cached (tracked files)
            const cmd = `git ls-files --cached --others --exclude-standard "${filePath}"`; // Quote to handle spaces
            const { stdout: filesOut } = await execAsync(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 });
            const gitFiles = filesOut.split('\n').filter(f => f.trim() !== '');
            
            if (gitFiles.length > 0) {
                filesToScan.push(...gitFiles);
                usedGit = true;
            }
        }
    } catch (e) {
        // Git failed or not a repo, fall back to manual
        console.warn(`[SkillRunner] git ls-files failed, falling back to recursive scan:`, e);
    }

    if (!usedGit) {
        // Fallback: Recursive scan
        const collectFiles = async (dir: string) => {
            try {
                const entries = await readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const res = join(dir, entry.name);
                    if (entry.isDirectory()) {
                        if (entry.name !== '.git' && entry.name !== 'node_modules') {
                            await collectFiles(res);
                        }
                    } else {
                        filesToScan.push(res);
                    }
                }
            } catch (err: any) {
                // If not a directory, maybe it's a file
                if (err.code === 'ENOTDIR') {
                    filesToScan.push(dir);
                }
            }
        };

        // If filePath is a glob (contains *), we can't really handle it well without a library
        // But if it's a simple path:
        if (filePath.includes('*')) {
             console.warn(`[SkillRunner] Globs not fully supported in fallback mode. Using as-is: ${filePath}`);
             filesToScan.push(filePath); 
        } else {
             await collectFiles(filePath);
        }
    }

    // Iterate over files
    for (const file of filesToScan) {
        // Skip if contains * (unresolved glob)
        if (file.includes('*')) continue; 

        const resolvedPath = file.startsWith('/') ? file : join(cwd, file);
        
        try {
            // Stat first to ensure it's a file (git ls-files returns files, but fallback might not)
            const stats = await stat(resolvedPath);
            if (!stats.isFile()) continue;

            const content = await readFile(resolvedPath, 'utf-8');
            
            // JS regex doesn't support (?i) flag inline, must use flags argument
            // But pattern might have it. Strip it if present and add 'i' flag.
            let safePattern = rawPattern;
            let flags = step.flags || 'g';
            
            if (safePattern.startsWith('(?i)')) {
                safePattern = safePattern.substring(4);
                if (!flags.includes('i')) flags += 'i';
            }

            const regex = new RegExp(safePattern, flags);
            const found = regex.test(content);
            
            if (step.fail_if_match && found) {
              throw new Error(`[Security] Regex match found in ${file}: ${rawPattern}`);
            }
            
            if (step.fail_if_no_match && !found) {
              throw new Error(`[Validation] Regex NOT found in ${file}: ${rawPattern}`);
            }
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                console.warn(`[SkillRunner] File not found for scan: ${resolvedPath}`);
                continue;
            }
            throw err;
        }
    }

    return {
      scanned: filesToScan,
      status: "clean"
    };
  }

  private async runLlmGenerateStep(step: SkillStep): Promise<any> {
    console.log(`[SkillRunner] LLM Generation (STUB) for step: ${step.name}`);
    
    // Task 2.3: "If no real LLM access, implement a 'Template' message generator"
    // We check if we have a real LLM client (unlikely here).
    // So we use a heuristic based on the prompt content.
    
    // Parse the prompt to find the file name and maybe diff
    const prompt = this.resolveVariables(step.prompt || '');
    
    // Simple Heuristic for Commit Messages
    let message = "chore: update file";
    
    // Try to extract filename from prompt if it follows "File: <name>"
    const fileMatch = prompt.match(/File:\s*(.+)/);
    if (fileMatch) {
        const filename = basename(fileMatch[1].trim());
        message = `fix(${filename}): update ${filename}`;
    }
    
    // Chunking logic (Task 2.5)
    // If diff is huge, we might truncate or just say "large update"
    // The prompt contains the diff.
    if (prompt.length > 10000) {
        console.warn(`[SkillRunner] Diff is too large (${prompt.length} chars). Truncating for heuristic.`);
        // We might want to use a generic message if diff is massive
        message = message.replace('fix', 'feat').replace('update', 'major update to');
    }
    
    // Allow user override via mock_output
    if (step.mock_output) {
        message = step.mock_output;
    }

    return {
      content: message,
      model: "heuristic-v1"
    };
  }

  private async runInteractiveStep(step: SkillStep): Promise<any> {
    const confirm = this.inputs.confirm;
    console.log(`[SkillRunner] Interactive step '${step.name}'. Confirm=${confirm}`);

    if (confirm === true || confirm === 'true') {
        console.log(`[SkillRunner] User confirmed step '${step.name}'. Continuing.`);
        return { confirmed: true };
    }

    // Stop execution and return proposal
    const previousStepName = step.input_source; // e.g. "generate_message"
    let previousOutput = "No output available";
    
    if (previousStepName && this.context.steps[previousStepName]) {
        // Try to get content or standard output
        const prev = this.context.steps[previousStepName];
        previousOutput = prev.content || prev.stdout || JSON.stringify(prev);
    } else {
        // Fallback: look at last step
        const stepNames = Object.keys(this.context.steps);
        if (stepNames.length > 0) {
             const last = this.context.steps[stepNames[stepNames.length - 1]];
             previousOutput = last.content || last.stdout || JSON.stringify(last);
        }
    }

    const proposalMsg = `PROPOSAL: ${previousOutput}. To execute, re-run with confirm=true.`;
    
    // We throw a special error or return a special state to stop execution?
    // The requirement says "STOP Execution" and "Return a special result".
    // If we throw, the execute() loop catches it.
    // Let's throw a special "InteractiveHalt" or similar, OR return a structure that execute() understands.
    
    // Actually, execute() loop catches errors and rethrows.
    // If we want to stop gracefully, we should throw a specific control flow error.
    throw new InteractiveHaltError(proposalMsg);
  }
}

export class InteractiveHaltError extends Error {
    constructor(public proposal: string) {
        super(proposal);
        this.name = "InteractiveHaltError";
    }
}
