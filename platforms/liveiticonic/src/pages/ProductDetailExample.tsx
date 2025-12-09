// Example Product Detail Page with Recommendations
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import {
  RecommendationCarousel,
  SimilarProducts,
  RecentlyViewed,
  CompleteTheLook,
  useViewHistory
} from '@/features/recommendations';

// Mock product data
const MOCK_PRODUCT = {
  id: '1',
  name: 'Classic White Tee',
  price: 29.99,
  image: '/placeholder.svg',
  category: 'tops',
  tags: ['casual', 'cotton', 'basic'],
  description: 'A timeless classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
  inStock: true,
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['White', 'Black', 'Gray']
};

export default function ProductDetailExample() {
  const { id } = useParams();
  const { addToHistory } = useViewHistory();

  // Track product view
  useEffect(() => {
    addToHistory(MOCK_PRODUCT);
  }, [id, addToHistory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={MOCK_PRODUCT.image}
              alt={MOCK_PRODUCT.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{MOCK_PRODUCT.name}</h1>
              <p className="text-3xl font-bold text-primary">${MOCK_PRODUCT.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground">{MOCK_PRODUCT.description}</p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2">
                {MOCK_PRODUCT.sizes.map((size) => (
                  <Button key={size} variant="outline" size="sm">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                {MOCK_PRODUCT.colors.map((color) => (
                  <Button key={color} variant="outline" size="sm">
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 100% Organic Cotton</li>
                  <li>• Machine Washable</li>
                  <li>• Classic Fit</li>
                  <li>• Made in USA</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complete the Look */}
        <div className="mb-16">
          <CompleteTheLook currentProduct={MOCK_PRODUCT} />
        </div>

        {/* Similar Products */}
        <div className="mb-16">
          <SimilarProducts currentProduct={MOCK_PRODUCT} />
        </div>

        {/* Trending Products Carousel */}
        <div className="mb-16">
          <RecommendationCarousel
            title="Trending Now"
            type="trending"
          />
        </div>

        {/* Personalized Recommendations */}
        <div className="mb-16">
          <RecommendationCarousel
            title="Recommended for You"
            type="personalized"
          />
        </div>

        {/* Recently Viewed */}
        <div className="mb-16">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}
