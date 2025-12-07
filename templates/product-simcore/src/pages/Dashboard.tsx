import { Atom, Beaker, FlaskConical, Waves, Activity, Play, CheckCircle2, Clock, Cpu, ThermometerSun } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * SimCore Dashboard
 * Scientific Computing & Physics Simulation Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Active Simulations', value: '24', change: 15.0, icon: Activity, trend: 'up' as const },
  { title: 'Completed Today', value: '186', change: 22.3, icon: CheckCircle2, trend: 'up' as const },
  { title: 'GPU Hours Used', value: '1,247', change: 8.5, icon: Cpu, trend: 'up' as const },
  { title: 'Avg. Convergence', value: '98.2%', change: 1.2, icon: Waves, trend: 'up' as const },
];

const simulationData = [
  { name: 'Mon', value: 28 },
  { name: 'Tue', value: 35 },
  { name: 'Wed', value: 42 },
  { name: 'Thu', value: 38 },
  { name: 'Fri', value: 51 },
  { name: 'Sat', value: 22 },
  { name: 'Sun', value: 18 },
];

const simulationQueue = [
  { id: 'SIM-001', name: 'Molecular Dynamics - H2O Cluster', type: 'MD', status: 'running', progress: 78, temp: '300K' },
  { id: 'SIM-002', name: 'Quantum Monte Carlo - Li2', type: 'QMC', status: 'running', progress: 45, temp: '0K' },
  { id: 'SIM-003', name: 'Fluid Dynamics - Turbulent Flow', type: 'CFD', status: 'queued', progress: 0, temp: 'N/A' },
  { id: 'SIM-004', name: 'Heat Transfer - Reactor Core', type: 'FEA', status: 'queued', progress: 0, temp: '850K' },
  { id: 'SIM-005', name: 'Protein Folding - Beta Sheet', type: 'MD', status: 'completed', progress: 100, temp: '310K' },
];

const physicsModules = [
  { name: 'Molecular Dynamics', icon: Beaker, sims: 89, color: 'text-blue-500' },
  { name: 'Quantum Monte Carlo', icon: Atom, sims: 34, color: 'text-purple-500' },
  { name: 'Computational Fluid', icon: Waves, sims: 56, color: 'text-cyan-500' },
  { name: 'Finite Element', icon: FlaskConical, sims: 42, color: 'text-green-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Atom className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">SIMCORE</span>
        </div>
        <h1 className="text-3xl font-bold">Scientific Computing Platform</h1>
        <p className="text-muted-foreground">High-performance physics simulation & computational modeling.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Simulation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulationQueue.map((sim, index) => (
                <motion.div key={sim.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {sim.status === 'running' && <Play className="w-5 h-5 text-primary animate-pulse" />}
                    {sim.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                    {sim.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sim.name}</p>
                    <p className="text-xs text-muted-foreground">{sim.type} • {sim.temp}</p>
                  </div>
                  <div className="flex-shrink-0 w-20">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${sim.progress}%` }} />
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">{sim.progress}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlaskConical className="w-5 h-5" />Physics Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {physicsModules.map((mod, index) => (
                <motion.div key={mod.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 pb-3 border-b last:border-0">
                  <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{mod.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{mod.sims} sims</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Simulations This Week</CardTitle></CardHeader>
        <CardContent><AreaChart data={simulationData} /></CardContent>
      </Card>
    </div>
  );
}

