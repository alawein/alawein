---
title: 'Error Handling Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Error Handling Guide

Error handling patterns, error boundaries, and user-friendly error messages.

## Overview

Proper error handling improves user experience and makes debugging easier. This
guide covers patterns for handling errors at all levels.

## Error Types

| Type       | Description            | Handling           |
| ---------- | ---------------------- | ------------------ |
| Network    | API failures, timeouts | Retry, fallback UI |
| Validation | Invalid user input     | Form errors        |
| Auth       | Unauthorized access    | Redirect to login  |
| Runtime    | Unexpected errors      | Error boundary     |
| Business   | Domain-specific errors | User message       |

## React Error Boundaries

### Basic Error Boundary

```typescript
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
    // Send to error tracking service
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Error Fallback Component

```typescript
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We're sorry, but something unexpected happened.</p>

      {process.env.NODE_ENV === "development" && error && (
        <pre className="error-details">{error.message}</pre>
      )}

      <div className="error-actions">
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        {resetError && (
          <Button variant="outline" onClick={resetError}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Using Error Boundaries

```typescript
// Wrap critical sections
function App() {
  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <Router>
        <ErrorBoundary fallback={<PageErrorFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}

// Feature-level boundaries
function SimulationViewer({ id }: { id: string }) {
  return (
    <ErrorBoundary
      fallback={<SimulationErrorFallback />}
      onError={(error) => logError("simulation", error)}
    >
      <SimulationCanvas id={id} />
    </ErrorBoundary>
  );
}
```

## API Error Handling

### Custom Error Classes

```typescript
// errors/ApiError.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, data?: any): ApiError {
    return new ApiError(
      data?.message || response.statusText,
      response.status,
      data?.code,
    );
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### API Client with Error Handling

```typescript
async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw ApiError.fromResponse(response, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new NetworkError();
    }

    throw error;
  }
}
```

### React Query Error Handling

```typescript
// Global error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof ApiError && error.statusCode < 500) {
          return false;
        }
        return failureCount < 3;
      },
      onError: (error) => {
        if (error instanceof ApiError && error.statusCode === 401) {
          // Redirect to login
          window.location.href = '/login';
        }
      },
    },
    mutations: {
      onError: (error) => {
        // Show toast for mutation errors
        toast.error(getErrorMessage(error));
      },
    },
  },
});

// Per-query error handling
function useSimulation(id: string) {
  return useQuery({
    queryKey: ['simulation', id],
    queryFn: () => fetchSimulation(id),
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 404) {
        // Handle not found specifically
        navigate('/simulations');
      }
    },
  });
}
```

## Form Validation Errors

### With React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await signIn(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Set field-specific errors from server
        Object.entries(error.fields).forEach(([field, message]) => {
          setError(field as any, { message });
        });
      } else {
        // Set root error for general failures
        setError("root", {
          message: getErrorMessage(error),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="error-banner">{errors.root.message}</div>
      )}

      <Input
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

## User-Friendly Error Messages

### Error Message Utility

```typescript
// utils/errorMessages.ts
const errorMessages: Record<string, string> = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Check for specific error codes
    if (error.code && errorMessages[error.code]) {
      return errorMessages[error.code];
    }

    // Fall back to status code
    switch (error.statusCode) {
      case 401:
        return errorMessages.UNAUTHORIZED;
      case 403:
        return errorMessages.FORBIDDEN;
      case 404:
        return errorMessages.NOT_FOUND;
      case 422:
        return errorMessages.VALIDATION_ERROR;
      case 429:
        return errorMessages.RATE_LIMITED;
      default:
        if (error.statusCode >= 500) {
          return errorMessages.SERVER_ERROR;
        }
    }
  }

  if (error instanceof NetworkError) {
    return errorMessages.NETWORK_ERROR;
  }

  if (error instanceof Error) {
    // In development, show actual error
    if (process.env.NODE_ENV === 'development') {
      return error.message;
    }
  }

  return errorMessages.DEFAULT;
}
```

## Toast Notifications

```typescript
// Error toast utility
import { toast } from 'sonner';

export function showErrorToast(error: unknown) {
  const message = getErrorMessage(error);

  toast.error(message, {
    action: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
  });
}

// Success with undo
export function showSuccessToast(message: string, onUndo?: () => void) {
  toast.success(message, {
    action: onUndo
      ? {
          label: 'Undo',
          onClick: onUndo,
        }
      : undefined,
  });
}
```

## Logging Errors

```typescript
// Error logging utility
interface ErrorContext {
  userId?: string;
  action?: string;
  component?: string;
  extra?: Record<string, unknown>;
}

export function logError(error: unknown, context?: ErrorContext) {
  const errorData = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData);
  }

  // Send to error tracking service
  Sentry.captureException(error, {
    tags: {
      action: context?.action,
      component: context?.component,
    },
    user: context?.userId ? { id: context.userId } : undefined,
    extra: context?.extra,
  });
}
```

## Best Practices

1. **Never swallow errors** - Always handle or rethrow
2. **Use specific error types** - Easier to handle appropriately
3. **Provide actionable messages** - Tell users what to do
4. **Log for debugging** - Include context
5. **Graceful degradation** - Show fallback UI
6. **Don't expose internals** - Hide technical details from users

## Related Documents

- [MONITORING.md](./MONITORING.md) - Error monitoring
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component patterns
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - State management
