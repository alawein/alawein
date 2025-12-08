/**
 * DensityMatrixHeatmap - Visualizes quantum density matrices as heatmaps
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Complex {
  real: number;
  imag: number;
}

interface DensityMatrixHeatmapProps {
  matrix: Complex[][];
  numQubits: number;
  showValues?: boolean;
  colorScheme?: "magnitude" | "real" | "imag";
  className?: string;
}

function complexMagnitude(c: Complex): number {
  return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

function binaryString(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

function getColor(value: number, max: number, scheme: string): string {
  const normalized = Math.abs(value) / max;
  
  if (scheme === "real") {
    if (value >= 0) {
      return `rgba(59, 130, 246, ${normalized})`; // Blue for positive
    }
    return `rgba(239, 68, 68, ${normalized})`; // Red for negative
  }
  
  if (scheme === "imag") {
    if (value >= 0) {
      return `rgba(34, 197, 94, ${normalized})`; // Green for positive
    }
    return `rgba(168, 85, 247, ${normalized})`; // Purple for negative
  }
  
  // Magnitude (default)
  return `rgba(99, 102, 241, ${normalized})`; // Indigo
}

export function DensityMatrixHeatmap({
  matrix,
  numQubits,
  showValues = true,
  colorScheme = "magnitude",
  className,
}: DensityMatrixHeatmapProps) {
  const { cells, maxValue, labels } = useMemo(() => {
    const dim = matrix.length;
    const labels = Array.from({ length: dim }, (_, i) => `|${binaryString(i, numQubits)}⟩`);
    
    let maxVal = 0;
    const cells: Array<{
      row: number;
      col: number;
      value: Complex;
      displayValue: number;
    }> = [];

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        const value = matrix[i][j];
        let displayValue: number;
        
        switch (colorScheme) {
          case "real":
            displayValue = value.real;
            break;
          case "imag":
            displayValue = value.imag;
            break;
          default:
            displayValue = complexMagnitude(value);
        }
        
        maxVal = Math.max(maxVal, Math.abs(displayValue));
        cells.push({ row: i, col: j, value, displayValue });
      }
    }

    return { cells, maxValue: maxVal || 1, labels };
  }, [matrix, numQubits, colorScheme]);

  const dim = matrix.length;
  const cellSize = Math.min(40, 300 / dim);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Density Matrix ({dim}×{dim})
        </span>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-muted">
            {colorScheme === "magnitude" ? "Magnitude" : colorScheme === "real" ? "Real" : "Imaginary"}
          </span>
        </div>
      </div>

      <div className="overflow-auto">
        <div
          className="grid gap-0.5 p-2 bg-muted/30 rounded-lg w-fit"
          style={{
            gridTemplateColumns: `auto repeat(${dim}, ${cellSize}px)`,
            gridTemplateRows: `auto repeat(${dim}, ${cellSize}px)`,
          }}
        >
          {/* Empty corner */}
          <div />
          
          {/* Column headers */}
          {labels.map((label, i) => (
            <div
              key={`col-${i}`}
              className="flex items-end justify-center text-[8px] font-mono text-muted-foreground pb-1"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {label}
            </div>
          ))}

          {/* Rows */}
          {Array.from({ length: dim }).map((_, rowIdx) => (
            <>
              {/* Row header */}
              <div
                key={`row-${rowIdx}`}
                className="flex items-center justify-end text-[8px] font-mono text-muted-foreground pr-1"
              >
                {labels[rowIdx]}
              </div>
              
              {/* Cells */}
              {cells
                .filter((c) => c.row === rowIdx)
                .map((cell) => (
                  <motion.div
                    key={`${cell.row}-${cell.col}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (cell.row * dim + cell.col) * 0.01 }}
                    className="rounded-sm flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell.displayValue, maxValue, colorScheme),
                    }}
                    title={`ρ[${cell.row}][${cell.col}] = ${cell.value.real.toFixed(3)}${cell.value.imag >= 0 ? "+" : ""}${cell.value.imag.toFixed(3)}i`}
                  >
                    {showValues && cellSize >= 30 && (
                      <span className="text-[8px] font-mono text-white/80">
                        {cell.displayValue.toFixed(2)}
                      </span>
                    )}
                  </motion.div>
                ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DensityMatrixHeatmap;

