import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { blogPosts } from '@/data/blog';

export default function BlogList() {
  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          The latest news, updates, and insights from our team.
        </p>
      </motion.div>

      {/* Featured Post */}
      {featuredPost && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="block p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors group"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              Featured
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(featuredPost.date), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {featuredPost.readTime}
              </span>
            </div>
          </Link>
        </motion.article>
      )}

      {/* Regular Posts */}
      <div className="space-y-6">
        {regularPosts.map((post, index) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block p-6 rounded-xl border hover:border-primary/40 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

