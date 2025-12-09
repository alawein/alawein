import React, { useState, useMemo } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VideoCard } from "./VideoCard";
import type { VideoMetadata, VideoCategory, DifficultyLevel } from "../types";

interface VideoLibraryProps {
  videos: VideoMetadata[];
  userProgress?: Record<string, number>; // videoId -> completion percentage
  onVideoSelect: (video: VideoMetadata) => void;
  className?: string;
}

const CATEGORIES: VideoCategory[] = [
  "strength",
  "cardio",
  "hiit",
  "yoga",
  "mobility",
  "recovery",
  "nutrition",
  "technique",
];

const DIFFICULTIES: DifficultyLevel[] = ["beginner", "intermediate", "advanced", "elite"];

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  videos,
  userProgress = {},
  onVideoSelect,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === "all" || video.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [videos, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VideoCategory | "all")}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | "all")}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            <option value="all">All Levels</option>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff} className="capitalize">
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"} found
      </p>

      {/* Video Grid/List */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}
      >
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            progress={userProgress[video.id]}
            onClick={() => onVideoSelect(video)}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos match your filters.</p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedDifficulty("all"); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

