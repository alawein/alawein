import { Atom, Waves, CircleDot, Cpu, Clock, Play, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * QMLab Dashboard
 * Quantum Simulation Workbench
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Simulations', value: '4,231', change: 28.5, icon: Waves, trend: 'up' as const },
  { title: 'Qubits Max', value: '32', change: 14.3, icon: CircleDot, trend: 'up' as const },
  { title: 'Avg. Fidelity', value: '99.2%', change: 0.8, icon: Atom, trend: 'up' as const },
  { title: 'Compute Time', value: '847h', change: 45.2, icon: Cpu, trend: 'up' as const },
];

const simData = [
  { name: 'Mon', value: 156 },
  { name: 'Tue', value: 189 },
  { name: 'Wed', value: 234 },
  { name: 'Thu', value: 198 },
  { name: 'Fri', value: 267 },
  { name: 'Sat', value: 89 },
  { name: 'Sun', value: 45 },
];

const simulations = [
  { id: 'QS-001', name: 'VQE H2 Molecule', qubits: 8, shots: 10000, status: 'running', fidelity: '98.7%' },
  { id: 'QS-002', name: 'QAOA MaxCut', qubits: 16, shots: 5000, status: 'running', fidelity: '97.2%' },
  { id: 'QS-003', name: 'Grover Search', qubits: 10, shots: 8000, status: 'queued', fidelity: '-' },
  { id: 'QS-004', name: 'QFT Benchmark', qubits: 20, shots: 1000, status: 'completed', fidelity: '99.8%' },
  { id: 'QS-005', name: 'Shor Factoring', qubits: 32, shots: 2000, status: 'completed', fidelity: '96.5%' },
];

// Sample qubit state (Bloch sphere representation simplified)
const qubitStates = [
  { id: 0, state: '|0⟩', prob0: 0.92, prob1: 0.08 },
  { id: 1, state: '|+⟩', prob0: 0.51, prob1: 0.49 },
  { id: 2, state: '|1⟩', prob0: 0.03, prob1: 0.97 },
  { id: 3, state: '|−⟩', prob0: 0.48, prob1: 0.52 },
];

const gates = ['H', 'X', 'Y', 'Z', 'CNOT', 'T', 'S', 'RX', 'RY', 'RZ'];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* QMLab Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Atom className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">QMLAB</span>
        </div>
        <h1 className="text-3xl font-bold">Quantum Simulation Workbench</h1>
        <p className="text-muted-foreground">High-fidelity quantum circuit simulation and analysis.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Simulations & Circuit Visualization */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Simulation Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5" />
              Simulation Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulations.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {sim.status === 'running' && <Play className="w-5 h-5 text-primary animate-pulse" />}
                    {sim.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                    {sim.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sim.name}</p>
                    <p className="text-xs text-muted-foreground">{sim.qubits} qubits • {sim.shots.toLocaleString()} shots</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-primary">{sim.fidelity}</p>
                    <p className="text-xs text-muted-foreground">fidelity</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Qubit State Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="w-5 h-5" />
              Qubit States
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qubitStates.map((qubit, index) => (
                <motion.div
                  key={qubit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono">Q{qubit.id}</span>
                    <span className="text-sm font-mono text-primary">{qubit.state}</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                    <motion.div
                      className="bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${qubit.prob0 * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                    <motion.div
                      className="bg-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${qubit.prob1 * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>|0⟩ {(qubit.prob0 * 100).toFixed(0)}%</span>
                    <span>|1⟩ {(qubit.prob1 * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gate Palette */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Gate Palette
              </p>
              <div className="flex flex-wrap gap-2">
                {gates.map((gate, index) => (
                  <motion.button
                    key={gate}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    {gate}
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulations Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Simulations This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart data={simData} />
        </CardContent>
      </Card>
    </div>
  );
}

