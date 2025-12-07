import { motion } from 'framer-motion';
import { Microscope, Users, Calendar, ArrowRight, Beaker, Cpu, Atom, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dr. M. Alowein Research Areas
 * Academic Portfolio - Family Platform
 */
const researchAreas = [
  {
    icon: Brain,
    title: 'Machine Learning for Materials',
    description: 'Developing novel ML architectures for predicting material properties, crystal structures, and phase diagrams. Focus on graph neural networks and attention mechanisms.',
    projects: ['Crystal-GNN', 'PhasePredict', 'MatBERT'],
    funding: '$2.4M NSF Grant',
    team: 4,
  },
  {
    icon: Atom,
    title: 'Quantum Computing',
    description: 'Exploring quantum algorithms for molecular simulation, including VQE, QAOA, and quantum machine learning. Developing error-mitigation strategies for NISQ devices.',
    projects: ['QChem-Sim', 'NISQ-VQE', 'Quantum-ML'],
    funding: '$1.8M DOE Grant',
    team: 3,
  },
  {
    icon: Beaker,
    title: 'AI-Driven Drug Discovery',
    description: 'Applying deep learning to accelerate drug discovery pipelines. Generative models for molecule design, binding affinity prediction, and ADMET optimization.',
    projects: ['DrugGen', 'BindPredict', 'ToxScreen'],
    funding: '$3.1M NIH Grant',
    team: 5,
  },
  {
    icon: Cpu,
    title: 'High-Performance Computing',
    description: 'Developing scalable algorithms for scientific computing. GPU-accelerated simulations, distributed computing frameworks, and performance optimization.',
    projects: ['ParaSim', 'GPU-DFT', 'CloudHPC'],
    funding: '$1.2M Industry Partnership',
    team: 2,
  },
];

const currentProjects = [
  { name: 'Crystal-GNN 2.0', status: 'Active', deadline: 'Mar 2025', progress: 65 },
  { name: 'Quantum Drug Discovery', status: 'Active', deadline: 'Jun 2025', progress: 40 },
  { name: 'MatBERT Pre-training', status: 'Planning', deadline: 'Sep 2025', progress: 15 },
];

export default function Research() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Microscope className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">RESEARCH</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Research Program</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Our interdisciplinary research bridges computational science, machine learning, and quantum computing
          to solve fundamental problems in materials science and drug discovery.
        </p>
      </motion.div>

      {/* Research Areas */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {researchAreas.map((area, index) => (
          <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover-card">
            <area.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{area.title}</h3>
            <p className="text-muted-foreground mb-4">{area.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {area.projects.map((project) => (
                <span key={project} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{project}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
              <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-4 h-4" /> {area.team} members</span>
              <span className="text-primary font-medium">{area.funding}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Projects */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold mb-6">Active Projects</h2>
        <div className="glass-card p-6">
          <div className="space-y-6">
            {currentProjects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {project.status} • <Calendar className="w-3 h-3" /> {project.deadline}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} whileInView={{ width: `${project.progress}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Interested in Collaborating?</h2>
        <p className="text-muted-foreground mb-6">We're always looking for talented researchers and industry partners.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
          Get in Touch <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

