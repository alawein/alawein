/**
 * Response helper utilities
 */

import type { ApiResponse, ApiErrorResponse } from '../types/generated';

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data };
}

export function createErrorResponse(code: string, message: string): ApiErrorResponse {
  return { code, message };
}
