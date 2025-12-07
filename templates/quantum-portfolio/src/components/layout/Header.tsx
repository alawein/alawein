import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Atom } from "lucide-react";

const navLinks = [
  { path: "/", label: "HOME" },
  { path: "/portfolio", label: "PORTFOLIO" },
  { path: "/resume", label: "RESUME" },
  { path: "/contact", label: "CONTACT" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-quantum-darker/80 backdrop-blur-md border-b border-quantum-purple/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Atom className="h-8 w-8 text-quantum-purple group-hover:text-quantum-pink transition-colors" />
            </motion.div>
            <span className="font-bold text-xl gradient-text">QUANTUM</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative font-mono text-sm group"
              >
                <span className={`transition-colors ${
                  location.pathname === link.path 
                    ? 'text-quantum-purple text-glow-purple' 
                    : 'text-muted-foreground hover:text-quantum-purple'
                }`}>
                  {link.label}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-quantum-purple"
                    style={{ boxShadow: '0 0 10px hsl(271 91% 65%)' }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-quantum-purple hover:text-quantum-pink transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-quantum-purple/20"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-mono text-sm ${
                  location.pathname === link.path 
                    ? 'text-quantum-purple text-glow-purple' 
                    : 'text-muted-foreground'
                }`}
              >
                <span className="text-quantum-cyan mr-2">&gt;</span>
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;

