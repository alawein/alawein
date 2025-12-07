import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Brain, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { QuantumButton } from "@/components/ui/quantum-button";

const features = [
  { icon: Code2, label: "Full-Stack Development", color: "quantum-purple" },
  { icon: Brain, label: "AI/ML Engineering", color: "quantum-pink" },
  { icon: Zap, label: "Optimization Algorithms", color: "quantum-cyan" },
  { icon: Sparkles, label: "System Architecture", color: "quantum-purple" },
];

export default function Home() {
  return (
    <div className="container pt-24 pb-16">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Terminal intro */}
          <motion.div 
            className="font-mono text-sm text-quantum-cyan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-quantum-pink">$</span> quantum.init()
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <motion.span 
              className="block gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              DEVELOPER
            </motion.span>
            <motion.span 
              className="block text-foreground/90 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              & <span className="text-quantum-pink text-glow-pink">ARCHITECT</span>
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Exploring the intersection of{" "}
            <span className="text-quantum-purple">quantum computing</span>,{" "}
            <span className="text-quantum-pink">artificial intelligence</span>, and{" "}
            <span className="text-quantum-cyan">elegant code</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/portfolio">
              <QuantumButton>
                VIEW PORTFOLIO <ArrowRight className="h-4 w-4" />
              </QuantumButton>
            </Link>
            <Link to="/contact">
              <QuantumButton variant="ghost">CONTACT ME</QuantumButton>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <motion.h2
          className="text-2xl font-mono text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-quantum-cyan">&lt;</span>
          <span className="gradient-text"> CAPABILITIES </span>
          <span className="text-quantum-cyan">/&gt;</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="quantum-border p-6 bg-quantum-dark/50 backdrop-blur-sm text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <feature.icon className={`h-10 w-10 text-${feature.color} group-hover:drop-shadow-[0_0_15px_currentColor]`} />
              </motion.div>
              <h3 className="font-mono text-sm text-foreground">{feature.label}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

