import { Link } from "react-router-dom";
import { ArrowRight, Code, Cpu, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  { icon: Code, label: "Full-Stack Development", description: "React, TypeScript, Node.js, Python" },
  { icon: Cpu, label: "AI/ML Engineering", description: "PyTorch, TensorFlow, LLMs, MLOps" },
  { icon: Database, label: "Optimization", description: "Combinatorial, Metaheuristics, GPU" },
  { icon: Zap, label: "High Performance", description: "Distributed Systems, Real-time" },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Software Engineer &<br />
          <span className="text-primary">AI/ML Researcher</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Building high-performance systems at the intersection of software engineering,
          machine learning, and mathematical optimization.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View Projects <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-input px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </motion.section>

      {/* Skills Grid */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Core Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <skill.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{skill.label}</h3>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Librex", desc: "High-performance optimization library" },
            { name: "MEZAN", desc: "ML/AI DevOps platform" },
            { name: "TalAI", desc: "AI-powered learning platform" },
          ].map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-lg border bg-card hover:border-primary transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

