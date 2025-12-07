import { motion } from 'framer-motion';
import { Package, ChevronRight, Calendar, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

/**
 * Rounaq Order History
 * Fashion E-commerce - Family Platform
 */
const orders = [
  { id: 'RNQ-8K4M2P', date: '2024-12-01', status: 'delivered', total: 289, items: [{ name: 'Silk Evening Dress', qty: 1 }, { name: 'Pearl Earrings', qty: 1 }] },
  { id: 'RNQ-3N7L5Q', date: '2024-11-18', status: 'shipped', total: 156, items: [{ name: 'Cashmere Scarf', qty: 2 }] },
  { id: 'RNQ-6J9R1T', date: '2024-11-05', status: 'processing', total: 425, items: [{ name: 'Designer Handbag', qty: 1 }] },
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
          <h1 className="text-3xl font-serif font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track your fashion purchases</p>
        </div>
        <Link to="/shop" className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600">
          Shop Now
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link to="/shop" className="text-rose-500 hover:underline">Browse Collection</Link>
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
                className="p-6 rounded-xl border bg-card hover:border-rose-500/50 transition-colors"
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

                <div className="py-4 border-t border-b space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center text-lg">👗</div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
                  <button className="flex items-center gap-1 text-rose-500 font-medium hover:underline">
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

