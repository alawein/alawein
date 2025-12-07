import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Code } from "lucide-react";

const experience = [
  {
    title: "Senior Software Engineer",
    company: "Tech Corp",
    period: "2022 - Present",
    description: "Leading development of AI-powered solutions and optimization systems.",
  },
  {
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Built scalable web applications and microservices architecture.",
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

const skills = [
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
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">RESUME</h1>
          <p className="text-muted-foreground font-mono">
            <span className="text-quantum-cyan">&gt;</span> Experience & qualifications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <Briefcase className="h-6 w-6 text-quantum-purple" />
              <span className="gradient-text">EXPERIENCE</span>
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="quantum-border p-6 bg-quantum-dark/50">
                <h3 className="font-bold text-foreground">{exp.title}</h3>
                <p className="text-quantum-pink font-mono text-sm">{exp.company}</p>
                <p className="text-muted-foreground text-xs mt-1">{exp.period}</p>
                <p className="text-muted-foreground text-sm mt-3">{exp.description}</p>
              </div>
            ))}
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <GraduationCap className="h-6 w-6 text-quantum-pink" />
              <span className="gradient-text">EDUCATION</span>
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="quantum-border p-6 bg-quantum-dark/50">
                <h3 className="font-bold text-foreground">{edu.degree}</h3>
                <p className="text-quantum-cyan font-mono text-sm">{edu.school}</p>
                <p className="text-muted-foreground text-xs mt-1">{edu.period}</p>
                <p className="text-muted-foreground text-sm mt-3">Focus: {edu.focus}</p>
              </div>
            ))}
          </motion.section>
        </div>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <Code className="h-6 w-6 text-quantum-cyan" />
            <span className="gradient-text">SKILLS</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill.category} className="quantum-border p-6 bg-quantum-dark/50">
                <h3 className="font-mono text-sm text-quantum-purple mb-4">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="px-2 py-1 text-xs bg-quantum-purple/10 text-foreground border border-quantum-purple/30">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

