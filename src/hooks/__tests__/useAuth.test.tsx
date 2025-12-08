import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import { apiService } from '@/services/api';
import { storageService } from '@/services/storage';
import { AuthenticationError, ValidationError } from '@/lib/errors';

// Mock dependencies
jest.mock('@/services/api');
jest.mock('@/services/storage');
jest.mock('@/lib/logger');

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('useAuth Hook', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'client' as const,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.get.mockResolvedValue(null);
  });

  describe('Initialization', () => {
    it('initializes with loading state', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('throws error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within AuthProvider');
    });
  });

  describe('Login', () => {
    it('successfully logs in with valid credentials', async () => {
      mockApiService.post.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login('test@example.com', 'Password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(mockStorageService.set).toHaveBeenCalledWith('refreshToken', 'refresh-token');
    });

    it('validates email format before login', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.login('invalid-email', 'Password123');
        })
      ).rejects.toThrow(ValidationError);

      expect(mockApiService.post).not.toHaveBeenCalled();
    });

    it('validates password strength before login', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'weak');
        })
      ).rejects.toThrow(ValidationError);

      expect(mockApiService.post).not.toHaveBeenCalled();
    });

    it('handles network errors gracefully', async () => {
      mockApiService.post.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'Password123');
        })
      ).rejects.toThrow();

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('handles authentication failures', async () => {
      mockApiService.post.mockRejectedValue(
        new AuthenticationError('Invalid credentials')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'WrongPassword123');
        })
      ).rejects.toThrow(AuthenticationError);

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('sanitizes email input', async () => {
      mockApiService.post.mockResolvedValue({
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login('  TEST@EXAMPLE.COM  ', 'Password123');
      });

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.objectContaining({
          email: 'test@example.com', // Should be trimmed and lowercased
        })
      );
    });
  });

  describe('Register', () => {
    it('successfully registers new user', async () => {
      mockApiService.post.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.register('test@example.com', 'Password123', {
          firstName: 'John',
          lastName: 'Doe',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('validates email during registration', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.register('invalid', 'Password123', {
            firstName: 'John',
            lastName: 'Doe',
          });
        })
      ).rejects.toThrow(ValidationError);
    });

    it('validates password strength during registration', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.register('test@example.com', 'weak', {
            firstName: 'John',
            lastName: 'Doe',
          });
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Logout', () => {
    it('successfully logs out user', async () => {
      mockApiService.post.mockResolvedValue({});

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // First login
      mockApiService.post.mockResolvedValueOnce({
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      await act(async () => {
        await result.current.login('test@example.com', 'Password123');
      });

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(mockStorageService.remove).toHaveBeenCalledWith('refreshToken');
    });

    it('clears tokens even if API call fails', async () => {
      mockApiService.post.mockRejectedValue(new Error('Logout failed'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockStorageService.remove).toHaveBeenCalledWith('refreshToken');
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    it('successfully refreshes token', async () => {
      mockStorageService.get.mockResolvedValue('refresh-token');
      mockApiService.post.mockResolvedValue({
        user: mockUser,
        accessToken: 'new-access-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('logs out when refresh token is missing', async () => {
      mockStorageService.get.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.refreshToken();
        })
      ).rejects.toThrow(AuthenticationError);

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('logs out when token refresh fails', async () => {
      mockStorageService.get.mockResolvedValue('invalid-token');
      mockApiService.post.mockRejectedValue(new AuthenticationError('Token expired'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.refreshToken();
        })
      ).rejects.toThrow(AuthenticationError);

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Update Profile', () => {
    it('successfully updates user profile', async () => {
      const updatedUser = {
        ...mockUser,
        profile: { ...mockUser.profile, firstName: 'Jane' },
      };

      mockApiService.put.mockResolvedValue({ user: updatedUser });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Set initial user
      act(() => {
        result.current.user = mockUser;
      });

      await act(async () => {
        await result.current.updateProfile({ firstName: 'Jane' });
      });

      expect(result.current.user?.profile.firstName).toBe('Jane');
    });

    it('handles profile update failures', async () => {
      mockApiService.put.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await expect(
        act(async () => {
          await result.current.updateProfile({ firstName: 'Jane' });
        })
      ).rejects.toThrow();
    });
  });
});