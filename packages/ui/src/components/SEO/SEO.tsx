/**
 * SEO Component
 *
 * Reusable SEO metadata component for all platforms.
 * Handles meta tags, Open Graph, Twitter Cards, and JSON-LD structured data.
 *
 * @example
 * ```tsx
 * <SEO
 *   title="Dashboard"
 *   description="Manage your projects and analytics"
 *   path="/dashboard"
 *   image="/og-dashboard.png"
 * />
 * ```
 */

import { useEffect } from 'react';

export interface SEOProps {
  /** Page title (will be appended with site name) */
  title: string;
  /** Page description for meta and OG */
  description?: string;
  /** Canonical path (without domain) */
  path?: string;
  /** OG/Twitter image URL */
  image?: string;
  /** Keywords for meta tag */
  keywords?: string[];
  /** Site name for OG */
  siteName?: string;
  /** Twitter handle (without @) */
  twitterHandle?: string;
  /** Page type for OG (default: website) */
  type?: 'website' | 'article' | 'product';
  /** Article metadata */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Product metadata */
  product?: {
    price?: number;
    currency?: string;
    availability?: 'in stock' | 'out of stock' | 'preorder';
  };
  /** JSON-LD structured data */
  jsonLd?: Record<string, unknown>;
  /** Disable indexing */
  noIndex?: boolean;
  /** Disable following links */
  noFollow?: boolean;
}

/**
 * Update or create a meta tag
 */
function setMeta(name: string, content: string, isProperty = false): void {
  const attr = isProperty ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Update or create a link tag
 */
function setLink(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Inject JSON-LD structured data
 */
function setJsonLd(data: Record<string, unknown>, id = 'seo-jsonld'): void {
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function SEO({
  title,
  description,
  path,
  image,
  keywords,
  siteName = 'Alawein',
  twitterHandle,
  type = 'website',
  article,
  product,
  jsonLd,
  noIndex = false,
  noFollow = false,
}: SEOProps): null {
  useEffect(() => {
    const fullTitle = `${title} | ${siteName}`;
    const url = path ? `${window.location.origin}${path}` : window.location.href;
    const imageUrl = image?.startsWith('http') ? image : image ? `${window.location.origin}${image}` : undefined;

    // Basic meta tags
    document.title = fullTitle;

    if (description) {
      setMeta('description', description);
    }

    if (keywords?.length) {
      setMeta('keywords', keywords.join(', '));
    }

    // Robots
    const robotsContent = [noIndex ? 'noindex' : 'index', noFollow ? 'nofollow' : 'follow'].join(', ');
    setMeta('robots', robotsContent);

    // Canonical URL
    setLink('canonical', url);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:type', type, true);
    setMeta('og:url', url, true);
    setMeta('og:site_name', siteName, true);

    if (description) {
      setMeta('og:description', description, true);
    }

    if (imageUrl) {
      setMeta('og:image', imageUrl, true);
    }

    // Article-specific OG tags
    if (type === 'article' && article) {
      if (article.publishedTime) {
        setMeta('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        setMeta('article:modified_time', article.modifiedTime, true);
      }
      if (article.author) {
        setMeta('article:author', article.author, true);
      }
      if (article.section) {
        setMeta('article:section', article.section, true);
      }
    }

    // Product-specific OG tags
    if (type === 'product' && product) {
      if (product.price !== undefined) {
        setMeta('product:price:amount', product.price.toString(), true);
      }
      if (product.currency) {
        setMeta('product:price:currency', product.currency, true);
      }
      if (product.availability) {
        setMeta('product:availability', product.availability, true);
      }
    }

    // Twitter Card
    setMeta('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', fullTitle);

    if (description) {
      setMeta('twitter:description', description);
    }

    if (imageUrl) {
      setMeta('twitter:image', imageUrl);
    }

    if (twitterHandle) {
      setMeta('twitter:site', `@${twitterHandle}`);
      setMeta('twitter:creator', `@${twitterHandle}`);
    }

    // JSON-LD structured data
    if (jsonLd) {
      setJsonLd(jsonLd);
    }
  }, [
    title,
    description,
    path,
    image,
    keywords,
    siteName,
    twitterHandle,
    type,
    article,
    product,
    jsonLd,
    noIndex,
    noFollow,
  ]);

  return null;
}

export default SEO;
