import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Code2, Cpu, Zap, Terminal, Database, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CyberButton } from "@/components/ui/cyber-button";

const skills = [
  { icon: Code2, label: "FULL-STACK", value: 95, color: "cyber-neon" },
  { icon: Cpu, label: "AI/ML", value: 88, color: "cyber-pink" },
  { icon: Zap, label: "OPTIMIZATION", value: 92, color: "cyber-blue" },
  { icon: Database, label: "DATA SYSTEMS", value: 90, color: "cyber-neon" },
  { icon: Shield, label: "SECURITY", value: 85, color: "cyber-pink" },
  { icon: Terminal, label: "DEVOPS", value: 87, color: "cyber-blue" },
];

const typingTexts = [
  "FULL-STACK DEVELOPER",
  "AI/ML ENGINEER",
  "OPTIMIZATION SPECIALIST",
  "SYSTEM ARCHITECT",
];

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effect
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [5, -5]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Typing effect
  useEffect(() => {
    const targetText = typingTexts[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < targetText.length) {
        timeout = setTimeout(() => {
          setDisplayText(targetText.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTextIndex]);

  return (
    <div className="container py-16 md:py-24 relative">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="space-y-6"
        >
          {/* Terminal-style intro with typing effect */}
          <motion.div
            className="font-mono text-sm md:text-base"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <span className="text-cyber-pink">$</span>{" "}
            <span className="text-cyber-neon/60">whoami</span>
            <div className="mt-2 text-cyber-neon">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="ml-1 inline-block w-3 h-5 bg-cyber-neon"
              />
            </div>
          </motion.div>

          {/* Main heading with enhanced glitch effect */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-cyber font-bold"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span
              className="glitch-text text-cyber-neon neon-text block relative"
              data-text="DEVELOPER"
              whileHover={{ textShadow: "0 0 30px #00ff9f, 0 0 60px #00ff9f" }}
            >
              DEVELOPER
            </motion.span>
            <span className="text-white/90 block mt-2">
              & <motion.span
                  className="text-cyber-pink inline-block"
                  whileHover={{ scale: 1.1, textShadow: "0 0 20px #ff00ff" }}
                >ARCHITECT</motion.span>
            </span>
          </motion.h1>

          {/* Subtitle with staggered animation */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Building the future with{" "}
            <motion.span
              className="text-cyber-neon cursor-pointer"
              whileHover={{ scale: 1.1, textShadow: "0 0 15px #00ff9f" }}
            >code</motion.span>,{" "}
            <motion.span
              className="text-cyber-pink cursor-pointer"
              whileHover={{ scale: 1.1, textShadow: "0 0 15px #ff00ff" }}
            >AI</motion.span>, and{" "}
            <motion.span
              className="text-cyber-blue cursor-pointer"
              whileHover={{ scale: 1.1, textShadow: "0 0 15px #00d4ff" }}
            >optimization algorithms</motion.span>.
          </motion.p>

          {/* CTA Buttons with hover effects */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/projects">
              <CyberButton>
                VIEW PROJECTS <ArrowRight className="ml-2 h-4 w-4" />
              </CyberButton>
            </Link>
            <Link to="/contact">
              <CyberButton variant="ghost">CONTACT ME</CyberButton>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Skills Section - Enhanced Grid */}
      <section className="py-16">
        <motion.h2
          className="text-3xl font-cyber text-cyber-neon mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-cyber-pink">&lt;</span> CAPABILITIES <span className="text-cyber-pink">/&gt;</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: skill.color === 'cyber-neon'
                  ? '0 0 30px rgba(0, 255, 159, 0.3)'
                  : skill.color === 'cyber-pink'
                    ? '0 0 30px rgba(255, 0, 255, 0.3)'
                    : '0 0 30px rgba(0, 212, 255, 0.3)'
              }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              className="cyber-border p-6 bg-cyber-dark/50 backdrop-blur-sm group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <skill.icon className={`h-10 w-10 text-${skill.color} group-hover:drop-shadow-[0_0_15px_currentColor]`} />
                </motion.div>
                <span className={`font-mono text-xl font-bold text-${skill.color}`}>
                  {skill.value}%
                </span>
              </div>
              <h3 className="font-cyber text-lg text-white mb-3">{skill.label}</h3>
              <div className="w-full h-3 bg-cyber-darker border border-cyber-neon/20 overflow-hidden relative">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${skill.color} to-${skill.color}/50`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                />
                {/* Animated scanline */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Terminal Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="cyber-border bg-cyber-darker p-6 font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-cyber-neon/20">
            <span className="w-3 h-3 rounded-full bg-cyber-red" />
            <span className="w-3 h-3 rounded-full bg-cyber-yellow" />
            <span className="w-3 h-3 rounded-full bg-cyber-neon" />
            <span className="ml-4 text-muted-foreground">terminal@alawein</span>
          </div>
          <div className="space-y-2">
            <p><span className="text-cyber-pink">$</span> <span className="text-cyber-neon">cat</span> about.txt</p>
            <p className="text-muted-foreground pl-4">
              Full-stack developer specializing in AI/ML, optimization algorithms,
              and building scalable SaaS platforms.
            </p>
            <p><span className="text-cyber-pink">$</span> <span className="text-cyber-neon">ls</span> projects/</p>
            <p className="text-cyber-blue pl-4">librex/ mezan/ talai/ qmlab/ repz/</p>
            <p><span className="text-cyber-pink">$</span> <span className="animate-pulse">_</span></p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

