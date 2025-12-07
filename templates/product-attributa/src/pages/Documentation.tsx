import { Book, Code, Terminal, HelpCircle, Copy, Check, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';

/**
 * Attributa Documentation
 * Marketing Attribution Platform
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
  { id: 'tracking', label: 'Event Tracking', icon: Code },
  { id: 'models', label: 'Attribution Models', icon: Terminal },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">ATTRIBUTA</span>
        </div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Marketing attribution and analytics platform.</p>
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
                  <CardTitle>Getting Started with Attributa</CardTitle>
                  <CardDescription>Track and attribute marketing conversions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">1. Install tracking script</h3>
                    <CodeBlock code={`<script src="https://cdn.attributa.io/v1/tracker.js"></script>\n<script>\n  Attributa.init('YOUR_PROJECT_ID');\n</script>`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">2. Track page views</h3>
                    <CodeBlock code={`// Automatic page tracking\nAttributa.trackPageView();\n\n// Custom events\nAttributa.track('button_click', {\n  button_id: 'cta-hero'\n});`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">3. Track conversions</h3>
                    <CodeBlock code={`Attributa.trackConversion({\n  value: 99.99,\n  currency: 'USD',\n  order_id: 'ORD-12345'\n});`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'tracking' && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Tracking</CardTitle>
                  <CardDescription>Track user interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Standard events</h3>
                    <CodeBlock code={`Attributa.track('add_to_cart', { product_id: 'SKU-123' });\nAttributa.track('checkout_started');\nAttributa.track('purchase_complete', { value: 150 });`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">User identification</h3>
                    <CodeBlock code={`Attributa.identify('user_123', {\n  email: 'user@example.com',\n  plan: 'premium'\n});`} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'models' && (
              <Card>
                <CardHeader>
                  <CardTitle>Attribution Models</CardTitle>
                  <CardDescription>Available attribution methodologies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Last Touch', desc: '100% credit to final touchpoint' },
                    { name: 'First Touch', desc: '100% credit to first touchpoint' },
                    { name: 'Linear', desc: 'Equal credit across all touchpoints' },
                    { name: 'Time Decay', desc: 'More credit to recent touchpoints' },
                    { name: 'Data-Driven', desc: 'ML-based credit distribution' },
                  ].map((model) => (
                    <div key={model.name} className="p-4 rounded-lg bg-muted/50">
                      <p className="font-semibold text-primary">{model.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{model.desc}</p>
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
                    { q: 'Events not appearing', a: 'Check browser console for errors. Verify project ID is correct.' },
                    { q: 'Attribution mismatch', a: 'Ensure conversion tracking fires after user identification.' },
                    { q: 'Cross-domain tracking', a: 'Enable link decoration in project settings.' },
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

