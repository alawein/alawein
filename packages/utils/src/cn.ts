/**
 * Class Name Utility
 * 
 * Combines class names using clsx and tailwind-merge for optimal Tailwind CSS usage.
 * This utility is used across all projects for consistent class name handling.
 * 
 * @example
 * ```tsx
 * import { cn } from '@alawein/utils/cn'
 * 
 * <div className={cn('base-class', isActive && 'active-class', className)} />
 * ```
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names intelligently, merging Tailwind classes properly
 * 
 * @param inputs - Any number of class values (strings, objects, arrays)
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Type export for ClassValue
 */
export type { ClassValue }
