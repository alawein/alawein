import { Book, Code, Terminal, HelpCircle, Copy, Check, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * SimCore Documentation
 * Scientific Computing Platform
 * by Alawein Technologies LLC
 */

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-foreground/90">{code}</code>
      </pre>
      <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const sections = [
  { id: 'getting-started', label: 'Getting Started', icon: Book },
  { id: 'simulations', label: 'Simulation Types', icon: Code },
  { id: 'hpc', label: 'HPC Integration', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">SIMCORE</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Scientific computing and simulation platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button key={section.id} onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === section.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {activeSection === 'getting-started' && (
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with SimCore</CardTitle>
                  <CardDescription>Run scientific simulations at scale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install</h3>
                    <CodeBlock code="pip install simcore" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Define a simulation</h3>
                    <CodeBlock code={`from simcore import Simulation, MolecularDynamics\n\nsim = Simulation(\n    engine=MolecularDynamics(),\n    system='water_box_1000',\n    timesteps=100000\n)`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Submit to cluster</h3>
                    <CodeBlock code={`job = sim.submit(\n    cluster='hpc-main',\n    nodes=4,\n    gpus_per_node=2\n)\n\nprint(f"Job ID: {job.id}")`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'simulations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Types</CardTitle>
                  <CardDescription>Supported simulation engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'MD', desc: 'Molecular Dynamics - atomic/molecular systems', engines: 'GROMACS, LAMMPS' },
                    { name: 'QMC', desc: 'Quantum Monte Carlo - electronic structure', engines: 'QMCPACK' },
                    { name: 'CFD', desc: 'Computational Fluid Dynamics', engines: 'OpenFOAM' },
                    { name: 'FEA', desc: 'Finite Element Analysis - structural mechanics', engines: 'FEniCS' },
                  ].map((sim) => (
                    <div key={sim.name} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-primary">{sim.name}</p>
                          <p className="text-sm text-muted-foreground">{sim.desc}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent">{sim.engines}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'hpc' && (
              <Card>
                <CardHeader>
                  <CardTitle>HPC Integration</CardTitle>
                  <CardDescription>Connect to compute clusters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Configure cluster</h3>
                    <CodeBlock code={`# ~/.simcore/clusters.yaml\nclusters:\n  hpc-main:\n    scheduler: slurm\n    host: hpc.example.com\n    partition: gpu\n    max_nodes: 64`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Monitor jobs</h3>
                    <CodeBlock code={`simcore jobs list\nsimcore jobs logs <job_id> --follow`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'troubleshooting' && (
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                  <CardDescription>Common issues and solutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { q: 'Job stuck in queue', a: 'Check cluster availability: simcore cluster status' },
                    { q: 'Simulation crashes', a: 'Review logs and reduce timestep or system size.' },
                    { q: 'Cannot connect to cluster', a: 'Verify SSH keys and cluster configuration.' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50">
                      <p className="font-medium">{item.q}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

