import { Bot, Brain, FileSearch, ListTodo, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * TalAI Dashboard
 * AI Research Agent Control Panel
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Active Agents', value: '12', change: 25.0, icon: Bot, trend: 'up' as const },
  { title: 'Tasks Completed', value: '1,847', change: 18.5, icon: CheckCircle2, trend: 'up' as const },
  { title: 'Research Papers', value: '342', change: 12.1, icon: FileSearch, trend: 'up' as const },
  { title: 'Avg. Task Time', value: '4.2m', change: -8.3, icon: Clock, trend: 'up' as const },
];

const taskData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 62 },
  { name: 'Wed', value: 58 },
  { name: 'Thu', value: 71 },
  { name: 'Fri', value: 89 },
  { name: 'Sat', value: 34 },
  { name: 'Sun', value: 28 },
];

const taskQueue = [
  { id: 'T-001', task: 'Literature review: Quantum ML algorithms', status: 'running', agent: 'Agent Alpha', progress: 67 },
  { id: 'T-002', task: 'Summarize arXiv papers on LLM optimization', status: 'running', agent: 'Agent Beta', progress: 45 },
  { id: 'T-003', task: 'Code analysis: TensorFlow vs PyTorch benchmarks', status: 'queued', agent: 'Pending', progress: 0 },
  { id: 'T-004', task: 'Generate report: Market analysis AI startups', status: 'queued', agent: 'Pending', progress: 0 },
  { id: 'T-005', task: 'Extract insights from patent database', status: 'completed', agent: 'Agent Gamma', progress: 100 },
];

const agentStatus = [
  { name: 'Agent Alpha', status: 'active', tasks: 156, specialty: 'Research & Analysis' },
  { name: 'Agent Beta', status: 'active', tasks: 89, specialty: 'Content Synthesis' },
  { name: 'Agent Gamma', status: 'idle', tasks: 234, specialty: 'Data Extraction' },
  { name: 'Agent Delta', status: 'active', tasks: 67, specialty: 'Code Review' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* TalAI Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">TALAI</span>
        </div>
        <h1 className="text-3xl font-bold">AI Research Agent Control Panel</h1>
        <p className="text-muted-foreground">Autonomous research agents working for you 24/7.</p>
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

      {/* Task Queue & Agent Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              Task Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taskQueue.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {task.status === 'running' && <Bot className="w-5 h-5 text-primary animate-pulse" />}
                    {task.status === 'queued' && <Clock className="w-5 h-5 text-muted-foreground" />}
                    {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.agent}</p>
                  </div>
                  <div className="flex-shrink-0 w-20">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">{task.progress}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentStatus.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 pb-3 border-b last:border-0"
                >
                  <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.specialty}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{agent.tasks} tasks</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Tasks Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks Completed This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart data={taskData} />
        </CardContent>
      </Card>
    </div>
  );
}

