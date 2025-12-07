import { Book, Code, Terminal, HelpCircle, Copy, Check, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * LLMWorks Documentation
 * LLM Benchmarking Platform
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
  { id: 'benchmarks', label: 'Benchmark Suites', icon: Code },
  { id: 'api', label: 'API Reference', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">LLMWORKS</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">LLM benchmarking and evaluation platform.</p>
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
                  <CardTitle>Getting Started with LLMWorks</CardTitle>
                  <CardDescription>Benchmark and evaluate LLMs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install</h3>
                    <CodeBlock code="pip install llmworks" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Configure models</h3>
                    <CodeBlock code={`from llmworks import Evaluator\n\nevaluator = Evaluator()\nevaluator.add_model('gpt-4', api_key='...')\nevaluator.add_model('claude-3', api_key='...')`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Run benchmarks</h3>
                    <CodeBlock code={`results = evaluator.run(\n    benchmarks=['mmlu', 'humaneval', 'gsm8k'],\n    models=['gpt-4', 'claude-3']\n)\n\nprint(results.leaderboard())`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'benchmarks' && (
              <Card>
                <CardHeader>
                  <CardTitle>Benchmark Suites</CardTitle>
                  <CardDescription>Available evaluation benchmarks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'MMLU', desc: 'Massive Multitask Language Understanding - 57 subjects', tasks: '14,042' },
                    { name: 'HumanEval', desc: 'Code generation benchmark', tasks: '164' },
                    { name: 'GSM8K', desc: 'Grade school math word problems', tasks: '8,500' },
                    { name: 'TruthfulQA', desc: 'Truthfulness and factuality', tasks: '817' },
                    { name: 'HellaSwag', desc: 'Commonsense reasoning', tasks: '10,042' },
                  ].map((bench) => (
                    <div key={bench.name} className="p-4 rounded-lg bg-muted/50 border border-border flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-primary">{bench.name}</p>
                        <p className="text-sm text-muted-foreground">{bench.desc}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-accent">{bench.tasks} tasks</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'api' && (
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>Core API endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">POST /api/runs</h3>
                    <CodeBlock code={`{\n  "models": ["gpt-4", "claude-3"],\n  "benchmarks": ["mmlu"],\n  "config": {\n    "temperature": 0,\n    "max_tokens": 1024\n  }\n}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">GET /api/leaderboard</h3>
                    <p className="text-muted-foreground">Returns ranked model performance across all benchmarks.</p>
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
                    { q: 'Rate limit errors', a: 'Configure rate limiting: evaluator.set_rate_limit(requests_per_minute=60)' },
                    { q: 'Inconsistent results', a: 'Set temperature=0 for deterministic outputs.' },
                    { q: 'Benchmark download fails', a: 'Use offline mode: evaluator.load_benchmark("mmlu", offline=True)' },
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

