// OptiLibria - Optimization Framework Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  GitBranch,
  Play,
  Settings,
  TrendingUp,
  Zap,
  Target,
  LineChart,
  BarChart3,
  Layers,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const algorithms = [
  { name: 'Genetic Algorithm', category: 'Evolutionary', problems: 156, avgTime: '2.3s' },
  { name: 'Simulated Annealing', category: 'Metaheuristic', problems: 89, avgTime: '1.8s' },
  { name: 'Particle Swarm', category: 'Swarm', problems: 124, avgTime: '1.5s' },
  { name: 'Gradient Descent', category: 'Classical', problems: 234, avgTime: '0.8s' },
  { name: 'Adam Optimizer', category: 'Adaptive', problems: 312, avgTime: '0.6s' },
  { name: 'Bayesian Optimization', category: 'Probabilistic', problems: 67, avgTime: '4.2s' },
];

const benchmarks = [
  { name: 'Rosenbrock Function', best: 'Adam', score: 99.8, runs: 1000 },
  { name: 'Rastrigin Function', best: 'PSO', score: 97.2, runs: 850 },
  { name: 'Ackley Function', best: 'GA', score: 95.5, runs: 1200 },
  { name: 'Schwefel Function', best: 'SA', score: 94.1, runs: 780 },
];

const stats = [
  { label: 'Algorithms', value: '31', icon: GitBranch, color: 'text-green-400' },
  { label: 'Problems Solved', value: '12,847', icon: Target, color: 'text-blue-400' },
  { label: 'Benchmark Runs', value: '45.2K', icon: Activity, color: 'text-purple-400' },
  { label: 'Avg Performance', value: '94.7%', icon: TrendingUp, color: 'text-cyan-400' },
];

const OptiLibriaDashboard = () => {
  const project = getProject('optilibria')!;
  const colors = useThemeColors();

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">OptiLibria Dashboard</h1>
            <p className="text-muted-foreground">Optimization framework with 31+ algorithms</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Benchmarks
            </Button>
            <Button
              style={{
                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
                color: colors.text,
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Problem
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Algorithm Library */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-green-400" />
                  Algorithm Library
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All 31
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {algorithms.map((algo, i) => (
                  <motion.div
                    key={algo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-green-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{algo.name}</p>
                        <p className="text-xs text-muted-foreground">{algo.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-mono text-muted-foreground">{algo.problems} solved</p>
                        <p className="text-xs text-green-400">{algo.avgTime}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benchmark Results */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Benchmark Results
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Run Suite
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchmarks.map((bench, i) => (
                  <motion.div
                    key={bench.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{bench.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {bench.runs.toLocaleString()} runs
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-500/30">
                        Best: {bench.best}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Performance</span>
                        <span className="font-mono">{bench.score}%</span>
                      </div>
                      <Progress value={bench.score} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Categories */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Problem Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Continuous', count: 156, color: 'from-green-500 to-emerald-500' },
                { name: 'Discrete', count: 89, color: 'from-blue-500 to-cyan-500' },
                { name: 'Combinatorial', count: 124, color: 'from-purple-500 to-pink-500' },
                { name: 'Multi-objective', count: 67, color: 'from-orange-500 to-yellow-500' },
                { name: 'Constrained', count: 98, color: 'from-red-500 to-rose-500' },
                { name: 'Black-box', count: 45, color: 'from-gray-500 to-slate-500' },
              ].map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all text-center group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}
                  >
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-2xl font-bold mt-1">{cat.count}</p>
                  <p className="text-xs text-muted-foreground">problems</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default OptiLibriaDashboard;
