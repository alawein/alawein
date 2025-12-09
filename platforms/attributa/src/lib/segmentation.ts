export const segmentation = { segment: (text: string) => [text] };

/**
 * Merges short prose segments together to create more meaningful analysis chunks.
 * Short segments (< minLength chars) are combined with adjacent segments.
 */
export function mergeShortProse(segments: string[], minLength = 50): string[] {
  if (segments.length === 0) return [];

  const merged: string[] = [];
  let buffer = '';

  for (const segment of segments) {
    buffer += (buffer ? ' ' : '') + segment;
    if (buffer.length >= minLength) {
      merged.push(buffer.trim());
      buffer = '';
    }
  }

  // Add any remaining buffer
  if (buffer.trim()) {
    if (merged.length > 0) {
      merged[merged.length - 1] += ' ' + buffer.trim();
    } else {
      merged.push(buffer.trim());
    }
  }

  return merged;
}

/**
 * Determines if a reliability warning should be shown based on segment count.
 */
export function shouldShowReliabilityWarning(segmentCount: number, minReliableSegments = 3): boolean {
  return segmentCount < minReliableSegments;
}

/**
 * Returns an explanation for low confidence scores.
 */
export function getLowConfidenceExplanation(confidence: number): string {
  if (confidence < 0.3) {
    return 'Very low confidence - the analysis may be unreliable due to insufficient text or unusual patterns.';
  } else if (confidence < 0.5) {
    return 'Low confidence - consider providing more context or longer text samples.';
  } else if (confidence < 0.7) {
    return 'Moderate confidence - results should be interpreted with some caution.';
  }
  return 'High confidence - analysis results are considered reliable.';
}
