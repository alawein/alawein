import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const MainLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
}: MainLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${className}`}>
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
