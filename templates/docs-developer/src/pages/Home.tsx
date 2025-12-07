import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, FileText, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';

const features = [
  { icon: Zap, title: 'Fast', description: 'Lightning-fast documentation search and navigation' },
  { icon: Shield, title: 'Secure', description: 'Enterprise-grade security for your content' },
  { icon: Globe, title: 'Global', description: 'CDN-powered delivery for worldwide access' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Documentation &{' '}
            <span className="text-primary">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Everything you need to build amazing products. Comprehensive guides, 
            API references, and the latest updates from our team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/docs"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <Book className="w-5 h-5" />
              Read the Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold hover:bg-accent transition-colors"
            >
              <FileText className="w-5 h-5" />
              Visit Blog
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Getting Started', 'API Reference', 'Deployment', 'Troubleshooting'].map((topic) => (
              <Link
                key={topic}
                to="/docs"
                className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <span className="font-medium group-hover:text-primary">{topic}</span>
                <ArrowRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

