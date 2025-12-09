/**
 * ProbabilityHistogram - Bar chart visualization of measurement probabilities
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProbabilityHistogramProps {
  probabilities: number[];
  numQubits: number;
  measurementCounts?: number[];
  totalShots?: number;
  showExpected?: boolean;
  className?: string;
}

function binaryString(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

export function ProbabilityHistogram({
  probabilities,
  numQubits,
  measurementCounts,
  totalShots,
  showExpected = true,
  className,
}: ProbabilityHistogramProps) {
  const bars = useMemo(() => {
    return probabilities.map((prob, index) => {
      const label = `|${binaryString(index, numQubits)}⟩`;
      const measured = measurementCounts?.[index];
      const measuredProb = measured && totalShots ? measured / totalShots : undefined;

      return {
        index,
        label,
        probability: prob,
        measuredProbability: measuredProb,
        measurementCount: measured,
      };
    });
  }, [probabilities, numQubits, measurementCounts, totalShots]);

  const maxProb = Math.max(...probabilities, ...(measurementCounts?.map((c) => (c / (totalShots || 1))) || []));
  const barWidth = Math.max(20, Math.min(60, 400 / probabilities.length));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Measurement Probabilities
        </span>
        {totalShots && (
          <span className="text-xs text-muted-foreground">
            {totalShots.toLocaleString()} shots
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {showExpected && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary/70" />
            <span>Expected</span>
          </div>
        )}
        {measurementCounts && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/70" />
            <span>Measured</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex items-end gap-1 h-48 p-4 bg-muted/30 rounded-lg overflow-x-auto">
        {bars.map((bar, idx) => (
          <div
            key={bar.index}
            className="flex flex-col items-center gap-1"
            style={{ width: barWidth }}
          >
            {/* Bars container */}
            <div className="flex gap-0.5 items-end h-36">
              {/* Expected probability bar */}
              {showExpected && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(bar.probability / maxProb) * 100}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.03 }}
                  className="w-full bg-primary/70 rounded-t-sm min-h-[2px]"
                  title={`Expected: ${(bar.probability * 100).toFixed(2)}%`}
                />
              )}

              {/* Measured probability bar */}
              {bar.measuredProbability !== undefined && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(bar.measuredProbability / maxProb) * 100}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.03 + 0.2 }}
                  className="w-full bg-green-500/70 rounded-t-sm min-h-[2px]"
                  title={`Measured: ${(bar.measuredProbability * 100).toFixed(2)}% (${bar.measurementCount} counts)`}
                />
              )}
            </div>

            {/* Label */}
            <span
              className="text-[10px] font-mono text-muted-foreground whitespace-nowrap"
              style={{
                writingMode: probabilities.length > 8 ? "vertical-rl" : "horizontal-tb",
                transform: probabilities.length > 8 ? "rotate(180deg)" : undefined,
              }}
            >
              {bar.label}
            </span>
          </div>
        ))}
      </div>

      {/* Statistics */}
      {measurementCounts && totalShots && (
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div className="p-2 rounded bg-muted/50">
            <div className="font-medium">Most Likely</div>
            <div className="text-muted-foreground">
              {bars.reduce((max, b) => (b.measurementCount || 0) > (max.measurementCount || 0) ? b : max, bars[0]).label}
            </div>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <div className="font-medium">Entropy</div>
            <div className="text-muted-foreground">
              {(-probabilities.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0)).toFixed(3)} bits
            </div>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <div className="font-medium">Fidelity</div>
            <div className="text-muted-foreground">
              {(probabilities.reduce((sum, p, i) => {
                const m = (measurementCounts[i] || 0) / totalShots;
                return sum + Math.sqrt(p * m);
              }, 0) ** 2 * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProbabilityHistogram;

