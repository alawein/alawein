// Product Recommendations Feature - All-in-one elegant implementation
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  description?: string;
  inStock?: boolean;
};

type RecommendationType = 'similar' | 'trending' | 'personalized' | 'recently-viewed';

// LocalStorage Keys
const VIEW_HISTORY_KEY = 'liveit-view-history';
const MAX_HISTORY_ITEMS = 20;

// View History Management
const useViewHistory = () => {
  const [history, setHistory] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
      } catch {
        localStorage.removeItem(VIEW_HISTORY_KEY);
      }
    }
  }, []);

  const addToHistory = (product: Product) => {
    setHistory((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to front
      const updated = [product, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(VIEW_HISTORY_KEY);
  };

  return { history, addToHistory, clearHistory };
};

// Similarity Engine - Client-side product matching
const calculateSimilarity = (product1: Product, product2: Product): number => {
  let score = 0;

  // Category match (highest weight)
  if (product1.category === product2.category) score += 50;

  // Tag overlap
  const commonTags = product1.tags.filter((tag) => product2.tags.includes(tag));
  score += commonTags.length * 10;

  // Price similarity (within 30%)
  const priceDiff = Math.abs(product1.price - product2.price) / product1.price;
  if (priceDiff < 0.3) score += 20;

  return score;
};

const findSimilarProducts = (product: Product, allProducts: Product[], limit = 4): Product[] => {
  return allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({ product: p, score: calculateSimilarity(product, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
};

// API Service - Mock implementation (replace with real API)
const fetchRecommendations = async (type: RecommendationType, productId?: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - replace with real API call
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Classic White Tee',
      price: 29.99,
      image: '/placeholder.svg',
      category: 'tops',
      tags: ['casual', 'cotton', 'basic'],
      inStock: true
    },
    {
      id: '2',
      name: 'Denim Jacket',
      price: 89.99,
      image: '/placeholder.svg',
      category: 'outerwear',
      tags: ['denim', 'casual', 'classic'],
      inStock: true
    },
    {
      id: '3',
      name: 'Black Skinny Jeans',
      price: 59.99,
      image: '/placeholder.svg',
      category: 'bottoms',
      tags: ['denim', 'skinny', 'black'],
      inStock: true
    },
    {
      id: '4',
      name: 'Leather Boots',
      price: 129.99,
      image: '/placeholder.svg',
      category: 'shoes',
      tags: ['leather', 'boots', 'winter'],
      inStock: false
    }
  ];

  return mockProducts;
};

// Hooks
const useRecommendations = (type: RecommendationType, productId?: string) => {
  return useQuery({
    queryKey: ['recommendations', type, productId],
    queryFn: () => fetchRecommendations(type, productId),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// Components

// Recommendation Card
const RecommendationCard = ({ 
  product, 
  onAddToCart, 
  onWishlist 
}: { 
  product: Product; 
  onAddToCart: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        {onWishlist && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-white/80 hover:bg-white transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={() => onWishlist(product)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold mb-3">${product.price.toFixed(2)}</p>
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

// Recommendation Carousel
export const RecommendationCarousel = ({ 
  title, 
  type, 
  productId 
}: { 
  title: string; 
  type: RecommendationType; 
  productId?: string;
}) => {
  const { data: products, isLoading } = useRecommendations(type, productId);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleAddToCart = (product: Product) => {
    // Add to cart logic (integrate with cart context/state)
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product: Product) => {
    toast.success(`${product.name} added to wishlist!`);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${type}`);
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id={`carousel-${type}`}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-64">
            <RecommendationCard
              product={product}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Similar Products Section
export const SimilarProducts = ({ currentProduct }: { currentProduct: Product }) => {
  const { data: allProducts } = useRecommendations('trending');
  const similarProducts = allProducts ? findSimilarProducts(currentProduct, allProducts) : [];

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  if (similarProducts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

// Recently Viewed Products
export const RecentlyViewed = () => {
  const { history, clearHistory } = useViewHistory();

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="h-6 w-6" />
          Recently Viewed
        </h2>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          Clear History
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

// Complete the Look Section
export const CompleteTheLook = ({ currentProduct }: { currentProduct: Product }) => {
  const { data: allProducts } = useRecommendations('trending');
  
  // Find complementary products (different category, similar style)
  const complementaryProducts = allProducts
    ?.filter((p) => p.category !== currentProduct.category)
    .filter((p) => p.tags.some((tag) => currentProduct.tags.includes(tag)))
    .slice(0, 3) || [];

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddAllToCart = () => {
    toast.success(`${complementaryProducts.length + 1} items added to cart!`);
  };

  if (complementaryProducts.length === 0) return null;

  const totalPrice = [currentProduct, ...complementaryProducts].reduce(
    (sum, p) => sum + p.price,
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Complete the Look</h2>
      <Card className="p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <RecommendationCard
            product={currentProduct}
            onAddToCart={handleAddToCart}
          />
          {complementaryProducts.map((product) => (
            <RecommendationCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total for {complementaryProducts.length + 1} items</p>
            <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          <Button size="lg" onClick={handleAddAllToCart}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add All to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Export hook for tracking views
export { useViewHistory };
