/**
 * Nexus Server-Side Rendering (SSR) Implementation
 * Provides SSR capabilities for Nexus applications
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { NexusConfig } from '@nexus/shared';

export interface SSROptions {
  url: string;
  config: NexusConfig;
  initialState?: any;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export interface SSRResult {
  html: string;
  css?: string;
  initialState: any;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

/**
 * Render a React component to HTML string with SSR
 */
export async function renderSSR(
  component: React.ReactElement,
  options: SSROptions
): Promise<SSRResult> {
  const { url, config, initialState = {}, meta = {} } = options;

  // Extract data for the component if needed
  const data = await extractComponentData(component, url);

  // Merge initial state
  const mergedState = { ...initialState, ...data };

  // Render component to string
  const appHtml = renderToString(
    <StaticRouter location={url}>
      {component}
    </StaticRouter>
  );

  // Extract critical CSS if using CSS-in-JS
  const css = await extractCriticalCSS(component);

  // Generate meta tags
  const metaTags = generateMetaTags({
    title: meta.title || config.platform.name,
    description: meta.description || config.platform.description,
    keywords: meta.keywords || '',
  });

  // Create full HTML document
  const html = createHTMLDocument({
    appHtml,
    css,
    initialState: mergedState,
    metaTags,
    config,
  });

  return {
    html,
    css,
    initialState: mergedState,
    meta: {
      title: meta.title || config.platform.name,
      description: meta.description || config.platform.description,
      keywords: meta.keywords || '',
    },
  };
}

/**
 * Extract data for server-side rendering
 */
async function extractComponentData(
  component: React.ReactElement,
  url: string
): Promise<any> {
  // Check if component has getServerSideProps
  if (component.type && 'getServerSideProps' in component.type) {
    const gssp = (component.type as any).getServerSideProps;
    const result = await gssp({ url });
    return result.props || {};
  }

  // Check for data requirements in component
  const dataRequirements = extractDataRequirements(component);
  if (dataRequirements.length > 0) {
    return await fetchDataRequirements(dataRequirements, url);
  }

  return {};
}

/**
 * Extract critical CSS for SSR
 */
async function extractCriticalCSS(
  component: React.ReactElement
): Promise<string | undefined> {
  // This would integrate with your CSS-in-JS solution
  // For now, return undefined
  return undefined;
}

/**
 * Generate meta tags for SEO
 */
function generateMetaTags(meta: {
  title: string;
  description: string;
  keywords: string;
}): string {
  return `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
  `;
}

/**
 * Create full HTML document
 */
function createHTMLDocument({
  appHtml,
  css,
  initialState,
  metaTags,
  config,
}: {
  appHtml: string;
  css?: string;
  initialState: any;
  metaTags: string;
  config: NexusConfig;
}): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${metaTags}
      ${css ? `<style id="critical-css">${css}</style>` : ''}
      <script>
        window.__NEXUS_STATE__ = ${JSON.stringify(initialState)};
        window.__NEXUS_CONFIG__ = ${JSON.stringify(config)};
      </script>
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script src="/static/js/bundle.js"></script>
    </body>
    </html>
  `;
}

/**
 * SSR Middleware for Express/Nexus server
 */
export function createSSRMiddleware(config: NexusConfig) {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if this route should be SSR
      if (shouldSSR(req.path, config)) {
        const component = await getComponentForRoute(req.path);

        if (component) {
          const result = await renderSSR(component, {
            url: req.url,
            config,
            meta: extractMetaFromRoute(req),
          });

          // Set caching headers
          res.set('Cache-Control', 'public, max-age=0, must-revalidate');
          res.set('X-Nexus-SSR', 'true');

          return res.send(result.html);
        }
      }

      next();
    } catch (error) {
      console.error('SSR Error:', error);
      next();
    }
  };
}

/**
 * Check if route should use SSR
 */
function shouldSSR(path: string, config: NexusConfig): boolean {
  // Skip static assets
  if (path.startsWith('/static/') || path.startsWith('/api/')) {
    return false;
  }

  // Check config for SSR settings
  if (config.ssr?.exclude?.some(pattern => path.match(pattern))) {
    return false;
  }

  if (config.ssr?.include?.some(pattern => path.match(pattern))) {
    return true;
  }

  // Default to true for HTML routes
  return !path.includes('.');
}

/**
 * Get component for route
 */
async function getComponentForRoute(path: string): Promise<React.ReactElement | null> {
  // This would map routes to components
  // For now, return null
  return null;
}

/**
 * Extract meta from route
 */
function extractMetaFromRoute(req: any): {
  title?: string;
  description?: string;
  keywords?: string;
} {
  // Extract meta from route config or component
  return {};
}

/**
 * Extract data requirements from component tree
 */
function extractDataRequirements(
  component: React.ReactElement
): string[] {
  // This would walk the component tree and find data requirements
  return [];
}

/**
 * Fetch data requirements
 */
async function fetchDataRequirements(
  requirements: string[],
  url: string
): Promise<any> {
  // This would fetch all required data
  return {};
}

/**
 * SSR Cache
 */
export class SSRCache {
  private cache = new Map<string, { html: string; timestamp: number }>();
  private ttl: number;

  constructor(ttl = 60000) {
    this.ttl = ttl;
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.html;
  }

  set(key: string, html: string): void {
    this.cache.set(key, { html, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Default cache instance
export const ssrCache = new SSRCache();

/**
 * Cached SSR rendering
 */
export async function renderSSRWithCache(
  component: React.ReactElement,
  options: SSROptions
): Promise<SSRResult> {
  const cacheKey = `${options.url}-${JSON.stringify(options.meta)}`;

  // Check cache
  const cached = ssrCache.get(cacheKey);
  if (cached) {
    return {
      html: cached,
      initialState: options.initialState || {},
      meta: {
        title: options.meta?.title || '',
        description: options.meta?.description || '',
        keywords: options.meta?.keywords || '',
      },
    };
  }

  // Render and cache
  const result = await renderSSR(component, options);
  ssrCache.set(cacheKey, result.html);

  return result;
}
