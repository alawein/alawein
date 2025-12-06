// File utility functions (browser-compatible)

export function fileExists(filePath: string): Promise<boolean> {
  // Browser implementation - always returns false for server-side paths
  return Promise.resolve(false);
}

export function readFileContent(filePath: string): Promise<string> {
  // Browser implementation - throws error for server-side paths
  return Promise.reject(new Error('File reading not supported in browser'));
}

export function writeFileContent(filePath: string, content: string): Promise<void> {
  // Browser implementation - throws error for server-side paths
  return Promise.reject(new Error('File writing not supported in browser'));
}

// Browser-specific utilities
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
