import { motion } from "framer-motion";
import { User, Briefcase, GraduationCap, Award } from "lucide-react";

const timeline = [
  {
    year: "2024",
    title: "Founder & Lead Developer",
    org: "Alawein Technologies LLC",
    description: "Building AI/ML platforms, optimization libraries, and SaaS products.",
    icon: Briefcase,
  },
  {
    year: "2023",
    title: "Senior Software Engineer",
    org: "Tech Company",
    description: "Led development of distributed systems and ML infrastructure.",
    icon: Briefcase,
  },
  {
    year: "2022",
    title: "M.S. Computer Science",
    org: "University",
    description: "Specialized in optimization algorithms and machine learning.",
    icon: GraduationCap,
  },
];

const stats = [
  { label: "PROJECTS", value: "50+" },
  { label: "COMMITS", value: "10K+" },
  { label: "COFFEE", value: "∞" },
];

export default function About() {
  return (
    <div className="container py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="font-mono text-sm text-cyber-neon/60 mb-2">
          <span className="text-cyber-pink">$</span> cat about.md
        </div>
        <h1 className="text-4xl md:text-5xl font-cyber font-bold text-white">
          <span className="text-cyber-neon">[</span>ABOUT<span className="text-cyber-neon">]</span>
        </h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-cyber-neon flex items-center justify-center bg-cyber-neon/10">
                <User className="h-10 w-10 text-cyber-neon" />
              </div>
              <div>
                <h2 className="font-cyber text-2xl text-white">ALAWEIN</h2>
                <p className="font-mono text-sm text-cyber-neon/60">Developer // Architect // Researcher</p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a full-stack developer and AI researcher passionate about building
                high-performance systems that push the boundaries of what's possible.
              </p>
              <p>
                My work spans optimization algorithms, machine learning infrastructure,
                and scalable SaaS platforms. I believe in writing clean, efficient code
                that solves real problems.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies,
                contributing to open source, or diving deep into research papers.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6">
            <h3 className="font-cyber text-xl text-white mb-6">
              <Award className="inline h-5 w-5 text-cyber-neon mr-2" />
              EXPERIENCE
            </h3>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded border border-cyber-neon/50 flex items-center justify-center bg-cyber-neon/10">
                      <item.icon className="h-5 w-5 text-cyber-neon" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-px h-full bg-cyber-neon/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="font-mono text-xs text-cyber-pink">{item.year}</span>
                    <h4 className="font-cyber text-white">{item.title}</h4>
                    <p className="text-sm text-cyber-neon/60">{item.org}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="cyber-border bg-cyber-dark/50 backdrop-blur-sm p-6 text-center"
            >
              <div className="font-cyber text-4xl text-cyber-neon neon-text mb-2">
                {stat.value}
              </div>
              <div className="font-mono text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

