import { Users, DollarSign, Cpu, TrendingUp, Atom, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * Alawein Technologies Dashboard
 * Advancing Science Through Code
 * Products: TalAI, Librex, MEZAN, QMLab, LLMWorks
 */
const stats = [
  { title: 'API Calls', value: '1.2M', change: 18.5, icon: Cpu, trend: 'up' as const },
  { title: 'Active Users', value: '2,350', change: 8.2, icon: Users, trend: 'up' as const },
  { title: 'Experiments', value: '847', change: 12.1, icon: Atom, trend: 'up' as const },
  { title: 'Model Accuracy', value: '94.5%', change: 2.3, icon: TrendingUp, trend: 'up' as const },
];

const usageData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const recentActivity = [
  { user: 'TalAI Agent', action: 'Completed research task', time: '2 min ago' },
  { user: 'Librex Solver', action: 'Optimized QAP instance', time: '5 min ago' },
  { user: 'MEZAN Pipeline', action: 'Deployed model v2.3', time: '12 min ago' },
  { user: 'QMLab Sim', action: 'Quantum simulation complete', time: '25 min ago' },
  { user: 'LLMWorks', action: 'Benchmark report generated', time: '1 hour ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Alawein Technologies Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">ALAWEIN TECHNOLOGIES</span>
        </div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">Advancing Science Through Code — Your unified control center.</p>
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

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={usageData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 pb-3 border-b last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

