import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, GitBranch, Filter, Box, Palette, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Platform {
  id: string;
  name: string;
  description: string;
  theme: string;
  status: 'active' | 'beta' | 'development' | 'pending';
  tier: 'scientific' | 'ai-ml' | 'cultural' | 'business' | 'lifestyle' | 'family';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  route?: string;
}

const platforms: Platform[] = [
  // Tier 1: Scientific/Technical
  {
    id: 'simcore',
    name: 'SimCore',
    description:
      'Scientific computing and simulation platform. Real-time parameter control, data visualization, and results graphing.',
    theme: 'Scientific Computing',
    status: 'pending',
    tier: 'scientific',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    route: '/studio/platforms/simcore',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    description:
      'Quantum mechanics laboratory. Wave function visualizations, quantum state experiments, and measurement results.',
    theme: 'Quantum Research',
    status: 'pending',
    tier: 'scientific',
    icon: Box,
    color: 'from-purple-500 to-pink-500',
    route: '/studio/platforms/qmlab',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    description:
      'Optimization algorithms platform. Performance metrics, algorithm comparison, and convergence visualizations.',
    theme: 'Optimization',
    status: 'development',
    tier: 'scientific',
    icon: Filter,
    color: 'from-teal-500 to-emerald-500',
    route: '/projects/optilibria',
  },

  // Tier 2: AI/ML
  {
    id: 'talai',
    name: 'TalAI',
    description:
      'AI research and machine learning platform. Model dashboards, neural network visualizers, and experiment tracking.',
    theme: 'AI Research',
    status: 'development',
    tier: 'ai-ml',
    icon: GitBranch,
    color: 'from-blue-500 to-cyan-500',
    route: '/projects/talai',
  },
  {
    id: 'llmworks',
    name: 'LLMWorks',
    description:
      'Language model development workspace. Prompt engineering, token visualization, and model comparison.',
    theme: 'LLM Development',
    status: 'development',
    tier: 'ai-ml',
    icon: Code2,
    color: 'from-orange-500 to-amber-500',
  },

  // Tier 3: Cultural/Themed
  {
    id: 'mezan',
    name: 'MEZAN',
    description:
      'Arabic/Middle Eastern elegant platform. RTL layout, geometric patterns, and calligraphic design.',
    theme: 'Arabic Design',
    status: 'development',
    tier: 'cultural',
    icon: Palette,
    color: 'from-yellow-500 to-orange-500',
    route: '/projects/mezan',
  },

  // Tier 4: Business/Professional
  {
    id: 'attributa',
    name: 'Attributa',
    description:
      'Attribution analytics platform. Multi-touch attribution modeling, channel performance, and ROI tracking.',
    theme: 'Analytics',
    status: 'development',
    tier: 'business',
    icon: Code2,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'repz',
    name: 'REPZ',
    description:
      'Representative/agent network platform. Profile showcases, network visualization, and connection mapping.',
    theme: 'Network Platform',
    status: 'development',
    tier: 'business',
    icon: Box,
    color: 'from-cyan-500 to-teal-500',
  },

  // Tier 5: Lifestyle/E-commerce
  {
    id: 'liveiticonic',
    name: 'LiveItIconic',
    description:
      'Lifestyle brand platform. Social media integration, image galleries, and curated product showcases.',
    theme: 'Lifestyle Brand',
    status: 'development',
    tier: 'lifestyle',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'peptidevault',
    name: 'PeptideVault',
    description:
      'Biotech e-commerce platform. Secure checkout, research citations, molecular visualizations.',
    theme: 'Scientific E-commerce',
    status: 'pending',
    tier: 'lifestyle',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
  },

  // Tier 6: Family Projects
  {
    id: 'moms-business',
    name: "Mom's Business",
    description:
      'Warm, approachable business website. Simple navigation, clear CTAs, and testimonial sections.',
    theme: 'Family Business',
    status: 'pending',
    tier: 'family',
    icon: Palette,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'dads-website',
    name: "Dad's Website",
    description:
      'Professional academic portfolio. CV/Resume display, publications, and project showcase.',
    theme: 'Academic Portfolio',
    status: 'pending',
    tier: 'family',
    icon: Code2,
    color: 'from-slate-500 to-gray-500',
  },
];

const tiers = {
  scientific: 'Scientific/Technical',
  'ai-ml': 'AI/ML Platforms',
  cultural: 'Cultural/Themed',
  business: 'Business/Professional',
  lifestyle: 'Lifestyle/E-commerce',
  family: 'Family Projects',
};

const statusColors = {
  active: 'bg-green-500/20 text-green-700 dark:text-green-400',
  beta: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  development: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  pending: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

const PlatformsHub = () => {
  const navigate = useNavigate();
  const groupedPlatforms = Object.entries(tiers).map((tier) => ({
    tier: tier[0],
    tierName: tier[1],
    platforms: platforms.filter((p) => p.tier === tier[0]),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20" />
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
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Platforms Studio
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover fully-featured, functional platforms. Each platform is a complete project with
            its own design language, color scheme, and interactive capabilities.
          </p>
        </motion.div>

        {/* Platforms by Tier */}
        {groupedPlatforms.map((group, groupIndex) => (
          <motion.div
            key={group.tier}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * (groupIndex + 1), duration: 0.6 }}
            className="my-16"
          >
            {/* Tier Title */}
            <h2 className="text-3xl font-bold mb-8 text-primary">{group.tierName}</h2>

            {/* Platforms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.platforms.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <motion.div
                    key={platform.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.6 }}
                  >
                    <Card
                      className={`h-full flex flex-col transition-all ${
                        platform.route
                          ? 'hover:shadow-lg cursor-pointer group border-border/50 bg-card/50 backdrop-blur'
                          : 'opacity-60 border-border/30'
                      }`}
                      onClick={() => platform.route && navigate(platform.route)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${platform.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <Badge variant="outline" className={statusColors[platform.status]}>
                            {platform.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-xs">{platform.theme}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                        {platform.route && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                            Explore <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center mt-16"
        >
          <p className="text-muted-foreground mb-2">
            Platforms marked as "pending" are waiting for design assets to be provided.
          </p>
          <p className="text-sm text-muted-foreground">
            Click on any available platform to explore its full features and interactive interface.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformsHub;
