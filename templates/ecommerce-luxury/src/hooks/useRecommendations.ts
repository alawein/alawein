import { useMemo } from 'react';
import { Product, products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';

export type RecommendationType = 'similar' | 'complementary' | 'trending' | 'cart-based';

interface RecommendationResult {
  products: Product[];
  type: RecommendationType;
  title: string;
}

/**
 * AI-powered product recommendations hook
 * Uses product attributes, cart contents, and browsing patterns to suggest products
 */
export function useRecommendations(
  currentProductId?: string,
  limit: number = 4
): RecommendationResult[] {
  const cartItems = useCartStore((state) => state.items);

  return useMemo(() => {
    const recommendations: RecommendationResult[] = [];
    const currentProduct = products.find((p) => p.id === currentProductId);

    // 1. Similar Products (same category)
    if (currentProduct) {
      const similar = products
        .filter((p) => p.id !== currentProductId && p.category === currentProduct.category)
        .slice(0, limit);

      if (similar.length > 0) {
        recommendations.push({
          products: similar,
          type: 'similar',
          title: 'You May Also Like',
        });
      }

      // 2. Complementary Products (different category, style matching)
      const complementary = getComplementaryProducts(currentProduct, limit);
      if (complementary.length > 0) {
        recommendations.push({
          products: complementary,
          type: 'complementary',
          title: 'Complete the Look',
        });
      }
    }

    // 3. Cart-based recommendations
    if (cartItems.length > 0) {
      const cartBased = getCartBasedRecommendations(cartItems, currentProductId, limit);
      if (cartBased.length > 0) {
        recommendations.push({
          products: cartBased,
          type: 'cart-based',
          title: 'Based on Your Cart',
        });
      }
    }

    // 4. Trending (new + sale items)
    const trending = products
      .filter((p) => (p.isNew || p.isSale) && p.id !== currentProductId)
      .slice(0, limit);

    if (trending.length > 0) {
      recommendations.push({
        products: trending,
        type: 'trending',
        title: 'Trending Now',
      });
    }

    return recommendations;
  }, [currentProductId, cartItems, limit]);
}

/**
 * Get products that complement the current product
 * Uses category pairing rules for outfit matching
 */
function getComplementaryProducts(product: Product, limit: number): Product[] {
  const pairings: Record<string, string[]> = {
    Outerwear: ['Knitwear', 'Accessories', 'Footwear'],
    Knitwear: ['Accessories', 'Outerwear', 'Bags'],
    Footwear: ['Accessories', 'Outerwear', 'Bags'],
    Accessories: ['Outerwear', 'Knitwear', 'Bags'],
    Bags: ['Accessories', 'Outerwear', 'Knitwear'],
  };

  const complementaryCategories = pairings[product.category] || [];

  return products
    .filter(
      (p) => p.id !== product.id && complementaryCategories.includes(p.category)
    )
    .sort((a, b) => {
      // Prioritize sale items and new arrivals
      const aScore = (a.isSale ? 2 : 0) + (a.isNew ? 1 : 0);
      const bScore = (b.isSale ? 2 : 0) + (b.isNew ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Get recommendations based on cart contents
 * Finds products that pair well with items already in cart
 */
function getCartBasedRecommendations(
  cartItems: { id: string }[],
  excludeId: string | undefined,
  limit: number
): Product[] {
  const cartProductIds = new Set(cartItems.map((item) => item.id));
  const cartProducts = products.filter((p) => cartProductIds.has(p.id));
  const cartCategories = new Set(cartProducts.map((p) => p.category));

  // Find products from different categories not in cart
  return products
    .filter(
      (p) =>
        !cartProductIds.has(p.id) &&
        p.id !== excludeId &&
        !cartCategories.has(p.category)
    )
    .sort((a, b) => {
      const aScore = (a.isSale ? 2 : 0) + (a.isNew ? 1 : 0);
      const bScore = (b.isSale ? 2 : 0) + (b.isNew ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

export default useRecommendations;

