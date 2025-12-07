import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-cyber uppercase tracking-wider transition-all duration-300 overflow-hidden group",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent border-2 border-cyber-neon text-cyber-neon",
          "hover:bg-cyber-neon hover:text-cyber-dark hover:shadow-[0_0_20px_#00ff9f]",
          "active:scale-95",
        ],
        pink: [
          "bg-transparent border-2 border-cyber-pink text-cyber-pink",
          "hover:bg-cyber-pink hover:text-cyber-dark hover:shadow-[0_0_20px_#ff00ff]",
        ],
        blue: [
          "bg-transparent border-2 border-cyber-blue text-cyber-blue",
          "hover:bg-cyber-blue hover:text-cyber-dark hover:shadow-[0_0_20px_#00d4ff]",
        ],
        ghost: [
          "bg-transparent text-cyber-neon/70",
          "hover:text-cyber-neon hover:bg-cyber-neon/10",
        ],
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CyberButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Corner decorations */}
        <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-current" />
        <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-current" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-current" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-current" />
        
        {/* Scan line effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-b from-transparent via-current/10 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-500" />
        
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";

