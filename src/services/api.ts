import { AppError, NetworkError, TimeoutError, AuthenticationError, handleError } from '@/lib/errors';
import { logger } from '@/lib/logger';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private accessToken: string | null = null;
  private csrfToken: string | null = null;
  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  };

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.initializeCsrfToken();
  }

  private async initializeCsrfToken() {
    try {
      const response = await fetch(`${this.baseUrl}/csrf-token`);
      const data = await response.json();
      this.csrfToken = data.token;
    } catch (error) {
      logger.warn('Failed to initialize CSRF token', { error });
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    return headers;
  }

  private async requestWithTimeout<T>(
    url: string,
    options: RequestInit,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError('Request timeout', { url, timeout });
      }
      throw error;
    }
  }

  private async retryRequest<T>(
    fn: () => Promise<Response>,
    retries: number = 0
  ): Promise<Response> {
    try {
      return await fn();
    } catch (error) {
      const shouldRetry =
        retries < this.retryConfig.maxRetries &&
        error instanceof AppError &&
        this.retryConfig.retryableStatuses.includes(error.statusCode);

      if (shouldRetry) {
        const delay = this.retryConfig.retryDelay * Math.pow(2, retries);
        logger.info(`Retrying request after ${delay}ms`, { retries, error });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries + 1);
      }

      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    logger.debug('API Request', { method: options.method || 'GET', url });

    try {
      const response = await this.retryRequest(
        () => this.requestWithTimeout(url, config)
      );

      // Handle authentication errors
      if (response.status === 401) {
        logger.warn('Authentication failed', { url, status: response.status });
        throw new AuthenticationError('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new AppError(
          errorData.message || `HTTP ${response.status}`,
          errorData.code,
          response.status
        );
        logger.error('API Error', error, { url, status: response.status });
        throw error;
      }

      const data = await response.json();
      logger.debug('API Response', { url, status: response.status });
      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      // Network or parsing errors
      if (error instanceof TypeError) {
        const networkError = new NetworkError('Network error occurred', { url });
        logger.error('Network Error', error, { url });
        throw networkError;
      }

      throw handleError(error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (error) {
            reject(new AppError('Failed to parse response'));
          }
        } else {
          reject(new AppError(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new NetworkError('Upload failed'));
      });

      xhr.open('POST', `${this.baseUrl}${endpoint}`);

      // Add auth headers
      const authHeaders = this.getAuthHeaders();
      Object.entries(authHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
      });

      xhr.send(formData);
    });
  }
}

export const apiService = new ApiService();

// Workout-specific API methods
export const workoutApi = {
  getWorkouts: (params?: Record<string, string>) =>
    apiService.get<any[]>('/workouts', params),
  getWorkout: (id: string) =>
    apiService.get<any>(`/workouts/${id}`),
  createWorkout: (workout: any) =>
    apiService.post<any>('/workouts', workout),
  updateWorkout: (id: string, workout: any) =>
    apiService.patch<any>(`/workouts/${id}`, workout),
  deleteWorkout: (id: string) =>
    apiService.delete(`/workouts/${id}`),
};
