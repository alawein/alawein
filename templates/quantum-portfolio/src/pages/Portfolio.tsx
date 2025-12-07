import { motion } from "framer-motion";
import { ExternalLink, Github, Folder, Sparkles, Zap, Brain, Atom, Cpu, BarChart3 } from "lucide-react";
import { FlipCard } from "@/components/ui/FlipCard";
import { TiltCard } from "@/components/ui/TiltCard";

const projects = [
  {
    title: "QMLab",
    description: "Quantum computing simulation and visualization platform",
    details: "Simulate quantum circuits, visualize quantum states, and explore quantum algorithms with an intuitive interface.",
    tags: ["Python", "React", "Quantum"],
    github: "https://github.com/alawein/qmlab",
    demo: "#",
    icon: Atom,
    color: "quantum-purple",
  },
  {
    title: "Librex",
    description: "High-performance optimization solver library",
    details: "Solve complex optimization problems with parallel algorithms, from TSP to QAP and beyond.",
    tags: ["Python", "C++", "Algorithms"],
    github: "https://github.com/alawein/librex",
    demo: "#",
    icon: Zap,
    color: "quantum-pink",
  },
  {
    title: "TalAI",
    description: "AI-powered development assistant platform",
    details: "Intelligent code generation, review, and documentation powered by state-of-the-art language models.",
    tags: ["TypeScript", "AI/ML", "LLM"],
    github: "https://github.com/alawein/talai",
    demo: "#",
    icon: Brain,
    color: "quantum-cyan",
  },
  {
    title: "MEZAN",
    description: "ML/AI DevOps and experiment tracking platform",
    details: "Track experiments, manage models, and orchestrate ML pipelines with enterprise-grade tooling.",
    tags: ["Python", "MLOps", "DevOps"],
    github: "https://github.com/alawein/mezan",
    demo: "#",
    icon: Cpu,
    color: "quantum-purple",
  },
  {
    title: "SimCore",
    description: "Physics simulation engine with real-time visualization",
    details: "Real-time physics simulations with WebGL rendering for scientific visualization and gaming.",
    tags: ["TypeScript", "WebGL", "Physics"],
    github: "https://github.com/alawein/simcore",
    demo: "#",
    icon: Sparkles,
    color: "quantum-pink",
  },
  {
    title: "LLMWorks",
    description: "LLM benchmarking and evaluation toolkit",
    details: "Comprehensive benchmarking suite for evaluating and comparing language model performance.",
    tags: ["Python", "LLM", "Benchmarks"],
    github: "https://github.com/alawein/llmworks",
    demo: "#",
    icon: BarChart3,
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

        {/* Projects Grid with Flip Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FlipCard
                className="h-64"
                front={
                  <div className="h-full p-6 flex flex-col">
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <project.icon className={`h-10 w-10 text-${project.color}`} />
                      <div className="flex gap-3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-quantum-purple transition-colors z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="h-5 w-5" />
                        </a>
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-quantum-cyan transition-colors z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{project.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-mono bg-quantum-purple/10 text-quantum-purple border border-quantum-purple/30 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hover hint */}
                    <p className="text-xs text-muted-foreground/50 mt-2 text-center">Hover for details →</p>
                  </div>
                }
                back={
                  <div className="h-full p-6 flex flex-col justify-center items-center text-center">
                    <project.icon className={`h-12 w-12 text-${project.color} mb-4`} />
                    <h3 className="text-xl font-bold gradient-text mb-3">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">{project.details}</p>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-6">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-quantum-purple/20 text-quantum-purple border border-quantum-purple/50 rounded hover:bg-quantum-purple/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" /> Code
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-quantum-cyan/20 text-quantum-cyan border border-quantum-cyan/50 rounded hover:bg-quantum-cyan/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" /> Demo
                      </a>
                    </div>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

