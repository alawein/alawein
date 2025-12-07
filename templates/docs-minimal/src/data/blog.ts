export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'introducing-v2',
    title: 'Introducing Version 2.0',
    excerpt: 'We are excited to announce the release of version 2.0 with major improvements and new features.',
    content: `
# Introducing Version 2.0

We're thrilled to announce the release of version 2.0, our biggest update yet!

## What's New

### Performance Improvements

We've completely rewritten our core engine, resulting in:

- **3x faster** API response times
- **50% reduction** in memory usage
- **99.99% uptime** guarantee

### New Features

- **Real-time Collaboration**: Work together with your team in real-time
- **Advanced Analytics**: Deep insights into your usage patterns
- **Custom Workflows**: Build automated workflows with our new visual editor

## Migration Guide

Upgrading from v1.x is straightforward. Check out our [migration guide](/docs/migration) for detailed instructions.

## Thank You

A huge thank you to our community for your feedback and support. This release wouldn't be possible without you!
    `,
    author: { name: 'Sarah Chen' },
    date: '2024-12-01',
    readTime: '5 min read',
    tags: ['Release', 'Product'],
    featured: true,
  },
  {
    slug: 'best-practices-2024',
    title: 'Best Practices for 2024',
    excerpt: 'Learn the top development practices that will help you build better applications this year.',
    content: `
# Best Practices for 2024

As we enter 2024, here are the development practices that will set you up for success.

## 1. Embrace TypeScript

TypeScript adoption continues to grow. If you haven't already, now is the time to make the switch.

## 2. Focus on Performance

Core Web Vitals matter more than ever. Optimize your:

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## 3. Security First

With increasing cyber threats, security should be built-in, not bolted-on.

## 4. AI-Assisted Development

Leverage AI tools to boost your productivity while maintaining code quality.

## Conclusion

Stay curious, keep learning, and build amazing things!
    `,
    author: { name: 'Michael Rodriguez' },
    date: '2024-11-15',
    readTime: '8 min read',
    tags: ['Best Practices', 'Development'],
  },
  {
    slug: 'scaling-to-millions',
    title: 'Scaling to Millions of Users',
    excerpt: 'A deep dive into how we scaled our infrastructure to handle millions of concurrent users.',
    content: `
# Scaling to Millions of Users

When we hit our first million users, we knew we needed to rethink our architecture.

## The Challenge

Our original setup couldn't handle the load. Response times were increasing, and errors were becoming more frequent.

## The Solution

### 1. Horizontal Scaling

We moved from vertical to horizontal scaling, adding more servers instead of bigger ones.

### 2. Caching Strategy

Implemented a multi-layer caching strategy:

- Edge caching with CDN
- Application-level caching with Redis
- Database query caching

### 3. Database Optimization

- Read replicas for query distribution
- Connection pooling
- Query optimization

## Results

After these changes:

- Response time: 200ms → 50ms
- Error rate: 2% → 0.01%
- Cost: 40% reduction

## Key Takeaways

Scale incrementally, measure everything, and always have a rollback plan.
    `,
    author: { name: 'Emily Watson' },
    date: '2024-11-01',
    readTime: '12 min read',
    tags: ['Engineering', 'Infrastructure'],
  },
];

