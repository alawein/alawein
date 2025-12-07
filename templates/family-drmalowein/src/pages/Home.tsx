import { motion } from "framer-motion";
import { ArrowRight, Download, GraduationCap, BookOpen, Users, Award, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Dr. M. Alowein Academic Portfolio
 * Family Platforms - Academic Research & Teaching
 */
const recentPublications = [
  { title: "Machine Learning Applications in Materials Science", journal: "Nature Materials", year: 2024, citations: 45 },
  { title: "Quantum Computing for Molecular Simulation", journal: "Physical Review Letters", year: 2023, citations: 89 },
  { title: "AI-Driven Drug Discovery Pipeline", journal: "Science Advances", year: 2023, citations: 156 },
];

export default function Home() {
  return (
    <div className="container pt-24 pb-16">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Professor of Computational Science</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <motion.span className="block text-foreground" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Dr. M.</motion.span>
            <motion.span className="block gradient-text mt-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>Alowein</motion.span>
          </h1>

          <motion.p className="text-xl text-muted-foreground max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Advancing computational methods in materials science, quantum computing,
            and AI-driven research. Bridging theory and application.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Link to="/publications"><Button size="lg"><BookOpen className="mr-2 h-4 w-4" /> Publications <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Button variant="outline" size="lg"><Download className="mr-2 h-4 w-4" /> Download CV</Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "15+", label: "Years Research", icon: GraduationCap },
            { value: "87", label: "Publications", icon: FileText },
            { value: "2,400+", label: "Citations", icon: Award },
            { value: "24", label: "PhD Students", icon: Users },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center hover-card">
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-16">
        <h2 className="text-2xl font-bold mb-8">Recent Publications</h2>
        <div className="space-y-4">
          {recentPublications.map((pub, index) => (
            <motion.div key={pub.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-4 hover-card">
              <h3 className="font-semibold">{pub.title}</h3>
              <p className="text-sm text-muted-foreground">{pub.journal} • {pub.year} • {pub.citations} citations</p>
            </motion.div>
          ))}
        </div>
        <Link to="/publications" className="inline-flex items-center gap-1 mt-4 text-primary font-medium hover:underline">View all publications <ArrowRight className="w-4 h-4" /></Link>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="glass-card p-8 text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Interested in Collaboration?</h2>
          <p className="text-muted-foreground mb-6">Open to research collaborations, speaking engagements, and PhD supervision.</p>
          <Button size="lg"><Mail className="mr-2 h-4 w-4" /> Get in Touch</Button>
        </div>
      </section>
    </div>
  );
}

