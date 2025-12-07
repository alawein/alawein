import { Book, Code, Terminal, HelpCircle, Copy, Check, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * MEZAN Documentation
 * ML/AI DevOps Platform
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
  { id: 'pipelines', label: 'ML Pipelines', icon: Code },
  { id: 'registry', label: 'Model Registry', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Workflow className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">MEZAN</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">ML/AI DevOps platform for model lifecycle management.</p>
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
                  <CardTitle>Getting Started with MEZAN</CardTitle>
                  <CardDescription>Set up your ML DevOps workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install the CLI</h3>
                    <CodeBlock code="pip install mezan-cli" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Initialize project</h3>
                    <CodeBlock code={`mezan init my-ml-project\ncd my-ml-project\nmezan login`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Create a pipeline</h3>
                    <CodeBlock code={`# mezan.yaml\npipeline:\n  name: training-pipeline\n  stages:\n    - name: preprocess\n      script: scripts/preprocess.py\n    - name: train\n      script: scripts/train.py\n      gpu: true\n    - name: evaluate\n      script: scripts/evaluate.py`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'pipelines' && (
              <Card>
                <CardHeader>
                  <CardTitle>ML Pipelines</CardTitle>
                  <CardDescription>Define and run training pipelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Run a pipeline</h3>
                    <CodeBlock code={`mezan run training-pipeline\nmezan run training-pipeline --gpu a100`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Monitor progress</h3>
                    <CodeBlock code={`mezan logs training-pipeline --follow\nmezan status`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Parameterized runs</h3>
                    <CodeBlock code={`mezan run training-pipeline \\\n  --param learning_rate=0.001 \\\n  --param epochs=100`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'registry' && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Registry</CardTitle>
                  <CardDescription>Version and deploy models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Register a model</h3>
                    <CodeBlock code={`mezan model register \\\n  --name my-classifier \\\n  --version 1.0.0 \\\n  --path ./models/classifier.pt`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Deploy to production</h3>
                    <CodeBlock code={`mezan model deploy my-classifier:1.0.0 \\\n  --env production \\\n  --replicas 3`} />
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
                    { q: 'Pipeline fails at GPU stage', a: 'Ensure GPU quota is available. Check with: mezan quota' },
                    { q: 'Model deployment timeout', a: 'Increase health check timeout in deployment config.' },
                    { q: 'Cannot connect to registry', a: 'Verify credentials with: mezan auth status' },
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

