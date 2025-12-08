// Image optimization utilities
import React from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  breakpoints?: number[];
  enableLazyLoading?: boolean;
}

class ImageOptimizer {
  private defaultBreakpoints = [320, 480, 768, 1024, 1200, 1920];
  private defaultOptions: ImageOptimizationOptions = {
    quality: 85,
    format: 'webp',
    breakpoints: this.defaultBreakpoints,
    enableLazyLoading: true,
  };

  constructor(private baseUrl: string = '') {}

  // Generate responsive image URLs
  generateResponsiveUrls(
    originalSrc: string,
    options: ImageOptimizationOptions = {}
  ): Array<{ src: string; width: number }> {
    const opts = { ...this.defaultOptions, ...options };
    const urls: Array<{ src: string; width: number }> = [];

    opts.breakpoints?.forEach(width => {
      const url = this.buildOptimizedUrl(originalSrc, {
        width,
        quality: opts.quality,
        format: opts.format,
      });
      urls.push({ src: url, width });
    });

    return urls;
  }

  // Build optimized image URL
  buildOptimizedUrl(
    src: string,
    params: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    }
  ): string {
    // Handle relative URLs by using current origin as base
    let url: URL;
    try {
      if (src.startsWith('/')) {
        // For relative paths, use current origin
        url = new URL(src, window.location.origin);
      } else if (src.startsWith('http')) {
        // For absolute URLs
        url = new URL(src);
      } else {
        // For relative paths without leading slash
        url = new URL('/' + src, window.location.origin);
      }
    } catch (e) {
      // Fallback: return original src if URL construction fails
      console.warn('Failed to optimize image URL:', src, e);
      return src;
    }
    
    if (params.width) url.searchParams.set('w', params.width.toString());
    if (params.height) url.searchParams.set('h', params.height.toString());
    if (params.quality) url.searchParams.set('q', params.quality.toString());
    if (params.format) url.searchParams.set('f', params.format);

    return url.toString();
  }

  // Generate srcSet string for responsive images
  generateSrcSet(originalSrc: string, options?: ImageOptimizationOptions): string {
    const urls = this.generateResponsiveUrls(originalSrc, options);
    return urls.map(({ src, width }) => `${src} ${width}w`).join(', ');
  }

  // Generate sizes attribute
  generateSizes(breakpoints?: Array<{ breakpoint: string; size: string }>): string {
    const defaultSizes = [
      { breakpoint: '(max-width: 320px)', size: '280px' },
      { breakpoint: '(max-width: 480px)', size: '440px' },
      { breakpoint: '(max-width: 768px)', size: '720px' },
      { breakpoint: '(max-width: 1024px)', size: '980px' },
      { breakpoint: '(max-width: 1200px)', size: '1160px' },
    ];

    const sizes = breakpoints || defaultSizes;
    const sizeQueries = sizes.map(({ breakpoint, size }) => `${breakpoint} ${size}`);
    sizeQueries.push('100vw'); // Default size

    return sizeQueries.join(', ');
  }

  // Preload critical images
  preloadImage(src: string, options: { as?: string; type?: string } = {}): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = options.as || 'image';
    if (options.type) link.type = options.type;
    
    document.head.appendChild(link);
  }

  // Convert image to WebP if supported
  async convertToWebP(file: File, quality = 0.85): Promise<Blob | null> {
    if (!this.supportsWebP()) {
      return null;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => resolve(blob),
          'image/webp',
          quality
        );
      };

      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }

  // Check WebP support
  supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Check AVIF support
  supportsAVIF(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  }

  // Get optimal format for current browser
  getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
    if (this.supportsAVIF()) return 'avif';
    if (this.supportsWebP()) return 'webp';
    return 'jpeg';
  }

  // Lazy loading intersection observer
  createLazyLoadObserver(callback?: (entry: IntersectionObserverEntry) => void): IntersectionObserver {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }

          img.classList.remove('lazy');
          img.classList.add('loaded');

          observer.unobserve(img);
          callback?.(entry);
        }
      });
    }, options);
    
    return observer;
  }

  // Compress image file
  async compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: string;
    } = {}
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { maxWidth = 1920, maxHeight = 1080, quality = 0.85, format = 'image/jpeg' } = options;

        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          format,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Calculate image dimensions that maintain aspect ratio
  calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number
  ): ImageDimensions {
    let width = originalWidth;
    let height = originalHeight;

    if (maxWidth && width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Generate placeholder for lazy loading
  generatePlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      // Create a simple gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    return canvas.toDataURL('image/jpeg', 0.1);
  }
}

// Create global instance
export const imageOptimizer = new ImageOptimizer();

// React hook for image optimization
export function useImageOptimization() {
  const [lazyLoadObserver, setLazyLoadObserver] = React.useState<IntersectionObserver | null>(null);

  React.useEffect(() => {
    const observer = imageOptimizer.createLazyLoadObserver();
    setLazyLoadObserver(observer);

    return () => {
      observer.disconnect();
    };
  }, []);

  const optimizeImage = React.useCallback((src: string, options?: ImageOptimizationOptions) => {
    return {
      srcSet: imageOptimizer.generateSrcSet(src, options),
      sizes: imageOptimizer.generateSizes(),
      src: imageOptimizer.buildOptimizedUrl(src, { quality: options?.quality }),
    };
  }, []);

  const enableLazyLoading = React.useCallback((element: HTMLImageElement) => {
    if (lazyLoadObserver && element) {
      lazyLoadObserver.observe(element);
    }
  }, [lazyLoadObserver]);

  return {
    optimizeImage,
    enableLazyLoading,
    supportsWebP: imageOptimizer.supportsWebP(),
    supportsAVIF: imageOptimizer.supportsAVIF(),
    optimalFormat: imageOptimizer.getOptimalFormat(),
  };
}

export default imageOptimizer;