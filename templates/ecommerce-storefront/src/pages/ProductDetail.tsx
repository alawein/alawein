import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft, Truck, RotateCcw, Shield } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import { Recommendations } from '@/components/product/Recommendations';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const productId = id;

  if (!product) {
    return (
      <div className="container px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  return (
    <div className="container px-4 py-8">
      {/* Breadcrumb */}
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-2xl overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.category}</p>
            <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Size selector */}
          {product.sizes && (
            <div>
              <p className="font-medium mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-foreground'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && (
            <div>
              <p className="font-medium mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-foreground'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-medium mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-lg border hover:bg-accent">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-lg border hover:bg-accent">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 py-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90">
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="p-4 rounded-lg border hover:bg-accent">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Free Shipping</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">30-Day Returns</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">2-Year Warranty</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI-Powered Recommendations */}
      <Recommendations currentProductId={productId} />
    </div>
  );
}

