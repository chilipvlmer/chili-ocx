import { Skill } from './loader';
import { tool } from '@opencode-ai/plugin';

/**
 * Registry to manage available skills and expose them as tools
 */
export class SkillRegistry {
  private skills: Map<string, Skill>;

  constructor() {
    this.skills = new Map();
  }

  /**
   * Register a new skill
   */
  register(skill: Skill): void {
    if (this.skills.has(skill.name)) {
      console.warn(`Overwriting existing skill: ${skill.name}`);
    }
    this.skills.set(skill.name, skill);
  }

  /**
   * Get all registered skills
   */
  getSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get a specific skill by name
   */
  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  /**
   * Generate tool definitions for all registered skills.
   * 
   * Each skill becomes a tool named `skill_<skill_name>`.
   * The tool's arguments are derived from the skill's `inputs` definition.
   * 
   * @returns A record of tool definitions compatible with the plugin system
   */
  getTools(): Record<string, any> {
    const tools: Record<string, any> = {};

    for (const skill of this.skills.values()) {
      const toolName = `skill_${skill.name}`;
      
      // Build argument schema from skill inputs
      const argsSchema: Record<string, any> = {};
      
      if (skill.inputs) {
        for (const [key, config] of Object.entries(skill.inputs)) {
          // Default to string if type not specified
          // In a real implementation, we'd map more types (number, boolean, enum)
          // based on config.type
          const type = (config as any).type || 'string';
          const description = (config as any).description || '';
          
          let schemaBuilder;
          
          switch (type) {
            case 'string':
              schemaBuilder = tool.schema.string();
              break;
            case 'number':
              schemaBuilder = tool.schema.number();
              break;
            case 'boolean':
              schemaBuilder = tool.schema.boolean();
              break;
            // TODO: Add support for enums/arrays if needed by skill spec
            default:
              schemaBuilder = tool.schema.string();
          }
          
          if (description) {
            schemaBuilder = schemaBuilder.describe(description);
          }
          
          // Note: The plugin tool helper schema doesn't seem to support 'required' 
          // explicitly in the chain yet (based on types seen elsewhere), 
          // usually it's implied or handled by validation.
          
          argsSchema[key] = schemaBuilder;
        }
      }

      tools[toolName] = tool({
        description: `[SKILL] ${skill.description}`,
        args: argsSchema,
        execute: async (args, context) => {
          // This is a placeholder. The actual execution logic will be handled 
          // by the SkillRunner in Task 1.4.
          // For now, we just return an acknowledgement.
          console.log(`Executing skill ${skill.name} with args:`, args);
          return `Skill ${skill.name} executed (Mock). Implementation pending in Task 1.4.`;
        }
      });
    }

    return tools;
  }
}
