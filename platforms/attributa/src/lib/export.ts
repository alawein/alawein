export const exportData = { toCSV: () => '', toPDF: () => new Blob() };

/**
 * Exports a report as a JSON file.
 */
export function exportReportAsJSON(report: unknown, filename = 'report.json'): void {
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * Exports a report as a CSV file.
 */
export function exportReportAsCSV(report: Record<string, unknown>, filename = 'report.csv'): void {
  const headers = Object.keys(report);
  const values = Object.values(report).map(v =>
    typeof v === 'object' ? JSON.stringify(v) : String(v)
  );
  const csv = headers.join(',') + '\n' + values.join(',');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, filename);
}

/**
 * Helper to download a blob as a file.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
