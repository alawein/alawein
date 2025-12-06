import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const experience = [
  {
    title: 'Research Scientist',
    company: 'ATLAS Experiment, CERN',
    location: 'Geneva, Switzerland',
    period: '2022 - Present',
    description:
      'Leading ML pipeline development for particle collision analysis. Developed novel algorithms that improved signal detection by 23%.',
    skills: ['Python', 'TensorFlow', 'Spark', 'HPC'],
  },
  {
    title: 'Graduate Research Assistant',
    company: 'UC Berkeley Physics',
    location: 'Berkeley, CA',
    period: '2019 - 2022',
    description:
      'Conducted research on quantum entanglement properties and developed simulation tools for quantum systems.',
    skills: ['Quantum Computing', 'Julia', 'LaTeX', 'MATLAB'],
  },
  {
    title: 'Software Engineer Intern',
    company: 'Google Research',
    location: 'Mountain View, CA',
    period: 'Summer 2021',
    description:
      'Worked on quantum error correction algorithms and contributed to Cirq open-source library.',
    skills: ['Python', 'Cirq', 'Quantum Algorithms'],
  },
];

const education = [
  {
    degree: 'Ph.D. in Physics',
    school: 'University of California, Berkeley',
    period: '2019 - 2024',
    thesis: 'Quantum Entanglement in Many-Body Systems',
    gpa: '4.0',
  },
  {
    degree: 'B.S. in Physics & Computer Science',
    school: 'Massachusetts Institute of Technology',
    period: '2015 - 2019',
    honors: 'Summa Cum Laude',
    gpa: '4.0',
  },
];

const awards = [
  { title: 'NSF Graduate Research Fellowship', year: '2020' },
  { title: 'Berkeley Physics Department Award', year: '2021' },
  { title: 'Best Paper - Quantum Computing Conference', year: '2023' },
  { title: 'Google PhD Fellowship Finalist', year: '2022' },
];

const skills = {
  languages: ['Python', 'TypeScript', 'Julia', 'Rust', 'C++'],
  frameworks: ['React', 'TensorFlow', 'PyTorch', 'Next.js'],
  tools: ['Git', 'Docker', 'Kubernetes', 'AWS'],
  domains: ['Quantum Computing', 'Machine Learning', 'HPC', 'Data Science'],
};

const InteractiveResume = () => {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Header */}
      <header className="glass-card border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
          >
            ← Back to Portfolio
          </a>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold mb-2">Meshal Alawein</h1>
              <p className="text-xl text-quantum-purple font-mono mb-4">Computational Physicist</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Berkeley, California
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  meshal@berkeley.edu
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com/malawein" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href="https://linkedin.com/in/malawein"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button className="bg-quantum-purple hover:bg-quantum-purple/80">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            {/* Experience */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-quantum-purple" />
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((job, i) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card border-white/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-quantum-purple">{job.company}</p>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 md:mt-0 md:text-right">
                            <p className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {job.period}
                            </p>
                            <p>{job.location}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-quantum-purple" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.degree}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card border-white/10">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="text-quantum-purple">{edu.school}</p>
                            {edu.thesis && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Thesis: <em>{edu.thesis}</em>
                              </p>
                            )}
                            {edu.honors && (
                              <Badge className="mt-2 bg-plasma-pink/20 text-plasma-pink">
                                {edu.honors}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{edu.period}</p>
                            <p className="font-mono">GPA: {edu.gpa}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Skills</h3>
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <p className="text-xs font-mono text-muted-foreground uppercase mb-2">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {items.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Awards */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-quantum-purple" />
                  Awards
                </h3>
                <ul className="space-y-3">
                  {awards.map((award) => (
                    <li key={award.title} className="flex items-start justify-between">
                      <span className="text-sm">{award.title}</span>
                      <span className="text-xs font-mono text-muted-foreground">{award.year}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InteractiveResume;
