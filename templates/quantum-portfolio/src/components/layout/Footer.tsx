import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Github, href: "https://github.com/alawein", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/alawein", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/alawein", label: "Twitter" },
  { icon: Mail, href: "mailto:contact@alawein.dev", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-quantum-purple/20 bg-quantum-darker/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="font-mono text-sm text-muted-foreground">
            <span className="text-quantum-purple">&lt;</span>
            {" "}© {new Date().getFullYear()} ALAWEIN{" "}
            <span className="text-quantum-purple">/&gt;</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-muted-foreground hover:text-quantum-purple transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <motion.div
              className="w-2 h-2 rounded-full bg-quantum-cyan"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            QUANTUM CORE: ONLINE
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

