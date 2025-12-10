/**
 * Component Analyzer - Analyzes React component structure
 */

import fs from 'fs';
import path from 'path';

export interface ComponentInfo {
  name: string;
  path: string;
  type: 'component' | 'hook' | 'context' | 'provider' | 'page' | 'layout';
  exports: string[];
  imports: string[];
  children?: ComponentInfo[];
}

export interface ComponentAnalysis {
  uiComponents: ComponentInfo[];
  features: ComponentInfo[];
  hooks: ComponentInfo[];
  providers: ComponentInfo[];
  pages: ComponentInfo[];
  stats: {
    totalComponents: number;
    totalHooks: number;
    totalProviders: number;
    totalPages: number;
  };
}

export class ComponentAnalyzer {
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  analyze(): ComponentAnalysis {
    const uiComponents = this.analyzeUIPackage();
    const features = this.analyzeFeatures();
    const hooks = this.analyzeHooks();
    const providers = this.findProviders();
    const pages = this.analyzePages();

    return {
      uiComponents,
      features,
      hooks,
      providers,
      pages,
      stats: {
        totalComponents: uiComponents.length + features.length,
        totalHooks: hooks.length,
        totalProviders: providers.length,
        totalPages: pages.length,
      },
    };
  }

  private analyzeUIPackage(): ComponentInfo[] {
    const uiPath = path.join(this.rootDir, 'packages', 'ui', 'src', 'components');
    return this.scanComponentDirectory(uiPath);
  }

  private analyzeFeatures(): ComponentInfo[] {
    const featuresPath = path.join(this.rootDir, 'src', 'features');
    if (!fs.existsSync(featuresPath)) return [];

    const features: ComponentInfo[] = [];
    const dirs = fs.readdirSync(featuresPath);

    for (const dir of dirs) {
      const featurePath = path.join(featuresPath, dir);
      if (fs.statSync(featurePath).isDirectory()) {
        features.push({
          name: dir,
          path: featurePath,
          type: 'component',
          exports: this.getExports(featurePath),
          imports: [],
          children: this.scanComponentDirectory(featurePath),
        });
      }
    }

    return features;
  }

  private analyzeHooks(): ComponentInfo[] {
    const hooksPath = path.join(this.rootDir, 'src', 'hooks');
    if (!fs.existsSync(hooksPath)) return [];

    const hooks: ComponentInfo[] = [];
    const files = fs.readdirSync(hooksPath);

    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const filePath = path.join(hooksPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const hookNames = this.extractHookNames(content);

        hooks.push({
          name: file.replace(/\.(ts|tsx)$/, ''),
          path: filePath,
          type: 'hook',
          exports: hookNames,
          imports: this.extractImports(content),
        });
      }
    }

    return hooks;
  }

  private findProviders(): ComponentInfo[] {
    const providers: ComponentInfo[] = [];

    // Check src directory for providers
    const srcPath = path.join(this.rootDir, 'src');
    if (fs.existsSync(srcPath)) {
      this.findProvidersRecursive(srcPath, providers);
    }

    return providers;
  }

  private findProvidersRecursive(dirPath: string, providers: ComponentInfo[]): void {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      if (item === 'node_modules' || item.startsWith('.')) continue;

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        this.findProvidersRecursive(itemPath, providers);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(itemPath, 'utf-8');

        if (content.includes('Provider') && content.includes('createContext')) {
          const providerMatch = content.match(/export\s+(?:const|function)\s+(\w+Provider)/);
          if (providerMatch) {
            providers.push({
              name: providerMatch[1],
              path: itemPath,
              type: 'provider',
              exports: [providerMatch[1]],
              imports: this.extractImports(content),
            });
          }
        }
      }
    }
  }

  private analyzePages(): ComponentInfo[] {
    const pagesPath = path.join(this.rootDir, 'src', 'pages');
    if (!fs.existsSync(pagesPath)) return [];

    return this.scanComponentDirectory(pagesPath, 'page');
  }

  private scanComponentDirectory(dirPath: string, type: ComponentInfo['type'] = 'component'): ComponentInfo[] {
    if (!fs.existsSync(dirPath)) return [];

    const components: ComponentInfo[] = [];
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Check for index file
        const indexFile = ['index.tsx', 'index.ts'].find((f) => fs.existsSync(path.join(itemPath, f)));

        if (indexFile) {
          const content = fs.readFileSync(path.join(itemPath, indexFile), 'utf-8');
          components.push({
            name: item,
            path: itemPath,
            type,
            exports: this.extractExportNames(content),
            imports: this.extractImports(content),
          });
        }
      } else if (item.endsWith('.tsx') && !item.startsWith('index')) {
        const content = fs.readFileSync(itemPath, 'utf-8');
        components.push({
          name: item.replace('.tsx', ''),
          path: itemPath,
          type,
          exports: this.extractExportNames(content),
          imports: this.extractImports(content),
        });
      }
    }

    return components;
  }

  private getExports(dirPath: string): string[] {
    const indexPath = path.join(dirPath, 'index.ts');
    if (!fs.existsSync(indexPath)) return [];

    const content = fs.readFileSync(indexPath, 'utf-8');
    return this.extractExportNames(content);
  }

  private extractExportNames(content: string): string[] {
    const exports: string[] = [];

    // Named exports
    const namedExports = content.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g);
    for (const match of namedExports) {
      exports.push(match[1]);
    }

    // Export { } from
    const reExports = content.matchAll(/export\s+\{\s*([^}]+)\s*\}/g);
    for (const match of reExports) {
      const names = match[1].split(',').map((n) => n.trim().split(' ')[0]);
      exports.push(...names);
    }

    return [...new Set(exports)];
  }

  private extractHookNames(content: string): string[] {
    const hooks: string[] = [];
    const matches = content.matchAll(/export\s+(?:const|function)\s+(use\w+)/g);

    for (const match of matches) {
      hooks.push(match[1]);
    }

    return hooks;
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    const matches = content.matchAll(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);

    for (const match of matches) {
      imports.push(match[1]);
    }

    return imports;
  }
}
