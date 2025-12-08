/**
 * Generated types from OpenAPI specification
 * TODO: Generate from openapi.json using openapi-typescript
 */

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// OpenAPI paths and components (placeholder for generated types)
export interface paths {
  [key: string]: {
    get?: Record<string, unknown>;
    post?: Record<string, unknown>;
    put?: Record<string, unknown>;
    patch?: Record<string, unknown>;
    delete?: Record<string, unknown>;
  };
}

export interface components {
  schemas: Record<string, unknown>;
  responses: Record<string, unknown>;
  parameters: Record<string, unknown>;
  requestBodies: Record<string, unknown>;
}

// Vite environment types
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_SENTRY_DSN?: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: Record<string, unknown>) => void;
      captureMessage: (message: string, level?: string) => void;
    };
  }
}
