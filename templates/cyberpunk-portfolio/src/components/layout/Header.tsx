import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "HOME", code: "01" },
  { path: "/projects", label: "PROJECTS", code: "02" },
  { path: "/about", label: "ABOUT", code: "03" },
  { path: "/contact", label: "CONTACT", code: "04" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-cyber-neon/20 bg-cyber-dark/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Terminal className="h-6 w-6 text-cyber-neon group-hover:animate-glitch" />
          <span className="font-cyber text-xl text-cyber-neon neon-text">
            ALAWEIN
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative font-mono text-sm tracking-wider transition-colors group",
                location.pathname === item.path
                  ? "text-cyber-neon"
                  : "text-muted-foreground hover:text-cyber-neon"
              )}
            >
              <span className="text-cyber-neon/50 mr-1">[{item.code}]</span>
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-cyber-neon shadow-[0_0_10px_#00ff9f]"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-cyber-neon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cyber-neon/20 overflow-hidden"
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block py-3 font-mono text-sm tracking-wider border-l-2 pl-4 transition-all",
                      location.pathname === item.path
                        ? "text-cyber-neon border-cyber-neon bg-cyber-neon/5"
                        : "text-muted-foreground border-transparent hover:text-cyber-neon hover:border-cyber-neon/50"
                    )}
                  >
                    <span className="text-cyber-neon/50 mr-2">[{item.code}]</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

