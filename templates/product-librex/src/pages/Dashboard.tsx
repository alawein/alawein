import { Cpu, Zap, Target, Clock, Play, Pause, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * Librex Dashboard
 * Optimization Solver Interface
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Problems Solved', value: '8,423', change: 22.5, icon: Target, trend: 'up' as const },
  { title: 'Avg. Solve Time', value: '2.3s', change: -15.2, icon: Clock, trend: 'up' as const },
  { title: 'Active Solvers', value: '6', change: 50.0, icon: Cpu, trend: 'up' as const },
  { title: 'Optimality Gap', value: '0.12%', change: -8.3, icon: TrendingUp, trend: 'up' as const },
];

const performanceData = [
  { name: 'Mon', value: 1245 },
  { name: 'Tue', value: 1567 },
  { name: 'Wed', value: 1342 },
  { name: 'Thu', value: 1789 },
  { name: 'Fri', value: 2134 },
  { name: 'Sat', value: 890 },
  { name: 'Sun', value: 456 },
];

const solverQueue = [
  { id: 'OPT-001', problem: 'Vehicle Routing (150 nodes)', solver: 'Librex.Flow', status: 'running', gap: '0.8%', time: '12.4s' },
  { id: 'OPT-002', problem: 'Facility Location (50 sites)', solver: 'Librex.Alloc', status: 'running', gap: '1.2%', time: '5.2s' },
  { id: 'OPT-003', problem: 'Job Shop Scheduling (200 jobs)', solver: 'Librex.Sched', status: 'queued', gap: '-', time: '-' },
  { id: 'OPT-004', problem: 'Bin Packing (1000 items)', solver: 'Librex.Pack', status: 'completed', gap: '0.0%', time: '1.8s' },
  { id: 'OPT-005', problem: 'TSP (75 cities)', solver: 'Librex.Tour', status: 'completed', gap: '0.05%', time: '3.4s' },
];

const solverModules = [
  { name: 'Librex.Flow', desc: 'Network & Routing', problems: 2341, avgTime: '8.2s' },
  { name: 'Librex.Alloc', desc: 'Resource Allocation', problems: 1892, avgTime: '4.5s' },
  { name: 'Librex.Sched', desc: 'Scheduling', problems: 1567, avgTime: '6.1s' },
  { name: 'Librex.Pack', desc: 'Packing & Cutting', problems: 1423, avgTime: '2.3s' },
  { name: 'Librex.Tour', desc: 'TSP & Variants', problems: 1200, avgTime: '5.7s' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Librex Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">LIBREX</span>
        </div>
        <h1 className="text-3xl font-bold">Optimization Solver Interface</h1>
        <p className="text-muted-foreground">High-performance solvers for complex optimization problems.</p>
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

      {/* Solver Queue & Modules */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Solver Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Solver Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solverQueue.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {job.status === 'running' && <Play className="w-5 h-5 text-primary animate-pulse" />}
                    {job.status === 'queued' && <Pause className="w-5 h-5 text-muted-foreground" />}
                    {job.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.problem}</p>
                    <p className="text-xs text-muted-foreground">{job.solver}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{job.gap}</p>
                    <p className="text-xs text-muted-foreground">{job.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solver Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Solver Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solverModules.map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 pb-3 border-b last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{module.name}</p>
                    <p className="text-xs text-muted-foreground">{module.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{module.problems.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{module.avgTime}</p>
                  </div>
                </motion.div>
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
          <AreaChart data={performanceData} />
        </CardContent>
      </Card>
    </div>
  );
}

