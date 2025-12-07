import { GitBranch, Boxes, Rocket, FlaskConical, CheckCircle2, Clock, AlertCircle, Server, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * MEZAN Dashboard
 * ML/AI DevOps Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Experiments', value: '1,847', change: 22.5, icon: FlaskConical, trend: 'up' as const },
  { title: 'Models Deployed', value: '34', change: 12.0, icon: Rocket, trend: 'up' as const },
  { title: 'Pipelines Active', value: '12', change: 8.3, icon: GitBranch, trend: 'up' as const },
  { title: 'Avg. Train Time', value: '45m', change: -18.2, icon: Clock, trend: 'up' as const },
];

const deploymentData = [
  { name: 'Mon', value: 8 },
  { name: 'Tue', value: 12 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 9 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 4 },
  { name: 'Sun', value: 2 },
];

const pipelines = [
  { id: 'PL-001', name: 'prod-classifier-v2', stage: 'Training', status: 'running', progress: 78 },
  { id: 'PL-002', name: 'nlp-sentiment-bert', stage: 'Validation', status: 'running', progress: 45 },
  { id: 'PL-003', name: 'rec-engine-collab', stage: 'Deploying', status: 'running', progress: 92 },
  { id: 'PL-004', name: 'vision-yolov8-custom', stage: 'Queued', status: 'queued', progress: 0 },
  { id: 'PL-005', name: 'timeseries-prophet', stage: 'Complete', status: 'completed', progress: 100 },
];

const modelRegistry = [
  { name: 'ResNet-50-Custom', version: 'v3.2.1', accuracy: '94.2%', status: 'production', endpoint: 'api/vision' },
  { name: 'BERT-Sentiment', version: 'v2.1.0', accuracy: '91.8%', status: 'production', endpoint: 'api/nlp' },
  { name: 'XGBoost-Churn', version: 'v1.4.2', accuracy: '88.5%', status: 'staging', endpoint: 'api/predict' },
  { name: 'Prophet-Sales', version: 'v1.0.0', accuracy: '85.3%', status: 'development', endpoint: '-' },
];

const resources = [
  { name: 'GPU Cluster A', usage: 78, type: 'A100 × 8' },
  { name: 'GPU Cluster B', usage: 45, type: 'V100 × 16' },
  { name: 'CPU Pool', usage: 62, type: '256 cores' },
  { name: 'Storage', usage: 34, type: '50TB NVMe' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* MEZAN Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Boxes className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">MEZAN</span>
        </div>
        <h1 className="text-3xl font-bold">ML/AI DevOps Platform</h1>
        <p className="text-muted-foreground">End-to-end ML lifecycle management and deployment.</p>
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

      {/* Pipelines & Model Registry */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Pipelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Active Pipelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelines.map((pipeline, index) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {pipeline.status === 'running' && <Clock className="w-5 h-5 text-primary animate-pulse" />}
                    {pipeline.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                    {pipeline.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-mono truncate">{pipeline.name}</p>
                    <p className="text-xs text-muted-foreground">{pipeline.stage}</p>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pipeline.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">{pipeline.progress}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Registry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Model Registry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modelRegistry.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    model.status === 'production' ? 'bg-green-500' :
                    model.status === 'staging' ? 'bg-yellow-500' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{model.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{model.version}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{model.accuracy}</p>
                    <p className="text-xs text-muted-foreground">{model.endpoint}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources & Deployments Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={resource.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{resource.name}</span>
                    <span className="text-muted-foreground">{resource.usage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        resource.usage > 80 ? 'bg-red-500' :
                        resource.usage > 60 ? 'bg-yellow-500' : 'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.usage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{resource.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deployments Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deployments This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={deploymentData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

