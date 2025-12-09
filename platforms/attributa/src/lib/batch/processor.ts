/**
 * Batch Processing Module for Attributa
 * Provides a queue system for processing multiple documents
 */

export interface BatchDocument {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'pdf' | 'code';
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: BatchResult;
  error?: string;
  addedAt: number;
  processedAt?: number;
}

export interface BatchResult {
  score: number;
  confidence: number;
  methods: {
    gltr?: { score: number; confidence: number };
    detectgpt?: { score: number; confidence: number };
    watermark?: { detected: boolean; confidence: number };
  };
  processingTimeMs: number;
}

export interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  pending: number;
  startedAt?: number;
  estimatedTimeRemaining?: number;
}

type ProgressCallback = (progress: BatchProgress) => void;
type DocumentCallback = (doc: BatchDocument) => void;

export class BatchProcessor {
  private queue: BatchDocument[] = [];
  private isProcessing = false;
  private concurrency: number;
  private onProgress?: ProgressCallback;
  private onDocumentComplete?: DocumentCallback;
  private processingStartTime?: number;

  constructor(options: { concurrency?: number } = {}) {
    this.concurrency = options.concurrency || 2;
  }

  /**
   * Add documents to the processing queue
   */
  addDocuments(documents: Array<{ name: string; content: string; type: BatchDocument['type'] }>): string[] {
    const ids: string[] = [];
    for (const doc of documents) {
      const id = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.queue.push({
        id,
        name: doc.name,
        content: doc.content,
        type: doc.type,
        status: 'pending',
        addedAt: Date.now(),
      });
      ids.push(id);
    }
    this.emitProgress();
    return ids;
  }

  /**
   * Start processing the queue
   */
  async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.processingStartTime = Date.now();

    const processingPromises: Promise<void>[] = [];

    while (this.hasPendingDocuments() || processingPromises.length > 0) {
      // Fill up to concurrency limit
      while (processingPromises.length < this.concurrency && this.hasPendingDocuments()) {
        const doc = this.getNextPending();
        if (doc) {
          const promise = this.processDocument(doc).finally(() => {
            const index = processingPromises.indexOf(promise);
            if (index > -1) processingPromises.splice(index, 1);
          });
          processingPromises.push(promise);
        }
      }

      // Wait for at least one to complete
      if (processingPromises.length > 0) {
        await Promise.race(processingPromises);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Process a single document
   */
  private async processDocument(doc: BatchDocument): Promise<void> {
    doc.status = 'processing';
    this.emitProgress();

    const startTime = Date.now();

    try {
      // Simulate analysis (replace with real implementation)
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

      // Mock result - would call real analyzers here
      doc.result = {
        score: Math.random() * 0.5 + 0.25,
        confidence: Math.random() * 0.3 + 0.7,
        methods: {
          gltr: { score: Math.random() * 0.6 + 0.2, confidence: 0.85 },
          detectgpt: { score: Math.random() * 0.5 + 0.3, confidence: 0.78 },
        },
        processingTimeMs: Date.now() - startTime,
      };

      doc.status = 'completed';
      doc.processedAt = Date.now();
    } catch (error) {
      doc.status = 'error';
      doc.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.emitProgress();
    this.onDocumentComplete?.(doc);
  }

  private hasPendingDocuments(): boolean {
    return this.queue.some((d) => d.status === 'pending');
  }

  private getNextPending(): BatchDocument | undefined {
    return this.queue.find((d) => d.status === 'pending');
  }

  private emitProgress(): void {
    this.onProgress?.(this.getProgress());
  }

  getProgress(): BatchProgress {
    const completed = this.queue.filter((d) => d.status === 'completed').length;
    const failed = this.queue.filter((d) => d.status === 'error').length;
    const processing = this.queue.filter((d) => d.status === 'processing').length;
    const pending = this.queue.filter((d) => d.status === 'pending').length;

    let estimatedTimeRemaining: number | undefined;
    if (this.processingStartTime && completed > 0) {
      const elapsed = Date.now() - this.processingStartTime;
      const avgTimePerDoc = elapsed / completed;
      estimatedTimeRemaining = Math.round(avgTimePerDoc * (pending + processing));
    }

    return { total: this.queue.length, completed, failed, processing, pending, startedAt: this.processingStartTime, estimatedTimeRemaining };
  }

  getDocuments(): BatchDocument[] {
    return [...this.queue];
  }

  clearCompleted(): void {
    this.queue = this.queue.filter((d) => d.status !== 'completed' && d.status !== 'error');
    this.emitProgress();
  }

  onProgressUpdate(callback: ProgressCallback): void {
    this.onProgress = callback;
  }

  onDocumentCompleted(callback: DocumentCallback): void {
    this.onDocumentComplete = callback;
  }
}

export const batchProcessor = new BatchProcessor();

