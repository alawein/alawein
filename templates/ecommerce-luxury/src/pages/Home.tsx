import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Recommendations } from '@/components/product/Recommendations';
import { products } from '@/data/products';

const categories = [
  { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
];

export default function Home() {
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              Live Your <span className="text-primary">Iconic</span> Life
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover premium lifestyle products crafted for those who dare to stand out.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 py-16">
        <h2 className="text-3xl font-serif font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="group block relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-serif font-semibold text-lg">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-16 bg-secondary/30">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
          <Link to="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold">New Arrivals</h2>
          <Link to="/shop?category=new" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="container px-4">
        <Recommendations />
      </section>

      {/* CTA Banner */}
      <section className="container px-4 py-16">
        <div className="relative rounded-2xl overflow-hidden bg-primary text-primary-foreground p-12 md:p-16">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Join the Iconic Club
            </h2>
            <p className="text-primary-foreground/80 mb-6">
              Get exclusive access to new arrivals, special offers, and 15% off your first order.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 placeholder:text-primary-foreground/60 border-0 focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

