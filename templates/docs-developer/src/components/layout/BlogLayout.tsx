import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function BlogLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}

