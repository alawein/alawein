import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'lbs'): string {
  return `${weight} ${unit}`;
}

export function calculateCalories(
  exercise: string,
  duration: number,
  weight: number
): number {
  // Simplified MET values
  const metValues: Record<string, number> = {
    running: 9.8,
    cycling: 7.5,
    swimming: 8.0,
    weightlifting: 6.0,
    yoga: 3.0,
    walking: 3.5,
    default: 5.0,
  };

  const met = metValues[exercise.toLowerCase()] || metValues.default;
  const hours = duration / 3600;
  return Math.round(met * weight * hours);
}

