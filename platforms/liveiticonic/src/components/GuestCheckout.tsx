/**
 * GuestCheckout Component
 *
 * Provides a streamlined checkout experience for guest users
 * with Stripe integration for secure payment processing.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe';
import { trackEvents } from '@/utils/analytics';
import { ArrowLeft, CreditCard, Loader2, Shield, AlertCircle } from 'lucide-react';

interface GuestCheckoutProps {
  onBack?: () => void;
}

export function GuestCheckout({ onBack }: GuestCheckoutProps) {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const shipping = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    if (!isStripeConfigured()) {
      setError('Payment system is not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Track checkout started
      trackEvents.checkoutStarted(
        items.map((item) => ({ id: item.id, quantity: item.quantity, price: item.price })),
        finalTotal,
      );

      // Create Stripe Checkout session
      const { url } = await createCheckoutSession({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerEmail: formData.email,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/collection');
    return null;
  }

  return (
    <div className='min-h-screen bg-lii-bg pt-24'>
      <div className='container mx-auto px-6 py-12'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onBack || (() => navigate(-1))}
            className='text-lii-ash hover:text-lii-cloud'
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <h1 className='text-3xl font-display font-semibold text-lii-cloud'>Guest Checkout</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0' />
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Shipping Form */}
          <div className='lg:col-span-2'>
            <Card className='bg-lii-ink border-lii-gold/10'>
              <CardHeader>
                <CardTitle className='text-lii-cloud'>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <Label htmlFor='email' className='text-lii-ash'>
                    Email *
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    placeholder='your@email.com'
                  />
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='firstName' className='text-lii-ash'>
                      First Name *
                    </Label>
                    <Input
                      id='firstName'
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    />
                  </div>
                  <div>
                    <Label htmlFor='lastName' className='text-lii-ash'>
                      Last Name *
                    </Label>
                    <Input
                      id='lastName'
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='address' className='text-lii-ash'>
                    Street Address *
                  </Label>
                  <Input
                    id='address'
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                  />
                </div>

                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <Label htmlFor='city' className='text-lii-ash'>
                      City *
                    </Label>
                    <Input
                      id='city'
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    />
                  </div>
                  <div>
                    <Label htmlFor='state' className='text-lii-ash'>
                      State *
                    </Label>
                    <Input
                      id='state'
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    />
                  </div>
                  <div>
                    <Label htmlFor='zipCode' className='text-lii-ash'>
                      ZIP Code *
                    </Label>
                    <Input
                      id='zipCode'
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud'
                    />
                  </div>
                </div>

                {/* Secure Payment Notice */}
                <div className='flex items-center gap-3 p-4 bg-lii-gold/5 rounded-lg border border-lii-gold/20'>
                  <Shield className='w-5 h-5 text-lii-gold flex-shrink-0' />
                  <div>
                    <p className='text-lii-cloud font-medium text-sm'>Secure Checkout</p>
                    <p className='text-lii-ash text-xs'>
                      You'll be redirected to Stripe for secure payment processing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className='space-y-6'>
            <Card className='bg-lii-ink border-lii-gold/10'>
              <CardHeader>
                <CardTitle className='text-lii-cloud'>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {items.map((item) => (
                  <div key={item.id} className='flex gap-3'>
                    <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-lii-cloud text-sm truncate'>{item.name}</p>
                      <p className='text-lii-gold text-sm'>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator className='bg-lii-gold/10' />

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between text-lii-ash'>
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-lii-ash'>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className='flex justify-between text-lii-ash'>
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className='bg-lii-gold/10' />
                  <div className='flex justify-between text-lii-cloud font-semibold'>
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} disabled={isProcessing} className='w-full' variant='primary'>
                  {isProcessing ? (
                    <div className='flex items-center gap-2'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Processing...
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <CreditCard className='w-4 h-4' />
                      Pay ${finalTotal.toFixed(2)}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestCheckout;
