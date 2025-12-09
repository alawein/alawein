import { describe, it, expect, beforeEach } from 'vitest';
import { mlAnalyzer } from '@/lib/ml-analyzer';

function addDummyData(n = 12) {
  for (let i = 0; i < n; i++) {
    mlAnalyzer.addDataPoint(
      { amplitude: i, temperature: 300 + i },
      { transmission: Math.sin(i / 2) + i * 0.1, energy: i * 0.05 }
    );
  }
}

describe('ml-analyzer', () => {
  beforeEach(() => {
    mlAnalyzer.clearData();
  });

  it('returns warning on insufficient data', async () => {
    addDummyData(5);
    const result = await mlAnalyzer.analyzeData();
    expect(result.insights.some(i => i.id === 'insufficient-data')).toBe(true);
  });

  it('produces patterns and predictions with sufficient data', async () => {
    addDummyData(20);
    const result = await mlAnalyzer.analyzeData();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(Array.isArray(result.predictions)).toBe(true);
    expect(result.insights.length).toBeGreaterThan(0);
  });
});
