import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    name: "Librex",
    description: "High-performance optimization library for combinatorial problems. Features GPU acceleration, parallel solving, and state-of-the-art metaheuristics.",
    tags: ["Python", "CUDA", "Optimization", "GPU"],
    github: "https://github.com/alawein/librex",
    demo: null,
  },
  {
    name: "MEZAN",
    description: "ML/AI DevOps platform for experiment tracking, model versioning, and deployment automation. MLflow-compatible API.",
    tags: ["Python", "MLOps", "Docker", "Kubernetes"],
    github: "https://github.com/alawein/mezan",
    demo: null,
  },
  {
    name: "TalAI",
    description: "AI-powered personalized learning platform with adaptive curriculum and intelligent tutoring systems.",
    tags: ["React", "TypeScript", "LLMs", "Education"],
    github: "https://github.com/alawein/talai",
    demo: "https://talai.dev",
  },
  {
    name: "REPZ",
    description: "Fitness tracking app with video exercise library, workout planning, and progress analytics.",
    tags: ["React Native", "TypeScript", "Fitness"],
    github: "https://github.com/alawein/repz",
    demo: null,
  },
  {
    name: "SimCore",
    description: "Physics simulation engine with offline support, real-time visualization, and educational tools.",
    tags: ["TypeScript", "WebGL", "Physics", "Education"],
    github: "https://github.com/alawein/simcore",
    demo: null,
  },
  {
    name: "QMLab",
    description: "Quantum computing simulation and visualization toolkit for education and research.",
    tags: ["Python", "Quantum", "Visualization"],
    github: "https://github.com/alawein/qmlab",
    demo: null,
  },
];

export default function Projects() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground mb-12">
          A collection of open-source projects and commercial products I've built.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                >
                  <Github className="h-4 w-4" /> Source
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" /> Demo
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

