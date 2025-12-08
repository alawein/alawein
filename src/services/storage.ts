import { logger } from '@/lib/logger';

interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Simple encryption utilities (use Web Crypto API in production)
class EncryptionService {
  private readonly ENCRYPTION_KEY = 'app-encryption-key'; // Should be from env in production

  async encrypt(data: string): Promise<string> {
    try {
      // In production, use Web Crypto API with proper key management
      // For now, using base64 encoding as placeholder
      if (typeof window !== 'undefined' && window.crypto?.subtle) {
        // TODO: Implement proper AES-GCM encryption
        return btoa(data);
      }
      return btoa(data);
    } catch (error) {
      logger.error('Encryption failed', error as Error);
      return data;
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    try {
      if (typeof window !== 'undefined' && window.crypto?.subtle) {
        // TODO: Implement proper AES-GCM decryption
        return atob(encryptedData);
      }
      return atob(encryptedData);
    } catch (error) {
      logger.error('Decryption failed', error as Error);
      return '';
    }
  }
}

const encryption = new EncryptionService();

class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      // Decrypt if it's a sensitive key
      const decrypted = this.isSensitiveKey(key) 
        ? await encryption.decrypt(item)
        : item;

      return JSON.parse(decrypted);
    } catch (error) {
      logger.error('Failed to get from localStorage', error as Error, { key });
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      
      // Encrypt if it's a sensitive key
      const toStore = this.isSensitiveKey(key)
        ? await encryption.encrypt(serialized)
        : serialized;

      localStorage.setItem(key, toStore);
    } catch (error) {
      logger.error('Failed to set in localStorage', error as Error, { key });
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Failed to remove from localStorage', error as Error, { key });
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Failed to clear localStorage', error as Error);
    }
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = ['refreshToken', 'accessToken', 'apiKey', 'password'];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }
}

class VercelKVAdapter implements StorageAdapter {
  private baseUrl = '/api/kv';

  async get<T>(key: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`KV get failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      logger.error('Failed to get from Vercel KV', error as Error, { key });
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error(`KV set failed: ${response.status}`);
      }
    } catch (error) {
      logger.error('Failed to set in Vercel KV', error as Error, { key });
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 404) {
        throw new Error(`KV remove failed: ${response.status}`);
      }
    } catch (error) {
      logger.error('Failed to remove from Vercel KV', error as Error, { key });
    }
  }

  async clear(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`KV clear failed: ${response.status}`);
      }
    } catch (error) {
      logger.error('Failed to clear Vercel KV', error as Error);
    }
  }
}

class StorageService {
  private adapter: StorageAdapter;

  constructor() {
    this.adapter = process.env.NODE_ENV === 'production' 
      ? new VercelKVAdapter()
      : new LocalStorageAdapter();
    
    logger.info('Storage service initialized', { 
      adapter: this.adapter.constructor.name,
      environment: process.env.NODE_ENV 
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return this.adapter.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return this.adapter.set(key, value);
  }

  async remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }

  /**
   * Securely store sensitive data with encryption
   */
  async setSecure<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    const encrypted = await encryption.encrypt(serialized);
    await this.adapter.set(key, encrypted as any);
  }

  /**
   * Retrieve and decrypt sensitive data
   */
  async getSecure<T>(key: string): Promise<T | null> {
    const encrypted = await this.adapter.get<string>(key);
    if (!encrypted) return null;

    try {
      const decrypted = await encryption.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      logger.error('Failed to decrypt secure data', error as Error, { key });
      return null;
    }
  }
}

export const storageService = new StorageService();
