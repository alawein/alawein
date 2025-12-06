import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  return (
    <header
      className={`h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="container h-full flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          MateaHub
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/templates"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Templates
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
