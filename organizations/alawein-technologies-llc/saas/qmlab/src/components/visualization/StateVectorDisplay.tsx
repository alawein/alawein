/**
 * StateVectorDisplay - Visualizes quantum state vectors with amplitudes and phases
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Complex {
  real: number;
  imag: number;
}

interface StateVectorDisplayProps {
  stateVector: Complex[];
  numQubits: number;
  showPhase?: boolean;
  showProbability?: boolean;
  className?: string;
}

function complexToString(c: Complex, precision: number = 3): string {
  const r = c.real.toFixed(precision);
  const i = Math.abs(c.imag).toFixed(precision);
  if (Math.abs(c.imag) < 0.0001) return r;
  if (Math.abs(c.real) < 0.0001) return `${c.imag >= 0 ? "" : "-"}${i}i`;
  return `${r}${c.imag >= 0 ? "+" : "-"}${i}i`;
}

function complexMagnitude(c: Complex): number {
  return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

function complexPhase(c: Complex): number {
  return Math.atan2(c.imag, c.real);
}

function binaryString(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

export function StateVectorDisplay({
  stateVector,
  numQubits,
  showPhase = true,
  showProbability = true,
  className,
}: StateVectorDisplayProps) {
  const states = useMemo(() => {
    return stateVector.map((amplitude, index) => {
      const magnitude = complexMagnitude(amplitude);
      const probability = magnitude * magnitude;
      const phase = complexPhase(amplitude);
      const basisState = `|${binaryString(index, numQubits)}⟩`;

      return {
        index,
        basisState,
        amplitude,
        magnitude,
        probability,
        phase,
        phaseColor: `hsl(${((phase + Math.PI) / (2 * Math.PI)) * 360}, 70%, 50%)`,
      };
    });
  }, [stateVector, numQubits]);

  const maxProbability = Math.max(...states.map((s) => s.probability));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-4">
        State Vector ({numQubits} qubit{numQubits > 1 ? "s" : ""})
      </div>

      <div className="space-y-1">
        {states.map((state) => (
          <motion.div
            key={state.index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: state.index * 0.02 }}
            className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
          >
            {/* Basis state label */}
            <code className="font-mono text-sm w-20 text-primary">
              {state.basisState}
            </code>

            {/* Amplitude */}
            <code className="font-mono text-xs w-32 text-muted-foreground">
              {complexToString(state.amplitude)}
            </code>

            {/* Probability bar */}
            {showProbability && (
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-4 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(state.probability / maxProbability) * 100}%` }}
                    transition={{ duration: 0.5, delay: state.index * 0.02 }}
                    className="h-full bg-primary/70 rounded-full"
                    style={showPhase ? { backgroundColor: state.phaseColor } : undefined}
                  />
                </div>
                <span className="text-xs font-mono w-16 text-right">
                  {(state.probability * 100).toFixed(1)}%
                </span>
              </div>
            )}

            {/* Phase indicator */}
            {showPhase && (
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{ borderColor: state.phaseColor }}
                title={`Phase: ${((state.phase * 180) / Math.PI).toFixed(1)}°`}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotate(${state.phase}rad)`,
                  }}
                >
                  <div
                    className="w-0.5 h-2 rounded-full"
                    style={{ backgroundColor: state.phaseColor }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StateVectorDisplay;

