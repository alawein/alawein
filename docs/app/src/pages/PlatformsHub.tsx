import { useState, useMemo } from 'react'
import { ExternalLink, Github, Globe, Play, Search, RefreshCw, Terminal, Zap, Clock, Activity } from 'lucide-react'
import {
  PLATFORMS,
  getPlatformsGroupedByTier,
  TIER_ORDER,
  TIER_LABELS,
  type PlatformDefinition,
  type PlatformTier,
} from '../data/platforms'

// Quick actions for common tasks
const QUICK_ACTIONS = [
  { id: 'dev-all', label: 'Start All Dev Servers', icon: Play, command: 'npm run dev' },
  { id: 'build-all', label: 'Build All Platforms', icon: Zap, command: 'npm run build' },
  { id: 'test-all', label: 'Run All Tests', icon: Activity, command: 'npm run test' },
  { id: 'type-check', label: 'Type Check', icon: Terminal, command: 'npm run type-check' },
]

// Recent activity (would be fetched from API in production)
const RECENT_ACTIVITY = [
  { id: '1', platform: 'SimCore', action: 'Build completed', time: '2 min ago', status: 'success' },
  { id: '2', platform: 'QMLab', action: 'Tests passed', time: '5 min ago', status: 'success' },
  { id: '3', platform: 'Portfolio', action: 'Deployed to production', time: '1 hour ago', status: 'success' },
  { id: '4', platform: 'REPZ', action: 'Type check passed', time: '2 hours ago', status: 'success' },
]

function StatusBadge({ status }: { status: PlatformDefinition['status'] }) {
  const styles = {
    active: 'bg-green-500/15 text-green-400 border-green-500/30',
    backend: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    planned: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function PlatformCard({ platform }: { platform: PlatformDefinition }) {
  const [from, to] = platform.gradientColors || ['#38bdf8', '#0284c7']

  return (
    <div
      className="group relative bg-card border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${from}08, ${to}08)`,
      }}
    >
      {/* Gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {platform.name}
          </h3>
          {platform.domainUrl && (
            <span className="text-xs text-muted-foreground">
              {new URL(platform.domainUrl).hostname}
            </span>
          )}
        </div>
        <StatusBadge status={platform.status} />
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {platform.tagline || platform.notes}
      </p>

      {/* Tags */}
      {platform.tags && platform.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platform.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border/30">
        {platform.devPort && (
          <a
            href={`http://localhost:${platform.devPort}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Dev :{platform.devPort}
          </a>
        )}
        {platform.domainUrl && platform.status === 'active' && (
          <a
            href={platform.domainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Live
          </a>
        )}
        {platform.githubUrl && (
          <a
            href={platform.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xs font-medium py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

function TierSection({ tier, platforms }: { tier: PlatformTier; platforms: PlatformDefinition[] }) {
  if (platforms.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          {TIER_LABELS[tier]}
        </h2>
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-xs text-muted-foreground">
          {platforms.length} {platforms.length === 1 ? 'platform' : 'platforms'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </section>
  )
}

export default function PlatformsHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const grouped = getPlatformsGroupedByTier()
  const totalPlatforms = PLATFORMS.length
  const activePlatforms = PLATFORMS.filter((p) => p.status === 'active').length
  const backendPlatforms = PLATFORMS.filter((p) => p.status === 'backend').length

  // Filter platforms based on search
  const filteredGrouped = useMemo(() => {
    if (!searchQuery.trim()) return grouped
    const query = searchQuery.toLowerCase()
    const result: Record<PlatformTier, PlatformDefinition[]> = {} as Record<PlatformTier, PlatformDefinition[]>
    for (const tier of TIER_ORDER) {
      result[tier] = grouped[tier].filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tagline?.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      )
    }
    return result
  }, [grouped, searchQuery])

  const handleQuickAction = (command: string) => {
    navigator.clipboard.writeText(command)
    alert(`Copied to clipboard: ${command}`)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Platforms Hub</h1>
              <p className="text-muted-foreground">
                All products, research projects, and platforms across Alawein Technologies, REPZ, and Live It Iconic.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{totalPlatforms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{activePlatforms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">{backendPlatforms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Backend</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search platforms by name, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.command)}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div>
                      <span className="text-sm font-medium">{activity.platform}</span>
                      <span className="text-sm text-muted-foreground"> - {activity.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-10">
        {TIER_ORDER.map((tier) => (
          <TierSection key={tier} tier={tier} platforms={filteredGrouped[tier]} />
        ))}
      </div>
    </div>
  )
}
