import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap, 
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { PLATFORMS } from '../data/platforms'

// Mock analytics data - would be fetched from API in production
const PLATFORM_METRICS = PLATFORMS.filter(p => p.status === 'active').map(p => ({
  id: p.id,
  name: p.name,
  visitors: Math.floor(Math.random() * 10000) + 1000,
  pageViews: Math.floor(Math.random() * 50000) + 5000,
  avgSessionDuration: Math.floor(Math.random() * 300) + 60,
  bounceRate: Math.floor(Math.random() * 40) + 20,
  trend: Math.random() > 0.5 ? 'up' : 'down',
  trendValue: Math.floor(Math.random() * 20) + 1,
}))

const AGGREGATE_METRICS = {
  totalVisitors: PLATFORM_METRICS.reduce((sum, p) => sum + p.visitors, 0),
  totalPageViews: PLATFORM_METRICS.reduce((sum, p) => sum + p.pageViews, 0),
  avgBounceRate: Math.round(PLATFORM_METRICS.reduce((sum, p) => sum + p.bounceRate, 0) / PLATFORM_METRICS.length),
  avgSessionDuration: Math.round(PLATFORM_METRICS.reduce((sum, p) => sum + p.avgSessionDuration, 0) / PLATFORM_METRICS.length),
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  suffix = ''
}: { 
  title: string
  value: number | string
  icon: React.ElementType
  trend?: 'up' | 'down'
  trendValue?: number
  suffix?: string
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trendValue}%
          </div>
        )}
      </div>
    </div>
  )
}

function PlatformRow({ platform }: { platform: typeof PLATFORM_METRICS[0] }) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <tr className="border-b border-border/30 hover:bg-card/50 transition-colors">
      <td className="py-3 px-4 font-medium">{platform.name}</td>
      <td className="py-3 px-4 text-right">{platform.visitors.toLocaleString()}</td>
      <td className="py-3 px-4 text-right">{platform.pageViews.toLocaleString()}</td>
      <td className="py-3 px-4 text-right">{formatDuration(platform.avgSessionDuration)}</td>
      <td className="py-3 px-4 text-right">{platform.bounceRate}%</td>
      <td className="py-3 px-4 text-right">
        <span className={`flex items-center justify-end gap-1 ${platform.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {platform.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {platform.trendValue}%
        </span>
      </td>
    </tr>
  )
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Cross-platform analytics and performance metrics for all active platforms.
              </p>
            </div>
            <div className="flex gap-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border/50 hover:border-primary/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Total Visitors" value={AGGREGATE_METRICS.totalVisitors} icon={Users} trend="up" trendValue={12} />
          <MetricCard title="Page Views" value={AGGREGATE_METRICS.totalPageViews} icon={Globe} trend="up" trendValue={8} />
          <MetricCard title="Avg. Session" value={`${Math.floor(AGGREGATE_METRICS.avgSessionDuration / 60)}m`} icon={Clock} trend="up" trendValue={5} />
          <MetricCard title="Bounce Rate" value={AGGREGATE_METRICS.avgBounceRate} icon={Activity} suffix="%" trend="down" trendValue={3} />
        </div>

        {/* Platform Breakdown */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border/50">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Platform Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background/50">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Platform</th>
                  <th className="py-3 px-4 text-right font-medium">Visitors</th>
                  <th className="py-3 px-4 text-right font-medium">Page Views</th>
                  <th className="py-3 px-4 text-right font-medium">Avg. Session</th>
                  <th className="py-3 px-4 text-right font-medium">Bounce Rate</th>
                  <th className="py-3 px-4 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_METRICS.map((platform) => (
                  <PlatformRow key={platform.id} platform={platform} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

