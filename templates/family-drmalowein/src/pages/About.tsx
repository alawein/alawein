import { motion } from "framer-motion";
import { Code2, Palette, Zap, Users } from "lucide-react";

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Figma"] },
  { category: "Soft Skills", items: ["Communication", "Problem Solving", "Leadership", "Teamwork"] },
];

const values = [
  { icon: Code2, title: "Clean Code", description: "Writing maintainable, readable, and efficient code" },
  { icon: Palette, title: "Design Focus", description: "Creating beautiful and intuitive user interfaces" },
  { icon: Zap, title: "Performance", description: "Optimizing for speed and user experience" },
  { icon: Users, title: "Collaboration", description: "Working effectively with teams and stakeholders" },
];

export default function About() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">About Me</h1>
          <p className="text-muted-foreground text-lg">
            Passionate about building digital products that make a difference
          </p>
        </div>

        {/* Bio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6">My Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              I'm a full-stack developer with over 5 years of experience building web applications 
              and digital products. My journey started with a curiosity about how things work on 
              the internet, which led me to learn programming and eventually pursue it as a career.
            </p>
            <p>
              Today, I specialize in building modern web applications using React, TypeScript, 
              and Node.js. I'm passionate about creating user-centric experiences that are both 
              beautiful and performant.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to 
              open-source projects, or sharing knowledge through blog posts and mentoring.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">What I Value</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center hover-card"
              >
                <value.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Skills & Technologies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-primary mb-4">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span 
                      key={item} 
                      className="px-3 py-1 text-sm bg-muted/50 rounded-full text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}

