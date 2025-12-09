export const scoring = { calculate: () => 0 };

const SCORING_WEIGHTS = {
  nlp: 0.4,
  watermark: 0.2,
  citation: 0.2,
  code: 0.2
};

/**
 * Computes a composite score from multiple analysis results.
 */
export function computeCompositeScore(scores: {
  nlpScore?: number;
  watermarkScore?: number;
  citationScore?: number;
  codeScore?: number;
}): number {
  const { nlpScore = 0, watermarkScore = 0, citationScore = 0, codeScore = 0 } = scores;
  return (
    nlpScore * SCORING_WEIGHTS.nlp +
    watermarkScore * SCORING_WEIGHTS.watermark +
    citationScore * SCORING_WEIGHTS.citation +
    codeScore * SCORING_WEIGHTS.code
  );
}

/**
 * Returns explanation of how scoring weights are applied.
 */
export function getScoringWeightsExplanation(): string {
  return `Scoring weights: NLP Analysis (${SCORING_WEIGHTS.nlp * 100}%), Watermark Detection (${SCORING_WEIGHTS.watermark * 100}%), Citation Audit (${SCORING_WEIGHTS.citation * 100}%), Code Analysis (${SCORING_WEIGHTS.code * 100}%)`;
}

/**
 * Computes overall score from a report object.
 */
export function computeOverallScore(report: {
  nlpScore?: number;
  watermarkScore?: number;
  citationScore?: number;
  codeScore?: number;
}): number {
  return computeCompositeScore(report);
}

/**
 * Checks if there is counter-evidence in the analysis results.
 * Counter-evidence suggests the text might not be AI-generated despite high scores.
 */
export function hasCounterEvidence(report: {
  nlpScore?: number;
  citationScore?: number;
  segments?: Array<{ score: number }>;
}): boolean {
  // Check for inconsistent segment scores (some high, some low)
  if (report.segments && report.segments.length > 1) {
    const scores = report.segments.map(s => s.score);
    const variance = scores.reduce((acc, s) => acc + Math.pow(s - (report.nlpScore || 0.5), 2), 0) / scores.length;
    if (variance > 0.1) return true;
  }
  // Check for high citation score (indicates proper sourcing)
  if (report.citationScore && report.citationScore > 0.8) return true;
  return false;
}
