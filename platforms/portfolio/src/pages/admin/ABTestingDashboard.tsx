/**
 * @file ABTestingDashboard.tsx
 * @description Admin dashboard for managing A/B testing experiments
 */
import { motion } from 'framer-motion';
import { FlaskConical, Play, Pause, CheckCircle, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useABTesting, Experiment } from '@/hooks/useABTesting';

const statusColors = {
  draft: 'bg-gray-500',
  running: 'bg-green-500',
  paused: 'bg-yellow-500',
  completed: 'bg-blue-500',
};

const statusIcons = {
  draft: FlaskConical,
  running: Play,
  paused: Pause,
  completed: CheckCircle,
};

interface ExperimentCardProps {
  experiment: Experiment;
}

function ExperimentCard({ experiment }: ExperimentCardProps) {
  const StatusIcon = statusIcons[experiment.status];
  
  // Mock conversion data - in production, this would come from analytics
  const mockConversions = {
    control: Math.floor(Math.random() * 1000) + 500,
    'variant-a': Math.floor(Math.random() * 1000) + 500,
    'variant-b': Math.floor(Math.random() * 500) + 250,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border bg-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{experiment.name}</h3>
          <p className="text-sm text-muted-foreground">{experiment.description}</p>
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusColors[experiment.status]}`}>
          <StatusIcon className="h-3 w-3" />
          {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Target: {experiment.targetPercentage}% of users</span>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Variants</p>
          {experiment.variants.map((variant) => {
            const conversions = mockConversions[variant.id as keyof typeof mockConversions] || 0;
            const conversionRate = ((conversions / 1500) * 100).toFixed(1);
            
            return (
              <div key={variant.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-sm text-muted-foreground">{variant.weight}% traffic</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {conversions} users
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {conversionRate}% conversion
                  </span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t">
        {experiment.status === 'running' && (
          <button className="px-3 py-1.5 text-sm rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
            Pause
          </button>
        )}
        {experiment.status === 'paused' && (
          <button className="px-3 py-1.5 text-sm rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20">
            Resume
          </button>
        )}
        <button className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export default function ABTestingDashboard() {
  const { getExperiments, assignments } = useABTesting();
  const experiments = getExperiments();

  const runningCount = experiments.filter(e => e.status === 'running').length;
  const totalVariants = experiments.reduce((sum, e) => sum + e.variants.length, 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FlaskConical className="h-8 w-8 text-primary" />
            A/B Testing
          </h1>
          <p className="text-muted-foreground">Manage experiments and analyze results</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          Create Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-5 w-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Running</span>
          </div>
          <p className="text-3xl font-bold">{runningCount}</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Experiments</span>
          </div>
          <p className="text-3xl font-bold">{experiments.length}</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-muted-foreground">Active Variants</span>
          </div>
          <p className="text-3xl font-bold">{totalVariants}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </div>
  );
}

