import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TimelineItem {
  date: string;
  title: string;
  company?: string;
  description: string;
  icon?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute left-4 md:left-1/2 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"
        style={{ transform: "translateX(-50%)" }}
      />

      {/* Timeline items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`relative flex items-center ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Content */}
            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}>
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-primary/50 transition-colors">
                {/* Date badge */}
                <motion.span
                  className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-primary/20 text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.date}
                </motion.span>

                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                {item.company && (
                  <p className="text-sm text-primary font-medium">{item.company}</p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>

            {/* Center node */}
            <motion.div
              className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center"
              style={{ transform: "translateX(-50%)" }}
              whileHover={{ scale: 1.2 }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                animate={{ opacity: [0.5, 0.2, 0.5], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Inner dot */}
              <div className="w-3 h-3 rounded-full bg-primary z-10" />
            </motion.div>

            {/* Spacer for other side */}
            <div className="hidden md:block w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

