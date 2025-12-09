import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';

/**
 * Props for the error fallback component
 */
export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component to render when an error occurs */
  fallback?: ReactNode | ComponentType<ErrorFallbackProps>;
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback to report error to external service */
  onReport?: (error: Error, errorInfo: ErrorInfo) => Promise<void>;
  /** Whether to show error details in the default fallback */
  showDetails?: boolean;
  /** Custom error boundary name for debugging */
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: ComponentType<ErrorFallbackProps & { showDetails?: boolean }> = ({
  error,
  resetError,
  showDetails = true,
}) => (
  <div
    role="alert"
    className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800"
  >
    <div className="flex items-center gap-2 mb-3">
      <svg className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</h2>
    </div>
    <p className="text-sm text-red-600 dark:text-red-300 mb-4">An unexpected error occurred. Please try again.</p>
    {showDetails && error && (
      <details className="mb-4">
        <summary className="text-sm cursor-pointer text-red-700 dark:text-red-300 hover:underline">Error details</summary>
        <pre className="mt-2 p-3 rounded bg-red-100 dark:bg-red-900/30 text-xs text-red-900 dark:text-red-100 overflow-auto max-h-40">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    )}
    <button
      onClick={resetError}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
    >
      Try again
    </button>
  </div>
);

/**
 * Enhanced ErrorBoundary with retry, error reporting, and customizable fallback
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ''}]`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
    if (this.props.onReport) {
      this.props.onReport(error, errorInfo).catch((e) => console.error('Failed to report error:', e));
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = true } = this.props;

    if (hasError) {
      if (typeof fallback === 'function') {
        const FallbackComponent = fallback;
        return <FallbackComponent error={error} errorInfo={errorInfo} resetError={this.resetError} />;
      }
      if (fallback) return fallback;
      return <DefaultErrorFallback error={error} errorInfo={errorInfo} resetError={this.resetError} showDetails={showDetails} />;
    }
    return children;
  }
}

/**
 * HOC for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): ComponentType<P> {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithErrorBoundary;
}
