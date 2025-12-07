import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

export function Header() {
  const { itemCount, openCart } = useCartStore();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <button className="lg:hidden p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-serif font-bold tracking-tight">
              Live It <span className="text-primary">Iconic</span>
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/shop?category=new" className="text-sm font-medium hover:text-primary transition-colors">
              New Arrivals
            </Link>
            <Link to="/shop?category=sale" className="text-sm font-medium text-primary">
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-accent rounded-lg hidden sm:flex">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg hidden sm:flex">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg hidden sm:flex">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-accent rounded-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {itemCount()}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

