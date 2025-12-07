import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/alawein", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/alawein", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/alawein", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@alawein.dev", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-cyber-neon/20 bg-cyber-dark/80 backdrop-blur-xl">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Status indicator */}
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse" />
            <span className="text-cyber-neon/60">SYSTEM ONLINE</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">
              © {new Date().getFullYear()} ALAWEIN
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-cyber-neon transition-colors group"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_#00ff9f]" />
              </a>
            ))}
          </div>
        </div>

        {/* ASCII art divider */}
        <div className="mt-6 text-center font-mono text-xs text-cyber-neon/20 overflow-hidden">
          ═══════════════════════════════════════════════════════════════════
        </div>
      </div>
    </footer>
  );
}

