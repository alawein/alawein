import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Palette,
  Rocket,
  AppWindow,
  Play,
  ShoppingCart,
  FileText,
  Users,
  Gamepad2,
  FlaskConical,
  Award,
} from 'lucide-react';

const featureCategories = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'Login, signup, and profile management',
    icon: Shield,
    color: 'from-cyan-500 to-blue-600',
    routes: ['/auth', '/profile'],
    preview: ['Login Forms', 'User Profiles'],
  },
  {
    id: 'dashboard',
    title: 'Dashboards',
    description: 'Analytics, metrics, and monitoring panels',
    icon: LayoutDashboard,
    color: 'from-purple-500 to-pink-600',
    routes: ['/admin', '/metrics', '/banking'],
    preview: ['Admin Panel', 'Metrics', 'Banking'],
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Design system showcases and UI patterns',
    icon: Palette,
    color: 'from-orange-500 to-red-600',
    routes: ['/templates', '/cyber-dashboard', '/design-engines'],
    preview: ['Cyberpunk', 'Glass', 'Neumorphic'],
  },
  {
    id: 'landing',
    title: 'Landing Pages',
    description: 'Marketing and promotional pages',
    icon: Rocket,
    color: 'from-green-500 to-emerald-600',
    routes: ['/saas', '/open-source', '/event'],
    preview: ['SaaS', 'Open Source', 'Events'],
  },
  {
    id: 'apps',
    title: 'Applications',
    description: 'Productivity and utility tools',
    icon: AppWindow,
    color: 'from-blue-500 to-indigo-600',
    routes: ['/tasks', '/calendar', '/chat'],
    preview: ['Task Manager', 'Calendar', 'Chat'],
  },
  {
    id: 'media',
    title: 'Media Players',
    description: 'Audio, video, and streaming interfaces',
    icon: Play,
    color: 'from-pink-500 to-rose-600',
    routes: ['/music', '/video', '/podcast'],
    preview: ['Music', 'Video', 'Podcast'],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    description: 'E-commerce and payment flows',
    icon: ShoppingCart,
    color: 'from-yellow-500 to-orange-600',
    routes: ['/checkout', '/pricing', '/nft-marketplace'],
    preview: ['Checkout', 'Pricing', 'NFT'],
  },
  {
    id: 'content',
    title: 'Content',
    description: 'Blogs, docs, and wikis',
    icon: FileText,
    color: 'from-teal-500 to-cyan-600',
    routes: ['/blog', '/api-docs', '/changelog'],
    preview: ['Blog', 'API Docs', 'Changelog'],
  },
  {
    id: 'social',
    title: 'Social',
    description: 'Community and lifestyle apps',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    routes: ['/social', '/recipes', '/meditation'],
    preview: ['Feed', 'Recipes', 'Meditation'],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'Game launchers and leaderboards',
    icon: Gamepad2,
    color: 'from-red-500 to-orange-600',
    routes: ['/arcade', '/game-launcher'],
    preview: ['Arcade', 'Launcher'],
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Data visualization and simulations',
    icon: FlaskConical,
    color: 'from-indigo-500 to-blue-600',
    routes: ['/quantum-lab', '/analytics', '/3d'],
    preview: ['Quantum Lab', 'Analytics', '3D'],
  },
  {
    id: 'showcase',
    title: 'Showcase',
    description: 'Portfolios and project displays',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    routes: ['/showcase', '/resume'],
    preview: ['Projects', 'Resume'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const FeatureNavigation = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-jules-cyan via-jules-magenta to-jules-purple bg-clip-text text-transparent">
            Feature Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore 12 feature categories with 60+ unique interfaces, each showcasing different
            design patterns and interactions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {featureCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              />
              <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 overflow-hidden group-hover:border-jules-cyan/50 transition-all duration-300">
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} p-3 mb-4 shadow-lg`}
                >
                  <category.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-jules-cyan transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>

                {/* Preview tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.preview.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {category.routes.slice(0, 3).map((route) => (
                    <Link
                      key={route}
                      to={route}
                      className="text-xs px-3 py-1.5 rounded-lg bg-jules-cyan/10 text-jules-cyan hover:bg-jules-cyan/20 transition-colors font-medium"
                    >
                      {route.replace('/', '').replace('-', ' ') || 'View'}
                    </Link>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-jules-cyan/20 to-jules-magenta/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureNavigation;
