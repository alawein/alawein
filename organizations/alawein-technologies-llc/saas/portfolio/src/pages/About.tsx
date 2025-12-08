import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">About Me</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            I'm a software engineer and AI/ML researcher passionate about building
            high-performance systems that solve complex real-world problems.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Background</h2>
            <p className="text-muted-foreground">
              With expertise spanning full-stack development, machine learning, and
              mathematical optimization, I focus on creating tools and platforms that
              push the boundaries of what's possible with modern computing.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Current Focus</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Building Librex - a high-performance optimization library with GPU acceleration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Developing MEZAN - an ML/AI DevOps platform for experiment tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Creating TalAI - an AI-powered personalized learning platform</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <p className="text-muted-foreground">Python, TypeScript, JavaScript, Rust, C++</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Frontend</h3>
                <p className="text-muted-foreground">React, Next.js, Vue, Tailwind CSS</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Backend</h3>
                <p className="text-muted-foreground">Node.js, FastAPI, Django, PostgreSQL</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">ML/AI</h3>
                <p className="text-muted-foreground">PyTorch, TensorFlow, JAX, LangChain</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">DevOps</h3>
                <p className="text-muted-foreground">Docker, Kubernetes, AWS, GCP</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Optimization</h3>
                <p className="text-muted-foreground">CUDA, Metaheuristics, Linear Programming</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Companies</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Alawein Technologies LLC</h3>
                <p className="text-sm text-muted-foreground">TalAI, Librex, MEZAN - AI/ML and optimization products</p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">REPZ LLC</h3>
                <p className="text-sm text-muted-foreground">Fitness technology and health applications</p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Live It Iconic LLC</h3>
                <p className="text-sm text-muted-foreground">E-commerce and lifestyle products</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

