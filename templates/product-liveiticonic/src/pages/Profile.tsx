import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Settings, LogOut, Shield, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LiveItIconic User Profile
 * Luxury Automotive E-commerce by Live It Iconic LLC
 */
const user = {
  name: 'Alexander Sterling',
  email: 'alex.sterling@email.com',
  phone: '+1 (555) 123-4567',
  address: '1234 Luxury Lane, Beverly Hills, CA 90210',
  memberSince: '2023-06-15',
  tier: 'Platinum',
};

const menuItems = [
  { icon: CreditCard, label: 'Payment Methods', href: '/payment-methods', description: '3 cards saved' },
  { icon: MapPin, label: 'Addresses', href: '/addresses', description: '2 addresses' },
  { icon: Bell, label: 'Notifications', href: '/notifications', description: 'Email & Push' },
  { icon: Shield, label: 'Security', href: '/security', description: '2FA enabled' },
  { icon: Settings, label: 'Preferences', href: '/preferences', description: 'Language, Theme' },
];

const stats = [
  { label: 'Total Orders', value: '12' },
  { label: 'Wishlist', value: '5' },
  { label: 'Reviews', value: '8' },
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mt-2">
              ⭐ {user.tier} Member
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <button className="text-sm text-primary font-medium hover:underline">Edit</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Primary Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border bg-card"
          >
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.label} to={item.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
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

