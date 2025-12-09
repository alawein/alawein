/**
 * Sentry Error Boundary Component
 *
 * Catches React errors and reports them to Sentry.
 */

import * as Sentry from '@sentry/react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  showDialog?: boolean;
  dialogOptions?: {
    title?: string;
    subtitle?: string;
    subtitle2?: string;
    labelName?: string;
    labelEmail?: string;
    labelComments?: string;
    labelClose?: string;
    labelSubmit?: string;
    successMessage?: string;
  };
}

/**
 * Error Boundary that reports errors to Sentry
 *
 * @example
 * ```tsx
 * import { SentryErrorBoundary } from '@alawein/integrations/sentry';
 *
 * function App() {
 *   return (
 *     <SentryErrorBoundary
 *       fallback={<ErrorPage />}
 *       onError={(error) => console.error(error)}
 *     >
 *       <MyApp />
 *     </SentryErrorBoundary>
 *   );
 * }
 * ```
 */
export function SentryErrorBoundary({
  children,
  fallback,
  onError,
  showDialog = false,
  dialogOptions,
}: ErrorBoundaryProps) {
  const handleError = (error: Error, componentStack: string) => {
    if (onError) {
      onError(error, { componentStack });
    }
  };

  const renderFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
    if (typeof fallback === 'function') {
      return fallback(error, resetError);
    }

    if (fallback) {
      return fallback;
    }

    // Default fallback UI
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <h1 style={{ color: '#1a1a1a', marginBottom: '16px' }}>Something went wrong</h1>
        <p style={{ color: '#6a6a6a', marginBottom: '24px' }}>We've been notified and are working to fix the issue.</p>
        <button
          onClick={resetError}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Try Again
        </button>
      </div>
    );
  };

  return (
    <Sentry.ErrorBoundary
      fallback={renderFallback}
      onError={handleError}
      showDialog={showDialog}
      dialogOptions={dialogOptions}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
