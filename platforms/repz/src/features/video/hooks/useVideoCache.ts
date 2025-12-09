import { useState, useCallback, useEffect } from "react";
import type { CachedVideo, VideoMetadata, VideoSource } from "../types";

const CACHE_DB_NAME = "repz-video-cache";
const CACHE_STORE_NAME = "videos";
const MAX_CACHE_SIZE_MB = 500;

interface CacheStats {
  totalSize: number;
  itemCount: number;
  availableSpace: number;
}

export function useVideoCache() {
  const [isSupported, setIsSupported] = useState(false);
  const [stats, setStats] = useState<CacheStats>({
    totalSize: 0,
    itemCount: 0,
    availableSpace: MAX_CACHE_SIZE_MB * 1024 * 1024,
  });

  // Check IndexedDB support
  useEffect(() => {
    setIsSupported("indexedDB" in window);
  }, []);

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
          const store = db.createObjectStore(CACHE_STORE_NAME, { keyPath: "videoId" });
          store.createIndex("cachedAt", "cachedAt", { unique: false });
          store.createIndex("expiresAt", "expiresAt", { unique: false });
        }
      };
    });
  }, []);

  const cacheVideo = useCallback(
    async (metadata: VideoMetadata, sources: VideoSource[]): Promise<void> => {
      if (!isSupported) return;

      const db = await openDB();
      const transaction = db.transaction(CACHE_STORE_NAME, "readwrite");
      const store = transaction.objectStore(CACHE_STORE_NAME);

      const cachedVideo: CachedVideo = {
        videoId: metadata.id,
        sources,
        metadata,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        sizeBytes: 0, // Would be calculated from actual blob sizes
      };

      return new Promise((resolve, reject) => {
        const request = store.put(cachedVideo);
        request.onsuccess = () => {
          updateStats();
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    },
    [isSupported, openDB]
  );

  const getCachedVideo = useCallback(
    async (videoId: string): Promise<CachedVideo | null> => {
      if (!isSupported) return null;

      const db = await openDB();
      const transaction = db.transaction(CACHE_STORE_NAME, "readonly");
      const store = transaction.objectStore(CACHE_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(videoId);
        request.onsuccess = () => {
          const cached = request.result as CachedVideo | undefined;
          if (cached && new Date(cached.expiresAt) > new Date()) {
            resolve(cached);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [isSupported, openDB]
  );

  const removeCachedVideo = useCallback(
    async (videoId: string): Promise<void> => {
      if (!isSupported) return;

      const db = await openDB();
      const transaction = db.transaction(CACHE_STORE_NAME, "readwrite");
      const store = transaction.objectStore(CACHE_STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.delete(videoId);
        request.onsuccess = () => {
          updateStats();
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    },
    [isSupported, openDB]
  );

  const clearCache = useCallback(async (): Promise<void> => {
    if (!isSupported) return;

    const db = await openDB();
    const transaction = db.transaction(CACHE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CACHE_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        updateStats();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }, [isSupported, openDB]);

  const updateStats = useCallback(async () => {
    if (!isSupported) return;

    const db = await openDB();
    const transaction = db.transaction(CACHE_STORE_NAME, "readonly");
    const store = transaction.objectStore(CACHE_STORE_NAME);

    const countRequest = store.count();
    countRequest.onsuccess = () => {
      setStats((prev) => ({
        ...prev,
        itemCount: countRequest.result,
      }));
    };
  }, [isSupported, openDB]);

  useEffect(() => {
    if (isSupported) {
      updateStats();
    }
  }, [isSupported, updateStats]);

  return {
    isSupported,
    stats,
    cacheVideo,
    getCachedVideo,
    removeCachedVideo,
    clearCache,
  };
}

