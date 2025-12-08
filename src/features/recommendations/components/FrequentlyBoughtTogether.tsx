import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductRecommendation } from '../types';

interface FrequentlyBoughtTogetherProps {
  currentProduct: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  recommendations: ProductRecommendation[];
  isLoading?: boolean;
  onAddToCart?: (productIds: string[]) => void;
  className?: string;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  recommendations,
  isLoading = false,
  onAddToCart,
  className = '',
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set([currentProduct.id])
  );

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (productId === currentProduct.id) return; // Can't deselect current product

    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    for (const product of selectedProducts) {
      total += product.price;
    }
    return total;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Frequently Bought Together</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedProducts.some(p => p.id === product.id)}
              onChange={() => toggleProduct(product)}
              className="rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">Total: ${calculateTotal()}</span>
        <button
          onClick={() => onAddToCart(selectedProducts)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={selectedProducts.length === 0}
        >
          Add Selected to Cart
        </button>
      </div>
    </div>
  );
}
