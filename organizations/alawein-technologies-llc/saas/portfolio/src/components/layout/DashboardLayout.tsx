import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  showSidebar?: boolean;
}

const DashboardLayout = ({
  children,
  sidebarContent,
  showSidebar = true,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      {showSidebar && <Sidebar>{sidebarContent}</Sidebar>}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
