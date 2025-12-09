export const greenlist = { check: () => false };

/**
 * Detects greenlist watermarks in text (AI watermarking technique).
 */
export async function greenlistWatermark(text: string): Promise<{
  detected: boolean;
  confidence: number;
  tokens: string[];
}> {
  // Stub implementation
  return {
    detected: false,
    confidence: 0,
    tokens: []
  };
}
