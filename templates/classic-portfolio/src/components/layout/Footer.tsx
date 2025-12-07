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
    <footer className="relative z-10 border-t border-white/5 glass-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ALAWEIN. All rights reserved.
          </p>

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
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

