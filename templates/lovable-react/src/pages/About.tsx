import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold">About</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-xl text-muted-foreground">
            This is a template for building modern web applications with a
            bidirectional workflow between Lovable.dev and your local IDE.
          </p>

          <h2 className="text-2xl font-semibold mt-8">The Workflow</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✦ Design UI components in Lovable.dev</li>
            <li>✦ Add business logic in your local IDE</li>
            <li>✦ Deploy automatically via Vercel</li>
            <li>✦ GitHub is the single source of truth</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Zustand", "TanStack Query", "Framer Motion"].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-lg bg-muted text-center text-sm"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

