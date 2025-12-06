// MEZAN - Enterprise Automation Platform Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  GitBranch,
  Play,
  Pause,
  Settings,
  Workflow,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  Network,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const workflows = [
  { id: 1, name: 'Customer Onboarding', status: 'active', executions: 1234, success: 98.5 },
  { id: 2, name: 'Invoice Processing', status: 'active', executions: 856, success: 99.2 },
  { id: 3, name: 'Data Sync Pipeline', status: 'paused', executions: 2341, success: 97.8 },
  { id: 4, name: 'Report Generation', status: 'active', executions: 567, success: 99.9 },
  { id: 5, name: 'Alert Notification', status: 'active', executions: 3421, success: 100 },
];

const recentExecutions = [
  {
    id: 1,
    workflow: 'Customer Onboarding',
    status: 'success',
    time: '2 min ago',
    duration: '1.2s',
  },
  { id: 2, workflow: 'Invoice Processing', status: 'success', time: '5 min ago', duration: '3.4s' },
  {
    id: 3,
    workflow: 'Data Sync Pipeline',
    status: 'failed',
    time: '12 min ago',
    duration: '45.2s',
  },
  {
    id: 4,
    workflow: 'Report Generation',
    status: 'success',
    time: '18 min ago',
    duration: '12.1s',
  },
];

const stats = [
  { label: 'Total Workflows', value: '47', icon: Workflow, trend: '+5' },
  { label: 'Executions Today', value: '2,847', icon: Activity, trend: '+12%' },
  { label: 'Success Rate', value: '99.1%', icon: CheckCircle, trend: '+0.3%' },
  { label: 'Avg Duration', value: '2.4s', icon: Clock, trend: '-0.2s' },
];

const MEZANDashboard = () => {
  const project = getProject('mezan')!;
  const colors = useThemeColors();

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">MEZAN Dashboard</h1>
            <p className="text-muted-foreground">Enterprise automation network control center</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                color: colors.text,
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
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
              <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                  <stat.icon className="w-full h-full" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
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
          {/* Workflows */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" style={{ color: colors.primary }} />
                  Active Workflows
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          workflow.status === 'active' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}
                      >
                        {workflow.status === 'active' ? (
                          <Play className="h-5 w-5 text-green-400" />
                        ) : (
                          <Pause className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workflow.executions.toLocaleString()} executions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{workflow.success}%</p>
                        <p className="text-xs text-muted-foreground">success</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: colors.secondary }} />
                Recent Executions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentExecutions.map((exec) => (
                <div
                  key={exec.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div
                    className={`mt-0.5 ${
                      exec.status === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {exec.status === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{exec.workflow}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{exec.time}</span>
                      <span>•</span>
                      <span>{exec.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2">
                View All Executions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" style={{ color: colors.primary }} />
              Connected Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Salesforce', 'Slack', 'PostgreSQL', 'AWS S3', 'Stripe', 'SendGrid'].map(
                (int, i) => (
                  <motion.div
                    key={int}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-green-500/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center text-xl font-bold">
                      {int.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{int}</span>
                    <Badge variant="outline" className="text-green-400 border-green-500/30">
                      Connected
                    </Badge>
                  </motion.div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default MEZANDashboard;
