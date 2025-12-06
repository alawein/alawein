import { Link } from 'react-router-dom'
import { Layers, FileCode, User, ExternalLink, Sparkles } from 'lucide-react'

const studios = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Full cyberpunk portfolio with Jules design system, PixelNinja, CRT effects, and matrix rain.',
    icon: Sparkles,
    to: 'http://localhost:5174', // platforms/portfolio dev server
    gradient: 'from-cyan-400 to-fuchsia-500',
    stats: 'platforms/portfolio',
    external: true,
  },
  {
    id: 'platforms',
    title: 'Platforms Hub',
    description: 'Browse all 22 platforms across 3 LLCs. View status, tech stacks, and launch apps.',
    icon: Layers,
    to: '/platforms',
    gradient: 'from-primary to-secondary',
    stats: '22 platforms',
    external: false,
  },
  {
    id: 'templates',
    title: 'Templates Hub',
    description: 'Reusable HTML templates for products, research projects, personas, and family sites.',
    icon: FileCode,
    to: '/templates',
    gradient: 'from-secondary to-accent',
    stats: '4 templates',
    external: false,
  },
]

export default function StudioSelector() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 text-gradient">
          Alawein Studios
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Central hub for all platforms, templates, and portfolio. Build, explore, and deploy.
        </p>
      </div>

      {/* Studio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {studios.map((studio) => {
          const CardWrapper = studio.external ? 'a' : Link
          const cardProps = studio.external
            ? { href: studio.to, target: '_blank', rel: 'noopener noreferrer' }
            : { to: studio.to }

          return (
            <CardWrapper
              key={studio.id}
              {...cardProps as any}
              className="group relative bg-card border border-border/50 rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${studio.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${studio.gradient} flex items-center justify-center mb-6`}>
                <studio.icon className="w-7 h-7 text-background" />
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {studio.title}
                {studio.external && <ExternalLink className="w-4 h-4 inline ml-2 opacity-50" />}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {studio.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {studio.stats}
                </span>
              </div>
            </CardWrapper>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/alaweimm90"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <span className="text-border">·</span>
          <a
            href="https://malawein.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Portfolio
          </a>
          <span className="text-border">·</span>
          <a
            href="../pages/brands/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Brand Pages
          </a>
        </div>
      </div>
    </div>
  )
}
