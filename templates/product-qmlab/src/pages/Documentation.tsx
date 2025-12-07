import { Book, Code, Terminal, HelpCircle, Copy, Check, Atom } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * QMLab Documentation
 * Quantum Simulation Workbench
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
  { id: 'circuits', label: 'Quantum Circuits', icon: Code },
  { id: 'gates', label: 'Gate Reference', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Atom className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">QMLAB</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Quantum simulation and circuit design workbench.</p>
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
                  <CardTitle>Getting Started with QMLab</CardTitle>
                  <CardDescription>Build and simulate quantum circuits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install</h3>
                    <CodeBlock code="pip install qmlab" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Create a circuit</h3>
                    <CodeBlock code={`from qmlab import Circuit\n\nqc = Circuit(2)  # 2 qubits\nqc.h(0)          # Hadamard on qubit 0\nqc.cx(0, 1)      # CNOT: control=0, target=1`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Simulate</h3>
                    <CodeBlock code={`from qmlab import Simulator\n\nsim = Simulator(backend='statevector')\nresult = sim.run(qc, shots=1000)\n\nprint(result.counts)  # {'00': 502, '11': 498}`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'circuits' && (
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Circuits</CardTitle>
                  <CardDescription>Building and manipulating circuits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Bell State</h3>
                    <CodeBlock code={`qc = Circuit(2)\nqc.h(0)\nqc.cx(0, 1)\n# Creates |Φ+⟩ = (|00⟩ + |11⟩)/√2`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">GHZ State</h3>
                    <CodeBlock code={`qc = Circuit(3)\nqc.h(0)\nqc.cx(0, 1)\nqc.cx(1, 2)\n# Creates (|000⟩ + |111⟩)/√2`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Quantum Fourier Transform</h3>
                    <CodeBlock code={`from qmlab.algorithms import QFT\n\nqc = Circuit(4)\nqc.append(QFT(4))`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'gates' && (
              <Card>
                <CardHeader>
                  <CardTitle>Gate Reference</CardTitle>
                  <CardDescription>Available quantum gates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'H', desc: 'Hadamard - creates superposition' },
                    { name: 'X, Y, Z', desc: 'Pauli gates - bit/phase flips' },
                    { name: 'CX (CNOT)', desc: 'Controlled-NOT - entanglement' },
                    { name: 'RX, RY, RZ', desc: 'Rotation gates - parameterized' },
                    { name: 'T, S', desc: 'Phase gates - T=π/4, S=π/2' },
                    { name: 'SWAP', desc: 'Swaps two qubit states' },
                  ].map((gate) => (
                    <div key={gate.name} className="p-3 rounded-lg bg-muted/50 flex items-center gap-4">
                      <span className="font-mono font-bold text-primary w-20">{gate.name}</span>
                      <span className="text-sm text-muted-foreground">{gate.desc}</span>
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
                    { q: 'Simulation is slow', a: 'For >20 qubits, use tensor network backend: Simulator(backend="mps")' },
                    { q: 'Results don\'t match theory', a: 'Check gate ordering. QMLab uses little-endian qubit ordering.' },
                    { q: 'Memory error', a: 'Statevector grows as 2^n. Use sampling mode for large circuits.' },
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

