import { ReactNode } from 'react';

interface SidebarProps {
  children?: ReactNode;
  className?: string;
}

const Sidebar = ({ children, className = '' }: SidebarProps) => {
  return (
    <aside className={`w-64 border-r border-border bg-card min-h-screen ${className}`}>
      <div className="p-4">
        {children || (
          <nav className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Navigation
            </p>
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
