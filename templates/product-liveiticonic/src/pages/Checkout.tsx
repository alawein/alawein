import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, Check, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';

/**
 * LiveItIconic Checkout
 * Luxury Automotive E-commerce by Live It Iconic LLC
 */
export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);

  const handlePlaceOrder = () => {
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="container px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">Your luxury vehicle is being prepared. Order #LII-{Date.now().toString(36).toUpperCase()}</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Continue Shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step Indicators */}
          <div className="flex items-center gap-4 mb-8">
            {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Review' }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <button onClick={() => step >= s.n && setStep(s.n)} className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s.n}</button>
                <span className={step >= s.n ? 'font-medium' : 'text-muted-foreground'}>{s.label}</span>
                {i < 2 && <div className={`w-8 h-0.5 ${step > s.n ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="col-span-1 px-4 py-3 rounded-lg border bg-background" />
                <input type="text" placeholder="Last Name" className="col-span-1 px-4 py-3 rounded-lg border bg-background" />
                <input type="email" placeholder="Email" className="col-span-2 px-4 py-3 rounded-lg border bg-background" />
                <input type="text" placeholder="Address" className="col-span-2 px-4 py-3 rounded-lg border bg-background" />
                <input type="text" placeholder="City" className="px-4 py-3 rounded-lg border bg-background" />
                <input type="text" placeholder="ZIP Code" className="px-4 py-3 rounded-lg border bg-background" />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium">Continue to Payment</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Details</h2>
              <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-lg border bg-background" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="px-4 py-3 rounded-lg border bg-background" />
                <input type="text" placeholder="CVC" className="px-4 py-3 rounded-lg border bg-background" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="w-4 h-4" /> Secure 256-bit SSL encryption</div>
              <button onClick={() => setStep(3)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium">Review Order</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-xl font-semibold">Review Your Order</h2>
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="w-16 h-16 rounded-lg bg-muted"></div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <button onClick={handlePlaceOrder} className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg">Place Order • {formatPrice(total() * 1.08)}</button>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl border bg-card space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total())}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(total() * 0.08)}</span></div>
            </div>
            <div className="pt-4 border-t flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(total() * 1.08)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

