import { Book, Code, Terminal, HelpCircle, Copy, Check, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * QAPLibria Documentation
 * Quadratic Assignment Problem Solver
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
  { id: 'qaplib', label: 'QAPLIB Benchmarks', icon: Code },
  { id: 'algorithms', label: 'Algorithms', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">QAPLIBRIA</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Quadratic Assignment Problem solver with QAPLIB benchmarks.</p>
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
                  <CardTitle>Getting Started with QAPLibria</CardTitle>
                  <CardDescription>Solve quadratic assignment problems efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install</h3>
                    <CodeBlock code="pip install qaplibria" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Load a QAPLIB instance</h3>
                    <CodeBlock code={`from qaplibria import QAP, load_qaplib\n\n# Load benchmark instance\nproblem = load_qaplib('nug12')\nprint(f"Size: {problem.n}x{problem.n}")`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Solve</h3>
                    <CodeBlock code={`solver = QAP(method='simulated_annealing')\nresult = solver.solve(problem)\n\nprint(f"Best cost: {result.cost}")\nprint(f"Assignment: {result.permutation}")`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'qaplib' && (
              <Card>
                <CardHeader>
                  <CardTitle>QAPLIB Benchmarks</CardTitle>
                  <CardDescription>Standard benchmark instances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'nug12-nug30', desc: 'Nugent instances (12-30 facilities)', difficulty: 'Easy-Medium' },
                    { name: 'chr12a-chr25a', desc: 'Christofides instances', difficulty: 'Medium' },
                    { name: 'tai20a-tai100a', desc: 'Taillard instances (20-100)', difficulty: 'Hard' },
                    { name: 'sko42-sko100', desc: 'Skorin-Kapov instances', difficulty: 'Very Hard' },
                  ].map((bench) => (
                    <div key={bench.name} className="p-4 rounded-lg bg-muted/50 border border-border flex justify-between items-center">
                      <div>
                        <p className="font-mono font-semibold text-primary">{bench.name}</p>
                        <p className="text-sm text-muted-foreground">{bench.desc}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-accent">{bench.difficulty}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'algorithms' && (
              <Card>
                <CardHeader>
                  <CardTitle>Algorithms</CardTitle>
                  <CardDescription>Available solving methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'simulated_annealing', desc: 'Probabilistic metaheuristic, good for large instances' },
                    { name: 'tabu_search', desc: 'Memory-based local search, avoids cycling' },
                    { name: 'genetic_algorithm', desc: 'Population-based evolutionary approach' },
                    { name: 'branch_and_bound', desc: 'Exact method for small instances (n ≤ 20)' },
                  ].map((algo) => (
                    <div key={algo.name} className="p-4 rounded-lg bg-muted/50">
                      <p className="font-mono font-semibold">{algo.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{algo.desc}</p>
                    </div>
                  ))}
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
                    { q: 'Solution quality is poor', a: 'Increase iterations or try a different algorithm. Hybrid methods often work best.' },
                    { q: 'Solver is too slow', a: 'For n > 50, use metaheuristics instead of exact methods.' },
                    { q: 'Cannot load QAPLIB file', a: 'Ensure file format matches QAPLIB standard. Use load_qaplib() for automatic parsing.' },
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

