import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Smoke test to ensure key plotting components use the unified scientific plot system
// This is a static import check (no runtime rendering)

const filesToCheck = [
  'src/components/EnhancedScientificPlot.tsx',
  'src/components/graphene/BandStructurePlot.tsx',
  'src/components/GrapheneCastroNetoPanel.tsx',
  'src/components/enhanced-examples/GrapheneEnhancedDemo.tsx',
];

describe('Scientific Plot System usage (static import checks)', () => {
  test.each(filesToCheck)('%s imports scientific-plot-system', (relativePath) => {
    const fullPath = resolve(process.cwd(), relativePath);
    const contents = readFileSync(fullPath, 'utf8');
    // Accept both absolute alias and relative import forms
    const usesUnified = /from\s+['"]@\/lib\/scientific-plot-system['"]/.test(contents) ||
                        /from\s+['"][\.\/]+.*scientific-plot-system['"]/.test(contents);
    expect(usesUnified).toBe(true);
  });
});
