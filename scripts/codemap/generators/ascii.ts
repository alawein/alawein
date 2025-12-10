/**
 * ASCII Generator - Generates ASCII art diagrams
 */

import { StructureAnalysis } from '../analyzers/structure';
import { ComponentAnalysis } from '../analyzers/components';
import { DatabaseAnalysis } from '../analyzers/database';
import { WorkflowAnalysis } from '../analyzers/workflows';

type DiagramData = StructureAnalysis | ComponentAnalysis | DatabaseAnalysis | WorkflowAnalysis;

export class AsciiGenerator {
  generate(name: string, data: DiagramData): string {
    switch (name) {
      case 'monorepo-structure':
        return this.generateMonorepoStructure(data as StructureAnalysis);
      case 'platform-overview':
        return this.generatePlatformOverview(data as StructureAnalysis);
      case 'tech-stack':
        return this.generateTechStack();
      case 'component-tree':
        return this.generateComponentTree(data as ComponentAnalysis);
      case 'ui-package':
        return this.generateUIPackage(data as ComponentAnalysis);
      case 'state-layers':
        return this.generateStateLayers();
      case 'edge-functions':
        return this.generateEdgeFunctions(data as StructureAnalysis);
      case 'workflow-map':
        return this.generateWorkflowMap(data as WorkflowAnalysis);
      case 'rls-policies':
        return this.generateRLSPolicies(data as DatabaseAnalysis);
      case 'testing-pyramid':
        return this.generateTestingPyramid();
      case 'test-coverage':
        return this.generateTestCoverage();
      default:
        return this.generateGenericBox(name, data);
    }
  }

  private box(content: string[], width: number = 65, title?: string): string {
    const lines: string[] = [];
    const innerWidth = width - 4;

    lines.push(`┌${'─'.repeat(width - 2)}┐`);

    if (title) {
      const padding = Math.floor((innerWidth - title.length) / 2);
      lines.push(`│${' '.repeat(padding)}${title}${' '.repeat(innerWidth - padding - title.length)}│`);
      lines.push(`├${'─'.repeat(width - 2)}┤`);
    }

    for (const line of content) {
      const trimmed = line.slice(0, innerWidth);
      lines.push(`│ ${trimmed.padEnd(innerWidth - 1)}│`);
    }

    lines.push(`└${'─'.repeat(width - 2)}┘`);

    return lines.join('\n');
  }

  private generateMonorepoStructure(data: StructureAnalysis): string {
    const width = 70;
    const lines: string[] = [];

    lines.push(`┌${'─'.repeat(width - 2)}┐`);
    lines.push(`│${'ALAWEIN MONOREPO'.padStart(42).padEnd(width - 3)}│`);
    lines.push(`├${'─'.repeat(width - 2)}┤`);
    lines.push(`│${' '.repeat(width - 2)}│`);

    // Platforms
    lines.push(`│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │`);
    lines.push(`│  │  platforms/ │  │  packages/  │  │   orgs/     │       │`);
    lines.push(`│  ├─────────────┤  ├─────────────┤  ├─────────────┤       │`);

    const platforms = data.platforms.map((p) => p.name).slice(0, 7);
    const packages = data.packages.map((p) => p.name).slice(0, 5);
    const orgs = data.organizations.map((o) => o.name).slice(0, 3);

    const maxRows = Math.max(platforms.length, packages.length, orgs.length);

    for (let i = 0; i < maxRows; i++) {
      const p = platforms[i] ? `• ${platforms[i]}`.padEnd(11) : ' '.repeat(11);
      const pk = packages[i] ? `• ${packages[i]}`.slice(0, 11).padEnd(11) : ' '.repeat(11);
      const o = orgs[i] ? `• ${orgs[i]}`.slice(0, 11).padEnd(11) : ' '.repeat(11);
      lines.push(`│  │ ${p} │  │ ${pk} │  │ ${o} │       │`);
    }

    lines.push(`│  └─────────────┘  └─────────────┘  └─────────────┘       │`);
    lines.push(`│${' '.repeat(width - 2)}│`);

    // Second row
    lines.push(`│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │`);
    lines.push(`│  │   .github/  │  │    docs/    │  │   scripts/  │       │`);
    lines.push(`│  ├─────────────┤  ├─────────────┤  ├─────────────┤       │`);
    lines.push(
      `│  │ ${String(data.stats.workflowCount).padStart(2)} workflows│  │ ${String(data.stats.docCount).padStart(3)} files  │  │ • codemap   │       │`,
    );
    lines.push(`│  │ • CI/CD     │  │ • guides    │  │ • validate  │       │`);
    lines.push(`│  │ • security  │  │ • api       │  │ • deploy    │       │`);
    lines.push(`│  └─────────────┘  └─────────────┘  └─────────────┘       │`);
    lines.push(`│${' '.repeat(width - 2)}│`);

    lines.push(`└${'─'.repeat(width - 2)}┘`);

    // Stats
    lines.push('');
    lines.push(
      `📊 Stats: ${data.stats.platformCount} platforms | ${data.stats.packageCount} packages | ${data.stats.workflowCount} workflows | ${data.stats.docCount} docs`,
    );

    return lines.join('\n');
  }

  private generatePlatformOverview(data: StructureAnalysis): string {
    const platforms = [
      { name: 'REPZ', desc: 'Fitness coaching', status: '✅' },
      { name: 'SimCore', desc: 'Scientific sim', status: '✅' },
      { name: 'QMLab', desc: 'Quantum mechanics', status: '🔶' },
      { name: 'LiveItIconic', desc: 'E-commerce', status: '✅' },
      { name: 'LLMWorks', desc: 'AI/ML tools', status: '🔶' },
      { name: 'Attributa', desc: 'Attribution', status: '🔶' },
      { name: 'Portfolio', desc: 'Personal site', status: '✅' },
    ];

    const lines: string[] = [];
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║                    PLATFORM OVERVIEW                         ║');
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║                                                              ║');

    for (const p of platforms) {
      const line = `  ${p.status} ${p.name.padEnd(15)} │ ${p.desc.padEnd(20)}`;
      lines.push(`║${line.padEnd(62)}║`);
    }

    lines.push('║                                                              ║');
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║  ✅ Active   🔶 Beta   ⚪ Planned                            ║');
    lines.push('╚══════════════════════════════════════════════════════════════╝');

    return lines.join('\n');
  }

  private generateTechStack(): string {
    return `
╔══════════════════════════════════════════════════════════════════╗
║                        TECH STACK                                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                      FRONTEND                              │  ║
║  │  React 18 │ TypeScript │ Vite │ Tailwind │ React Query    │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                   ║
║                              ▼                                   ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                      HOSTING                               │  ║
║  │              Vercel (Edge Network + CDN)                   │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                   ║
║                              ▼                                   ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                    API LAYER                               │  ║
║  │           Supabase Edge Functions (Deno)                   │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                   ║
║                              ▼                                   ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                    DATABASE                                │  ║
║  │      PostgreSQL │ Row Level Security │ Realtime            │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;
  }

  private generateComponentTree(data: ComponentAnalysis): string {
    const lines: string[] = [];
    lines.push('REACT COMPONENT TREE');
    lines.push('═'.repeat(50));
    lines.push('');
    lines.push('App');
    lines.push('├── QueryClientProvider');
    lines.push('│   └── AuthProvider');
    lines.push('│       └── ThemeProvider');
    lines.push('│           └── BrowserRouter');
    lines.push('│               ├── MainLayout');
    lines.push('│               │   ├── Navbar');
    lines.push('│               │   └── Footer');
    lines.push('│               ├── DashboardLayout');
    lines.push('│               │   ├── Sidebar');
    lines.push('│               │   └── Header');
    lines.push('│               └── Routes');
    lines.push('│                   ├── / (Portfolio)');
    lines.push('│                   ├── /simcore/*');
    lines.push('│                   ├── /repz/*');
    lines.push('│                   ├── /qmlab/*');
    lines.push('│                   └── /liveiticonic/*');
    lines.push('');
    lines.push(
      `📊 ${data.stats.totalComponents} components | ${data.stats.totalHooks} hooks | ${data.stats.totalProviders} providers`,
    );

    return lines.join('\n');
  }

  private generateUIPackage(data: ComponentAnalysis): string {
    const components = data.uiComponents.map((c) => c.name);

    const lines: string[] = [];
    lines.push('@monorepo/ui PACKAGE');
    lines.push('═'.repeat(40));
    lines.push('');
    lines.push('packages/ui/src/');
    lines.push('├── components/');

    for (let i = 0; i < components.length; i++) {
      const prefix = i === components.length - 1 ? '└──' : '├──';
      lines.push(`│   ${prefix} ${components[i]}/`);
    }

    lines.push('├── atoms/');
    lines.push('├── tokens/');
    lines.push('├── styles/');
    lines.push('└── index.ts');
    lines.push('');
    lines.push(`📦 ${components.length} components exported`);

    return lines.join('\n');
  }

  private generateStateLayers(): string {
    return `
STATE MANAGEMENT LAYERS
═══════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────┐
│                  SERVER STATE                       │
│              (React Query / TanStack)               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │  queries  │ │ mutations │ │   cache   │        │
│  └───────────┘ └───────────┘ └───────────┘        │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                 GLOBAL UI STATE                     │
│                (React Context)                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │   auth    │ │   theme   │ │   toast   │        │
│  └───────────┘ └───────────┘ └───────────┘        │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                  LOCAL STATE                        │
│             (useState / useReducer)                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │   forms   │ │  modals   │ │  toggles  │        │
│  └───────────┘ └───────────┘ └───────────┘        │
└─────────────────────────────────────────────────────┘
`;
  }

  private generateEdgeFunctions(data: StructureAnalysis): string {
    const functions = ['simcore-api', 'repz-api', 'qmlab-api', 'liveiticonic-api', 'talai-api', 'optilibria-api'];

    const lines: string[] = [];
    lines.push('SUPABASE EDGE FUNCTIONS');
    lines.push('═'.repeat(50));
    lines.push('');
    lines.push('supabase/functions/');

    for (let i = 0; i < functions.length; i++) {
      const prefix = i === functions.length - 1 ? '└──' : '├──';
      lines.push(`${prefix} ${functions[i]}/`);
      lines.push(`${i === functions.length - 1 ? '   ' : '│  '} └── index.ts`);
    }

    lines.push('');
    lines.push('Each function handles:');
    lines.push('  • Authentication (JWT validation)');
    lines.push('  • CORS headers');
    lines.push('  • Request routing');
    lines.push('  • Database operations');

    return lines.join('\n');
  }

  private generateWorkflowMap(data: WorkflowAnalysis): string {
    const lines: string[] = [];
    lines.push('GITHUB ACTIONS WORKFLOWS');
    lines.push('═'.repeat(60));
    lines.push('');
    lines.push(
      `Total: ${data.stats.totalWorkflows} workflows | ${data.stats.totalJobs} jobs | ${data.stats.reusableCount} reusable`,
    );
    lines.push('');

    lines.push('MAIN WORKFLOWS:');
    for (const wf of data.workflows.slice(0, 10)) {
      const triggers = wf.triggers.slice(0, 2).join(', ');
      lines.push(`  ├── ${wf.name.padEnd(25)} [${triggers}]`);
    }

    if (data.workflows.length > 10) {
      lines.push(`  └── ... and ${data.workflows.length - 10} more`);
    }

    lines.push('');
    lines.push('REUSABLE WORKFLOWS:');
    for (const wf of data.reusableWorkflows) {
      lines.push(`  ├── ${wf.filename}`);
    }

    lines.push('');
    lines.push('TRIGGERS:');
    for (const [trigger, count] of Object.entries(data.stats.triggerTypes)) {
      lines.push(`  • ${trigger}: ${count}`);
    }

    return lines.join('\n');
  }

  private generateRLSPolicies(data: DatabaseAnalysis): string {
    const lines: string[] = [];
    lines.push('ROW LEVEL SECURITY POLICIES');
    lines.push('═'.repeat(60));
    lines.push('');

    for (const schema of data.schemas.slice(0, 5)) {
      lines.push(`📁 ${schema.name}`);

      for (const table of schema.tables) {
        if (table.rlsPolicies.length > 0) {
          lines.push(`  └── ${table.name}`);
          for (const policy of table.rlsPolicies) {
            lines.push(`      • ${policy}`);
          }
        }
      }
      lines.push('');
    }

    lines.push(`📊 Total: ${data.stats.totalRlsPolicies} RLS policies across ${data.stats.totalTables} tables`);

    return lines.join('\n');
  }

  private generateTestingPyramid(): string {
    return `
                    TESTING PYRAMID
═══════════════════════════════════════════════════════

                         /\\
                        /  \\
                       / E2E\\
                      / Playwright
                     /──────────\\
                    /            \\
                   / INTEGRATION  \\
                  /   API Tests    \\
                 /──────────────────\\
                /                    \\
               /      UNIT TESTS      \\
              /    Vitest + RTL        \\
             /──────────────────────────\\

    ┌────────────────────────────────────────┐
    │  E2E:         ~10%   (Slow, Expensive) │
    │  Integration: ~20%   (Medium)          │
    │  Unit:        ~70%   (Fast, Cheap)     │
    └────────────────────────────────────────┘
`;
  }

  private generateTestCoverage(): string {
    return `
TEST COVERAGE BY PACKAGE
═══════════════════════════════════════════════════════

Package              Coverage   Tests   Status
─────────────────────────────────────────────────────
@monorepo/ui         ████████░░  80%    ✅
@monorepo/utils      █████████░  90%    ✅
platforms/repz       ██████░░░░  60%    🔶
platforms/simcore    ███████░░░  70%    ✅
platforms/qmlab      ████░░░░░░  40%    ⚠️
platforms/iconic     █████░░░░░  50%    🔶
─────────────────────────────────────────────────────
Total                ██████░░░░  65%    🔶

Legend: ✅ Good  🔶 Needs Work  ⚠️ Critical
`;
  }

  private generateGenericBox(name: string, data: any): string {
    return this.box(
      [`Diagram: ${name}`, '', 'Data available - use Mermaid or SVG for visualization'],
      50,
      name.toUpperCase(),
    );
  }
}
