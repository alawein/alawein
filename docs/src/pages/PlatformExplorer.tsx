import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Grid3X3,
  Zap,
  Sparkles,
  GitBranch,
  Filter,
  Box,
  ChevronRight,
  Palette,
  Settings,
  Home,
  Brain,
  Building2,
  FlaskConical,
  BarChart3,
  MessageSquare,
  Rocket,
  Heart,
  User,
  Pill,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  route?: string;
  externalUrl?: string;
  status: 'active' | 'beta' | 'development' | 'planned';
  designBrief?: string;
}

const templates: DesignTemplate[] = [
  // Active & Built Platforms
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio & resume showcase',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    route: '/portfolio',
    status: 'active',
  },
  {
    id: 'simcore',
    name: 'SimCore',
    description: 'Scientific computing & simulation platform',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
    route: '/projects/simcore',
    status: 'active',
    designBrief:
      'Scientific/quantum computing aesthetic with particle effects, dark mode primary, glowing accents, technical documentation layouts, code snippet displays, research paper integration.',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    description: 'Quantum mechanics laboratory',
    icon: Box,
    color: 'from-pink-500 to-rose-500',
    route: '/projects/qmlab',
    status: 'active',
    designBrief:
      'Quantum-inspired design with wave function visualizations, Schrödinger equation displays, probability density animations, dark cosmic backgrounds with neon particle trails.',
  },
  {
    id: 'mezan',
    name: 'MEZAN',
    description: 'Arabic-themed enterprise automation',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    route: '/projects/mezan',
    status: 'active',
    designBrief:
      'Arabic-themed platform with elegant calligraphic elements, RTL layout support, warm golds and deep blues, geometric Islamic patterns, sophisticated typography mixing Arabic and Latin scripts. Modern Dubai tech hub meets traditional Arabian aesthetics.',
  },
  {
    id: 'talai',
    name: 'TalAI',
    description: 'AI research and ML experimentation',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    route: '/projects/talai',
    status: 'active',
    designBrief:
      'AI-focused interface with neural network visualizations, clean tech aesthetic, blues and purples, dynamic data flow animations, dashboard-heavy design, emphasizing machine learning capabilities.',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    description: 'Optimization algorithms platform',
    icon: Filter,
    color: 'from-indigo-500 to-purple-500',
    route: '/projects/optilibria',
    status: 'active',
    designBrief:
      'Balanced, optimization-focused design with symmetrical layouts, gradient transitions, charts and performance metrics, professional corporate feel with teal and slate color schemes.',
  },
  // Ready & Developed External Platforms
  {
    id: 'attributa',
    name: 'Attributa',
    description: 'Attribution & analytics platform',
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    externalUrl: 'https://attributa.io',
    status: 'active',
    designBrief:
      'Clean data visualization, professional SaaS design, modular card layouts, interactive graphs, conversion funnel displays.',
  },
  {
    id: 'llmworks',
    name: 'LLMWorks',
    description: 'Language model workspace',
    icon: MessageSquare,
    color: 'from-violet-500 to-purple-500',
    externalUrl: 'https://llmworks.ai',
    status: 'active',
    designBrief:
      'Code editor integration, prompt engineering interface, real-time processing indicators, developer-focused UX, syntax highlighting, model comparison tools.',
  },
  {
    id: 'repz',
    name: 'REPZ',
    description: 'Representative & agent platform',
    icon: User,
    color: 'from-slate-500 to-gray-500',
    externalUrl: 'https://repz.io',
    status: 'active',
    designBrief:
      'Professional networking design, profile showcases, connection mapping, representative dashboards, agent performance metrics.',
  },
  {
    id: 'liveiticonic',
    name: 'LiveItIconic',
    description: 'Lifestyle & inspiration brand',
    icon: Rocket,
    color: 'from-rose-500 to-pink-500',
    externalUrl: 'https://liveiticonic.com',
    status: 'active',
    designBrief:
      'Instagram-worthy aesthetics, bold imagery, inspirational quotes integration, social media feed styling, lifestyle photography, motivational content layouts.',
  },
  // Planned & In Development
  {
    id: 'mom-business',
    name: "Mama's Kitchen",
    description: "Mom's business - warm & approachable",
    icon: Heart,
    color: 'from-rose-400 to-red-400',
    status: 'planned',
    designBrief:
      'Warm, approachable, trustworthy design, easy navigation for older demographics, clear call-to-actions, testimonial sections, family-oriented imagery.',
  },
  {
    id: 'dad-website',
    name: 'Dr. Alawein',
    description: "Dad's professional portfolio",
    icon: Building2,
    color: 'from-slate-600 to-gray-600',
    status: 'planned',
    designBrief:
      'Professional portfolio/blog hybrid, clean minimalist design, resume/CV integration, project showcases, academic credentials, publications list.',
  },
  {
    id: 'peptide-vault',
    name: 'PeptideVault',
    description: 'Research peptides marketplace',
    icon: Pill,
    color: 'from-emerald-500 to-teal-500',
    status: 'planned',
    designBrief:
      'Medical/scientific credibility, clean white backgrounds, molecular structure graphics, research citations, secure checkout, compliance-focused design, lab aesthetic.',
  },
  {
    id: 'helix-commerce',
    name: 'HelixCommerce',
    description: 'Biotech e-commerce platform',
    icon: FlaskConical,
    color: 'from-cyan-500 to-blue-500',
    status: 'planned',
    designBrief:
      'Scientific e-commerce with DNA helix motifs, clinical precision aesthetic, trust badges, research verification, batch tracking, purity certificates display.',
  },
];

const statusColors = {
  active: 'bg-green-500/10 text-green-500 border-green-500/30',
  beta: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  development: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  planned: 'bg-muted text-muted-foreground border-border',
};

const PlatformExplorer = () => {
  const navigate = useNavigate();

  const handleNavigate = (template: DesignTemplate) => {
    if (template.externalUrl) {
      window.open(template.externalUrl, '_blank');
    } else if (template.route) {
      navigate(template.route);
    }
  };

  const activePlatforms = templates.filter((t) => t.status === 'active');
  const plannedPlatforms = templates.filter(
    (t) => t.status === 'planned' || t.status === 'development'
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Platform Studio</h1>
              <p className="text-muted-foreground mt-2">
                Explore and access all platforms in the ecosystem
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline">
                  <Palette className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Active Platforms */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Active Platforms</h2>
            <p className="text-muted-foreground mb-6">
              Live and deployed platforms ready to explore
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlatforms.map((template, index) => {
                const Icon = template.icon;
                const isExternal = !!template.externalUrl;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer group hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden h-full"
                      onClick={() => handleNavigate(template)}
                    >
                      {/* Gradient Header */}
                      <div
                        className={`h-24 bg-gradient-to-br ${template.color} opacity-80 group-hover:opacity-100 transition-opacity relative`}
                      >
                        {isExternal && (
                          <div className="absolute top-2 right-2">
                            <ExternalLink className="h-4 w-4 text-white/80" />
                          </div>
                        )}
                      </div>

                      <CardHeader className="-mt-8 relative pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="bg-background rounded-lg p-3 border border-border shadow-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge className={statusColors[template.status]} variant="outline">
                            {template.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button
                          className="w-full group/btn"
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate(template)}
                        >
                          {isExternal ? 'Visit Site' : 'Open Platform'}
                          <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Planned & In Development */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">Platforms in development or planning phase</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plannedPlatforms.map((template, index) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="opacity-75 hover:opacity-100 transition-opacity h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`bg-gradient-to-br ${template.color} rounded-lg p-2`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <Badge className={statusColors[template.status]} variant="outline">
                            {template.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-muted/50 border-primary/20">
            <CardHeader>
              <Palette className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-lg">Unique Design Systems</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Each platform has its own tailored design system, from Arabic calligraphy to quantum
              aesthetics.
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-primary/20">
            <CardHeader>
              <Settings className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-lg">Custom Workflows</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Platform-specific features and integrations designed for their unique use cases.
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-primary/20">
            <CardHeader>
              <Grid3X3 className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-lg">Ecosystem Integration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              All platforms share core infrastructure while maintaining distinct identities.
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PlatformExplorer;
