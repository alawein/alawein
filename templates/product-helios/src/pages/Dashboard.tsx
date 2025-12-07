import { Sun, Server, Cpu, HardDrive, Activity, Network, Zap, ThermometerSun, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * Helios Dashboard
 * Scientific Computing Infrastructure Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Active Nodes', value: '48', change: 4.2, icon: Server, trend: 'up' as const },
  { title: 'Jobs Running', value: '127', change: 15.8, icon: Play, trend: 'up' as const },
  { title: 'GPU Utilization', value: '87%', change: 5.2, icon: Cpu, trend: 'up' as const },
  { title: 'Queue Depth', value: '342', change: -12.4, icon: Activity, trend: 'up' as const },
];

const utilizationData = [
  { name: '00:00', value: 72 },
  { name: '04:00', value: 85 },
  { name: '08:00', value: 92 },
  { name: '12:00', value: 88 },
  { name: '16:00', value: 95 },
  { name: '20:00', value: 78 },
  { name: '24:00', value: 68 },
];

const jobQueue = [
  { id: 'JOB-2847', name: 'QMC Simulation Batch', user: 'research_1', nodes: 8, gpus: 32, status: 'running', time: '2h 34m' },
  { id: 'JOB-2848', name: 'MD Trajectory Analysis', user: 'grad_team', nodes: 4, gpus: 16, status: 'running', time: '1h 12m' },
  { id: 'JOB-2849', name: 'DFT Optimization', user: 'postdoc_3', nodes: 2, gpus: 8, status: 'running', time: '45m' },
  { id: 'JOB-2850', name: 'CFD Large Eddy Sim', user: 'research_2', nodes: 16, gpus: 64, status: 'queued', time: 'pending' },
  { id: 'JOB-2851', name: 'Neural Network Training', user: 'ml_group', nodes: 4, gpus: 16, status: 'queued', time: 'pending' },
];

const clusterNodes = [
  { name: 'gpu-cluster-01', gpus: 8, memory: '512GB', temp: '62°C', status: 'healthy', load: 94 },
  { name: 'gpu-cluster-02', gpus: 8, memory: '512GB', temp: '58°C', status: 'healthy', load: 87 },
  { name: 'gpu-cluster-03', gpus: 8, memory: '512GB', temp: '71°C', status: 'warning', load: 98 },
  { name: 'cpu-cluster-01', gpus: 0, memory: '1TB', temp: '45°C', status: 'healthy', load: 72 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sun className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">HELIOS</span>
        </div>
        <h1 className="text-3xl font-bold">HPC Cluster Management</h1>
        <p className="text-muted-foreground">Scientific computing infrastructure & job scheduling.</p>
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
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobQueue.map((job, index) => (
                <motion.div key={job.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {job.status === 'running' && <Play className="w-5 h-5 text-green-500 animate-pulse" />}
                    {job.status === 'queued' && <Activity className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.name}</p>
                    <p className="text-xs text-muted-foreground">{job.user} • {job.nodes} nodes • {job.gpus} GPUs</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{job.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5" />Cluster Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clusterNodes.map((node, index) => (
                <motion.div key={node.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="pb-3 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {node.status === 'healthy' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                      {node.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{node.temp}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${node.load > 90 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${node.load}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{node.gpus} GPUs • {node.memory} • {node.load}% load</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>24h Cluster Utilization</CardTitle></CardHeader>
        <CardContent><AreaChart data={utilizationData} /></CardContent>
      </Card>
    </div>
  );
}

