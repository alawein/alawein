import { Hammer, FolderPlus, Layers, GitBranch, Package, Rocket, Clock, CheckCircle2, Code2, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * Foundry Dashboard
 * Product Incubator & Template Management Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Templates', value: '47', change: 8.5, icon: Layers, trend: 'up' as const },
  { title: 'Projects Created', value: '234', change: 22.1, icon: FolderPlus, trend: 'up' as const },
  { title: 'Active Scaffolds', value: '12', change: 15.0, icon: Rocket, trend: 'up' as const },
  { title: 'Components', value: '186', change: 5.3, icon: Package, trend: 'up' as const },
];

const scaffoldData = [
  { name: 'Mon', value: 8 },
  { name: 'Tue', value: 12 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 9 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 4 },
  { name: 'Sun', value: 3 },
];

const templateCategories = [
  { name: 'SaaS Dashboard', count: 12, icon: Code2, color: 'text-purple-500' },
  { name: 'E-commerce', count: 8, icon: Package, color: 'text-yellow-500' },
  { name: 'Portfolio', count: 6, icon: FileCode, color: 'text-cyan-500' },
  { name: 'Landing Page', count: 9, icon: Layers, color: 'text-pink-500' },
  { name: 'Documentation', count: 7, icon: GitBranch, color: 'text-green-500' },
];

const recentProjects = [
  { name: 'QAPLibria Dashboard', template: 'saas-dashboard', status: 'completed', time: '2h ago' },
  { name: 'Client Portfolio Site', template: 'quantum-portfolio', status: 'in-progress', time: '4h ago' },
  { name: 'Startup Landing', template: 'landing-gradient', status: 'completed', time: '1d ago' },
  { name: 'Fitness Mobile App', template: 'fitness-tracker', status: 'in-progress', time: '2d ago' },
  { name: 'API Documentation', template: 'docs-developer', status: 'queued', time: '3d ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Hammer className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">FOUNDRY</span>
        </div>
        <h1 className="text-3xl font-bold">Product Incubator</h1>
        <p className="text-muted-foreground">Template management & project scaffolding platform.</p>
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
            <CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5" />Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div key={project.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {project.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {project.status === 'in-progress' && <Rocket className="w-5 h-5 text-primary animate-pulse" />}
                    {project.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">Template: {project.template}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{project.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" />Template Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templateCategories.map((cat, index) => (
                <motion.div key={cat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 pb-3 border-b last:border-0">
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cat.name}</p>
                  </div>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{cat.count}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Projects Scaffolded This Week</CardTitle></CardHeader>
        <CardContent><AreaChart data={scaffoldData} /></CardContent>
      </Card>
    </div>
  );
}

