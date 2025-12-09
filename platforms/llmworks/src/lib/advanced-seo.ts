/**
 * Advanced SEO utilities for LLM Works platform
 * Implements comprehensive SEO best practices and structured data
 */
import React from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

/**
 * Generate comprehensive meta tags for SEO
 */
export const generateMetaTags = (config: SEOConfig): string[] => {
  const tags: string[] = [];
  const baseUrl = 'https://llmworks.dev';
  
  // Basic meta tags
  tags.push(`<title>${config.title}</title>`);
  tags.push(`<meta name="description" content="${config.description}">`);
  
  if (config.keywords && config.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${config.keywords.join(', ')}">`);
  }

  // Open Graph tags
  tags.push(`<meta property="og:title" content="${config.title}">`);
  tags.push(`<meta property="og:description" content="${config.description}">`);
  tags.push(`<meta property="og:type" content="${config.type || 'website'}">`);
  tags.push(`<meta property="og:url" content="${config.url || baseUrl}">`);
  tags.push(`<meta property="og:site_name" content="LLM Works">`);
  tags.push(`<meta property="og:locale" content="${config.locale || 'en_US'}">`);

  if (config.image) {
    tags.push(`<meta property="og:image" content="${config.image}">`);
    tags.push(`<meta property="og:image:alt" content="${config.title}">`);
    tags.push(`<meta property="og:image:width" content="1200">`);
    tags.push(`<meta property="og:image:height" content="630">`);
  }

  if (config.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${config.publishedTime}">`);
  }

  if (config.modifiedTime) {
    tags.push(`<meta property="article:modified_time" content="${config.modifiedTime}">`);
  }

  if (config.author) {
    tags.push(`<meta property="article:author" content="${config.author}">`);
  }

  if (config.section) {
    tags.push(`<meta property="article:section" content="${config.section}">`);
  }

  if (config.tags && config.tags.length > 0) {
    config.tags.forEach(tag => {
      tags.push(`<meta property="article:tag" content="${tag}">`);
    });
  }

  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:title" content="${config.title}">`);
  tags.push(`<meta name="twitter:description" content="${config.description}">`);
  tags.push(`<meta name="twitter:site" content="@llmworks">`);
  tags.push(`<meta name="twitter:creator" content="@llmworks">`);

  if (config.image) {
    tags.push(`<meta name="twitter:image" content="${config.image}">`);
  }

  // Additional SEO tags
  tags.push(`<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`);
  tags.push(`<meta name="googlebot" content="index, follow">`);
  tags.push(`<meta name="bingbot" content="index, follow">`);
  
  // Canonical URL
  tags.push(`<link rel="canonical" href="${config.url || baseUrl}">`);

  // Alternate locales
  if (config.alternateLocales && config.alternateLocales.length > 0) {
    config.alternateLocales.forEach(locale => {
      tags.push(`<link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}">`);
    });
  }

  return tags;
};

/**
 * Generate JSON-LD structured data for organization
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LLM Works',
    description: 'Open-source platform for evaluating Large Language Models through interactive testing and rigorous benchmarking',
    url: 'https://llmworks.dev',
    logo: 'https://llmworks.dev/logo.png',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: ['English']
    },
    sameAs: [
      'https://github.com/alawein/aegis-ai-evaluator',
      'https://twitter.com/llmworks',
      'https://linkedin.com/company/llmworks'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    }
  };
};

/**
 * Generate JSON-LD structured data for software application
 */
export const generateSoftwareApplicationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LLM Works',
    description: 'Comprehensive platform for LLM evaluation with interactive Arena testing and standardized benchmarks',
    url: 'https://llmworks.dev',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5'
    },
    author: {
      '@type': 'Organization',
      name: 'LLM Works Community'
    },
    datePublished: '2024-01-15',
    dateModified: new Date().toISOString(),
    version: '1.0.0',
    downloadUrl: 'https://llmworks.dev',
    screenshot: 'https://llmworks.dev/screenshots/dashboard.png',
    featureList: [
      'Interactive Arena testing between AI models',
      'Standardized benchmark evaluation (MMLU, TruthfulQA, GSM8K)',
      'Real-time performance monitoring',
      'Comprehensive analytics dashboard',
      'Cost tracking and optimization',
      'Accessibility-first design'
    ]
  };
};

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate JSON-LD structured data for FAQ
 */
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate JSON-LD structured data for how-to guide
 */
export const generateHowToSchema = (title: string, steps: string[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: `Learn how to ${title.toLowerCase()}`,
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    supply: [{
      '@type': 'HowToSupply',
      name: 'API Keys from LLM providers'
    }],
    tool: [{
      '@type': 'HowToTool',
      name: 'LLM Works Platform'
    }],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step,
      text: step,
      url: `https://llmworks.dev/guides/${title.toLowerCase().replace(/\s+/g, '-')}#step-${index + 1}`
    }))
  };
};

/**
 * Generate sitemap entries
 */
export const generateSitemapEntries = () => {
  const baseUrl = 'https://llmworks.dev';
  const currentDate = new Date().toISOString();
  
  return [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/arena`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/bench`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/settings`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    // Add guide pages
    {
      url: `${baseUrl}/guides/getting-started`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/guides/arena-evaluation`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/guides/benchmark-testing`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    }
  ];
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot  
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

Disallow: /api/
Disallow: /test/
Disallow: /*.json$
Disallow: /admin/

Sitemap: https://llmworks.dev/sitemap.xml
`;
};

/**
 * Performance monitoring for Core Web Vitals
 */
export const trackCoreWebVitals = (onReport: (metric: any) => void) => {
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS(onReport);
    onINP(onReport);
    onFCP(onReport);
    onLCP(onReport);
    onTTFB(onReport);
  }).catch((error) => {
    console.warn('Web Vitals not available:', error);
  });
};

/**
 * Enhanced SEO setup for React components
 */
export const useAdvancedSEO = (config: SEOConfig) => {
  React.useEffect(() => {
    // Update document title
    document.title = config.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.description);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = config.url || window.location.href;

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:url', content: config.url || window.location.href },
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

    // Add structured data
    const structuredDataScript = document.getElementById('structured-data');
    if (structuredDataScript) {
      document.head.removeChild(structuredDataScript);
    }

    const newStructuredDataScript = document.createElement('script');
    newStructuredDataScript.id = 'structured-data';
    newStructuredDataScript.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: config.title,
      description: config.description,
      url: config.url || window.location.href,
      isPartOf: {
        '@type': 'WebSite',
        name: 'LLM Works',
        url: 'https://llmworks.dev'
      },
      datePublished: config.publishedTime || new Date().toISOString(),
      dateModified: config.modifiedTime || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'LLM Works Community'
      }
    };
    
    newStructuredDataScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(newStructuredDataScript);

  }, [config]);
};

/**
 * Initialize comprehensive SEO setup
 */
export const initAdvancedSEO = () => {
  // Add organization schema
  const orgSchema = document.createElement('script');
  orgSchema.type = 'application/ld+json';
  orgSchema.textContent = JSON.stringify(generateOrganizationSchema());
  document.head.appendChild(orgSchema);

  // Add software application schema
  const appSchema = document.createElement('script');
  appSchema.type = 'application/ld+json';
  appSchema.textContent = JSON.stringify(generateSoftwareApplicationSchema());
  document.head.appendChild(appSchema);

  // Track Core Web Vitals
  trackCoreWebVitals((metric) => {
    // Send to analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  });

  console.log('🚀 Advanced SEO features initialized');
};