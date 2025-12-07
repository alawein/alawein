import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container pt-24 pb-16">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Available for new opportunities</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <motion.span 
              className="block text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Hi, I'm
            </motion.span>
            <motion.span 
              className="block gradient-text mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Developer Name
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-muted-foreground max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A passionate full-stack developer crafting beautiful, performant, 
            and user-centric digital experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/projects">
              <Button size="lg">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" /> Download CV
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "10+", label: "Technologies" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center hover-card"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

