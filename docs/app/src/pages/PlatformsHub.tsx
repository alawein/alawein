import { ExternalLink, Github, Globe, Play } from 'lucide-react'
import {
  PLATFORMS,
  getPlatformsGroupedByTier,
  TIER_ORDER,
  TIER_LABELS,
  type PlatformDefinition,
  type PlatformTier,
} from '../data/platforms'

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
  const grouped = getPlatformsGroupedByTier()
  const totalPlatforms = PLATFORMS.length
  const activePlatforms = PLATFORMS.filter((p) => p.status === 'active').length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Platforms Hub</h1>
              <p className="text-muted-foreground">
                All products, research projects, and platforms across Alawein Technologies, REPZ, and Live It Iconic.
              </p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{totalPlatforms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{activePlatforms}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        {TIER_ORDER.map((tier) => (
          <TierSection key={tier} tier={tier} platforms={grouped[tier]} />
        ))}
      </div>
    </div>
  )
}
