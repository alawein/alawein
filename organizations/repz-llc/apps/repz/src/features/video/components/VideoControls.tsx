import React, { useState } from "react";
import { Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoQuality } from "../types";

interface VideoControlsProps {
  quality: VideoQuality;
  playbackRate: number;
  availableQualities: VideoQuality[];
  onQualityChange: (quality: VideoQuality) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const QUALITY_LABELS: Record<VideoQuality, string> = {
  auto: "Auto",
  "1080p": "1080p HD",
  "720p": "720p HD",
  "480p": "480p",
  "360p": "360p",
};

export const VideoControls: React.FC<VideoControlsProps> = ({
  quality,
  playbackRate,
  availableQualities,
  onQualityChange,
  onPlaybackRateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quality" | "speed">("quality");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-gray-300"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl min-w-[200px] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("quality")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                activeTab === "quality"
                  ? "text-white bg-gray-800"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Quality
            </button>
            <button
              onClick={() => setActiveTab("speed")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                activeTab === "speed"
                  ? "text-white bg-gray-800"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Speed
            </button>
          </div>

          {/* Quality Options */}
          {activeTab === "quality" && (
            <div className="py-2">
              {availableQualities.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    onQualityChange(q);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                    quality === q
                      ? "text-primary bg-gray-800"
                      : "text-white hover:bg-gray-800"
                  )}
                >
                  <span>{QUALITY_LABELS[q]}</span>
                  {quality === q && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Speed Options */}
          {activeTab === "speed" && (
            <div className="py-2">
              {PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    onPlaybackRateChange(rate);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                    playbackRate === rate
                      ? "text-primary bg-gray-800"
                      : "text-white hover:bg-gray-800"
                  )}
                >
                  <span>{rate === 1 ? "Normal" : `${rate}x`}</span>
                  {playbackRate === rate && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

