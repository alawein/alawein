import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Star } from 'lucide-react';

const projects = [
  {
    name: 'Optilibria',
    description:
      'A high-performance optimization library for scientific computing. Features GPU-accelerated algorithms for large-scale convex and non-convex optimization problems.',
    tech: ['Python', 'CUDA', 'C++', 'JAX'],
    stars: 1247,
    github: 'https://github.com',
    demo: 'https://optilibria.dev',
    color: 'jules-cyan',
  },
  {
    name: 'ATLAS ML Pipeline',
    description:
      'Machine learning infrastructure for the ATLAS experiment at CERN. Real-time event classification and signal reconstruction using transformer architectures.',
    tech: ['PyTorch', 'C++', 'ROOT', 'Kubernetes'],
    stars: 892,
    github: 'https://github.com',
    color: 'jules-magenta',
  },
  {
    name: 'MeatheadPhysicist',
    description:
      'Evidence-based fitness tracking with physics-inspired progression algorithms. Combines biomechanics modeling with machine learning for personalized training.',
    tech: ['React', 'TypeScript', 'Python', 'TensorFlow'],
    stars: 634,
    github: 'https://github.com',
    demo: 'https://meatheadphysicist.app',
    color: 'jules-yellow',
  },
  {
    name: 'REPZCoach',
    description:
      'AI-powered coaching assistant that analyzes workout videos using computer vision. Provides real-time form feedback and tracks rep quality.',
    tech: ['Python', 'OpenCV', 'PyTorch', 'FastAPI'],
    stars: 421,
    github: 'https://github.com',
    demo: 'https://repzcoach.io',
    color: 'jules-green',
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-jules-yellow glitch-text"
            data-text="// Featured Projects"
            style={{ textShadow: '0 0 20px hsl(var(--jules-yellow))' }}
          >
            {'// Featured Projects'}
          </h2>
          <p className="text-muted-foreground font-mono mb-16">
            {"// Open source tools and applications I've built"}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.article
                key={project.name}
                className={`p-6 border border-${project.color}/20 bg-jules-dark/50 backdrop-blur-sm rounded-lg hover:border-${project.color}/50 transition-all`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      className={`text-xl font-bold text-${project.color}`}
                      style={{ textShadow: `0 0 10px hsl(var(--${project.color}))` }}
                    >
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-jules-yellow/80">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-mono">{project.stars.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg border border-${project.color}/30 hover:bg-${project.color}/10 transition-colors text-${project.color}`}
                      aria-label={`View ${project.name} on GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg border border-${project.color}/30 hover:bg-${project.color}/10 transition-colors text-${project.color}`}
                        aria-label={`View ${project.name} demo`}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed font-mono text-sm">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border border-${project.color}/20 text-${project.color}/80`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
