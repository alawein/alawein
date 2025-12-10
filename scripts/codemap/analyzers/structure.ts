/**
 * Structure Analyzer - Analyzes repository directory structure
 */

import fs from 'fs';
import path from 'path';

export interface DirectoryInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: DirectoryInfo[];
  size?: number;
  itemCount?: number;
}

export interface StructureAnalysis {
  root: string;
  platforms: DirectoryInfo[];
  packages: DirectoryInfo[];
  organizations: DirectoryInfo[];
  workflows: DirectoryInfo[];
  docs: DirectoryInfo[];
  stats: {
    totalFiles: number;
    totalDirs: number;
    platformCount: number;
    packageCount: number;
    workflowCount: number;
    docCount: number;
  };
}

export class StructureAnalyzer {
  private rootDir: string;
  private ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo'];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  analyze(): StructureAnalysis {
    const platforms = this.analyzeDirectory(path.join(this.rootDir, 'platforms'), 1);
    const packages = this.analyzeDirectory(path.join(this.rootDir, 'packages'), 1);
    const organizations = this.analyzeDirectory(path.join(this.rootDir, 'organizations'), 1);
    const workflows = this.analyzeDirectory(path.join(this.rootDir, '.github', 'workflows'), 1);
    const docs = this.analyzeDirectory(path.join(this.rootDir, 'docs'), 1);

    return {
      root: this.rootDir,
      platforms: platforms?.children || [],
      packages: packages?.children || [],
      organizations: organizations?.children || [],
      workflows: workflows?.children || [],
      docs: docs?.children || [],
      stats: {
        totalFiles: this.countFiles(this.rootDir),
        totalDirs: this.countDirs(this.rootDir),
        platformCount: platforms?.children?.length || 0,
        packageCount: packages?.children?.length || 0,
        workflowCount: workflows?.children?.filter((f) => f.name.endsWith('.yml')).length || 0,
        docCount: this.countFiles(path.join(this.rootDir, 'docs'), '.md'),
      },
    };
  }

  private analyzeDirectory(dirPath: string, depth: number): DirectoryInfo | null {
    if (!fs.existsSync(dirPath)) {
      return null;
    }

    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);

    if (stats.isFile()) {
      return {
        name,
        path: dirPath,
        type: 'file',
        size: stats.size,
      };
    }

    if (this.ignoreDirs.includes(name)) {
      return null;
    }

    const children: DirectoryInfo[] = [];

    if (depth > 0) {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        if (this.ignoreDirs.includes(item)) continue;

        const itemPath = path.join(dirPath, item);
        const child = this.analyzeDirectory(itemPath, depth - 1);

        if (child) {
          children.push(child);
        }
      }
    }

    return {
      name,
      path: dirPath,
      type: 'directory',
      children: children.sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }),
      itemCount: this.countItems(dirPath),
    };
  }

  private countItems(dirPath: string): number {
    if (!fs.existsSync(dirPath)) return 0;

    let count = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      if (this.ignoreDirs.includes(item)) continue;

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        count += this.countItems(itemPath);
      } else {
        count++;
      }
    }

    return count;
  }

  private countFiles(dirPath: string, extension?: string): number {
    if (!fs.existsSync(dirPath)) return 0;

    let count = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      if (this.ignoreDirs.includes(item)) continue;

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        count += this.countFiles(itemPath, extension);
      } else if (!extension || item.endsWith(extension)) {
        count++;
      }
    }

    return count;
  }

  private countDirs(dirPath: string): number {
    if (!fs.existsSync(dirPath)) return 0;

    let count = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      if (this.ignoreDirs.includes(item)) continue;

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        count++;
        count += this.countDirs(itemPath);
      }
    }

    return count;
  }
}
