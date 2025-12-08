import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';
import { Loader2, Minus, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  isProcessing?: boolean;
  showEditableQuantities?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
  onUpdateQuantity,
  onRemoveItem,
  isProcessing = false,
  showEditableQuantities = true,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsCouponApplying(true);
    setCouponError('');

    try {
      // TODO: Replace with actual API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate coupon validation
      if (couponCode.toUpperCase() === 'WELCOME10') {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: subtotal * 0.1, // 10% discount
        });
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setIsCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const finalTotal = appliedCoupon ? total - appliedCoupon.discount : total;

  return (
    <Card className="bg-lii-ink border-lii-gold/10 sticky top-24">
      <CardHeader>
        <CardTitle className="text-lii-cloud">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex gap-3 group">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                {showEditableQuantities && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove item"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lii-cloud font-ui text-sm truncate font-medium">
                  {item.name}
                </p>
                {item.variant && (
                  <p className="text-lii-ash font-ui text-xs">{item.variant}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lii-gold font-ui text-sm font-medium">
                    ${item.price.toFixed(2)}
                  </p>
                  {showEditableQuantities ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 border-lii-gold/20"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-lii-cloud font-ui text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 border-lii-gold/20"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-lii-ash font-ui text-sm">
                      Qty: {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-lii-gold/10" />

        {/* Coupon Code */}
        {!appliedCoupon ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50 pl-9"
                  disabled={isCouponApplying}
                />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lii-gold" />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isCouponApplying}
                className="border-lii-gold/20"
              >
                {isCouponApplying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            {couponError && (
              <p className="text-red-400 text-xs">{couponError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-green-400 text-sm font-medium">
                  {appliedCoupon.code}
                </p>
                <p className="text-lii-ash text-xs">
                  -${appliedCoupon.discount.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveCoupon}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Separator className="bg-lii-gold/10" />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-lii-ash font-ui text-sm">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-400 font-ui text-sm">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${appliedCoupon.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lii-ash font-ui text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping === 0 && subtotal < 100 && (
            <p className="text-lii-gold text-xs">
              🎉 Free shipping on orders over $100!
            </p>
          )}
          <div className="flex justify-between text-lii-ash font-ui text-sm">
            <span>Tax (estimated)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator className="bg-lii-gold/10" />
          <div className="flex justify-between text-lii-cloud font-ui font-semibold text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-lii-ash text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-lii-gold"></div>
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-2 text-lii-ash text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-lii-gold"></div>
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-lii-ash text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-lii-gold"></div>
            <span>Free returns on all orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
