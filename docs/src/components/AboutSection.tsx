import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-8 text-jules-cyan glitch-text"
            data-text="// About"
            style={{ textShadow: '0 0 20px hsl(var(--jules-cyan))' }}
          >
            {'// About'}
          </h2>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-mono">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              I'm a computational physicist and machine learning researcher pursuing my PhD at{' '}
              <span
                className="text-jules-magenta"
                style={{ textShadow: '0 0 8px hsl(var(--jules-magenta))' }}
              >
                UC Berkeley
              </span>
              . My work focuses on developing novel optimization algorithms and applying deep
              learning techniques to solve complex problems in particle physics.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              At the{' '}
              <span
                className="text-jules-yellow"
                style={{ textShadow: '0 0 8px hsl(var(--jules-yellow))' }}
              >
                ATLAS experiment
              </span>{' '}
              at CERN, I work on signal processing and event reconstruction, pushing the boundaries
              of what's possible with modern ML architectures in high-energy physics.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Beyond research, I'm passionate about building tools that make complex systems more
              accessible. From optimization libraries to fitness tracking apps, I believe in
              creating software that empowers people to achieve their goals.
            </motion.p>
          </div>

          {/* Current Focus */}
          <motion.div
            className="mt-12 p-6 border border-jules-green/20 bg-jules-green/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h3
              className="text-sm font-mono text-jules-green mb-4 uppercase tracking-wider"
              style={{ textShadow: '0 0 8px hsl(var(--jules-green))' }}
            >
              {'$ current_focus --list'}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { area: 'Research', desc: 'Quantum ML optimization', color: 'jules-cyan' },
                { area: 'Building', desc: 'Developer productivity tools', color: 'jules-magenta' },
                { area: 'Exploring', desc: 'GPU-accelerated simulations', color: 'jules-yellow' },
              ].map((item) => (
                <div key={item.area} className="space-y-1">
                  <span className={`text-xs font-mono text-${item.color}`}>{`> ${item.area}`}</span>
                  <p className="text-foreground font-mono text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
