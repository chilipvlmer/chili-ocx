import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { Skill, SkillStep } from './loader.js';
import { join } from 'path';

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
      } catch (error) {
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
      default:
        console.warn(`[SkillRunner] Unknown step type: ${step.type}. Skipping.`);
        return { skipped: true, reason: 'unknown_type' };
    }
  }

  private resolveVariables(template: string): string {
    if (typeof template !== 'string') return template;
    
    // Replace ${inputs.var} or ${steps.stepName.output}
    return template.replace(/\$\{([^}]+)\}/g, (_, path) => {
      const value = this.getValueByPath(path);
      return value !== undefined ? String(value) : `\${${path}}`;
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
    
    // Safety check: Don't run purely dangerous things? 
    // For now we assume the user/skill is trusted, but we logs.
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

  private async runRegexScanStep(step: SkillStep): Promise<any> {
    const rawFile = step.file;
    const rawPattern = step.pattern;
    
    if (!rawFile) throw new Error(`Step ${step.name} (regex_scan) missing 'file' property`);
    if (!rawPattern) throw new Error(`Step ${step.name} (regex_scan) missing 'pattern' property`);

    const filePath = this.resolveVariables(rawFile);
    // Note: pattern is usually a string from YAML/MD, need to be careful with escaping if it comes from user input
    // But here it comes from the skill definition.
    
    // TODO: Verify if file path is absolute or relative?
    // Assume relative to CWD if not absolute.
    const resolvedPath = filePath.startsWith('/') ? filePath : join(process.cwd(), filePath);
    
    console.log(`[SkillRunner] Scanning file: ${resolvedPath}`);
    
    const content = await readFile(resolvedPath, 'utf-8');
    const regex = new RegExp(rawPattern, step.flags || 'g'); // Default global?
    
    const found = regex.test(content);
    
    if (step.fail_if_match && found) {
      throw new Error(`[Security] Regex match found in ${filePath}: ${rawPattern}`);
    }
    
    if (step.fail_if_no_match && !found) {
      throw new Error(`[Validation] Regex NOT found in ${filePath}: ${rawPattern}`);
    }

    return {
      found,
      matches: found ? content.match(regex) : []
    };
  }

  private async runLlmGenerateStep(step: SkillStep): Promise<any> {
    console.log(`[SkillRunner] LLM Generation (STUB) for step: ${step.name}`);
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock data
    // If the step has a 'mock_output' property, use that, otherwise default.
    return {
      content: step.mock_output || `[MOCK LLM OUTPUT for ${step.name}]\nBased on prompt: ${step.prompt?.substring(0, 50)}...`,
      model: "mock-model-001"
    };
  }
}
