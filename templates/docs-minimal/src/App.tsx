import { Routes, Route } from 'react-router-dom';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { BlogLayout } from '@/components/layout/BlogLayout';
import Home from '@/pages/Home';
import DocsPage from '@/pages/docs/DocsPage';
import BlogList from '@/pages/blog/BlogList';
import BlogPost from '@/pages/blog/BlogPost';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs/*" element={<DocsLayout />}>
        <Route path=":slug" element={<DocsPage />} />
        <Route index element={<DocsPage />} />
      </Route>
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogList />} />
        <Route path=":slug" element={<BlogPost />} />
      </Route>
    </Routes>
  );
}

