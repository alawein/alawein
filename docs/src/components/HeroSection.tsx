import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import TerminalTyping from './TerminalTyping';

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'jules-cyan' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'jules-magenta' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'jules-yellow' },
  { icon: Mail, href: 'mailto:meshal@berkeley.edu', label: 'Email', color: 'jules-green' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Location badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-jules-green/30 bg-jules-green/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-4 h-4 text-jules-green" />
            <span className="text-sm font-mono text-jules-green">Berkeley, California</span>
          </motion.div>

          {/* Name with glitch effect */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span
              className="text-jules-cyan glitch-text"
              data-text="Meshal Alawein"
              style={{
                textShadow:
                  '0 0 30px hsl(var(--jules-cyan)), 0 0 60px hsl(var(--jules-cyan) / 0.5)',
              }}
            >
              Meshal Alawein
            </span>
          </motion.h1>

          {/* Title */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2
              className="text-xl md:text-2xl font-mono text-muted-foreground mb-4 glitch-text"
              data-text="Computational Physicist"
            >
              Computational Physicist
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Building the future at the intersection of{' '}
              <span
                className="text-jules-magenta font-medium glitch-text"
                data-text="physics"
                style={{ textShadow: '0 0 10px hsl(var(--jules-magenta))' }}
              >
                physics
              </span>
              ,{' '}
              <span
                className="text-jules-yellow font-medium glitch-text"
                data-text="AI"
                style={{ textShadow: '0 0 10px hsl(var(--jules-yellow))' }}
              >
                AI
              </span>
              , and{' '}
              <span
                className="text-jules-cyan font-medium glitch-text"
                data-text="optimization"
                style={{ textShadow: '0 0 10px hsl(var(--jules-cyan))' }}
              >
                optimization
              </span>
            </p>
          </motion.div>

          {/* Terminal typing animation */}
          <TerminalTyping />

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg border border-${link.color}/30 bg-${link.color}/5 text-${link.color} hover:bg-${link.color}/20 transition-all`}
                aria-label={link.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.5 },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-jules-cyan/30 flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-jules-cyan"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 8px hsl(var(--jules-cyan))' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
