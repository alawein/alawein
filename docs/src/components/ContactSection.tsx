import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Copy, Check, Calendar, ArrowRight } from 'lucide-react';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);

  const email = 'meshal@berkeley.edu';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <div className="container px-4 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-jules-green glitch-text"
            data-text="// Let's Connect"
            style={{ textShadow: '0 0 20px hsl(var(--jules-green))' }}
          >
            {"// Let's Connect"}
          </h2>
          <p className="text-muted-foreground font-mono mx-auto mb-12 max-w-xl">
            {
              '// Interested in collaboration, research opportunities, or just want to chat about physics and code'
            }
          </p>

          {/* Email with copy */}
          <motion.div
            className="inline-flex items-center gap-4 p-4 border border-jules-cyan/20 bg-jules-cyan/5 rounded-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Mail className="w-5 h-5 text-jules-cyan" />
            <span className="font-mono text-jules-cyan">{email}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-jules-cyan/30 hover:bg-jules-cyan/10 transition-colors"
              aria-label="Copy email"
            >
              {copied ? (
                <Check className="w-4 h-4 text-jules-green" />
              ) : (
                <Copy className="w-4 h-4 text-jules-cyan" />
              )}
            </button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <a
              href="mailto:meshal@berkeley.edu"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono font-medium transition-all duration-300 bg-jules-magenta text-jules-dark hover:shadow-lg"
              style={{ boxShadow: '0 0 20px hsl(var(--jules-magenta) / 0.5)' }}
            >
              Send a Message
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono font-medium border border-jules-yellow/30 text-jules-yellow hover:bg-jules-yellow/10 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule a Call
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
