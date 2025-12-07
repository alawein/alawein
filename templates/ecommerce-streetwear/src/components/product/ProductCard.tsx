import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
  isSale,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/product/${id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-4">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-2 py-1 bg-foreground text-background text-xs font-medium rounded">
                NEW
              </span>
            )}
            {isSale && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                SALE
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-background rounded-full shadow-md hover:bg-accent">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-background/90 backdrop-blur-sm rounded-lg font-medium text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
          <h3 className="font-medium group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

