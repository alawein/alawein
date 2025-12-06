import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Python', 'TypeScript', 'C++', 'Julia', 'Rust', 'CUDA'],
    color: 'jules-cyan',
  },
  {
    title: 'Frameworks',
    skills: ['PyTorch', 'TensorFlow', 'React', 'Next.js', 'FastAPI', 'JAX'],
    color: 'jules-magenta',
  },
  {
    title: 'Tools',
    skills: ['Docker', 'Kubernetes', 'Git', 'AWS', 'Linux', 'PostgreSQL'],
    color: 'jules-yellow',
  },
  {
    title: 'Domains',
    skills: [
      'Machine Learning',
      'Optimization',
      'Physics Simulation',
      'Data Analysis',
      'HPC',
      'Scientific Computing',
    ],
    color: 'jules-green',
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      <div className="container px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-jules-magenta glitch-text"
            data-text="// Skills & Expertise"
            style={{ textShadow: '0 0 20px hsl(var(--jules-magenta))' }}
          >
            {'// Skills & Expertise'}
          </h2>
          <p className="text-muted-foreground font-mono mb-16">
            {'// Technologies and domains I work with regularly'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className={`p-6 border border-${category.color}/20 bg-${category.color}/5 rounded-lg`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + categoryIndex * 0.1, duration: 0.6 }}
              >
                <h3
                  className={`text-sm font-mono text-${category.color} mb-4 uppercase tracking-wider`}
                  style={{ textShadow: `0 0 8px hsl(var(--${category.color}))` }}
                >
                  {`$ ${category.title.toLowerCase()} --list`}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      className={`px-3 py-1.5 text-sm font-mono rounded-full border border-${category.color}/30 text-${category.color} bg-${category.color}/10`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        delay: 0.4 + categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 0.4,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
