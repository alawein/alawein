import { FileCode, ExternalLink, Copy } from 'lucide-react'

const templates = [
  {
    id: 'product-landing',
    name: 'Product Landing',
    description: 'For active SPA products with features, tech stack, and CTAs.',
    bestFor: ['SimCore', 'QMLab', 'LLMWorks', 'Attributa', 'REPZ', 'LiveItIconic'],
    sections: ['Hero with CTAs', 'Feature grid', 'Tech stack panel', 'Auth info'],
    gradient: ['#22c55e', '#15803d'],
    path: '/pages/templates/product-landing.html',
  },
  {
    id: 'research-project',
    name: 'Research Project',
    description: 'For academic/research projects with publications and research areas.',
    bestFor: ['MagLogic', 'QMatSim', 'QubeML', 'SciComp', 'SpinCirc'],
    sections: ['Research hero', 'Research areas grid', 'Publications list', 'Project status'],
    gradient: ['#38bdf8', '#0284c7'],
    path: '/pages/templates/research-project.html',
  },
  {
    id: 'persona-page',
    name: 'Persona Page',
    description: 'For content creators, education personas, and personal brands.',
    bestFor: ['MeatheadPhysicist', 'Content personas'],
    sections: ['Centered hero with avatar', 'Content areas grid', 'Social links', 'Featured content'],
    gradient: ['#f97316', '#ea580c'],
    path: '/pages/templates/persona-page.html',
  },
  {
    id: 'family-site',
    name: 'Family Site',
    description: 'For planned family/personal projects with minimal content.',
    bestFor: ['DrMalawein', 'Rounaq', 'Family projects'],
    sections: ['Simple hero', 'Under development banner', 'Info cards', 'Contact section'],
    gradient: ['#a855f7', '#7c3aed'],
    path: '/pages/templates/family-site.html',
  },
]

function TemplateCard({ template }: { template: typeof templates[0] }) {
  const [from, to] = template.gradient

  return (
    <div
      className="group relative bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      style={{
        background: `linear-gradient(135deg, ${from}08, ${to}08)`,
      }}
    >
      {/* Preview header */}
      <div
        className="h-32 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${from}20, ${to}20)` }}
      >
        <FileCode className="w-12 h-12 text-muted-foreground/50" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {template.description}
        </p>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Best for:</p>
          <div className="flex flex-wrap gap-1.5">
            {template.bestFor.slice(0, 4).map((item) => (
              <span
                key={item}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Sections:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {template.sections.map((section) => (
              <li key={section} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/50" />
                {section}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border/30">
          <a
            href={`..${template.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`cp templates/${template.id}.html brands/newproject/index.html`)
            }}
            className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesHub() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Templates Hub</h1>
              <p className="text-muted-foreground">
                Reusable HTML templates for creating new brand pages, landing pages, and project sites.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{templates.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Templates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-card border border-border/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">How to Use Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">1</div>
              <h3 className="font-medium mb-1">Copy Template</h3>
              <p className="text-muted-foreground">
                Copy the template file to your new brand directory.
              </p>
              <code className="text-xs bg-muted/50 px-2 py-1 rounded mt-2 block">
                cp templates/product-landing.html brands/newproject/
              </code>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold mb-3">2</div>
              <h3 className="font-medium mb-1">Replace Placeholders</h3>
              <p className="text-muted-foreground">
                Replace <code className="text-xs bg-muted/50 px-1 rounded">{'{{PLACEHOLDER}}'}</code> values with your content.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold mb-3">3</div>
              <h3 className="font-medium mb-1">Customize</h3>
              <p className="text-muted-foreground">
                Override colors and add sections as needed. All templates use the shared design system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
