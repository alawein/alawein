import { BarChart3, PieChart, TrendingUp, Users, MousePointer, Eye, Target, Layers, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';

/**
 * Attributa Dashboard
 * Marketing Attribution & Analytics Platform
 * by Alawein Technologies LLC
 */
const stats = [
  { title: 'Tracked Events', value: '2.4M', change: 24.5, icon: MousePointer, trend: 'up' as const },
  { title: 'Unique Users', value: '148K', change: 12.3, icon: Users, trend: 'up' as const },
  { title: 'Conversions', value: '8,247', change: 18.7, icon: Target, trend: 'up' as const },
  { title: 'Attribution Accuracy', value: '96.8%', change: 2.1, icon: TrendingUp, trend: 'up' as const },
];

const conversionData = [
  { name: 'Mon', value: 1240 },
  { name: 'Tue', value: 1580 },
  { name: 'Wed', value: 1420 },
  { name: 'Thu', value: 1890 },
  { name: 'Fri', value: 2100 },
  { name: 'Sat', value: 980 },
  { name: 'Sun', value: 760 },
];

const channelAttribution = [
  { channel: 'Organic Search', conversions: 2847, share: 34.5, color: 'bg-green-500' },
  { channel: 'Paid Search', conversions: 1923, share: 23.3, color: 'bg-blue-500' },
  { channel: 'Social Media', conversions: 1456, share: 17.7, color: 'bg-purple-500' },
  { channel: 'Email', conversions: 1089, share: 13.2, color: 'bg-yellow-500' },
  { channel: 'Direct', conversions: 932, share: 11.3, color: 'bg-pink-500' },
];

const topTouchpoints = [
  { path: 'Blog → Pricing → Demo Request', conversions: 423, value: '$84,600' },
  { path: 'PPC Ad → Landing → Sign Up', conversions: 312, value: '$62,400' },
  { path: 'Email → Features → Trial', conversions: 287, value: '$57,400' },
  { path: 'Social → Case Study → Contact', conversions: 198, value: '$39,600' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">ATTRIBUTA</span>
        </div>
        <h1 className="text-3xl font-bold">Marketing Attribution Dashboard</h1>
        <p className="text-muted-foreground">Multi-touch attribution analytics & conversion tracking.</p>
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
            <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" />Channel Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelAttribution.map((ch, index) => (
                <motion.div key={ch.channel} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{ch.channel}</span>
                    <span className="text-sm text-muted-foreground">{ch.conversions} ({ch.share}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full transition-all`} style={{ width: `${ch.share}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" />Top Conversion Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTouchpoints.map((tp, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="pb-3 border-b last:border-0">
                  <p className="text-sm font-medium flex items-center gap-1">{tp.path} <ArrowUpRight className="w-3 h-3 text-green-500" /></p>
                  <p className="text-xs text-muted-foreground">{tp.conversions} conversions • {tp.value}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Weekly Conversions</CardTitle></CardHeader>
        <CardContent><AreaChart data={conversionData} /></CardContent>
      </Card>
    </div>
  );
}

