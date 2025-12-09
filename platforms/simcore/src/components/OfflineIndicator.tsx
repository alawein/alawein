/**
 * Offline status indicator component
 */

import React from "react";
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOffline } from "@/hooks/use-offline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OfflineIndicatorProps {
  variant?: "minimal" | "detailed";
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  variant = "minimal",
  className,
}) => {
  const { isOnline, connectionStatus, pendingSyncCount, syncNow, storageQuota } = useOffline();

  const getStatusColor = () => {
    if (!isOnline) return "text-red-500";
    if (connectionStatus === "slow") return "text-yellow-500";
    if (pendingSyncCount > 0) return "text-blue-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (pendingSyncCount > 0) return <Cloud className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline - Changes saved locally";
    if (connectionStatus === "slow") return "Slow connection";
    if (pendingSyncCount > 0) return `${pendingSyncCount} changes pending sync`;
    return "All synced";
  };

  if (variant === "minimal") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-1", getStatusColor(), className)}>
              {getStatusIcon()}
              {pendingSyncCount > 0 && (
                <span className="text-xs font-medium">{pendingSyncCount}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", className)}>
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-full bg-opacity-20", getStatusColor())}>
            {getStatusIcon()}
          </div>
          <div>
            <p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
            <p className="text-sm text-muted-foreground">{getStatusText()}</p>
          </div>
        </div>

        {isOnline && pendingSyncCount > 0 && (
          <button
            onClick={() => syncNow()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Sync now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pending Changes */}
      {pendingSyncCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <Cloud className="w-4 h-4" />
          <span>{pendingSyncCount} changes waiting to sync</span>
        </div>
      )}

      {/* Storage Usage */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Local Storage</span>
          <span>{(storageQuota.usage / 1024 / 1024).toFixed(1)} MB</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              storageQuota.percentUsed > 90 ? "bg-red-500" : "bg-primary"
            )}
            style={{ width: `${Math.min(storageQuota.percentUsed, 100)}%` }}
          />
        </div>
        {storageQuota.percentUsed > 80 && (
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <AlertCircle className="w-3 h-3" />
            <span>Storage running low</span>
          </div>
        )}
      </div>

      {/* Offline Mode Info */}
      {!isOnline && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Working Offline</p>
          <p className="text-muted-foreground">
            Your simulations and data are saved locally. Changes will sync when you're back online.
          </p>
        </div>
      )}
    </div>
  );
};

