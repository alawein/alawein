/**
 * Nexus Edge Runtime
 * Provides edge computing capabilities for global deployment
 */

import { createServer as createHttpServer } from 'http';
import { parse } from 'url';
import { NexusConfig } from '@nexus/shared';

export interface EdgeFunction {
  name: string;
  handler: (request: EdgeRequest) => Promise<EdgeResponse>;
  regions?: string[];
  memory?: number;
  timeout?: number;
}

export interface EdgeRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string | Uint8Array;
  query: Record<string, string>;
  params: Record<string, string>;
  cf?: Record<string, any>; // Cloudflare-specific data
  geo?: {
    country?: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface EdgeResponse {
  status: number;
  headers: Record<string, string>;
  body?: string | Uint8Array | ReadableStream;
}

export interface EdgeContext {
  waitUntil: (promise: Promise<any>) => void;
  env: Record<string, string>;
  config: NexusConfig;
}

/**
 * Edge Runtime Manager
 */
export class EdgeRuntime {
  private functions = new Map<string, EdgeFunction>();
  private config: NexusConfig;
  private regions: string[];

  constructor(config: NexusConfig, regions = ['us-east', 'us-west', 'eu-west', 'asia-southeast']) {
    this.config = config;
    this.regions = regions;
  }

  /**
   * Register an edge function
   */
  registerFunction(fn: EdgeFunction): void {
    this.functions.set(fn.name, fn);
  }

  /**
   * Execute edge function
   */
  async executeFunction(
    name: string,
    request: EdgeRequest,
    context: EdgeContext
  ): Promise<EdgeResponse> {
    const fn = this.functions.get(name);
    if (!fn) {
      throw new Error(`Edge function not found: ${name}`);
    }

    // Check region constraints
    if (fn.regions && !fn.regions.includes(this.getCurrentRegion())) {
      // Forward to nearest region
      return this.forwardToRegion(name, request, fn.regions[0]);
    }

    // Execute with timeout
    const timeout = fn.timeout || 30000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Function timeout')), timeout);
    });

    try {
      return await Promise.race([
        fn.handler(request),
        timeoutPromise,
      ]);
    } catch (error) {
      console.error(`Edge function error (${name}):`, error);
      return {
        status: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Internal server error' }),
      };
    }
  }

  /**
   * Get current region
   */
  private getCurrentRegion(): string {
    // This would determine the actual region
    // For now, return default
    return 'us-east';
  }

  /**
   * Forward request to another region
   */
  private async forwardToRegion(
    name: string,
    request: EdgeRequest,
    region: string
  ): Promise<EdgeResponse> {
    // This would forward the request to the specified region
    // For now, return error
    return {
      status: 503,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Service not available in this region' }),
    };
  }

  /**
   * Deploy functions to edge locations
   */
  async deploy(): Promise<void> {
    console.log(`Deploying ${this.functions.size} edge functions to ${this.regions.length} regions...`);

    for (const [name, fn] of this.functions) {
      console.log(`  - ${name} to ${fn.regions || this.regions}`);
    }
  }
}

/**
 * Edge Request Builder
 */
export function createEdgeRequest(req: any): EdgeRequest {
  const parsedUrl = parse(req.url, true);

  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: parsedUrl.query as Record<string, string>,
    params: {}, // Would be populated by router
    geo: {
      country: req.headers['cf-ipcountry'],
      city: req.headers['cf-ipcity'],
      region: req.headers['cf-ipregion'],
    },
  };
}

/**
 * Edge Response Builder
 */
export function createEdgeResponse(
  status: number,
  body: string | Uint8Array,
  headers: Record<string, string> = {}
): EdgeResponse {
  return {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body,
  };
}

/**
 * Edge Middleware for Express/Nexus
 */
export function createEdgeMiddleware(runtime: EdgeRuntime) {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if this is an edge function route
      if (req.path.startsWith('/api/edge/')) {
        const functionName = req.path.replace('/api/edge/', '');

        const edgeReq = createEdgeRequest(req);
        const context: EdgeContext = {
          waitUntil: (promise) => {
            // Handle background tasks
            promise.catch(console.error);
          },
          env: process.env,
          config: req.nexusConfig,
        };

        const edgeRes = await runtime.executeFunction(
          functionName,
          edgeReq,
          context
        );

        // Set headers
        Object.entries(edgeRes.headers).forEach(([key, value]) => {
          res.set(key, value);
        });

        // Send response
        res.status(edgeRes.status);

        if (edgeRes.body instanceof ReadableStream) {
          // Handle streaming response
          res.send(edgeRes.body);
        } else {
          res.send(edgeRes.body);
        }

        return;
      }

      next();
    } catch (error) {
      console.error('Edge middleware error:', error);
      next();
    }
  };
}

/**
 * Edge Server
 */
export function createEdgeServer(runtime: EdgeRuntime, port = 3001) {
  const server = createHttpServer(async (req, res) => {
    try {
      const edgeReq = createEdgeRequest(req);
      const context: EdgeContext = {
        waitUntil: (promise) => {
          promise.catch(console.error);
        },
        env: process.env,
        config: runtime['config'],
      };

      // Route to function based on path
      const pathParts = req.url?.split('/') || [];
      const functionName = pathParts[1];

      if (functionName && runtime['functions'].has(functionName)) {
        const edgeRes = await runtime.executeFunction(
          functionName,
          edgeReq,
          context
        );

        // Send response
        res.writeHead(edgeRes.status, edgeRes.headers);
        if (edgeRes.body) {
          res.end(edgeRes.body);
        } else {
          res.end();
        }
      } else {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'Function not found' }));
      }
    } catch (error) {
      console.error('Edge server error:', error);
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });

  server.listen(port, () => {
    console.log(`Edge server running on port ${port}`);
  });

  return server;
}

/**
 * Common edge function templates
 */

// API proxy
export const apiProxy: EdgeFunction = {
  name: 'api-proxy',
  handler: async (request) => {
    const url = request.query.url;
    if (!url) {
      return {
        status: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'URL required' }),
      };
    }

    try {
      const response = await fetch(url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const body = await response.arrayBuffer();

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: new Uint8Array(body),
      };
    } catch (error) {
      return {
        status: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Proxy error' }),
      };
    }
  },
  regions: ['us-east', 'eu-west'],
};

// Image optimization
export const imageOptimizer: EdgeFunction = {
  name: 'image-optimizer',
  handler: async (request) => {
    const imageUrl = request.query.url;
    const width = parseInt(request.query.width || '800');
    const height = parseInt(request.query.height || '600');
    const quality = parseInt(request.query.quality || '80');

    if (!imageUrl) {
      return {
        status: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Image URL required' }),
      };
    }

    try {
      // Fetch image
      const response = await fetch(imageUrl);
      const imageBuffer = await response.arrayBuffer();

      // This would use an image processing library
      // For now, just return the original
      return {
        status: 200,
        headers: {
          'content-type': response.headers.get('content-type') || 'image/jpeg',
          'cache-control': 'public, max-age=31536000, immutable',
        },
        body: new Uint8Array(imageBuffer),
      };
    } catch (error) {
      return {
        status: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Image processing failed' }),
      };
    }
  },
  regions: ['us-east', 'us-west', 'eu-west', 'asia-southeast'],
};

// A/B testing
export const abTest: EdgeFunction = {
  name: 'ab-test',
  handler: async (request) => {
    const testId = request.query.test;
    const userId = request.headers['user-id'] || 'anonymous';

    // Consistent hashing for A/B test
    const hash = hashCode(userId + testId);
    const variant = hash % 2 === 0 ? 'A' : 'B';

    return {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        testId,
        variant,
        userId,
      }),
    };
  },
};

// Rate limiting
export const rateLimiter: EdgeFunction = {
  name: 'rate-limiter',
  handler: async (request) => {
    const clientId = request.headers['x-forwarded-for'] || 'unknown';
    const limit = parseInt(request.query.limit || '100');
    const window = parseInt(request.query.window || '60'); // seconds

    // This would use a distributed cache like KV
    // For now, just allow all requests
    return {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'x-ratelimit-limit': limit.toString(),
        'x-ratelimit-remaining': (limit - 1).toString(),
        'x-ratelimit-reset': (Date.now() + window * 1000).toString(),
      },
      body: JSON.stringify({ allowed: true }),
    };
  },
};

/**
 * Utility functions
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Edge deployment utilities
 */
export class EdgeDeployer {
  private runtime: EdgeRuntime;

  constructor(runtime: EdgeRuntime) {
    this.runtime = runtime;
  }

  /**
   * Deploy to multiple edge providers
   */
  async deployToProviders(providers: string[]): Promise<void> {
    for (const provider of providers) {
      console.log(`Deploying to ${provider}...`);

      switch (provider) {
        case 'cloudflare':
          await this.deployToCloudflare();
          break;
        case 'vercel':
          await this.deployToVercel();
          break;
        case 'deno':
          await this.deployToDeno();
          break;
        default:
          console.warn(`Unknown provider: ${provider}`);
      }
    }
  }

  private async deployToCloudflare(): Promise<void> {
    // This would deploy to Cloudflare Workers
    console.log('  - Uploading workers...');
    console.log('  - Configuring routes...');
    console.log('  - Setting up KV namespaces...');
  }

  private async deployToVercel(): Promise<void> {
    // This would deploy to Vercel Edge Functions
    console.log('  - Building functions...');
    console.log('  - Uploading to Vercel...');
  }

  private async deployToDeno(): Promise<void> {
    // This would deploy to Deno Deploy
    console.log('  - Compiling for Deno...');
    console.log('  - Deploying to Deno Deploy...');
  }
}
