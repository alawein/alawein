import { Book, Code, Terminal, HelpCircle, Copy, Check, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * TalAI Documentation
 * API Reference and Getting Started Guide
 * by Alawein Technologies LLC
 */

const CodeBlock = ({ code, language = 'typescript' }: { code: string; language?: string }) => {
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
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const sections = [
  { id: 'getting-started', label: 'Getting Started', icon: Book },
  { id: 'api-reference', label: 'API Reference', icon: Code },
  { id: 'examples', label: 'Code Examples', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">TALAI</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Learn how to use TalAI's AI research agents.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {activeSection === 'getting-started' && (
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with TalAI</CardTitle>
                  <CardDescription>Set up your first AI research agent in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install the SDK</h3>
                    <CodeBlock code="npm install @alawein/talai-sdk" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Initialize your agent</h3>
                    <CodeBlock code={`import { TalAI } from '@alawein/talai-sdk';\n\nconst agent = new TalAI({\n  apiKey: process.env.TALAI_API_KEY,\n  model: 'research-v2'\n});`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Run your first research task</h3>
                    <CodeBlock code={`const result = await agent.research({\n  topic: 'Quantum machine learning algorithms',\n  depth: 'comprehensive',\n  sources: ['arxiv', 'pubmed', 'semantic-scholar']\n});\n\nconsole.log(result.summary);`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'api-reference' && (
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>Complete API documentation for TalAI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">POST /api/tasks</h3>
                    <p className="text-muted-foreground">Create a new research task</p>
                    <CodeBlock code={`{\n  "topic": "string",\n  "depth": "quick" | "standard" | "comprehensive",\n  "sources": ["arxiv", "pubmed", ...],\n  "priority": "low" | "medium" | "high"\n}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">GET /api/agents</h3>
                    <p className="text-muted-foreground">List all available agents and their status</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">WebSocket /ws/tasks</h3>
                    <p className="text-muted-foreground">Real-time task progress updates</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'examples' && (
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Real-world usage patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Literature Review</h3>
                    <CodeBlock code={`const review = await agent.literatureReview({\n  query: 'transformer architectures',\n  yearRange: [2020, 2024],\n  maxPapers: 50\n});`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Code Analysis</h3>
                    <CodeBlock code={`const analysis = await agent.analyzeCode({\n  repo: 'https://github.com/example/project',\n  focus: ['performance', 'security']\n});`} />
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
                    { q: 'Agent not responding', a: 'Check your API key and network connection. Ensure the agent is in "active" status.' },
                    { q: 'Task stuck in queue', a: 'High priority tasks may be processed first. Try increasing priority or check agent availability.' },
                    { q: 'Rate limit exceeded', a: 'Upgrade your plan or implement exponential backoff in your requests.' },
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

