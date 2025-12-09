import { useState, useCallback, useEffect, useRef } from "react";
import type { VideoProgress } from "../types";

const SAVE_INTERVAL_MS = 5000; // Save progress every 5 seconds
const COMPLETION_THRESHOLD = 0.9; // 90% watched = completed

interface UseVideoProgressOptions {
  videoId: string;
  userId: string;
  duration: number;
  onProgress?: (progress: VideoProgress) => void;
  onComplete?: () => void;
}

export function useVideoProgress({
  videoId,
  userId,
  duration,
  onProgress,
  onComplete,
}: UseVideoProgressOptions) {
  const [progress, setProgress] = useState<VideoProgress>({
    videoId,
    userId,
    watchedDuration: 0,
    lastPosition: 0,
    completionPercentage: 0,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  });

  const lastSaveTime = useRef<number>(0);
  const hasCompleted = useRef<boolean>(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const key = `video-progress-${userId}-${videoId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as VideoProgress;
        setProgress(parsed);
        hasCompleted.current = parsed.completedAt !== null;
      } catch {
        // Invalid data, start fresh
      }
    }
  }, [videoId, userId]);

  const updateProgress = useCallback(
    (currentTime: number) => {
      if (duration === 0) return;

      const now = Date.now();
      const completionPercentage = Math.min(1, currentTime / duration);

      setProgress((prev) => {
        const newProgress: VideoProgress = {
          ...prev,
          watchedDuration: Math.max(prev.watchedDuration, currentTime),
          lastPosition: currentTime,
          completionPercentage,
          updatedAt: new Date().toISOString(),
        };

        // Check for completion
        if (
          completionPercentage >= COMPLETION_THRESHOLD &&
          !hasCompleted.current
        ) {
          newProgress.completedAt = new Date().toISOString();
          hasCompleted.current = true;
          onComplete?.();
        }

        // Save to localStorage periodically
        if (now - lastSaveTime.current >= SAVE_INTERVAL_MS) {
          const key = `video-progress-${userId}-${videoId}`;
          localStorage.setItem(key, JSON.stringify(newProgress));
          lastSaveTime.current = now;
          onProgress?.(newProgress);
        }

        return newProgress;
      });
    },
    [duration, videoId, userId, onProgress, onComplete]
  );

  const saveProgress = useCallback(() => {
    const key = `video-progress-${userId}-${videoId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    onProgress?.(progress);
  }, [progress, videoId, userId, onProgress]);

  const resetProgress = useCallback(() => {
    const key = `video-progress-${userId}-${videoId}`;
    localStorage.removeItem(key);
    hasCompleted.current = false;
    setProgress({
      videoId,
      userId,
      watchedDuration: 0,
      lastPosition: 0,
      completionPercentage: 0,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    });
  }, [videoId, userId]);

  // Save on unmount
  useEffect(() => {
    return () => {
      const key = `video-progress-${userId}-${videoId}`;
      localStorage.setItem(key, JSON.stringify(progress));
    };
  }, [progress, videoId, userId]);

  return {
    progress,
    updateProgress,
    saveProgress,
    resetProgress,
    isCompleted: progress.completedAt !== null,
  };
}

