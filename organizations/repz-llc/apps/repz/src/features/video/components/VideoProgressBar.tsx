import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  chapters?: Array<{ startTime: number; title: string }>;
  className?: string;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
  currentTime,
  duration,
  buffered,
  onSeek,
  chapters = [],
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? (buffered / duration) * 100 : 0;

  const calculateTimeFromPosition = useCallback(
    (clientX: number): number => {
      if (!containerRef.current || duration === 0) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(clientX - rect.left, rect.width));
      return (position / rect.width) * duration;
    },
    [duration]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const position = e.clientX - rect.left;
      setHoverPosition(position);
      setHoverTime(calculateTimeFromPosition(e.clientX));

      if (isDragging) {
        onSeek(calculateTimeFromPosition(e.clientX));
      }
    },
    [calculateTimeFromPosition, isDragging, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      onSeek(calculateTimeFromPosition(e.clientX));
    },
    [calculateTimeFromPosition, onSeek]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    setIsDragging(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getChapterAtTime = (time: number): string | null => {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (time >= chapters[i].startTime) {
        return chapters[i].title;
      }
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative h-2 group cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/20 rounded-full" />

      {/* Buffered Progress */}
      <div
        className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
        style={{ width: `${bufferedPercentage}%` }}
      />

      {/* Current Progress */}
      <div
        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
        style={{ width: `${progressPercentage}%` }}
      />

      {/* Scrubber Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${progressPercentage}% - 8px)` }}
      />

      {/* Chapter Markers */}
      {chapters.map((chapter, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 w-0.5 bg-white/60"
          style={{ left: `${(chapter.startTime / duration) * 100}%` }}
        />
      ))}

      {/* Hover Tooltip */}
      {hoverTime !== null && (
        <div
          className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs text-white whitespace-nowrap"
          style={{ left: hoverPosition }}
        >
          {formatTime(hoverTime)}
          {chapters.length > 0 && getChapterAtTime(hoverTime) && (
            <div className="text-gray-300">{getChapterAtTime(hoverTime)}</div>
          )}
        </div>
      )}
    </div>
  );
};

