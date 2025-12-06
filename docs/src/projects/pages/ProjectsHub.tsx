// Projects Hub - Central navigation for all platforms
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowLeft,
  Sparkles,
  GitBranch,
  Boxes,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { getAllProjects, getProjectsByCategory } from '../config';
import { ProjectCard } from '../components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Projects', icon: Boxes },
  { id: 'scientific-computing', label: 'Scientific', icon: Sparkles },
  { id: 'enterprise-automation', label: 'Enterprise', icon: Zap },
  { id: 'ai-research', label: 'AI Research', icon: GitBranch },
  { id: 'optimization', label: 'Optimization', icon: Filter },
  { id: 'quantum-mechanics', label: 'Quantum', icon: Grid3X3 },
];

const ProjectsHub = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allProjects = getAllProjects();
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.features.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/portfolio">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">AlaweinOS Projects</h1>
                <p className="text-sm text-muted-foreground">
                  {allProjects.length} platforms • Full-stack applications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-10 bg-muted/50"
                />
              </div>
              <div className="flex border rounded-lg bg-muted/30">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(viewMode === 'grid' && 'bg-primary/20 text-primary')}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(viewMode === 'list' && 'bg-primary/20 text-primary')}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 bg-muted/50"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* Stats Footer */}
      <footer className="border-t border-border/50 bg-muted/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text">{allProjects.length}</div>
              <div className="text-sm text-muted-foreground">Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">
                {allProjects.reduce((acc, p) => acc + p.features.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">
                {allProjects.reduce((acc, p) => acc + p.routes.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">
                {allProjects.filter((p) => p.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectsHub;
