import { RecommendationConfig, RecommendationResponse, ProductRecommendation, RecommendationSource } from '../types';

class RecommendationService {
  private baseUrl = '/api/recommendations';

  async getRecommendations(config: RecommendationConfig): Promise<RecommendationResponse> {
    try {
      const params = new URLSearchParams({
        source: config.source,
        limit: config.limit.toString(),
      });

      if (config.contextProductId) {
        params.append('productId', config.contextProductId);
      }

      if (config.contextCartItems?.length) {
        params.append('cartItems', config.contextCartItems.join(','));
      }

      if (config.filters) {
        if (config.filters.category) {
          params.append('category', config.filters.category);
        }
        if (config.filters.brand) {
          params.append('brand', config.filters.brand);
        }
        if (config.filters.priceRange) {
          params.append('minPrice', config.filters.priceRange.min.toString());
          params.append('maxPrice', config.filters.priceRange.max.toString());
        }
      }

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        ...data,
        generatedAt: new Date(data.generatedAt),
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return fallback data for development/demo
      return this.getFallbackRecommendations(config);
    }
  }

  private getFallbackRecommendations(config: RecommendationConfig): RecommendationResponse {
    const mockProducts = this.generateMockProducts(config.limit);
    
    return {
      recommendations: mockProducts.map((product, index) => ({
        id: `rec-${product.id}-${Date.now()}`,
        product,
        score: Math.random() * 0.4 + 0.6, // 0.6-1.0
        reason: this.getReasonForSource(config.source),
        source: config.source,
        metadata: {
          algorithm: 'collaborative_filtering',
          confidence: Math.random() * 0.3 + 0.7,
        },
      })),
      totalCount: config.limit,
      source: config.source,
      generatedAt: new Date(),
    };
  }

  private generateMockProducts(count: number) {
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'];
    const brands = ['Apple', 'Nike', 'Samsung', 'Adidas', 'Sony'];
    
    return Array.from({ length: count }, (_, index) => ({
      id: `product-${index + 1}`,
      name: `Premium Product ${index + 1}`,
      price: Math.floor(Math.random() * 500) + 50,
      imageUrl: `https://picsum.photos/400/400?random=${index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      rating: Math.random() * 2 + 3, // 3-5 stars
      tags: ['popular', 'trending', 'recommended'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));
  }

  private getReasonForSource(source: RecommendationSource): string {
    const reasons = {
      [RecommendationSource.SIMILAR_PRODUCTS]: 'Similar to items you viewed',
      [RecommendationSource.FREQUENTLY_BOUGHT]: 'Often bought together',
      [RecommendationSource.TRENDING]: 'Trending in your area',
      [RecommendationSource.PERSONALIZED]: 'Based on your preferences',
    };
    
    return reasons[source] || 'Recommended for you';
  }

  async trackRecommendationClick(recommendationId: string, productId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendationId,
          productId,
          action: 'click',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  }

  async trackRecommendationConversion(recommendationId: string, productId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendationId,
          productId,
          action: 'conversion',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking recommendation conversion:', error);
    }
  }
}

export const recommendationService = new RecommendationService();
