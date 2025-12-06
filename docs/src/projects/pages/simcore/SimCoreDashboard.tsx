// SimCore - Scientific Computing Platform Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  Cpu,
  Database,
  GitBranch,
  Play,
  Settings,
  TrendingUp,
  Zap,
  Box,
  LineChart,
  Layers,
  Timer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const simulations = [
  { id: 1, name: 'Fluid Dynamics CFD', status: 'running', progress: 67, eta: '2h 15m' },
  { id: 2, name: 'Molecular Dynamics', status: 'queued', progress: 0, eta: '45m' },
  { id: 3, name: 'Finite Element Analysis', status: 'completed', progress: 100, eta: '-' },
  { id: 4, name: 'Monte Carlo Simulation', status: 'running', progress: 34, eta: '5h 30m' },
];

const stats = [
  { label: 'Active Simulations', value: '12', icon: Activity, color: 'text-green-400' },
  { label: 'Compute Nodes', value: '48', icon: Cpu, color: 'text-blue-400' },
  { label: 'Data Processed', value: '2.4 TB', icon: Database, color: 'text-purple-400' },
  { label: 'Experiments', value: '156', icon: GitBranch, color: 'text-cyan-400' },
];

const SimCoreDashboard = () => {
  const project = getProject('simcore')!;
  const colors = useThemeColors();

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">SimCore Dashboard</h1>
            <p className="text-muted-foreground">
              Scientific computing and simulation control center
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                color: colors.text,
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              New Simulation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Simulations */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: colors.primary }} />
                Active Simulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulations.map((sim) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          sim.status === 'running'
                            ? 'bg-green-400 animate-pulse'
                            : sim.status === 'completed'
                              ? 'bg-blue-400'
                              : 'bg-yellow-400'
                        }`}
                      />
                      <span className="font-medium">{sim.name}</span>
                    </div>
                    <Badge
                      variant={
                        sim.status === 'running'
                          ? 'default'
                          : sim.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {sim.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{sim.progress}%</span>
                    </div>
                    <Progress value={sim.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      ETA: {sim.eta}
                    </span>
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions & Resources */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: colors.secondary }} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Box className="h-4 w-4 mr-2" />
                  Create Experiment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LineChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Browse Datasets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Compare Results
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: colors.success }} />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">CPU Usage</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Memory</span>
                    <span>64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Storage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default SimCoreDashboard;
