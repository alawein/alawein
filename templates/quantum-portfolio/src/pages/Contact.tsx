import { motion } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { QuantumButton } from "@/components/ui/quantum-button";

const contactInfo = [
  { icon: Mail, label: "Email", value: "contact@alawein.dev", href: "mailto:contact@alawein.dev" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA", href: "#" },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/alawein" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/alawein" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/alawein" },
];

export default function Contact() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">CONTACT</h1>
          <p className="text-muted-foreground font-mono">
            <span className="text-quantum-cyan">&gt;</span> Let's connect
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="quantum-border p-8 bg-quantum-dark/50"
          >
            <h2 className="text-xl font-bold mb-6 gradient-text">SEND MESSAGE</h2>
            <form className="space-y-6">
              <div>
                <label className="block font-mono text-sm text-quantum-purple mb-2">NAME</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-quantum-darker border border-quantum-purple/30 text-foreground font-mono text-sm focus:border-quantum-purple focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-mono text-sm text-quantum-purple mb-2">EMAIL</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-quantum-darker border border-quantum-purple/30 text-foreground font-mono text-sm focus:border-quantum-purple focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block font-mono text-sm text-quantum-purple mb-2">MESSAGE</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-quantum-darker border border-quantum-purple/30 text-foreground font-mono text-sm focus:border-quantum-purple focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <QuantumButton type="submit" className="w-full">
                TRANSMIT <Send className="h-4 w-4" />
              </QuantumButton>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="quantum-border p-6 bg-quantum-dark/50 flex items-center gap-4 group hover:bg-quantum-purple/5 transition-colors block"
                >
                  <info.icon className="h-6 w-6 text-quantum-purple group-hover:text-quantum-pink transition-colors" />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{info.label}</p>
                    <p className="text-foreground">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="quantum-border p-6 bg-quantum-dark/50">
              <h3 className="font-mono text-sm text-quantum-purple mb-4">CONNECT</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-quantum-purple/10 border border-quantum-purple/30 text-quantum-purple hover:bg-quantum-purple hover:text-white transition-colors"
                  >
                    <link.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="quantum-border p-6 bg-quantum-dark/50">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-quantum-cyan"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono text-sm text-muted-foreground">
                  Available for new opportunities
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

