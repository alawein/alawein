import { useState, useCallback, useRef, useEffect } from "react";
import type { PlaybackState, VideoQuality, VideoSource } from "../types";

const DEFAULT_STATE: PlaybackState = {
  isPlaying: false,
  isPaused: true,
  isBuffering: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  quality: "auto",
  playbackRate: 1,
  isFullscreen: false,
};

export function useVideoPlayer(sources: VideoSource[]) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<PlaybackState>(DEFAULT_STATE);
  const [currentSource, setCurrentSource] = useState<VideoSource | null>(
    sources.find((s) => s.quality === "auto") || sources[0] || null
  );

  const play = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
      } catch (error) {
        console.error("Failed to play video:", error);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      videoRef.current.volume = clampedVolume;
      videoRef.current.muted = clampedVolume === 0;
      setState((prev) => ({
        ...prev,
        volume: clampedVolume,
        isMuted: clampedVolume === 0,
      }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    }
  }, []);

  const setQuality = useCallback((quality: VideoQuality) => {
    const newSource = sources.find((s) => s.quality === quality);
    if (newSource && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentSource(newSource);
      setState((prev) => ({ ...prev, quality }));
      // Restore position after source change
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
        }
      }, 100);
    }
  }, [sources]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setState((prev) => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return;
    const container = videoRef.current.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: true }));
    } else {
      await document.exitFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // Event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers = {
      timeupdate: () => setState((prev) => ({ ...prev, currentTime: video.currentTime })),
      durationchange: () => setState((prev) => ({ ...prev, duration: video.duration })),
      waiting: () => setState((prev) => ({ ...prev, isBuffering: true })),
      canplay: () => setState((prev) => ({ ...prev, isBuffering: false })),
      ended: () => setState((prev) => ({ ...prev, isPlaying: false, isPaused: true })),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, []);

  return {
    videoRef,
    state,
    currentSource,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setQuality,
    setPlaybackRate,
    toggleFullscreen,
  };
}

