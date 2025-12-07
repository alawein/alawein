import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DocsLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container flex">
        <Sidebar />
        <main className="flex-1 min-w-0 py-6 px-4 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

