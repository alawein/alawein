import { Github, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/alawein", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/alawein", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/alawein", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

