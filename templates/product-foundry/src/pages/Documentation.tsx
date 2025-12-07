import { Book, Code, Terminal, HelpCircle, Copy, Check, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * Foundry Documentation
 * Product Incubator Platform
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
  { id: 'templates', label: 'Project Templates', icon: Code },
  { id: 'scaffolding', label: 'Scaffolding', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Hammer className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">FOUNDRY</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Product incubator and project scaffolding platform.</p>
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
                  <CardTitle>Getting Started with Foundry</CardTitle>
                  <CardDescription>Scaffold new projects quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install CLI</h3>
                    <CodeBlock code="npm install -g @alawein/foundry-cli" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Create a new project</h3>
                    <CodeBlock code={`foundry create my-project\n\n# Interactive prompts:\n# ? Select template: saas-dashboard\n# ? Select theme: quantum\n# ? Include auth: Yes`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Start development</h3>
                    <CodeBlock code={`cd my-project\nnpm install\nnpm run dev`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'templates' && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Templates</CardTitle>
                  <CardDescription>Available starter templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'saas-dashboard', desc: 'Full-featured SaaS dashboard with auth', stack: 'React, Supabase' },
                    { name: 'ecommerce', desc: 'E-commerce storefront with cart', stack: 'React, Stripe' },
                    { name: 'landing-page', desc: 'Marketing landing page', stack: 'React, Framer Motion' },
                    { name: 'docs-site', desc: 'Documentation website', stack: 'React, MDX' },
                    { name: 'api-service', desc: 'REST API backend', stack: 'Node, Express' },
                  ].map((tpl) => (
                    <div key={tpl.name} className="p-4 rounded-lg bg-muted/50 border border-border flex justify-between items-center">
                      <div>
                        <p className="font-mono font-semibold text-primary">{tpl.name}</p>
                        <p className="text-sm text-muted-foreground">{tpl.desc}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-accent">{tpl.stack}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'scaffolding' && (
              <Card>
                <CardHeader>
                  <CardTitle>Scaffolding Commands</CardTitle>
                  <CardDescription>Generate components and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Generate components</h3>
                    <CodeBlock code={`foundry generate component UserProfile\nfoundry generate page Dashboard\nfoundry generate hook useAuth`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Add features</h3>
                    <CodeBlock code={`foundry add auth\nfoundry add payments\nfoundry add analytics`} />
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
                    { q: 'Template not found', a: 'Update CLI: npm update -g @alawein/foundry-cli' },
                    { q: 'Dependency conflicts', a: 'Clear cache: foundry cache clear' },
                    { q: 'Build fails after scaffolding', a: 'Run: foundry doctor to diagnose issues' },
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

