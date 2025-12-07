import { Book, Code, Terminal, HelpCircle, Copy, Check, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * Helios Documentation
 * HPC Cluster Management
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
  { id: 'nodes', label: 'Node Management', icon: Code },
  { id: 'jobs', label: 'Job Scheduling', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Server className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">HELIOS</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">HPC cluster management and job scheduling.</p>
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
                  <CardTitle>Getting Started with Helios</CardTitle>
                  <CardDescription>Manage HPC clusters efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install CLI</h3>
                    <CodeBlock code="pip install helios-hpc" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Connect to cluster</h3>
                    <CodeBlock code={`helios connect hpc.example.com\nhelios auth login`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Check cluster status</h3>
                    <CodeBlock code={`helios status\nhelios nodes list\nhelios queue`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'nodes' && (
              <Card>
                <CardHeader>
                  <CardTitle>Node Management</CardTitle>
                  <CardDescription>Monitor and manage compute nodes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">List nodes</h3>
                    <CodeBlock code={`helios nodes list\nhelios nodes list --partition gpu\nhelios nodes show node-001`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Node operations</h3>
                    <CodeBlock code={`helios nodes drain node-001 --reason "maintenance"\nhelios nodes resume node-001`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'jobs' && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Scheduling</CardTitle>
                  <CardDescription>Submit and manage jobs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Submit a job</h3>
                    <CodeBlock code={`helios submit job.sh \\\n  --nodes 4 \\\n  --gpus-per-node 2 \\\n  --time 24:00:00 \\\n  --partition gpu`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Monitor jobs</h3>
                    <CodeBlock code={`helios jobs list\nhelios jobs logs <job_id>\nhelios jobs cancel <job_id>`} />
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
                    { q: 'Job pending too long', a: 'Check resource availability: helios partitions show' },
                    { q: 'Node marked as down', a: 'Check node health: helios nodes diagnose <node>' },
                    { q: 'Authentication failed', a: 'Refresh credentials: helios auth refresh' },
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

