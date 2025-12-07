import { motion } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";

const projects = [
  {
    title: "QMLab",
    description: "Quantum computing simulation and visualization platform",
    tags: ["Python", "React", "Quantum"],
    github: "https://github.com/alawein/qmlab",
    demo: "#",
    color: "quantum-purple",
  },
  {
    title: "Librex",
    description: "High-performance optimization solver library",
    tags: ["Python", "C++", "Algorithms"],
    github: "https://github.com/alawein/librex",
    demo: "#",
    color: "quantum-pink",
  },
  {
    title: "TalAI",
    description: "AI-powered development assistant platform",
    tags: ["TypeScript", "AI/ML", "LLM"],
    github: "https://github.com/alawein/talai",
    demo: "#",
    color: "quantum-cyan",
  },
  {
    title: "MEZAN",
    description: "ML/AI DevOps and experiment tracking platform",
    tags: ["Python", "MLOps", "DevOps"],
    github: "https://github.com/alawein/mezan",
    demo: "#",
    color: "quantum-purple",
  },
  {
    title: "SimCore",
    description: "Physics simulation engine with real-time visualization",
    tags: ["TypeScript", "WebGL", "Physics"],
    github: "https://github.com/alawein/simcore",
    demo: "#",
    color: "quantum-pink",
  },
  {
    title: "LLMWorks",
    description: "LLM benchmarking and evaluation toolkit",
    tags: ["Python", "LLM", "Benchmarks"],
    github: "https://github.com/alawein/llmworks",
    demo: "#",
    color: "quantum-cyan",
  },
];

export default function Portfolio() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">PORTFOLIO</h1>
          <p className="text-muted-foreground font-mono">
            <span className="text-quantum-cyan">&gt;</span> Projects that push boundaries
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="quantum-border bg-quantum-dark/50 backdrop-blur-sm overflow-hidden group"
            >
              {/* Header */}
              <div className="p-6 border-b border-quantum-purple/20">
                <div className="flex items-center justify-between mb-4">
                  <Folder className={`h-8 w-8 text-${project.color}`} />
                  <div className="flex gap-3">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-quantum-purple transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a 
                      href={project.demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-quantum-cyan transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-quantum-purple transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs font-mono bg-quantum-purple/10 text-quantum-purple border border-quantum-purple/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

