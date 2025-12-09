/**
 * Cross-platform status monitoring hook
 * Provides real-time health checks for platform dev servers
 */

import { useState, useEffect, useCallback } from 'react';

export interface PlatformStatus {
  id: string;
  name: string;
  port: number;
  isOnline: boolean;
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export interface UsePlatformStatusOptions {
  /** Platforms to monitor */
  platforms: Array<{ id: string; name: string; port: number }>;
  /** Check interval in milliseconds (default: 30000) */
  checkInterval?: number;
  /** Enable automatic checking (default: true) */
  autoCheck?: boolean;
  /** Timeout for health checks in milliseconds (default: 5000) */
  timeout?: number;
}

export interface UsePlatformStatusReturn {
  /** Status of all platforms */
  statuses: PlatformStatus[];
  /** Number of online platforms */
  onlineCount: number;
  /** Number of offline platforms */
  offlineCount: number;
  /** Whether a check is in progress */
  isChecking: boolean;
  /** Manually trigger a status check */
  checkAll: () => Promise<void>;
  /** Check a single platform */
  checkOne: (id: string) => Promise<PlatformStatus | null>;
  /** Last time all platforms were checked */
  lastFullCheck: Date | null;
}

async function checkPlatformHealth(
  platform: { id: string; name: string; port: number },
  timeout: number
): Promise<PlatformStatus> {
  const startTime = Date.now();
  const url = `http://localhost:${platform.port}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    return {
      id: platform.id,
      name: platform.name,
      port: platform.port,
      isOnline: true,
      lastChecked: new Date(),
      responseTime,
    };
  } catch (error) {
    return {
      id: platform.id,
      name: platform.name,
      port: platform.port,
      isOnline: false,
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function usePlatformStatus(
  options: UsePlatformStatusOptions
): UsePlatformStatusReturn {
  const {
    platforms,
    checkInterval = 30000,
    autoCheck = true,
    timeout = 5000,
  } = options;

  const [statuses, setStatuses] = useState<PlatformStatus[]>(() =>
    platforms.map((p) => ({
      id: p.id,
      name: p.name,
      port: p.port,
      isOnline: false,
      lastChecked: new Date(),
    }))
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastFullCheck, setLastFullCheck] = useState<Date | null>(null);

  const checkAll = useCallback(async () => {
    setIsChecking(true);
    try {
      const results = await Promise.all(
        platforms.map((p) => checkPlatformHealth(p, timeout))
      );
      setStatuses(results);
      setLastFullCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  }, [platforms, timeout]);

  const checkOne = useCallback(
    async (id: string): Promise<PlatformStatus | null> => {
      const platform = platforms.find((p) => p.id === id);
      if (!platform) return null;

      const result = await checkPlatformHealth(platform, timeout);
      setStatuses((prev) =>
        prev.map((s) => (s.id === id ? result : s))
      );
      return result;
    },
    [platforms, timeout]
  );

  // Auto-check on mount and interval
  useEffect(() => {
    if (!autoCheck) return;

    checkAll();
    const intervalId = setInterval(checkAll, checkInterval);
    return () => clearInterval(intervalId);
  }, [autoCheck, checkAll, checkInterval]);

  const onlineCount = statuses.filter((s) => s.isOnline).length;
  const offlineCount = statuses.filter((s) => !s.isOnline).length;

  return {
    statuses,
    onlineCount,
    offlineCount,
    isChecking,
    checkAll,
    checkOne,
    lastFullCheck,
  };
}

