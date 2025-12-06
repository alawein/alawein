// Project Card Component for Project Hub
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Zap, Shield } from 'lucide-react';
import { Project } from '../types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  development: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  beta: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  deprecated: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const categoryIcons = {
  'scientific-computing': '🔬',
  'enterprise-automation': '⚙️',
  'ai-research': '🧠',
  optimization: '📈',
  'quantum-mechanics': '⚛️',
  portfolio: '💼',
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={`/${project.slug}`}>
        <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: project.theme.gradient }}
          />

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{ background: project.theme.gradient }}
              >
                {categoryIcons[project.category] || project.name.charAt(0)}
              </div>
              <Badge className={cn('text-xs', statusColors[project.status])}>
                {project.status}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{project.tagline}</p>
          </div>

          {/* Description */}
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>

          {/* Features */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {project.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
              {project.features.length > 3 && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  +{project.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Tech Stack Preview */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>{project.techStack.frontend.length} frontend</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>{project.techStack.backend.length} backend</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">v{project.version}</span>
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <span>Explore</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
