export const pdfExtractor = { extract: async () => '' };

/**
 * Extracts text content from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Stub implementation - real PDF extraction would use pdf.js or similar
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // For now, just return empty string - real implementation would parse PDF
      resolve('');
    };
    reader.onerror = () => resolve('');
    reader.readAsArrayBuffer(file);
  });
}
