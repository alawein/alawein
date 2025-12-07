import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Brain, Code2, Atom, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { QuantumButton } from "@/components/ui/quantum-button";
import { TiltCard } from "@/components/ui/TiltCard";
import { HolographicCard } from "@/components/ui/HolographicCard";
import { useEffect, useState } from "react";

const features = [
  { icon: Code2, label: "Full-Stack Development", description: "Modern web applications with React, Node.js, and cloud infrastructure", color: "quantum-purple" },
  { icon: Brain, label: "AI/ML Engineering", description: "Building intelligent systems with PyTorch, TensorFlow, and LLMs", color: "quantum-pink" },
  { icon: Zap, label: "Optimization Algorithms", description: "High-performance solvers for complex computational problems", color: "quantum-cyan" },
  { icon: Atom, label: "Quantum Computing", description: "Exploring quantum algorithms and quantum-classical hybrid systems", color: "quantum-purple" },
];

const titles = ["Developer", "Architect", "Engineer", "Researcher", "Creator"];

function useTypingAnimation(words: string[], typingSpeed = 100, pauseDuration = 2000) {
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentWord.length < word.length) {
          setCurrentWord(word.slice(0, currentWord.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentWord.length > 0) {
          setCurrentWord(currentWord.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentWord, isDeleting, wordIndex, words, typingSpeed, pauseDuration]);

  return currentWord;
}

export default function Home() {
  const typedTitle = useTypingAnimation(titles, 100, 2000);

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
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-1"
            >
              _
            </motion.span>
          </motion.div>

          {/* Main heading with typing animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <motion.span
              className="block gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {typedTitle.toUpperCase()}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-quantum-cyan"
              >
                |
              </motion.span>
            </motion.span>
            <motion.span
              className="block text-foreground/90 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              & <span className="text-quantum-pink text-glow-pink">INNOVATOR</span>
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

      {/* Features Section with TiltCards */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="p-6 text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4"
                  >
                    <feature.icon className={`h-12 w-12 text-${feature.color}`} style={{ filter: `drop-shadow(0 0 15px currentColor)` }} />
                  </motion.div>
                  <h3 className="font-bold text-foreground mb-2">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50+", label: "Projects", color: "quantum-purple" },
            { value: "10+", label: "Open Source", color: "quantum-pink" },
            { value: "5+", label: "Years Experience", color: "quantum-cyan" },
            { value: "∞", label: "Curiosity", color: "quantum-purple" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <HolographicCard className="p-6 text-center">
                <motion.p
                  className={`text-4xl md:text-5xl font-bold text-${stat.color}`}
                  animate={{ textShadow: [`0 0 20px currentColor`, `0 0 40px currentColor`, `0 0 20px currentColor`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2 font-mono">{stat.label}</p>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

