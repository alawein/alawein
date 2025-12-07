import { motion } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with cart, checkout, and payment integration",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    title: "Task Management App",
    description: "Collaborative task management with real-time updates and team features",
    tags: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    title: "AI Content Generator",
    description: "AI-powered content generation tool for marketing and social media",
    tags: ["Python", "FastAPI", "OpenAI", "React"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    title: "Portfolio Template",
    description: "Modern portfolio template with animations and dark mode",
    tags: ["React", "Tailwind", "Framer Motion"],
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with forecasts and location search",
    tags: ["React", "TypeScript", "Weather API"],
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    title: "Blog Platform",
    description: "Markdown-based blog platform with SEO optimization",
    tags: ["Next.js", "MDX", "Tailwind"],
    github: "#",
    demo: "#",
    featured: false,
  },
];

export default function Projects() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Projects</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A collection of projects I've worked on, from personal experiments to production applications
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden hover-card group"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <Folder className="h-8 w-8 text-primary" />
                  <div className="flex gap-3">
                    <a 
                      href={project.github} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a 
                      href={project.demo} 
                      className="text-muted-foreground hover:text-secondary transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

