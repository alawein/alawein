import React from 'react';
import { TrendingUp, Fire } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductRecommendation } from '../types';

interface TrendingProductsProps {
  recommendations: ProductRecommendation[];
  isLoading?: boolean;
  onProductClick?: (productId: string) => void;
  className?: string;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  recommendations,
  isLoading = false,
  onProductClick,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <Fire className="h-5 w-5 text-orange-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendation, index) => (
          <Card
            key={recommendation.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 group relative"
            onClick={() => onProductClick?.(recommendation.product.id)}
          >
            <CardContent className="p-4">
              {index < 3 && (
                <Badge
                  variant="destructive"
                  className="absolute top-2 right-2 z-10"
                >
                  #{index + 1}
                </Badge>
              )}

              <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={recommendation.product.imageUrl}
                  alt={recommendation.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {recommendation.product.name}
              </h3>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-primary">
                  ${recommendation.product.price.toFixed(2)}
                </span>
                {recommendation.product.rating && (
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.floor(recommendation.product.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({recommendation.product.rating.toFixed(1)})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Trending
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                {recommendation.reason}
              </p>

              {recommendation.product.brand && (
                <Badge variant="outline" className="text-xs">
                  {recommendation.product.brand}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
