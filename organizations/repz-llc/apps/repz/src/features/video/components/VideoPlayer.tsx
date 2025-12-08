import React, { useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { useVideoProgress } from "../hooks/useVideoProgress";
import { VideoControls } from "./VideoControls";
import { VideoProgressBar } from "./VideoProgressBar";
import type { VideoMetadata, VideoSource } from "../types";

interface VideoPlayerProps {
  metadata: VideoMetadata;
  sources: VideoSource[];
  userId: string;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  metadata,
  sources,
  userId,
  autoplay = false,
  className,
  onComplete,
}) => {
  const {
    videoRef,
    state,
    currentSource,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setQuality,
    setPlaybackRate,
    toggleFullscreen,
  } = useVideoPlayer(sources);

  const { progress, updateProgress, isCompleted } = useVideoProgress({
    videoId: metadata.id,
    userId,
    duration: state.duration,
    onComplete,
  });

  // Update progress on timeupdate
  useEffect(() => {
    if (state.currentTime > 0) {
      updateProgress(state.currentTime);
    }
  }, [state.currentTime, updateProgress]);

  // Seek to last position on load
  useEffect(() => {
    if (state.duration > 0 && progress.lastPosition > 0 && !isCompleted) {
      seek(progress.lastPosition);
    }
  }, [state.duration, progress.lastPosition, isCompleted, seek]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "relative group bg-black rounded-lg overflow-hidden",
        state.isFullscreen && "fixed inset-0 z-50",
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentSource?.url}
        poster={metadata.thumbnail}
        autoPlay={autoplay}
        playsInline
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Loading Indicator */}
      {state.isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}

      {/* Play/Pause Overlay */}
      {state.isPaused && !state.isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <Play className="w-16 h-16 text-white fill-white" />
        </button>
      )}

      {/* Controls Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <VideoProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          buffered={0}
          onSeek={seek}
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {state.isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {state.isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            <span className="text-white text-sm">
              {formatTime(state.currentTime)} / {formatTime(state.duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <VideoControls
              quality={state.quality}
              playbackRate={state.playbackRate}
              availableQualities={sources.map((s) => s.quality)}
              onQualityChange={setQuality}
              onPlaybackRateChange={setPlaybackRate}
            />
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

