import { readFile, readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

export interface SkillStep {
  name: string;
  type: string;
  [key: string]: any;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version?: string;
  steps: SkillStep[];
  [key: string]: any;
}

/**
 * Basic YAML-like parser for Frontmatter and Step configs.
 * Supports key: value pairs.
 */
function parseYamlLike(text: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = text.split('\n');
  
  let currentKey: string | null = null;
  let multilineValue: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      // Flush previous multiline if any
      if (currentKey) {
        if (multilineValue.length > 0) {
          result[currentKey] = multilineValue.join('\n').trim();
        }
        multilineValue = [];
      }

      const key = match[1];
      const value = match[2];
      
      if (value) {
        // Direct value
        // simple parsing of booleans and numbers
        if (value === 'true') result[key] = true;
        else if (value === 'false') result[key] = false;
        else if (!isNaN(Number(value))) result[key] = Number(value);
        else result[key] = value; // String
        currentKey = null; 
      } else {
        // Start of multiline or just empty
        currentKey = key;
        result[key] = '';
      }
    } else if (currentKey) {
      // Continuation of previous key
      multilineValue.push(line); // Preserve indentation? For now, raw line.
    }
  }

  // Flush last
  if (currentKey && multilineValue.length > 0) {
    result[currentKey] = multilineValue.join('\n').trim();
  }

  return result;
}

/**
 * Parse a markdown skill file
 */
export async function parseSkill(filePath: string): Promise<Skill> {
  const content = await readFile(filePath, 'utf-8');
  const filename = basename(filePath, extname(filePath));

  // 1. Extract Frontmatter
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  const fmMatch = content.match(fmRegex);
  
  let metadata: Record<string, any> = {};
  let body = content;

  if (fmMatch) {
    metadata = parseYamlLike(fmMatch[1]);
    body = content.substring(fmMatch[0].length);
  }

  // Defaults
  const skill: Skill = {
    id: filename,
    name: metadata.name || filename,
    description: metadata.description || '',
    version: metadata.version || '0.0.1',
    steps: [],
    ...metadata
  };

  // 2. Parse Steps
  // Assumption: Steps are defined by H2 headers (## step-name)
  // Content under the header is the config for that step.
  
  const stepSplitRegex = /^##\s+(.*)$/gm;
  let match;
  const indices: { name: string, start: number }[] = [];

  while ((match = stepSplitRegex.exec(body)) !== null) {
    indices.push({ name: match[1].trim(), start: match.index });
  }

  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const next = indices[i + 1];
    
    const startPos = current.start + (`## ${current.name}`).length;
    const endPos = next ? next.start : body.length;
    
    const stepContent = body.substring(startPos, endPos).trim();
    const stepConfig = parseYamlLike(stepContent);

    skill.steps.push({
      name: current.name,
      type: stepConfig.type || 'unknown',
      ...stepConfig
    });
  }

  return skill;
}

/**
 * Load all skills from a directory
 */
export async function loadSkills(dir: string): Promise<Skill[]> {
  try {
    const stats = await stat(dir);
    if (!stats.isDirectory()) return [];

    const files = await readdir(dir);
    const skills: Skill[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        try {
          const skill = await parseSkill(join(dir, file));
          skills.push(skill);
        } catch (err) {
          console.error(`Failed to parse skill ${file}:`, err);
        }
      }
    }

    return skills;
  } catch (error) {
    // If dir doesn't exist, return empty
    return [];
  }
}
