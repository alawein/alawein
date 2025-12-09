import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const actionButtonVariants = cva([
  // Base styles - accessible foundation
  "inline-flex items-center justify-center gap-2 whitespace-nowrap",
  "font-medium transition-all duration-[350ms] relative overflow-hidden",
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50",
  "disabled:pointer-events-none disabled:opacity-50",
  // Shimmer effect for premium feel
  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
  // Hardware acceleration
  "transform-gpu will-change-transform",
], {
  variants: {
    variant: {
      primary: [
        "bg-accent text-black shadow-lg",
        "hover:brightness-95 hover:shadow-xl",
        "active:scale-[0.98] active:shadow-md",
      ],
      secondary: [
        "bg-[rgba(255,255,255,0.03)] text-muted border border-[rgba(255,255,255,0.1)]",
        "hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)]",
        "active:scale-[0.98]",
      ],
      danger: [
        "bg-red-600 text-white shadow-lg",
        "hover:bg-red-700 hover:shadow-xl",
        "active:scale-[0.98] active:shadow-md",
      ],
      ghost: [
        "text-muted hover:text-foreground",
        "hover:bg-[rgba(255,255,255,0.03)]",
      ],
    },
    size: {
      normal: "px-4 py-2 min-h-[44px] min-w-[44px] text-sm",
      compact: "px-3 py-1.5 min-h-[36px] text-xs",
      large: "px-6 py-3 min-h-[48px] text-base",
      icon: "p-3 min-h-[44px] min-w-[44px]",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "normal",
  }
});

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  /**
   * Icon component to display - should be descriptive with text
   */
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  /**
   * Additional accessible label - only use if visible text doesn't fully describe action
   */
  ariaLabel?: string;
  /**
   * Loading state with accessible announcement
   */
  loading?: boolean;
  /**
   * File metadata for download actions (e.g., "ONNX, 3.2 MB")
   */
  fileMeta?: string;
}

/**
 * Accessible action button with descriptive labels and proper sizing
 * 
 * Guidelines:
 * - Always use verb-first descriptive labels ("Start training", not "Train")
 * - Include file metadata for downloads ("Export model (ONNX)")
 * - Minimum 44x44px touch targets
 * - Clear consequence for destructive actions ("Reset circuit — clears workspace")
 */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, size, icon: Icon, ariaLabel, loading, fileMeta, children, ...props }, ref) => {
    const visibleText = fileMeta ? `${children} (${fileMeta})` : children;
    const accessibleLabel = ariaLabel || visibleText;

    return (
      <button
        className={cn(actionButtonVariants({ variant, size }), className)}
        ref={ref}
        aria-label={typeof accessibleLabel === 'string' ? accessibleLabel : undefined}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
          </>
        ) : Icon ? (
          <Icon aria-hidden={true} className="w-4 h-4 flex-shrink-0" />
        ) : null}
        
        {size !== "icon" && (
          <span className="flex-1 text-left">{visibleText}</span>
        )}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

/**
 * Icon-only button with mandatory accessible label
 */
export interface IconButtonProps extends Omit<ActionButtonProps, 'children' | 'size'> {
  /**
   * Required accessible label describing the action
   */
  label: string;
  /**
   * Required icon component
   */
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon: Icon, className, variant = "ghost", ...props }, ref) => {
    return (
      <ActionButton
        ref={ref}
        variant={variant}
        size="icon"
        icon={Icon}
        ariaLabel={label}
        className={className}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </ActionButton>
    );
  }
);

IconButton.displayName = "IconButton";