/**
 * SVG Generator - Generates simplified SVG diagrams
 *
 * For complex SVGs, use Cascade with: "Generate SVG diagram for <name>"
 */

import { StructureAnalysis } from '../analyzers/structure';
import { ComponentAnalysis } from '../analyzers/components';

type DiagramData = StructureAnalysis | ComponentAnalysis | any;

interface SvgConfig {
  width: number;
  height: number;
  padding: number;
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
}

const DEFAULT_CONFIG: SvgConfig = {
  width: 800,
  height: 600,
  padding: 40,
  colors: {
    background: '#0f172a',
    primary: '#6366f1',
    secondary: '#22c55e',
    accent: '#f59e0b',
    text: '#ffffff',
    textMuted: '#94a3b8',
    border: '#334155',
  },
};

export class SvgGenerator {
  private config: SvgConfig;

  constructor(config: Partial<SvgConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  generate(name: string, data: DiagramData): string {
    switch (name) {
      case 'platform-overview':
        return this.generatePlatformOverview(data as StructureAnalysis);
      case 'tech-stack':
        return this.generateTechStack();
      case 'component-tree':
        return this.generateComponentTree(data as ComponentAnalysis);
      case 'testing-pyramid':
        return this.generateTestingPyramid();
      default:
        return this.generatePlaceholder(name);
    }
  }

  private svgHeader(width: number = this.config.width, height: number = this.config.height): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${this.config.colors.primary}"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${this.config.colors.background}"/>`;
  }

  private svgFooter(): string {
    return `</svg>`;
  }

  private text(
    x: number,
    y: number,
    content: string,
    options: { size?: number; color?: string; anchor?: string; weight?: string } = {},
  ): string {
    const { size = 12, color = this.config.colors.text, anchor = 'middle', weight = 'normal' } = options;
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="system-ui" font-size="${size}" font-weight="${weight}">${content}</text>`;
  }

  private rect(
    x: number,
    y: number,
    width: number,
    height: number,
    options: { fill?: string; stroke?: string; rx?: number } = {},
  ): string {
    const { fill = this.config.colors.background, stroke = this.config.colors.border, rx = 6 } = options;
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
  }

  private generatePlatformOverview(data: StructureAnalysis): string {
    const platforms = [
      { name: 'REPZ', icon: '💪', color: '#22c55e' },
      { name: 'SimCore', icon: '🔬', color: '#3b82f6' },
      { name: 'QMLab', icon: '⚛️', color: '#8b5cf6' },
      { name: 'LiveItIconic', icon: '🛍️', color: '#ec4899' },
      { name: 'LLMWorks', icon: '🤖', color: '#f59e0b' },
      { name: 'Attributa', icon: '📊', color: '#14b8a6' },
      { name: 'Portfolio', icon: '👤', color: '#6366f1' },
    ];

    const width = 900;
    const height = 500;
    const cardWidth = 110;
    const cardHeight = 80;
    const gap = 15;
    const startX = (width - (platforms.length * (cardWidth + gap) - gap)) / 2;

    let svg = this.svgHeader(width, height);

    // Title
    svg += this.text(width / 2, 40, 'Platform Overview', { size: 24, weight: 'bold' });

    // Platform cards
    platforms.forEach((platform, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = 80;

      svg += `<g transform="translate(${x}, ${y})">`;
      svg += this.rect(0, 0, cardWidth, cardHeight, { fill: '#1e293b', stroke: platform.color });
      svg += this.text(cardWidth / 2, 30, platform.icon, { size: 24 });
      svg += this.text(cardWidth / 2, 55, platform.name, { size: 11, weight: 'bold' });
      svg += `</g>`;
    });

    // Shared packages section
    const sharedY = 200;
    svg += this.rect(100, sharedY, 700, 100, { fill: '#1e293b', stroke: this.config.colors.secondary });
    svg += this.text(width / 2, sharedY + 25, 'Shared Packages', {
      size: 14,
      weight: 'bold',
      color: this.config.colors.secondary,
    });

    const packages = ['@monorepo/ui', '@monorepo/utils', '@monorepo/config', '@monorepo/types'];
    packages.forEach((pkg, i) => {
      const x = 180 + i * 170;
      svg += this.rect(x, sharedY + 40, 140, 40, { fill: '#0f172a', stroke: this.config.colors.border });
      svg += this.text(x + 70, sharedY + 65, pkg, { size: 10 });
    });

    // Backend section
    const backendY = 340;
    svg += this.rect(100, backendY, 700, 100, { fill: '#1e293b', stroke: this.config.colors.accent });
    svg += this.text(width / 2, backendY + 25, 'Backend Infrastructure', {
      size: 14,
      weight: 'bold',
      color: this.config.colors.accent,
    });

    const backend = [
      { name: 'Vercel', desc: 'Hosting' },
      { name: 'Supabase', desc: 'Database + Auth' },
      { name: 'Edge Functions', desc: 'API' },
    ];
    backend.forEach((item, i) => {
      const x = 180 + i * 220;
      svg += this.rect(x, backendY + 40, 180, 40, { fill: '#0f172a', stroke: this.config.colors.border });
      svg += this.text(x + 90, backendY + 55, item.name, { size: 11, weight: 'bold' });
      svg += this.text(x + 90, backendY + 70, item.desc, { size: 9, color: this.config.colors.textMuted });
    });

    // Arrows
    svg += `<path d="M450 160 L450 195" stroke="${this.config.colors.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>`;
    svg += `<path d="M450 300 L450 335" stroke="${this.config.colors.textMuted}" stroke-width="2"/>`;

    svg += this.svgFooter();
    return svg;
  }

  private generateTechStack(): string {
    const width = 800;
    const height = 600;
    const layers = [
      { name: 'Frontend', items: ['React 18', 'TypeScript', 'Vite', 'Tailwind', 'React Query'], color: '#3b82f6' },
      { name: 'Hosting', items: ['Vercel Edge Network', 'CDN', 'Static Assets'], color: '#22c55e' },
      { name: 'API Layer', items: ['Supabase Edge Functions', 'Deno Runtime'], color: '#f59e0b' },
      { name: 'Database', items: ['PostgreSQL', 'Row Level Security', 'Realtime'], color: '#ec4899' },
    ];

    let svg = this.svgHeader(width, height);

    // Title
    svg += this.text(width / 2, 40, 'Technology Stack', { size: 24, weight: 'bold' });

    const layerHeight = 100;
    const layerWidth = 600;
    const startX = (width - layerWidth) / 2;
    const startY = 80;

    layers.forEach((layer, i) => {
      const y = startY + i * (layerHeight + 20);

      // Layer box
      svg += this.rect(startX, y, layerWidth, layerHeight, { fill: '#1e293b', stroke: layer.color });

      // Layer name
      svg += this.text(startX + 20, y + 25, layer.name, {
        size: 14,
        weight: 'bold',
        anchor: 'start',
        color: layer.color,
      });

      // Items
      const itemWidth = (layerWidth - 40) / layer.items.length;
      layer.items.forEach((item, j) => {
        const itemX = startX + 20 + j * itemWidth;
        svg += this.rect(itemX, y + 40, itemWidth - 10, 45, { fill: '#0f172a', stroke: this.config.colors.border });
        svg += this.text(itemX + (itemWidth - 10) / 2, y + 68, item, { size: 10 });
      });

      // Arrow to next layer
      if (i < layers.length - 1) {
        svg += `<path d="M${width / 2} ${y + layerHeight} L${width / 2} ${y + layerHeight + 15}" stroke="${this.config.colors.textMuted}" stroke-width="2"/>`;
        svg += this.text(width / 2, y + layerHeight + 12, '▼', { size: 10, color: this.config.colors.textMuted });
      }
    });

    svg += this.svgFooter();
    return svg;
  }

  private generateComponentTree(data: ComponentAnalysis): string {
    const width = 800;
    const height = 500;

    let svg = this.svgHeader(width, height);

    // Title
    svg += this.text(width / 2, 35, 'React Component Hierarchy', { size: 20, weight: 'bold' });

    // Tree structure
    const tree = [
      { level: 0, name: 'App', x: 400, y: 70, color: '#6366f1' },
      { level: 1, name: 'QueryClientProvider', x: 250, y: 140, color: '#8b5cf6' },
      { level: 1, name: 'AuthProvider', x: 400, y: 140, color: '#8b5cf6' },
      { level: 1, name: 'ThemeProvider', x: 550, y: 140, color: '#8b5cf6' },
      { level: 2, name: 'BrowserRouter', x: 400, y: 210, color: '#3b82f6' },
      { level: 3, name: 'MainLayout', x: 200, y: 280, color: '#22c55e' },
      { level: 3, name: 'DashboardLayout', x: 400, y: 280, color: '#22c55e' },
      { level: 3, name: 'AuthLayout', x: 600, y: 280, color: '#22c55e' },
      { level: 4, name: 'Home', x: 150, y: 350, color: '#f59e0b' },
      { level: 4, name: 'Projects', x: 250, y: 350, color: '#f59e0b' },
      { level: 4, name: 'Dashboard', x: 400, y: 350, color: '#f59e0b' },
      { level: 4, name: 'Login', x: 550, y: 350, color: '#f59e0b' },
      { level: 4, name: 'Register', x: 650, y: 350, color: '#f59e0b' },
    ];

    // Draw connections
    const connections = [
      [0, 1],
      [0, 2],
      [0, 3],
      [2, 4],
      [4, 5],
      [4, 6],
      [4, 7],
      [5, 8],
      [5, 9],
      [6, 10],
      [7, 11],
      [7, 12],
    ];

    connections.forEach(([from, to]) => {
      const f = tree[from];
      const t = tree[to];
      svg += `<path d="M${f.x} ${f.y + 15} L${f.x} ${(f.y + t.y) / 2} L${t.x} ${(f.y + t.y) / 2} L${t.x} ${t.y - 15}" stroke="${this.config.colors.border}" stroke-width="1.5" fill="none"/>`;
    });

    // Draw nodes
    tree.forEach((node) => {
      const boxWidth = node.name.length * 8 + 20;
      svg += this.rect(node.x - boxWidth / 2, node.y - 15, boxWidth, 30, { fill: '#1e293b', stroke: node.color });
      svg += this.text(node.x, node.y + 5, node.name, { size: 10 });
    });

    // Legend
    const legend = [
      { name: 'Root', color: '#6366f1' },
      { name: 'Providers', color: '#8b5cf6' },
      { name: 'Router', color: '#3b82f6' },
      { name: 'Layouts', color: '#22c55e' },
      { name: 'Pages', color: '#f59e0b' },
    ];

    svg += this.rect(30, 400, 120, legend.length * 25 + 20, { fill: '#1e293b', stroke: this.config.colors.border });
    legend.forEach((item, i) => {
      const y = 420 + i * 25;
      svg += this.rect(45, y - 6, 12, 12, { fill: item.color, stroke: item.color, rx: 2 });
      svg += this.text(70, y + 4, item.name, { size: 10, anchor: 'start' });
    });

    svg += this.svgFooter();
    return svg;
  }

  private generateTestingPyramid(): string {
    const width = 700;
    const height = 450;

    let svg = this.svgHeader(width, height);

    // Title
    svg += this.text(width / 2, 35, 'Testing Pyramid', { size: 20, weight: 'bold' });

    const centerX = width / 2;
    const baseY = 380;
    const pyramidHeight = 280;

    // Pyramid layers (from top to bottom)
    const layers = [
      { name: 'E2E', tool: 'Playwright', percent: '10%', color: '#ec4899', width: 100 },
      { name: 'Integration', tool: 'API Tests', percent: '20%', color: '#f59e0b', width: 200 },
      { name: 'Unit', tool: 'Vitest + RTL', percent: '70%', color: '#22c55e', width: 350 },
    ];

    const layerHeight = pyramidHeight / layers.length;

    layers.forEach((layer, i) => {
      const y = 70 + i * layerHeight;
      const halfWidth = layer.width / 2;

      // Trapezoid shape
      const nextWidth = layers[i + 1]?.width || layer.width + 100;
      const nextHalfWidth = nextWidth / 2;

      svg += `<path d="M${centerX - halfWidth} ${y} L${centerX + halfWidth} ${y} L${centerX + nextHalfWidth} ${y + layerHeight} L${centerX - nextHalfWidth} ${y + layerHeight} Z" fill="${layer.color}" opacity="0.8"/>`;

      // Labels
      svg += this.text(centerX, y + layerHeight / 2, layer.name, { size: 14, weight: 'bold' });
      svg += this.text(centerX, y + layerHeight / 2 + 18, layer.tool, { size: 10, color: '#fff' });

      // Percentage on the right
      svg += this.text(centerX + nextHalfWidth + 40, y + layerHeight / 2 + 5, layer.percent, {
        size: 12,
        anchor: 'start',
      });
    });

    // Info box
    svg += this.rect(50, baseY + 20, 600, 50, { fill: '#1e293b', stroke: this.config.colors.border });
    svg += this.text(width / 2, baseY + 40, 'E2E: Slow, Expensive  |  Integration: Medium  |  Unit: Fast, Cheap', {
      size: 11,
      color: this.config.colors.textMuted,
    });
    svg += this.text(width / 2, baseY + 58, 'More tests at the bottom, fewer at the top', {
      size: 10,
      color: this.config.colors.textMuted,
    });

    svg += this.svgFooter();
    return svg;
  }

  private generatePlaceholder(name: string): string {
    const width = 600;
    const height = 400;

    let svg = this.svgHeader(width, height);

    svg += this.rect(50, 50, width - 100, height - 100, { fill: '#1e293b', stroke: this.config.colors.primary });
    svg += this.text(width / 2, height / 2 - 30, name, { size: 18, weight: 'bold' });
    svg += this.text(width / 2, height / 2 + 10, 'Complex SVG - Use Cascade for generation', {
      size: 12,
      color: this.config.colors.textMuted,
    });
    svg += this.text(width / 2, height / 2 + 35, `"Generate SVG diagram for ${name}"`, {
      size: 11,
      color: this.config.colors.primary,
    });

    svg += this.svgFooter();
    return svg;
  }
}
