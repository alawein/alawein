import { motion } from 'framer-motion';
import { Package, ChevronRight, Calendar, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

/**
 * LiveItIconic Order History
 * Luxury Automotive E-commerce by Live It Iconic LLC
 */
const orders = [
  { id: 'LII-7X9K2M', date: '2024-12-01', status: 'delivered', total: 287400, items: [{ name: 'Lamborghini Huracán EVO', qty: 1, image: '' }] },
  { id: 'LII-5P3N8L', date: '2024-11-15', status: 'shipped', total: 223800, items: [{ name: 'Porsche 911 GT3 RS', qty: 1, image: '' }] },
  { id: 'LII-2M6J4R', date: '2024-10-28', status: 'processing', total: 507300, items: [{ name: 'Ferrari SF90 Stradale', qty: 1, image: '' }] },
  { id: 'LII-9K1T5H', date: '2024-09-20', status: 'cancelled', total: 315000, items: [{ name: 'McLaren 720S Spider', qty: 1, image: '' }] },
];

const statusConfig = {
  delivered: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Delivered' },
  shipped: { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Shipped' },
  processing: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Processing' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelled' },
};

export default function OrderHistory() {
  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Order History</h1>
          <p className="text-muted-foreground">Track your luxury acquisitions</p>
        </div>
        <Link to="/shop" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start your luxury collection today</p>
          <Link to="/shop" className="text-primary hover:underline">Browse Collection</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono font-semibold text-lg">{order.id}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 border-t border-b">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">🏎️</div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
                  <button className="flex items-center gap-1 text-primary font-medium hover:underline">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

