import { MessageSquare, Gauge, Trophy, Zap, Clock, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * LLMWorks Dashboard
 * LLM Benchmarking Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Models Tested', value: '156', change: 24.5, icon: MessageSquare, trend: 'up' as const },
  { title: 'Benchmarks Run', value: '12,847', change: 18.2, icon: Gauge, trend: 'up' as const },
  { title: 'Leaderboard Entries', value: '89', change: 12.0, icon: Trophy, trend: 'up' as const },
  { title: 'Avg. Latency', value: '124ms', change: -8.5, icon: Zap, trend: 'up' as const },
];

const benchData = [
  { name: 'Mon', value: 1245 },
  { name: 'Tue', value: 1567 },
  { name: 'Wed', value: 1892 },
  { name: 'Thu', value: 1654 },
  { name: 'Fri', value: 2134 },
  { name: 'Sat', value: 890 },
  { name: 'Sun', value: 456 },
];

const leaderboard = [
  { rank: 1, model: 'GPT-4-Turbo', provider: 'OpenAI', score: 92.4, change: 0, params: '1.76T' },
  { rank: 2, model: 'Claude-3-Opus', provider: 'Anthropic', score: 91.8, change: 1, params: 'Unknown' },
  { rank: 3, model: 'Gemini-Ultra', provider: 'Google', score: 90.2, change: -1, params: 'Unknown' },
  { rank: 4, model: 'Llama-3-70B', provider: 'Meta', score: 87.5, change: 2, params: '70B' },
  { rank: 5, model: 'Mistral-Large', provider: 'Mistral', score: 85.3, change: 0, params: 'Unknown' },
];

const benchmarks = [
  { name: 'MMLU', category: 'Knowledge', models: 156, leader: 'GPT-4-Turbo', score: '86.4%' },
  { name: 'HumanEval', category: 'Coding', models: 142, leader: 'GPT-4-Turbo', score: '91.2%' },
  { name: 'GSM8K', category: 'Math', models: 134, leader: 'Claude-3-Opus', score: '94.8%' },
  { name: 'TruthfulQA', category: 'Truthfulness', models: 128, leader: 'Claude-3-Opus', score: '78.2%' },
  { name: 'BBH', category: 'Reasoning', models: 112, leader: 'GPT-4-Turbo', score: '83.1%' },
];

const recentRuns = [
  { id: 'BR-001', model: 'Mixtral-8x22B', benchmark: 'MMLU', status: 'running', progress: 67 },
  { id: 'BR-002', model: 'Phi-3-Medium', benchmark: 'HumanEval', status: 'running', progress: 45 },
  { id: 'BR-003', model: 'Command-R+', benchmark: 'GSM8K', status: 'queued', progress: 0 },
  { id: 'BR-004', model: 'Qwen-1.5-72B', benchmark: 'BBH', status: 'completed', progress: 100 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* LLMWorks Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">LLMWORKS</span>
        </div>
        <h1 className="text-3xl font-bold">LLM Benchmarking Platform</h1>
        <p className="text-muted-foreground">Comprehensive evaluation and comparison of large language models.</p>
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

      {/* Leaderboard & Benchmarks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Model Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Model Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.model}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500 text-yellow-950' :
                    entry.rank === 2 ? 'bg-gray-300 text-gray-800' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-950' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.model}</p>
                    <p className="text-xs text-muted-foreground">{entry.provider} • {entry.params}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.change > 0 && <ArrowUp className="w-4 h-4 text-green-500" />}
                    {entry.change < 0 && <ArrowDown className="w-4 h-4 text-red-500" />}
                    <span className="text-lg font-bold text-primary">{entry.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Benchmark Suites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benchmarks.map((bench, index) => (
                <motion.div
                  key={bench.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{bench.name}</p>
                    <p className="text-xs text-muted-foreground">{bench.category} • {bench.models} models</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-primary">{bench.score}</p>
                    <p className="text-xs text-muted-foreground truncate">{bench.leader}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs & Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Benchmark Runs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRuns.map((run, index) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">{run.model}</span>
                    <span className="text-muted-foreground">{run.benchmark}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        run.status === 'completed' ? 'bg-green-500' :
                        run.status === 'running' ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${run.progress}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benchmarks Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Benchmarks This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={benchData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

