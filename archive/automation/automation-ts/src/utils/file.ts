import { readFileSync, existsSync, statSync } from 'fs';
import { resolve } from 'path';
import { load as loadYaml } from 'js-yaml';

// Base path for automation assets - points to the Python automation folder
// This allows the TS CLI to use the same YAML configs and prompts
export const AUTOMATION_PATH = resolve(__dirname, '..', '..', '..', 'automation');

export function loadYamlFile(filePath: string): any {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return loadYaml(content) || {};
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    return {};
  }
}

export function loadMarkdownFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading markdown file ${filePath}:`, error);
    return '';
  }
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function getFileSize(filePath: string): number {
  try {
    const stats = statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}
