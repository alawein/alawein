import { useState, useCallback, useEffect, useRef } from 'react';
import { BatchProcessor, BatchDocument, BatchProgress } from '@/lib/batch/processor';

export function useBatchProcessor(options: { concurrency?: number } = {}) {
  const [documents, setDocuments] = useState<BatchDocument[]>([]);
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    processing: 0,
    pending: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const processorRef = useRef<BatchProcessor | null>(null);

  // Initialize processor
  useEffect(() => {
    const processor = new BatchProcessor({ concurrency: options.concurrency || 2 });

    processor.onProgressUpdate((p) => {
      setProgress(p);
      setDocuments(processor.getDocuments());
    });

    processor.onDocumentCompleted(() => {
      setDocuments(processor.getDocuments());
    });

    processorRef.current = processor;

    return () => {
      processorRef.current = null;
    };
  }, [options.concurrency]);

  const addDocuments = useCallback(
    (docs: Array<{ name: string; content: string; type: BatchDocument['type'] }>) => {
      if (!processorRef.current) return [];
      const ids = processorRef.current.addDocuments(docs);
      setDocuments(processorRef.current.getDocuments());
      return ids;
    },
    []
  );

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const docs: Array<{ name: string; content: string; type: BatchDocument['type'] }> = [];

    for (const file of Array.from(files)) {
      try {
        const content = await file.text();
        const type = file.name.endsWith('.pdf')
          ? 'pdf'
          : file.name.match(/\.(js|ts|py|java|cpp|c|go|rs)$/)
          ? 'code'
          : 'text';
        docs.push({ name: file.name, content, type });
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
      }
    }

    return addDocuments(docs);
  }, [addDocuments]);

  const startProcessing = useCallback(async () => {
    if (!processorRef.current || isProcessing) return;
    setIsProcessing(true);
    try {
      await processorRef.current.startProcessing();
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const clearCompleted = useCallback(() => {
    if (!processorRef.current) return;
    processorRef.current.clearCompleted();
    setDocuments(processorRef.current.getDocuments());
  }, []);

  const getCompletedDocuments = useCallback(() => {
    return documents.filter((d) => d.status === 'completed');
  }, [documents]);

  const exportResults = useCallback(() => {
    const completed = getCompletedDocuments();
    const results = completed.map((doc) => ({
      name: doc.name,
      type: doc.type,
      score: doc.result?.score,
      confidence: doc.result?.confidence,
      methods: doc.result?.methods,
      processedAt: doc.processedAt,
    }));
    return JSON.stringify(results, null, 2);
  }, [getCompletedDocuments]);

  return {
    documents,
    progress,
    isProcessing,
    addDocuments,
    addFiles,
    startProcessing,
    clearCompleted,
    getCompletedDocuments,
    exportResults,
  };
}

