import React from "react";
import { Play, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoMetadata, DifficultyLevel } from "../types";

interface VideoCardProps {
  video: VideoMetadata;
  progress?: number; // 0-100
  onClick?: () => void;
  className?: string;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-orange-500",
  elite: "bg-red-500",
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
};

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  progress,
  onClick,
  className,
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
          {formatDuration(video.duration)}
        </div>

        {/* Progress Bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {video.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* Instructor */}
          <img
            src={video.instructor.avatar}
            alt={video.instructor.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="truncate">{video.instructor.name}</span>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 mt-3">
          {/* Difficulty */}
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium text-white",
              DIFFICULTY_COLORS[video.difficulty]
            )}
          >
            {DIFFICULTY_LABELS[video.difficulty]}
          </span>

          {/* Category */}
          <span className="text-xs text-muted-foreground capitalize">
            {video.category}
          </span>
        </div>
      </div>
    </div>
  );
};

