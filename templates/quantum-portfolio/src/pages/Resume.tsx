import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Code } from "lucide-react";
import { Timeline } from "@/components/ui/Timeline";
import { QuantumSkillBar } from "@/components/ui/QuantumSkillBar";
import { HolographicCard } from "@/components/ui/HolographicCard";

const timelineItems = [
  {
    date: "2022 - Present",
    title: "Senior Software Engineer",
    company: "Tech Corp",
    description: "Leading development of AI-powered solutions and optimization systems. Architecting scalable platforms serving millions of users.",
  },
  {
    date: "2020 - 2022",
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    description: "Built scalable web applications and microservices architecture. Led team of 5 engineers on core product features.",
  },
  {
    date: "2018 - 2020",
    title: "Junior Developer",
    company: "Digital Agency",
    description: "Developed responsive web applications and e-commerce solutions for diverse clients.",
  },
];

const education = [
  {
    degree: "M.S. Computer Science",
    school: "University of Technology",
    period: "2018 - 2020",
    focus: "Machine Learning & Optimization",
  },
  {
    degree: "B.S. Computer Engineering",
    school: "State University",
    period: "2014 - 2018",
    focus: "Software Engineering",
  },
];

const skillBars = [
  { skill: "TypeScript / JavaScript", level: 95 },
  { skill: "React / Next.js", level: 92 },
  { skill: "Python", level: 88 },
  { skill: "Node.js / Express", level: 90 },
  { skill: "PostgreSQL / MongoDB", level: 85 },
  { skill: "AI / Machine Learning", level: 80 },
  { skill: "DevOps / Cloud", level: 75 },
  { skill: "Rust / Systems", level: 65 },
];

const skillCategories = [
  { category: "Languages", items: ["TypeScript", "Python", "Rust", "C++"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind", "Three.js"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
  { category: "AI/ML", items: ["PyTorch", "TensorFlow", "LangChain", "OpenAI"] },
];

export default function Resume() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">RESUME</h1>
          <p className="text-muted-foreground font-mono">
            <span className="text-quantum-cyan">&gt;</span> Experience & qualifications
          </p>
        </div>

        {/* Experience Timeline */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <Briefcase className="h-6 w-6 text-quantum-purple" />
            <span className="gradient-text">EXPERIENCE</span>
          </h2>
          <Timeline items={timelineItems} />
        </section>

        {/* Skills with Animated Bars */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <Code className="h-6 w-6 text-quantum-cyan" />
            <span className="gradient-text">SKILL LEVELS</span>
          </h2>
          <HolographicCard className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {skillBars.map((skill, index) => (
                <QuantumSkillBar
                  key={skill.skill}
                  skill={skill.skill}
                  level={skill.level}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </HolographicCard>
        </section>

        {/* Education */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <GraduationCap className="h-6 w-6 text-quantum-pink" />
            <span className="gradient-text">EDUCATION</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, i) => (
              <HolographicCard key={i} className="p-6">
                <h3 className="font-bold text-foreground">{edu.degree}</h3>
                <p className="text-quantum-cyan font-mono text-sm">{edu.school}</p>
                <p className="text-muted-foreground text-xs mt-1">{edu.period}</p>
                <p className="text-muted-foreground text-sm mt-3">Focus: {edu.focus}</p>
              </HolographicCard>
            ))}
          </div>
        </section>

        {/* Skill Categories */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <Code className="h-6 w-6 text-quantum-purple" />
            <span className="gradient-text">TECHNOLOGIES</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((skill) => (
              <HolographicCard key={skill.category} className="p-6">
                <h3 className="font-mono text-sm text-quantum-purple mb-4">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="px-2 py-1 text-xs bg-quantum-purple/10 text-foreground border border-quantum-purple/30 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </HolographicCard>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}

