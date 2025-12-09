export const staticScan = { scan: () => [] };

/**
 * Analyzes code for AI-generated patterns.
 */
export async function analyzeCode(code: string): Promise<{
  score: number;
  patterns: Array<{ type: string; confidence: number }>;
}> {
  // Stub implementation
  return {
    score: 0.5,
    patterns: []
  };
}
