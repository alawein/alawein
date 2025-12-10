#!/usr/bin/env npx ts-node

/**
 * CodeMap CLI - Visual code map generator for the Alawein monorepo
 *
 * Generates ASCII, Mermaid, and SVG diagrams from codebase analysis.
 *
 * Usage:
 *   npx ts-node scripts/codemap/cli.ts generate --all
 *   npx ts-node scripts/codemap/cli.ts generate --category architecture
 *   npx ts-node scripts/codemap/cli.ts generate --name monorepo-structure
 *   npx ts-node scripts/codemap/cli.ts list
 */

import fs from 'fs';
import path from 'path';
import { StructureAnalyzer } from './analyzers/structure';
import { ComponentAnalyzer } from './analyzers/components';
import { DatabaseAnalyzer } from './analyzers/database';
import { WorkflowAnalyzer } from './analyzers/workflows';
import { AsciiGenerator } from './generators/ascii';
import { MermaidGenerator } from './generators/mermaid';
import { SvgGenerator } from './generators/svg';

const ROOT_DIR = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(__dirname, 'output');

// Diagram registry
const DIAGRAMS = {
  // Architecture
  'monorepo-structure': { category: 'architecture', formats: ['ascii', 'mermaid'] },
  'platform-overview': { category: 'architecture', formats: ['ascii', 'mermaid', 'svg'] },
  'llc-ownership': { category: 'architecture', formats: ['mermaid'] },
  'tech-stack': { category: 'architecture', formats: ['ascii', 'svg'] },
  'deployment-architecture': { category: 'architecture', formats: ['mermaid'] },
  'data-flow': { category: 'architecture', formats: ['mermaid'] },
  'package-dependencies': { category: 'architecture', formats: ['mermaid'] },
  'ci-cd-pipeline': { category: 'architecture', formats: ['mermaid'] },

  // Database
  'repz-schema': { category: 'database', formats: ['mermaid'] },
  'liveiticonic-schema': { category: 'database', formats: ['mermaid'] },
  'shared-tables': { category: 'database', formats: ['mermaid'] },
  'rls-policies': { category: 'database', formats: ['ascii'] },

  // Components
  'component-tree': { category: 'components', formats: ['ascii', 'mermaid', 'svg'] },
  'ui-package': { category: 'components', formats: ['ascii', 'mermaid'] },
  'feature-modules': { category: 'components', formats: ['mermaid'] },
  'provider-stack': { category: 'components', formats: ['mermaid'] },
  'hook-dependencies': { category: 'components', formats: ['mermaid'] },

  // State
  'state-layers': { category: 'state', formats: ['ascii', 'mermaid'] },
  'auth-state-machine': { category: 'state', formats: ['mermaid'] },
  'react-query-cache': { category: 'state', formats: ['mermaid'] },

  // API
  'api-service': { category: 'api', formats: ['mermaid'] },
  'edge-functions': { category: 'api', formats: ['ascii'] },
  'request-flow': { category: 'api', formats: ['mermaid'] },
  'error-hierarchy': { category: 'api', formats: ['mermaid'] },
  'auth-flow': { category: 'api', formats: ['mermaid'] },

  // CI/CD
  'workflow-map': { category: 'cicd', formats: ['ascii', 'mermaid'] },
  'pr-pipeline': { category: 'cicd', formats: ['mermaid'] },
  'deployment-pipeline': { category: 'cicd', formats: ['mermaid'] },

  // Testing
  'testing-pyramid': { category: 'testing', formats: ['ascii', 'svg'] },
  'test-coverage': { category: 'testing', formats: ['ascii'] },
} as const;

type DiagramName = keyof typeof DIAGRAMS;
type Category = 'architecture' | 'database' | 'components' | 'state' | 'api' | 'cicd' | 'testing';
type Format = 'ascii' | 'mermaid' | 'svg';

interface GenerateOptions {
  name?: DiagramName;
  category?: Category;
  format?: Format;
  all?: boolean;
  output?: string;
}

class CodeMapCLI {
  private structureAnalyzer: StructureAnalyzer;
  private componentAnalyzer: ComponentAnalyzer;
  private databaseAnalyzer: DatabaseAnalyzer;
  private workflowAnalyzer: WorkflowAnalyzer;
  private asciiGenerator: AsciiGenerator;
  private mermaidGenerator: MermaidGenerator;
  private svgGenerator: SvgGenerator;

  constructor() {
    this.structureAnalyzer = new StructureAnalyzer(ROOT_DIR);
    this.componentAnalyzer = new ComponentAnalyzer(ROOT_DIR);
    this.databaseAnalyzer = new DatabaseAnalyzer(ROOT_DIR);
    this.workflowAnalyzer = new WorkflowAnalyzer(ROOT_DIR);
    this.asciiGenerator = new AsciiGenerator();
    this.mermaidGenerator = new MermaidGenerator();
    this.svgGenerator = new SvgGenerator();
  }

  async generate(options: GenerateOptions): Promise<void> {
    const outputDir = options.output || OUTPUT_DIR;
    fs.mkdirSync(outputDir, { recursive: true });

    const diagramsToGenerate = this.getDiagramsToGenerate(options);

    console.log(`\n🗺️  CodeMap Generator`);
    console.log(`${'─'.repeat(50)}`);
    console.log(`Generating ${diagramsToGenerate.length} diagram(s)...\n`);

    for (const name of diagramsToGenerate) {
      const diagram = DIAGRAMS[name];
      const formats = options.format ? [options.format] : diagram.formats;

      for (const format of formats) {
        if (!(diagram.formats as readonly string[]).includes(format)) {
          console.log(`⏭️  Skipping ${name} (${format}) - format not supported`);
          continue;
        }

        try {
          const content = await this.generateDiagram(name, format as Format);
          const filename = `${name}.${this.getExtension(format as Format)}`;
          const filepath = path.join(outputDir, filename);

          fs.writeFileSync(filepath, content);
          console.log(`✅ Generated: ${filename}`);
        } catch (error) {
          console.error(`❌ Failed: ${name} (${format}) - ${(error as Error).message}`);
        }
      }
    }

    console.log(`\n📁 Output directory: ${outputDir}`);
  }

  private getDiagramsToGenerate(options: GenerateOptions): DiagramName[] {
    if (options.name) {
      return [options.name];
    }

    if (options.category) {
      return (Object.entries(DIAGRAMS) as [DiagramName, { category: string }][])
        .filter(([_, d]) => d.category === options.category)
        .map(([name]) => name);
    }

    if (options.all) {
      return Object.keys(DIAGRAMS) as DiagramName[];
    }

    return [];
  }

  private async generateDiagram(name: DiagramName, format: Format): Promise<string> {
    const data = await this.analyzeForDiagram(name);

    switch (format) {
      case 'ascii':
        return this.asciiGenerator.generate(name, data);
      case 'mermaid':
        return this.mermaidGenerator.generate(name, data);
      case 'svg':
        return this.svgGenerator.generate(name, data);
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  private async analyzeForDiagram(name: DiagramName): Promise<any> {
    const category = DIAGRAMS[name].category;

    switch (category) {
      case 'architecture':
        return this.structureAnalyzer.analyze();
      case 'database':
        return this.databaseAnalyzer.analyze();
      case 'components':
        return this.componentAnalyzer.analyze();
      case 'cicd':
        return this.workflowAnalyzer.analyze();
      default:
        return this.structureAnalyzer.analyze();
    }
  }

  private getExtension(format: Format): string {
    switch (format) {
      case 'ascii':
        return 'txt';
      case 'mermaid':
        return 'mmd';
      case 'svg':
        return 'svg';
    }
  }

  list(): void {
    console.log(`\n🗺️  Available Diagrams`);
    console.log(`${'─'.repeat(60)}`);

    const categories = [...new Set(Object.values(DIAGRAMS).map((d) => d.category))];

    for (const category of categories) {
      console.log(`\n📂 ${category.toUpperCase()}`);

      const diagrams = (
        Object.entries(DIAGRAMS) as [DiagramName, { category: string; formats: readonly string[] }][]
      ).filter(([_, d]) => d.category === category);

      for (const [name, diagram] of diagrams) {
        const formats = diagram.formats.join(', ');
        console.log(`   • ${name.padEnd(25)} [${formats}]`);
      }
    }

    console.log(`\n📊 Total: ${Object.keys(DIAGRAMS).length} diagrams`);
  }

  help(): void {
    console.log(`
🗺️  CodeMap CLI - Visual code map generator

USAGE:
  npx ts-node scripts/codemap/cli.ts <command> [options]

COMMANDS:
  generate    Generate diagram(s)
  list        List available diagrams
  help        Show this help message

OPTIONS:
  --all                Generate all diagrams
  --name <name>        Generate specific diagram
  --category <cat>     Generate all diagrams in category
  --format <fmt>       Output format (ascii, mermaid, svg)
  --output <dir>       Output directory

CATEGORIES:
  architecture, database, components, state, api, cicd, testing

EXAMPLES:
  # Generate all diagrams
  npx ts-node scripts/codemap/cli.ts generate --all

  # Generate architecture diagrams
  npx ts-node scripts/codemap/cli.ts generate --category architecture

  # Generate specific diagram as Mermaid
  npx ts-node scripts/codemap/cli.ts generate --name auth-flow --format mermaid

  # List available diagrams
  npx ts-node scripts/codemap/cli.ts list

FOR COMPLEX SVG DIAGRAMS:
  Use Cascade with: "Generate SVG diagram for <name>"
  Cascade can create detailed, styled SVGs with full context.
`);
  }
}

// CLI Entry Point
async function main() {
  const cli = new CodeMapCLI();
  const args = process.argv.slice(2);
  const command = args[0];

  const parseArgs = (args: string[]): GenerateOptions => {
    const options: GenerateOptions = {};

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case '--all':
          options.all = true;
          break;
        case '--name':
          options.name = args[++i] as DiagramName;
          break;
        case '--category':
          options.category = args[++i] as Category;
          break;
        case '--format':
          options.format = args[++i] as Format;
          break;
        case '--output':
          options.output = args[++i];
          break;
      }
    }

    return options;
  };

  switch (command) {
    case 'generate':
      const options = parseArgs(args.slice(1));
      if (!options.all && !options.name && !options.category) {
        console.error('Error: Specify --all, --name, or --category');
        process.exit(1);
      }
      await cli.generate(options);
      break;

    case 'list':
      cli.list();
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      cli.help();
      break;
  }
}

main().catch(console.error);
