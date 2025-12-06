interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  return (
    <footer className={`py-6 border-t border-border bg-background ${className}`}>
      <div className="container text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MateaHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
