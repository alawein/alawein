import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Briefcase, Code, Mail, LogIn, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import JulesBackground from '@/components/JulesBackground';
import CRTOverlay from '@/components/CRTOverlay';

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-jules-dark text-foreground overflow-hidden">
      <JulesBackground />
      <CRTOverlay />

      {/* Navigation Bar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute inset-0 bg-jules-dark/80 backdrop-blur-md border-b border-jules-cyan/10"
          style={{ opacity: navOpacity }}
        />
        <nav className="container relative px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold font-mono text-jules-cyan flex items-center gap-2"
            style={{ textShadow: '0 0 10px hsl(var(--jules-cyan))' }}
          >
            <Home className="w-4 h-4" />
            {'<MA/>'}
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/portfolio"
              className="text-sm font-mono text-muted-foreground hover:text-jules-cyan transition-colors relative group"
            >
              Portfolio
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-jules-cyan transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 8px hsl(var(--jules-cyan))' }}
              />
            </Link>
            <Link
              to="/studio"
              className="text-sm font-mono text-muted-foreground hover:text-jules-cyan transition-colors relative group"
            >
              Platforms
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-jules-cyan transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 8px hsl(var(--jules-cyan))' }}
              />
            </Link>
          </div>

          {/* Auth button */}
          <Link
            to="/auth"
            className="px-4 py-2 text-sm font-mono rounded-full border border-jules-magenta/50 text-jules-magenta hover:bg-jules-magenta/10 transition-all flex items-center gap-2"
            style={{ textShadow: '0 0 8px hsl(var(--jules-magenta))' }}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </nav>
      </motion.header>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-4xl"
        >
          {/* Logo/Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              M. Alawein
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 font-light tracking-wide">
              Scientific Computing • AI Research • Enterprise Solutions
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between complex computational challenges and elegant software
            solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/portfolio"
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              View Portfolio
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/studio"
              className="group flex items-center gap-2 px-8 py-4 border border-border bg-background/50 backdrop-blur-sm rounded-lg font-medium text-lg text-foreground transition-all duration-300 hover:bg-background/80 hover:border-primary/50"
            >
              Explore Platforms
              <Code className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-8 text-muted-foreground">
            <Link
              to="/portfolio#about"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">About</span>
            </Link>
            <Link
              to="/portfolio#skills"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">Skills</span>
            </Link>
            <Link
              to="/portfolio#contact"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">Contact</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
