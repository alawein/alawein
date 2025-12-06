// TalAI - AI Research Platform Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Brain,
  Activity,
  Database,
  GitBranch,
  Play,
  Settings,
  Sparkles,
  Zap,
  LineChart,
  Layers,
  Upload,
  Download,
  Cpu,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const experiments = [
  {
    id: 1,
    name: 'GPT-4 Fine-tuning',
    status: 'training',
    progress: 45,
    metrics: { loss: 0.023, accuracy: 0.94 },
  },
  {
    id: 2,
    name: 'Image Classifier v3',
    status: 'completed',
    progress: 100,
    metrics: { loss: 0.012, accuracy: 0.97 },
  },
  {
    id: 3,
    name: 'Sentiment Analysis',
    status: 'queued',
    progress: 0,
    metrics: { loss: null, accuracy: null },
  },
  {
    id: 4,
    name: 'Object Detection',
    status: 'training',
    progress: 78,
    metrics: { loss: 0.045, accuracy: 0.89 },
  },
];

const models = [
  { name: 'talai-vision-v2', version: '2.1.0', downloads: 12450, rating: 4.8 },
  { name: 'talai-nlp-base', version: '1.5.2', downloads: 8920, rating: 4.6 },
  { name: 'talai-classifier', version: '3.0.1', downloads: 5670, rating: 4.9 },
];

const stats = [
  { label: 'Active Experiments', value: '8', icon: Activity, color: 'from-purple-500 to-cyan-500' },
  { label: 'GPU Hours Used', value: '2,847', icon: Cpu, color: 'from-cyan-500 to-green-500' },
  { label: 'Models Deployed', value: '23', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { label: 'Datasets', value: '156', icon: Database, color: 'from-yellow-500 to-orange-500' },
];

const TalAIDashboard = () => {
  const project = getProject('talai')!;
  const colors = useThemeColors();

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">TalAI Research Hub</h1>
            <p className="text-muted-foreground">
              AI research platform for training and deployment
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
            <Button
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
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
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
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
          {/* Experiments */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  Active Experiments
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiments.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          exp.status === 'training'
                            ? 'bg-purple-400 animate-pulse'
                            : exp.status === 'completed'
                              ? 'bg-green-400'
                              : 'bg-yellow-400'
                        }`}
                      />
                      <span className="font-medium">{exp.name}</span>
                    </div>
                    <Badge
                      variant={
                        exp.status === 'training'
                          ? 'default'
                          : exp.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {exp.status}
                    </Badge>
                  </div>

                  {exp.status !== 'queued' && (
                    <>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Training Progress</span>
                          <span>{exp.progress}%</span>
                        </div>
                        <Progress value={exp.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <span className="text-muted-foreground">Loss: </span>
                          <span className="font-mono text-cyan-400">{exp.metrics.loss}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <span className="text-muted-foreground">Accuracy: </span>
                          <span className="font-mono text-green-400">
                            {(exp.metrics.accuracy! * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Model Registry */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Model Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {models.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">v{model.version}</p>
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                      ★ {model.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Download className="h-3 w-3" />
                    <span>{model.downloads.toLocaleString()} downloads</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Deploy Model
                  </Button>
                </motion.div>
              ))}
              <Button variant="ghost" className="w-full">
                Browse All Models
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* GPU Cluster Status */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-green-400" />
              GPU Cluster Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: 8 }).map((_, i) => {
                const usage = Math.floor(Math.random() * 100);
                const status = usage > 80 ? 'high' : usage > 40 ? 'medium' : 'low';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
                  >
                    <div
                      className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                        status === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : status === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      <Cpu className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium">GPU {i + 1}</p>
                    <p className="text-lg font-bold">{usage}%</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default TalAIDashboard;
