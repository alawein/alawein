import { motion } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

const projects = [
  {
    id: "librex",
    name: "LIBREX",
    tagline: "Optimization Engine",
    description: "High-performance optimization library for QAP, flow, and allocation problems.",
    tags: ["Python", "Rust", "CUDA"],
    color: "cyber-neon",
    github: "https://github.com/alawein/librex",
  },
  {
    id: "mezan",
    name: "MEZAN",
    tagline: "ML DevOps Platform",
    description: "End-to-end machine learning experiment tracking and deployment platform.",
    tags: ["Python", "React", "MLflow"],
    color: "cyber-pink",
    github: "https://github.com/alawein/mezan",
  },
  {
    id: "talai",
    name: "TALAI",
    tagline: "AI Research Framework",
    description: "Modular AI research platform with 40+ specialized modules.",
    tags: ["Python", "PyTorch", "Transformers"],
    color: "cyber-blue",
    github: "https://github.com/alawein/talai",
  },
  {
    id: "qmlab",
    name: "QMLAB",
    tagline: "Quantum Computing",
    description: "Quantum circuit simulation and visualization toolkit.",
    tags: ["TypeScript", "React", "Qiskit"],
    color: "cyber-purple",
    github: "https://github.com/alawein/qmlab",
  },
];

export default function Projects() {
  return (
    <div className="container py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="font-mono text-sm text-cyber-neon/60 mb-2">
          <span className="text-cyber-pink">$</span> ls -la projects/
        </div>
        <h1 className="text-4xl md:text-5xl font-cyber font-bold text-white">
          <span className="text-cyber-neon">[</span>PROJECTS<span className="text-cyber-neon">]</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          A collection of open-source tools, platforms, and research projects.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cyber-border bg-cyber-dark/50 backdrop-blur-sm group hover:bg-cyber-neon/5 transition-all duration-300"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Folder className={`h-8 w-8 text-${project.color} mb-2`} />
                  <h2 className="font-cyber text-2xl text-white group-hover:text-cyber-neon transition-colors">
                    {project.name}
                  </h2>
                  <p className="font-mono text-sm text-cyber-neon/60">{project.tagline}</p>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-cyber-neon transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-mono border border-cyber-neon/30 text-cyber-neon/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-cyber-neon/20 flex justify-end">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <CyberButton size="sm">
                  VIEW CODE <ExternalLink className="ml-2 h-3 w-3" />
                </CyberButton>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

