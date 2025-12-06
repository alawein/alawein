// Unified Project Layout - Shell for all platforms
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X, ChevronRight, ExternalLink, Settings, User, LogOut } from 'lucide-react';
import { Project } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

interface ProjectLayoutProps {
  project: Project;
  children: ReactNode;
}

const ProjectLayout = ({ project, children }: ProjectLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div
      className="min-h-screen flex"
      style={
        {
          '--project-primary': project.theme.primary,
          '--project-secondary': project.theme.secondary,
          '--project-accent': project.theme.accent,
          '--project-bg': project.theme.background,
          '--project-surface': project.theme.surface,
        } as React.CSSProperties
      }
    >
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 72 }}
        animate={{ width: sidebarOpen ? 280 : 72 }}
        className="hidden lg:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl"
      >
        {/* Project Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{
                background: project.theme.gradient,
                color: 'white',
              }}
            >
              {project.name.charAt(0)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <h2 className="font-bold text-foreground truncate">{project.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">{project.tagline}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0"
            >
              <ChevronRight
                className={cn('h-4 w-4 transition-transform', sidebarOpen && 'rotate-180')}
              />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {project.routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-primary/10 hover:text-primary',
                isActiveRoute(route.path)
                  ? 'bg-primary/15 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Home className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {route.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Link
            to="/projects"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
              'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <ExternalLink className="h-4 w-4" />
            {sidebarOpen && <span className="text-sm">All Projects</span>}
          </Link>
          {isAuthenticated && (
            <button
              onClick={() => logout()}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
              )}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="text-sm">Sign Out</span>}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
            style={{ background: project.theme.gradient }}
          >
            {project.name.charAt(0)}
          </div>
          <span className="font-bold">{project.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-80 bg-card border-r border-border"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                    style={{ background: project.theme.gradient }}
                  >
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold">{project.name}</h2>
                    <p className="text-xs text-muted-foreground">{project.tagline}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {project.routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                      isActiveRoute(route.path)
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    <Home className="h-5 w-5" />
                    <span>{route.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:overflow-y-auto">
        <div className="lg:hidden h-16" /> {/* Mobile header spacer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectLayout;
