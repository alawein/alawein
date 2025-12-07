import { Book, Code, Terminal, HelpCircle, Copy, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * Librex Documentation
 * Optimization Solver API Reference
 * by Alawein Technologies LLC
 */

const CodeBlock = ({ code, language = 'python' }: { code: string; language?: string }) => {
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
  { id: 'solvers', label: 'Solver Modules', icon: Code },
  { id: 'examples', label: 'Examples', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">LIBREX</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Optimization solver library for complex problems.</p>
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
                  <CardTitle>Getting Started with Librex</CardTitle>
                  <CardDescription>Install and configure the optimization solver</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install via pip</h3>
                    <CodeBlock code="pip install librex" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Import a solver module</h3>
                    <CodeBlock code={`from librex import Flow, Alloc, Sched\n\n# Network flow optimization\nsolver = Flow(method='min_cost')`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Define and solve</h3>
                    <CodeBlock code={`problem = solver.define(\n    nodes=['A', 'B', 'C', 'D'],\n    edges=[('A','B',10), ('B','C',5), ('C','D',8)],\n    source='A', sink='D'\n)\n\nresult = solver.solve(problem)\nprint(f"Max flow: {result.objective}")`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'solvers' && (
              <Card>
                <CardHeader>
                  <CardTitle>Solver Modules</CardTitle>
                  <CardDescription>Available optimization modules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Flow', desc: 'Network flow optimization (max-flow, min-cost flow)' },
                    { name: 'Alloc', desc: 'Resource allocation and assignment problems' },
                    { name: 'Sched', desc: 'Job scheduling and sequencing optimization' },
                    { name: 'Pack', desc: 'Bin packing and cutting stock problems' },
                    { name: 'Tour', desc: 'Vehicle routing and traveling salesman problems' },
                  ].map((mod) => (
                    <div key={mod.name} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="font-mono font-semibold text-primary">{mod.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'examples' && (
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Real-world optimization patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Resource Allocation</h3>
                    <CodeBlock code={`from librex import Alloc\n\nsolver = Alloc()\nresult = solver.assign(\n    workers=['W1', 'W2', 'W3'],\n    tasks=['T1', 'T2', 'T3'],\n    costs=[[5, 9, 1], [10, 3, 2], [8, 7, 4]]\n)`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Job Scheduling</h3>
                    <CodeBlock code={`from librex import Sched\n\nsolver = Sched(objective='minimize_makespan')\nresult = solver.schedule(\n    jobs=[{'id': 1, 'duration': 5}, {'id': 2, 'duration': 3}],\n    machines=2\n)`} />
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
                    { q: 'Solver returns infeasible', a: 'Check constraint bounds. Ensure problem is not over-constrained.' },
                    { q: 'Slow convergence', a: 'Try adjusting solver parameters: max_iter, tolerance, or use a different method.' },
                    { q: 'Memory issues on large problems', a: 'Enable sparse mode: solver.configure(sparse=True)' },
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

