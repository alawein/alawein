/**
 * Component for managing saved offline simulations
 */

import React, { useState, useEffect } from "react";
import { Play, Trash2, Cloud, CloudOff, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOffline } from "@/hooks/use-offline";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SimulationState } from "@/lib/offline/types";

interface SavedSimulationsProps {
  onLoadSimulation?: (simulation: SimulationState) => void;
  className?: string;
}

export const SavedSimulations: React.FC<SavedSimulationsProps> = ({
  onLoadSimulation,
  className,
}) => {
  const { getSavedSimulations, deleteSimulation, isOnline } = useOffline();
  const [simulations, setSimulations] = useState<SimulationState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimulations = async () => {
      setLoading(true);
      const saved = await getSavedSimulations();
      setSimulations(saved.sort((a, b) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      ));
      setLoading(false);
    };

    loadSimulations();
  }, [getSavedSimulations]);

  const handleDelete = async (id: string) => {
    await deleteSimulation(id);
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CloudOff className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No saved simulations</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Your simulations will be saved here for offline access
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Simulations</h3>
        <span className="text-sm text-muted-foreground">
          {simulations.length} saved
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {simulations.map((sim) => (
          <Card key={sim.id} className="group">
            {/* Thumbnail */}
            {sim.thumbnail && (
              <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                <img
                  src={sim.thumbnail}
                  alt={sim.moduleName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{sim.moduleName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(sim.savedAt)}
                  </CardDescription>
                </div>
                <div className={cn("p-1 rounded", isOnline ? "text-green-500" : "text-yellow-500")}>
                  {isOnline ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onLoadSimulation?.(sim)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Load
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Simulation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this saved simulation. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(sim.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

