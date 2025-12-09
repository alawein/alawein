/**
 * useSSE - Server-Sent Events Hook for AI Streaming
 *
 * Provides real-time streaming from AI backends (FastAPI, Edge Functions)
 * with automatic reconnection and error handling.
 *
 * @example
 * ```tsx
 * function AIChat() {
 *   const { data, error, isStreaming, start, stop } = useSSE<{ text: string }>({
 *     url: '/api/ai/stream',
 *     onMessage: (event) => console.log('Received:', event.text),
 *     onError: (error) => console.error('SSE Error:', error),
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => start({ prompt: 'Hello' })}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *       {isStreaming && <span>Streaming...</span>}
 *       <pre>{JSON.stringify(data, null, 2)}</pre>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSSEOptions<T> {
  /** SSE endpoint URL */
  url: string;
  /** Called for each SSE message */
  onMessage?: (data: T) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Called when connection opens */
  onOpen?: () => void;
  /** Called when connection closes */
  onClose?: () => void;
  /** Auto-reconnect on disconnect (default: true) */
  autoReconnect?: boolean;
  /** Max reconnection attempts (default: 3) */
  maxReconnectAttempts?: number;
  /** Reconnection delay in ms (default: 1000) */
  reconnectDelay?: number;
  /** Custom headers for the request */
  headers?: Record<string, string>;
  /** Parse SSE data as JSON (default: true) */
  parseJson?: boolean;
}

export interface UseSSEReturn<T> {
  /** Latest received data */
  data: T | null;
  /** All received messages */
  messages: T[];
  /** Current error if any */
  error: Error | null;
  /** Whether currently streaming */
  isStreaming: boolean;
  /** Whether connected */
  isConnected: boolean;
  /** Start streaming with optional body data */
  start: (body?: unknown) => void;
  /** Stop streaming */
  stop: () => void;
  /** Clear all messages */
  clear: () => void;
}

export function useSSE<T = unknown>(options: UseSSEOptions<T>): UseSSEReturn<T> {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    autoReconnect = true,
    maxReconnectAttempts = 3,
    reconnectDelay = 1000,
    headers = {},
    parseJson = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [messages, setMessages] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
    onClose?.();
  }, [onClose]);

  const start = useCallback(
    async (body?: unknown) => {
      // Stop any existing connection
      stop();

      setError(null);
      setIsStreaming(true);
      reconnectAttemptsRef.current = 0;

      const connect = async () => {
        try {
          abortControllerRef.current = new AbortController();

          const response = await fetch(url, {
            method: body ? 'POST' : 'GET',
            headers: {
              Accept: 'text/event-stream',
              'Content-Type': 'application/json',
              ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: abortControllerRef.current.signal,
          });

          if (!response.ok) {
            throw new Error(`SSE connection failed: ${response.status} ${response.statusText}`);
          }

          if (!response.body) {
            throw new Error('Response body is null');
          }

          setIsConnected(true);
          onOpen?.();

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();

                if (dataStr === '[DONE]') {
                  stop();
                  return;
                }

                try {
                  const parsed = parseJson ? (JSON.parse(dataStr) as T) : (dataStr as T);
                  setData(parsed);
                  setMessages((prev) => [...prev, parsed]);
                  onMessage?.(parsed);
                } catch {
                  // If JSON parsing fails and parseJson is true, treat as raw string
                  if (parseJson) {
                    const rawData = dataStr as T;
                    setData(rawData);
                    setMessages((prev) => [...prev, rawData]);
                    onMessage?.(rawData);
                  }
                }
              }
            }
          }
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            return; // Intentional abort
          }

          const error = err as Error;
          setError(error);
          onError?.(error);
          setIsConnected(false);

          // Auto-reconnect logic
          if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else {
            setIsStreaming(false);
          }
        }
      };

      connect();
    },
    [url, headers, parseJson, autoReconnect, maxReconnectAttempts, reconnectDelay, onMessage, onError, onOpen, stop],
  );

  const clear = useCallback(() => {
    setData(null);
    setMessages([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    data,
    messages,
    error,
    isStreaming,
    isConnected,
    start,
    stop,
    clear,
  };
}
