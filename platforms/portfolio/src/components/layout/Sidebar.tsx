import { ReactNode } from 'react';

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <aside className="w-64 border-r bg-card hidden lg:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;

