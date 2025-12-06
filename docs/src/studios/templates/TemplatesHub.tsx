import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Layout, Zap, Type, Palette, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon';
  route?: string;
}

const templates: Template[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Template',
    description:
      'Data visualization and analytics dashboard with charts, metrics, and real-time updates.',
    category: 'Layout',
    icon: Grid3X3,
    status: 'coming-soon',
  },
  {
    id: 'landing',
    name: 'Landing Page Template',
    description:
      'Modern marketing landing page with hero section, features, CTA, and testimonials.',
    category: 'Marketing',
    icon: Layout,
    status: 'coming-soon',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Template',
    description: 'Personal portfolio showcase with projects, skills, and contact sections.',
    category: 'Portfolio',
    icon: Code2,
    status: 'coming-soon',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Template',
    description:
      'Complete e-commerce storefront with product grid, filters, and cart functionality.',
    category: 'Shop',
    icon: Grid3X3,
    status: 'coming-soon',
  },
  {
    id: 'components',
    name: 'UI Components',
    description: 'Reusable component library: buttons, forms, cards, modals, and more.',
    category: 'Components',
    icon: Palette,
    status: 'coming-soon',
  },
  {
    id: 'animations',
    name: 'Animation Demos',
    description:
      'Framer Motion animations: transitions, gestures, scroll effects, and interactions.',
    category: 'Effects',
    icon: Zap,
    status: 'coming-soon',
  },
  {
    id: 'typography',
    name: 'Typography System',
    description: 'Font family showcases, text hierarchy, and semantic typography tokens.',
    category: 'Design',
    icon: Type,
    status: 'coming-soon',
  },
  {
    id: 'colors',
    name: 'Color Schemes',
    description: 'Pre-built color palettes and theme variations for different design aesthetics.',
    category: 'Design',
    icon: Palette,
    status: 'coming-soon',
  },
];

const categories = Array.from(new Set(templates.map((t) => t.category)));

const TemplatesHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 py-12 max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/studio')}
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Templates Studio
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore reusable design templates, UI components, and interactive examples. All
            templates showcase design patterns and best practices.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap gap-2 my-8"
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-primary/20 border-primary/50 text-primary"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button key={cat} variant="outline" size="sm" className="hover:bg-primary/10">
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card
                  className={`h-full flex flex-col transition-all ${
                    template.status === 'available'
                      ? 'hover:shadow-lg cursor-pointer group border-border/50 bg-card/50 backdrop-blur'
                      : 'opacity-60 border-border/30'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {template.status === 'coming-soon' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {template.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center"
        >
          <p className="text-muted-foreground">
            Templates are being created based on your design briefs. Once available, you can explore
            and interact with each template.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplatesHub;
