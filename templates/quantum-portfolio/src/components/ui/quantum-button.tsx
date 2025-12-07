import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuantumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const QuantumButton = forwardRef<HTMLButtonElement, QuantumButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const baseStyles = "relative px-6 py-3 font-mono text-sm font-medium transition-all duration-300 overflow-hidden group";
    
    const variants = {
      primary: "bg-quantum-purple/20 border border-quantum-purple text-quantum-purple hover:bg-quantum-purple hover:text-white",
      secondary: "bg-quantum-pink/20 border border-quantum-pink text-quantum-pink hover:bg-quantum-pink hover:text-white",
      ghost: "bg-transparent border border-quantum-purple/50 text-quantum-purple hover:border-quantum-purple hover:bg-quantum-purple/10",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {/* Glow effect */}
        <span 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            boxShadow: variant === 'primary' 
              ? '0 0 20px hsl(271 91% 65% / 0.5)' 
              : variant === 'secondary'
                ? '0 0 20px hsl(330 81% 60% / 0.5)'
                : '0 0 15px hsl(271 91% 65% / 0.3)',
          }}
        />
        
        {/* Scan line effect */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Corner decorations */}
        <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-current" />
        <span className="absolute top-0 right-0 w-2 h-2 border-r border-t border-current" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-current" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-current" />
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

QuantumButton.displayName = "QuantumButton";

export default QuantumButton;

