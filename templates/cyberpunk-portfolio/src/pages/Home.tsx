import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { CyberButton } from "@/components/ui/cyber-button";

const skills = [
  { icon: Code2, label: "FULL-STACK", value: "95%" },
  { icon: Cpu, label: "AI/ML", value: "88%" },
  { icon: Zap, label: "OPTIMIZATION", value: "92%" },
];

export default function Home() {
  return (
    <div className="container py-16 md:py-24">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Terminal-style intro */}
          <div className="font-mono text-sm text-cyber-neon/60">
            <span className="text-cyber-pink">$</span> whoami
          </div>

          {/* Main heading with glitch effect */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-cyber font-bold">
            <span 
              className="glitch-text text-cyber-neon neon-text block"
              data-text="DEVELOPER"
            >
              DEVELOPER
            </span>
            <span className="text-white/90 block mt-2">
              & <span className="text-cyber-pink">ARCHITECT</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-body">
            Building the future with <span className="text-cyber-neon">code</span>,{" "}
            <span className="text-cyber-pink">AI</span>, and{" "}
            <span className="text-cyber-blue">optimization algorithms</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/projects">
              <CyberButton>
                VIEW PROJECTS <ArrowRight className="ml-2 h-4 w-4" />
              </CyberButton>
            </Link>
            <Link to="/contact">
              <CyberButton variant="ghost">CONTACT ME</CyberButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cyber-border p-6 bg-cyber-dark/50 backdrop-blur-sm group hover:bg-cyber-neon/5 transition-colors"
            >
              <skill.icon className="h-8 w-8 text-cyber-neon mb-4 group-hover:drop-shadow-[0_0_10px_#00ff9f]" />
              <h3 className="font-cyber text-lg text-white mb-2">{skill.label}</h3>
              <div className="w-full h-2 bg-cyber-dark border border-cyber-neon/30 overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-neon"
                  initial={{ width: 0 }}
                  whileInView={{ width: skill.value }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
              <span className="font-mono text-sm text-cyber-neon/60 mt-2 block">
                {skill.value}
              </span>
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

