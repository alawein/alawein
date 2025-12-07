import { Grid3X3, Target, Clock, TrendingUp, CheckCircle2, Play, Layers, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * QAPLibria Dashboard
 * Quadratic Assignment Problem Solver
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'QAP Instances', value: '3,421', change: 18.5, icon: Grid3X3, trend: 'up' as const },
  { title: 'Best Solutions', value: '2,847', change: 12.3, icon: Target, trend: 'up' as const },
  { title: 'Avg. Solve Time', value: '4.7s', change: -22.1, icon: Clock, trend: 'up' as const },
  { title: 'Avg. Gap', value: '0.08%', change: -15.4, icon: TrendingUp, trend: 'up' as const },
];

const solveData = [
  { name: 'Mon', value: 89 },
  { name: 'Tue', value: 112 },
  { name: 'Wed', value: 98 },
  { name: 'Thu', value: 134 },
  { name: 'Fri', value: 156 },
  { name: 'Sat', value: 45 },
  { name: 'Sun', value: 32 },
];

const recentProblems = [
  { id: 'QAP-001', name: 'nug30', size: '30×30', status: 'solved', gap: '0.00%', time: '2.3s', cost: 6124 },
  { id: 'QAP-002', name: 'tai50a', size: '50×50', status: 'running', gap: '0.12%', time: '8.4s', cost: 458821 },
  { id: 'QAP-003', name: 'sko64', size: '64×64', status: 'queued', gap: '-', time: '-', cost: null },
  { id: 'QAP-004', name: 'wil100', size: '100×100', status: 'queued', gap: '-', time: '-', cost: null },
  { id: 'QAP-005', name: 'chr25a', size: '25×25', status: 'solved', gap: '0.00%', time: '0.8s', cost: 3796 },
];

// Sample 5x5 assignment matrix for visualization
const assignmentMatrix = [
  [1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0],
];

const benchmarks = [
  { name: 'QAPLIB', problems: 134, solved: 128, bestKnown: 112 },
  { name: 'Tai Series', problems: 45, solved: 42, bestKnown: 38 },
  { name: 'Sko Series', problems: 12, solved: 12, bestKnown: 11 },
  { name: 'Custom', problems: 89, solved: 89, bestKnown: 89 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* QAPLibria Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">QAPLIBRIA</span>
        </div>
        <h1 className="text-3xl font-bold">Quadratic Assignment Problem Solver</h1>
        <p className="text-muted-foreground">State-of-the-art QAP solver with best-known solution tracking.</p>
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

      {/* Problem Queue & Assignment Visualization */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Problem Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Problem Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {problem.status === 'running' && <Play className="w-5 h-5 text-primary animate-pulse" />}
                    {problem.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                    {problem.status === 'solved' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-mono">{problem.name}</p>
                    <p className="text-xs text-muted-foreground">{problem.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{problem.gap}</p>
                    <p className="text-xs text-muted-foreground">{problem.time}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm font-mono text-primary">{problem.cost?.toLocaleString() || '-'}</p>
                    <p className="text-xs text-muted-foreground">cost</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Matrix Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Current Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-5 gap-1 mb-4">
                {assignmentMatrix.flat().map((cell, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono ${
                      cell === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {cell}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                π = [1, 3, 5, 2, 4]
              </p>
            </div>

            {/* Benchmark Stats */}
            <div className="mt-6 pt-4 border-t space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Benchmark Coverage
              </p>
              {benchmarks.map((bench, index) => (
                <div key={bench.name} className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-muted-foreground">{bench.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(bench.bestKnown / bench.problems) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right">{bench.bestKnown}/{bench.problems}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Problems Solved This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart data={solveData} />
        </CardContent>
      </Card>
    </div>
  );
}

