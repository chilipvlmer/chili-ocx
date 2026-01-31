import { readFile, access } from 'fs/promises';
import { join } from 'path';

/**
 * Reads a knowledge skill file from registry or local path.
 * 
 * Strategy:
 * 1. Check Registry: files/skills/{name}/SKILL.md
 * 2. Check Local: .opencode/skills/{name}.md
 * 
 * @param name Skill name (e.g. "prd-methodology")
 * @param projectRoot Root directory of the project
 * @returns The content of the skill file
 * @throws Error if skill not found
 */
export async function readSkill(name: string, projectRoot: string): Promise<string> {
  // Security check: simple regex to prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error(`Invalid skill name: "${name}". Must match /^[a-zA-Z0-9_-]+$/.`);
  }

  // 1. Try Registry Path (files/skills/{name}/SKILL.md)
  // Note: We need to locate where the registry files are relative to the running plugin.
  // When running in dev (e.g. inside chili-ocx), process.cwd() is the repo root.
  // When running as installed plugin, we assume 'files' is not available directly 
  // unless we are in the repo itself or it's bundled.
  
  // Wait, for the 'skill' tool to work for the user, it needs to read from the 
  // *user's* project if it's a local skill, or from the *embedded* registry if it's a standard skill.
  // But standard skills are Markdown files. Are they bundled?
  // 
  // In the RFC it says:
  // Search Paths:
  // - files/skills/{name}/SKILL.md (Registry)
  // - .opencode/skills/{name}.md (Local)
  
  // This assumes the plugin has access to the registry files.
  // If this plugin is running inside the chili-ocx repo (as we are now), 
  // `files/skills` is at the root.
  
  const registryPath = join(projectRoot, 'files', 'skills', name, 'SKILL.md');
  
  try {
    await access(registryPath);
    const content = await readFile(registryPath, 'utf-8');
    return content;
  } catch (err) {
    // Not found in registry, try local
  }

  // 2. Try Local Path (.opencode/skills/{name}.md)
  const localPath = join(projectRoot, '.opencode', 'skills', `${name}.md`);
  
  try {
    await access(localPath);
    const content = await readFile(localPath, 'utf-8');
    return content;
  } catch (err) {
    // Not found in local either
    throw new Error(`Skill "${name}" not found in registry (${registryPath}) or local (${localPath}).`);
  }
}

export async function listAvailableSkills(projectRoot: string): Promise<string[]> {
    // TODO: Implement listing logic if needed
    return [];
}
