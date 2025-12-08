import { apiService } from '../api';
import { NetworkError, TimeoutError, AuthenticationError } from '@/lib/errors';
import { securityService, getSecurityHeaders } from '@/config/security.config';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Security Headers', () => {
    it('includes security headers in requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await apiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          }),
        })
      );
    });

    it('applies CSP headers in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const headers = getSecurityHeaders();
      
      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains; preload');

      process.env.NODE_ENV = originalEnv;
    });

    it('disables CSP headers in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const headers = getSecurityHeaders();
      
      expect(headers).not.toHaveProperty('Content-Security-Policy');
      expect(headers).not.toHaveProperty('Strict-Transport-Security');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Security Service Integration', () => {
    it('sanitizes input to prevent XSS', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = securityService.sanitizeInput(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toBe('');
    });

    it('validates file uploads correctly', () => {
      const validImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/octet-stream' });

      const validResult = securityService.validateFileUpload(validImage);
      const invalidResult = securityService.validateFileUpload(invalidFile);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('File type not allowed');
    });

    it('validates JWT tokens correctly', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.signature';
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.signature';

      expect(securityService.validateToken(validToken)).toBe(true);
      expect(securityService.validateToken(expiredToken)).toBe(false);
      expect(securityService.validateToken('invalid')).toBe(false);
    });
  });

  describe('GET requests', () => {
    it('successfully fetches data', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiService.get('/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('includes query parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await apiService.get('/test', { page: '1', limit: '10' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test?page=1&limit=10'),
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    it('successfully posts data', async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const data = { name: 'Test' };
      const result = await apiService.post('/test', data);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles 401 authentication errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(apiService.get('/protected')).rejects.toThrow(AuthenticationError);
    });

    it('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Network error'));

      await expect(apiService.get('/test')).rejects.toThrow(NetworkError);
    });

    it('handles timeout errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({}),
          }), 15000); // Longer than default timeout
        })
      );

      await expect(apiService.get('/slow')).rejects.toThrow(TimeoutError);
    });

    it('parses error responses correctly', async () => {
      const errorMessage = 'Validation failed';
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage, code: 'VALIDATION_ERROR' }),
      });

      await expect(apiService.get('/test')).rejects.toThrow(errorMessage);
    });
  });

  describe('Retry Logic', () => {
    it('retries on 503 Service Unavailable', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: async () => ({ message: 'Service unavailable' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const result = await apiService.get('/test');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('stops retrying after max attempts', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ message: 'Service unavailable' }),
      });

      await expect(apiService.get('/test')).rejects.toThrow();

      // Should retry 3 times + initial request = 4 total
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('does not retry on 400 Bad Request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(apiService.get('/test')).rejects.toThrow();

      // Should not retry
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication Headers', () => {
    it('includes access token when set', async () => {
      apiService.setAccessToken('test-token');

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await apiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );

      // Cleanup
      apiService.setAccessToken(null);
    });

    it('includes CSRF token when set', async () => {
      apiService.setCsrfToken('csrf-token');

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await apiService.post('/test', {});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-CSRF-Token': 'csrf-token',
          }),
        })
      );
    });
  });

  describe('File Upload', () => {
    it('uploads file with progress tracking', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const mockProgress = jest.fn();

      // Mock XMLHttpRequest
      const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        upload: {
          addEventListener: jest.fn(),
        },
        addEventListener: jest.fn((event, handler) => {
          if (event === 'load') {
            setTimeout(() => {
              Object.defineProperty(mockXHR, 'status', { value: 200 });
              Object.defineProperty(mockXHR, 'responseText', { 
                value: JSON.stringify({ success: true }) 
              });
              handler();
            }, 0);
          }
        }),
      };

      global.XMLHttpRequest = jest.fn(() => mockXHR) as any;

      const result = await apiService.uploadFile('/upload', mockFile, mockProgress);

      expect(result).toEqual({ success: true });
      expect(mockXHR.open).toHaveBeenCalledWith('POST', expect.stringContaining('/upload'));
    });
  });
});