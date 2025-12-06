import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, Boxes, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StudioSelector = () => {
  const navigate = useNavigate();

  const studios = [
    {
      id: 'templates',
      title: 'Templates Studio',
      description:
        'Generic, reusable design templates and components. Explore UI patterns, layouts, animations, and design systems.',
      icon: Palette,
      color: 'from-cyan-500 to-blue-500',
      route: '/studio/templates',
    },
    {
      id: 'platforms',
      title: 'Platforms Studio',
      description:
        'Concrete, functional projects and applications. Discover full-featured platforms with real capabilities.',
      icon: Boxes,
      color: 'from-purple-500 to-pink-500',
      route: '/studio/platforms',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 py-20 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Studio Hub
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your exploration path: dive into reusable templates or discover fully-featured
            platforms.
          </p>
        </motion.div>

        {/* Studios Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {studios.map((studio, index) => {
            const Icon = studio.icon;
            return (
              <motion.div
                key={studio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-all cursor-pointer group border-border/50 bg-card/50 backdrop-blur"
                  onClick={() => navigate(studio.route)}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${studio.color} p-3 mb-4`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-2xl">{studio.title}</CardTitle>
                    <CardDescription className="text-base">{studio.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all justify-between"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-20 text-muted-foreground"
        >
          <p className="text-sm">
            Select a studio above to get started. All platforms and templates are locally hosted and
            fully interactive.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioSelector;
