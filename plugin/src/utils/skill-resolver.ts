import { join } from "path";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";

export interface SkillResolution {
  name: string;
  content: string;
  source: 'registry' | 'local' | 'not-found';
  path: string;
  availableSkills?: string[];
}

export class SkillResolver {
  private registryPath: string;
  private localPath: string;

  constructor(ctxDirectory: string) {
    // Registry path: files/skills/{name}/SKILL.md
    this.registryPath = join(ctxDirectory, 'files/skills');
    
    // Local path: .opencode/skills/{name}.md
    this.localPath = join(ctxDirectory, '.opencode/skills');
  }

  async resolve(name: string): Promise<SkillResolution> {
    try {
      const safeName = this.sanitize(name);
      
      // 1. Check Registry (files/skills/{name}/SKILL.md)
      const registryFile = join(this.registryPath, safeName, 'SKILL.md');
      if (existsSync(registryFile)) {
        return {
          name,
          content: readFileSync(registryFile, 'utf-8'),
          source: 'registry',
          path: registryFile
        };
      }

      // 2. Check Local (.opencode/skills/{name}.md)
      const localFile = join(this.localPath, `${safeName}.md`);
      if (existsSync(localFile)) {
        return {
          name,
          content: readFileSync(localFile, 'utf-8'),
          source: 'local',
          path: localFile
        };
      }

      // 3. Not found
      const available = await this.listAvailable();
      return {
        name,
        content: '',
        source: 'not-found',
        path: '',
        availableSkills: available
      };

    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid skill name') {
        throw error;
      }
      // Return not-found for generic errors during lookup
      const available = await this.listAvailable();
      return {
        name,
        content: '',
        source: 'not-found',
        path: '',
        availableSkills: available
      };
    }
  }

  private sanitize(name: string): string {
    // Only allow alphanumeric, hyphens, underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new Error('Invalid skill name. Use alphanumeric, hyphens, and underscores only.');
    }
    return name;
  }

  private async listAvailable(): Promise<string[]> {
    const skills = new Set<string>();

    // Scan Registry
    if (existsSync(this.registryPath)) {
      try {
        const files = readdirSync(this.registryPath);
        for (const file of files) {
          const fullPath = join(this.registryPath, file);
          if (statSync(fullPath).isDirectory()) {
            if (existsSync(join(fullPath, 'SKILL.md'))) {
              skills.add(file);
            }
          }
        }
      } catch (e) {
        // Ignore read errors
      }
    }

    // Scan Local
    if (existsSync(this.localPath)) {
      try {
        const files = readdirSync(this.localPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            skills.add(file.replace('.md', ''));
          }
        }
      } catch (e) {
        // Ignore read errors
      }
    }

    return Array.from(skills).sort();
  }
}
