// QMLab - Quantum Mechanics Laboratory Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Atom,
  Activity,
  Waves,
  GitBranch,
  Play,
  Settings,
  Sparkles,
  Zap,
  Eye,
  Layers,
  BookOpen,
  FlaskConical,
  Radio,
  Box,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const quantumSystems = [
  { id: 1, name: 'Hydrogen Atom', type: 'Bound State', energy: '-13.6 eV', active: true },
  { id: 2, name: 'Harmonic Oscillator', type: 'Continuous', energy: 'ℏω(n+½)', active: true },
  { id: 3, name: 'Particle in Box', type: 'Infinite Well', energy: 'n²π²ℏ²/2mL²', active: false },
  { id: 4, name: 'Tunneling Barrier', type: 'Scattering', energy: 'E < V₀', active: true },
];

const experiments = [
  { name: 'Double Slit', status: 'running', particles: 10000, pattern: 'interference' },
  { name: 'Stern-Gerlach', status: 'completed', particles: 5000, pattern: 'spin-split' },
  { name: 'Quantum Eraser', status: 'ready', particles: 0, pattern: 'pending' },
];

const stats = [
  { label: 'Quantum States', value: '∞', icon: Waves, color: 'from-cyan-500 to-blue-500' },
  { label: 'Simulations', value: '847', icon: Activity, color: 'from-purple-500 to-pink-500' },
  { label: 'Experiments', value: '23', icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
  { label: 'Visualizations', value: '156', icon: Eye, color: 'from-orange-500 to-yellow-500' },
];

const QMLabDashboard = () => {
  const project = getProject('qmlab')!;
  const colors = useThemeColors();

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">QMLab Laboratory</h1>
            <p className="text-muted-foreground">
              Interactive quantum mechanics simulation environment
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>
            <Button
              style={{
                background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.primary} 100%)`,
                color: colors.text,
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Experiment
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
              <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.color}`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold font-mono mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantum Systems */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5 text-cyan-400" />
                  Quantum Systems
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quantumSystems.map((system, i) => (
                  <motion.div
                    key={system.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      system.active
                        ? 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50'
                        : 'bg-muted/30 border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            system.active ? 'bg-cyan-500/20' : 'bg-muted/50'
                          }`}
                        >
                          <Atom
                            className={`h-5 w-5 ${system.active ? 'text-cyan-400' : 'text-muted-foreground'}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{system.name}</p>
                          <p className="text-xs text-muted-foreground">{system.type}</p>
                        </div>
                      </div>
                      {system.active && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 font-mono text-sm text-center">
                      E = {system.energy}
                    </div>
                    <Button
                      size="sm"
                      variant={system.active ? 'default' : 'outline'}
                      className="w-full mt-3"
                    >
                      {system.active ? 'Visualize' : 'Load System'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Experiments */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-400" />
                Experiments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiments.map((exp, i) => (
                <motion.div
                  key={exp.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{exp.name}</span>
                    <Badge
                      variant={
                        exp.status === 'running'
                          ? 'default'
                          : exp.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {exp.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted/50">
                      <span className="text-muted-foreground">Particles: </span>
                      <span className="font-mono">{exp.particles.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="text-muted-foreground">Pattern: </span>
                      <span className="font-mono">{exp.pattern}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run New Experiment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Preview */}
        <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-400" />
              Wave Function Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 rounded-xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-border/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center"
                >
                  <Waves className="h-16 w-16 text-cyan-400" />
                </motion.div>
                <p className="text-muted-foreground">Select a quantum system to visualize</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Ψ(x,t) = Ae^(ikx-iωt)</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default QMLabDashboard;
