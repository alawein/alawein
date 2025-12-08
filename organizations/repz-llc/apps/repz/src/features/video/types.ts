/**
 * Video streaming types for REPZ fitness platform
 */

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  thumbnail: string;
  category: VideoCategory;
  difficulty: DifficultyLevel;
  instructor: InstructorInfo;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoSource {
  url: string;
  quality: VideoQuality;
  type: "hls" | "mp4" | "webm";
  bitrate?: number;
}

export interface InstructorInfo {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
}

export type VideoCategory =
  | "strength"
  | "cardio"
  | "hiit"
  | "yoga"
  | "mobility"
  | "recovery"
  | "nutrition"
  | "technique";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "elite";

export type VideoQuality = "auto" | "1080p" | "720p" | "480p" | "360p";

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  quality: VideoQuality;
  playbackRate: number;
  isFullscreen: boolean;
}

export interface VideoProgress {
  videoId: string;
  userId: string;
  watchedDuration: number;
  lastPosition: number;
  completionPercentage: number;
  completedAt: string | null;
  updatedAt: string;
}

export interface CachedVideo {
  videoId: string;
  sources: VideoSource[];
  metadata: VideoMetadata;
  cachedAt: string;
  expiresAt: string;
  sizeBytes: number;
}

export interface VideoPlayerConfig {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  preload: "auto" | "metadata" | "none";
  defaultQuality: VideoQuality;
  enableCaching: boolean;
  maxCacheSize: number; // MB
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
}

export interface VideoPlaylist {
  id: string;
  title: string;
  description: string;
  videos: VideoMetadata[];
  totalDuration: number;
  createdBy: string;
  isPublic: boolean;
}

