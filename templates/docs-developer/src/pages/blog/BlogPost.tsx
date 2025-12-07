import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { blogPosts } from '@/data/blog';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i}>{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i}>{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i}>{line.slice(2)}</h1>;
        }
        if (line.startsWith('- ')) {
          return <li key={i}>{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i}>{line}</p>;
      })
      .filter(Boolean);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
        </div>
      </motion.header>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose max-w-none"
      >
        {renderContent(post.content)}
      </motion.article>

      {/* Author bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 p-6 rounded-xl bg-muted/50 border"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-primary/30" />
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">Author</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

