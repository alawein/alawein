import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { href: '/', label: 'Home', isHash: false },
  { href: '#about', label: 'About', isHash: true },
  { href: '#skills', label: 'Skills', isHash: true },
  { href: '#contact', label: 'Contact', isHash: true },
  { href: '/studio', label: 'Platforms', isHash: false },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isHash: boolean
  ) => {
    e.preventDefault();
    if (isHash) {
      // Scroll to section on current page
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to route
      navigate(href);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0 bg-jules-dark/80 backdrop-blur-md border-b border-jules-cyan/10"
        style={{ opacity }}
      />

      <nav className="container relative px-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-lg font-bold font-mono text-jules-cyan"
          style={{ textShadow: '0 0 10px hsl(var(--jules-cyan))' }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          {'<MA/>'}
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href, link.isHash)}
              className="text-sm font-mono text-muted-foreground hover:text-jules-cyan transition-colors relative group"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-jules-cyan transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 8px hsl(var(--jules-cyan))' }}
              />
            </a>
          ))}
        </div>

        {/* Resume button */}
        <a
          href="/resume.pdf"
          className="px-4 py-2 text-sm font-mono rounded-full border border-jules-magenta/50 text-jules-magenta hover:bg-jules-magenta/10 transition-all"
          style={{ textShadow: '0 0 8px hsl(var(--jules-magenta))' }}
        >
          Resume
        </a>
      </nav>
    </motion.header>
  );
};

export default Navigation;
