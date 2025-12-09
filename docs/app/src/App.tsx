import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, Layers, FileCode, ExternalLink, BarChart3 } from 'lucide-react'
import StudioSelector from './pages/StudioSelector'
import PlatformsHub from './pages/PlatformsHub'
import TemplatesHub from './pages/TemplatesHub'
import AnalyticsDashboard from './pages/AnalyticsDashboard'

function NavLink({ to, icon: Icon, children, external }: { to: string; icon: React.ElementType; children: React.ReactNode; external?: boolean }) {
  const location = useLocation()
  const isActive = location.pathname === to

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{children}</span>
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    )
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-background font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">Alawein Studios</span>
            </Link>

            <nav className="flex items-center gap-1">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/platforms" icon={Layers}>Platforms</NavLink>
              <NavLink to="/analytics" icon={BarChart3}>Analytics</NavLink>
              <NavLink to="/templates" icon={FileCode}>Templates</NavLink>
              <NavLink to="https://alawein.com" icon={ExternalLink} external>Portfolio</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<StudioSelector />} />
          <Route path="/platforms" element={<PlatformsHub />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/templates" element={<TemplatesHub />} />
        </Routes>
      </main>
    </div>
  )
}
