import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, TrendingUp, Heart } from 'lucide-react';
import { useRecommendations, RecommendationType } from '@/hooks/useRecommendations';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface RecommendationsProps {
  currentProductId?: string;
  className?: string;
}

const typeIcons: Record<RecommendationType, React.ReactNode> = {
  similar: <Heart className="w-5 h-5" />,
  complementary: <Sparkles className="w-5 h-5" />,
  'cart-based': <ShoppingBag className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
};

const typeColors: Record<RecommendationType, string> = {
  similar: 'text-pink-500',
  complementary: 'text-purple-500',
  'cart-based': 'text-amber-500',
  trending: 'text-emerald-500',
};

export function Recommendations({ currentProductId, className }: RecommendationsProps) {
  const recommendations = useRecommendations(currentProductId, 4);
  const [activeIndex, setActiveIndex] = useState(0);

  if (recommendations.length === 0) return null;

  const currentRec = recommendations[activeIndex];

  return (
    <section className={cn('py-12', className)}>
      {/* Section Header with Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {recommendations.map((rec, index) => (
            <button
              key={rec.type}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeIndex === index
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              <span className={cn(activeIndex !== index && typeColors[rec.type])}>
                {typeIcons[rec.type]}
              </span>
              <span className="hidden sm:inline">{rec.title}</span>
            </button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : recommendations.length - 1))}
            className="p-2 rounded-full border hover:bg-accent transition-colors"
            aria-label="Previous recommendations"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev < recommendations.length - 1 ? prev + 1 : 0))}
            className="p-2 rounded-full border hover:bg-accent transition-colors"
            aria-label="Next recommendations"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRec.type}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn('p-2 rounded-lg bg-muted', typeColors[currentRec.type])}>
              {typeIcons[currentRec.type]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentRec.title}</h2>
              <p className="text-sm text-muted-foreground">
                {currentRec.type === 'similar' && 'Products similar to what you\'re viewing'}
                {currentRec.type === 'complementary' && 'Items that pair perfectly together'}
                {currentRec.type === 'cart-based' && 'Based on items in your cart'}
                {currentRec.type === 'trending' && 'Popular picks right now'}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentRec.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* AI Badge */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Personalized by AI</span>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;

