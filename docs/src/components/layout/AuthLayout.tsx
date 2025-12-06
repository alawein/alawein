import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {(title || subtitle) && (
          <div className="text-center space-y-2">
            {title && <h1 className="text-3xl font-bold text-foreground">{title}</h1>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
