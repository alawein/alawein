import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { docsContent, docsSidebar } from '@/data/docs';
import { TableOfContents } from '@/components/layout/TableOfContents';

export default function DocsPage() {
  const { slug = 'introduction' } = useParams();
  const doc = docsContent[slug];

  // Get all docs in flat array for prev/next navigation
  const allDocs = docsSidebar.flatMap((section) => section.items);
  const currentIndex = allDocs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  if (!doc) {
    return <Navigate to="/docs/introduction" replace />;
  }

  // Convert markdown-like content to HTML (simplified)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          const text = line.slice(4);
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h3 key={i} id={id}>{text}</h3>;
        }
        if (line.startsWith('## ')) {
          const text = line.slice(3);
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h2 key={i} id={id}>{text}</h2>;
        }
        if (line.startsWith('# ')) {
          const text = line.slice(2);
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h1 key={i} id={id}>{text}</h1>;
        }
        // List items
        if (line.startsWith('- ')) {
          return <li key={i}>{line.slice(2)}</li>;
        }
        // Code blocks (simplified)
        if (line.startsWith('```')) {
          return null;
        }
        // Empty lines
        if (line.trim() === '') {
          return <br key={i} />;
        }
        // Regular paragraphs
        return <p key={i}>{line}</p>;
      })
      .filter(Boolean);
  };

  return (
    <div className="flex gap-8">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-w-0 prose max-w-none"
      >
        {renderContent(doc.content)}

        {/* Prev/Next Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t not-prose">
          {prevDoc ? (
            <Link
              to={`/docs/${prevDoc.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              <div>
                <p className="text-xs">Previous</p>
                <p className="font-medium">{prevDoc.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextDoc && (
            <Link
              to={`/docs/${nextDoc.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-right"
            >
              <div>
                <p className="text-xs">Next</p>
                <p className="font-medium">{nextDoc.title}</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.article>

      <TableOfContents content={doc.content} />
    </div>
  );
}

