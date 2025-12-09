export const crossref = { lookup: async () => null };

/**
 * Audits citations in text against CrossRef database.
 */
export async function auditCitations(text: string): Promise<{
  citations: Array<{ text: string; valid: boolean; doi?: string }>;
  score: number;
}> {
  // Stub implementation
  return {
    citations: [],
    score: 1.0
  };
}
