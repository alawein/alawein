import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Heart, Settings, LogOut, Bell, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Rounaq User Profile
 * Fashion E-commerce - Family Platform
 */
const user = {
  name: 'Sarah Mitchell',
  email: 'sarah.m@email.com',
  phone: '+1 (555) 987-6543',
  address: '456 Fashion Avenue, New York, NY 10001',
  memberSince: '2024-01-20',
};

const menuItems = [
  { icon: ShoppingBag, label: 'My Orders', href: '/orders', count: '3' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist', count: '12' },
  { icon: MapPin, label: 'Addresses', href: '/addresses', count: '2' },
  { icon: Bell, label: 'Notifications', href: '/notifications', count: '' },
  { icon: Settings, label: 'Settings', href: '/settings', count: '' },
];

const recentlyViewed = [
  { name: 'Silk Blouse', price: 89 },
  { name: 'Wool Coat', price: 245 },
  { name: 'Leather Boots', price: 178 },
];

export default function Profile() {
  return (
    <div className="container px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border bg-card text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Edit Profile
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border bg-card"
          >
            <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.label} to={item.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-rose-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count && <span className="text-sm text-muted-foreground">{item.count}</span>}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recently Viewed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border bg-card"
          >
            <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyViewed.map((item) => (
                <div key={item.name} className="flex-shrink-0 w-32">
                  <div className="w-32 h-40 rounded-lg bg-rose-100 mb-2"></div>
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-sm text-rose-500">${item.price}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl border bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Default Address</h2>
              <button className="text-sm text-rose-500 font-medium hover:underline">Change</button>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{user.address}</p>
            </div>
          </motion.div>

          {/* Sign Out */}
          <button className="flex items-center gap-2 text-red-500 font-medium hover:underline">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

