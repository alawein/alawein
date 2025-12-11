/**
 * @file AdminDashboard.tsx
 * @description Admin analytics dashboard with user metrics, subscription analytics, and platform usage
 */
import { motion } from 'framer-motion';
import {
  Users, CreditCard, Activity, TrendingUp,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

const MetricCard = ({ title, value, change, icon: Icon, trend }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-lg border bg-card"
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className="h-8 w-8 text-primary" />
      <span className={`flex items-center text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {Math.abs(change)}%
      </span>
    </div>
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-sm text-muted-foreground">{title}</p>
  </motion.div>
);

interface PlatformUsageProps {
  name: string;
  users: number;
  requests: number;
  color: string;
}

const platformData: PlatformUsageProps[] = [
  { name: 'SimCore', users: 1234, requests: 45678, color: 'bg-blue-500' },
  { name: 'MEZAN', users: 892, requests: 32456, color: 'bg-purple-500' },
  { name: 'TalAI', users: 567, requests: 23456, color: 'bg-green-500' },
  { name: 'OptiLibria', users: 345, requests: 12345, color: 'bg-orange-500' },
  { name: 'QMLab', users: 234, requests: 8765, color: 'bg-pink-500' },
];

const subscriptionData = [
  { tier: 'Free', count: 2456, revenue: 0 },
  { tier: 'Pro', count: 567, revenue: 27783 },
  { tier: 'Team', count: 123, revenue: 24477 },
  { tier: 'Enterprise', count: 12, revenue: 47988 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const totalUsers = platformData.reduce((sum, p) => sum + p.users, 0);
  const totalRequests = platformData.reduce((sum, p) => sum + p.requests, 0);
  const totalRevenue = subscriptionData.reduce((sum, s) => sum + s.revenue, 0);
  const totalSubscribers = subscriptionData.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform analytics and metrics</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Users" value={totalUsers.toLocaleString()} change={12.5} icon={Users} trend="up" />
        <MetricCard title="Monthly Revenue" value={`$${totalRevenue.toLocaleString()}`} change={8.3} icon={CreditCard} trend="up" />
        <MetricCard title="API Requests" value={`${(totalRequests / 1000).toFixed(1)}K`} change={23.1} icon={Activity} trend="up" />
        <MetricCard title="Active Subscriptions" value={totalSubscribers - subscriptionData[0].count} change={-2.4} icon={TrendingUp} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Platform Usage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Platform Usage</h2>
          </div>
          <div className="space-y-4">
            {platformData.map((platform) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{platform.name}</span>
                  <span className="text-muted-foreground">{platform.users.toLocaleString()} users</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${platform.color} rounded-full transition-all`}
                    style={{ width: `${(platform.users / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscription Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Subscription Distribution</h2>
          </div>
          <div className="space-y-4">
            {subscriptionData.map((sub) => (
              <div key={sub.tier} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{sub.tier}</p>
                  <p className="text-sm text-muted-foreground">{sub.count.toLocaleString()} subscribers</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${sub.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">MRR</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg border bg-card"
      >
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New user signup', user: 'john@example.com', platform: 'SimCore', time: '2 min ago' },
            { action: 'Subscription upgraded', user: 'sarah@company.com', platform: 'MEZAN', time: '15 min ago' },
            { action: 'API key generated', user: 'dev@startup.io', platform: 'TalAI', time: '1 hour ago' },
            { action: 'Simulation completed', user: 'researcher@uni.edu', platform: 'QMLab', time: '2 hours ago' },
            { action: 'New team created', user: 'admin@enterprise.com', platform: 'OptiLibria', time: '3 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 text-xs rounded-full bg-secondary">{activity.platform}</span>
                <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
