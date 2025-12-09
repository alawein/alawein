import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CheckoutFormData, Order } from '@/types/order';
import { ArrowLeft, CreditCard, Loader2, Shield, Truck, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvents } from '@/utils/analytics';
import { emailService } from '@/services/emailService';
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Track checkout started
  useEffect(() => {
    if (items.length > 0) {
      trackEvents.checkoutStarted(
        items.map((item) => ({ id: item.id, quantity: item.quantity, price: item.price })),
        total,
      );
      trackEvents.checkoutStep('shipping', 1);
    }
  }, [items, total]);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddressSame: true,
  });

  const shipping = total > 100 ? 0 : 15;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shipping + tax;

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Check if Stripe is configured
      if (!isStripeConfigured()) {
        throw new Error('Payment system is not configured. Please contact support.');
      }

      // Track checkout step
      trackEvents.checkoutStep('payment', 2);

      // Create Stripe Checkout session and redirect
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
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/collection');
    return null;
  }

  return (
    <>
      <SEO
        title='Checkout - Live It Iconic'
        description='Complete your purchase of premium luxury automotive merchandise.'
      />

      <div className='min-h-screen bg-lii-bg pt-24'>
        <div className='container mx-auto px-6 py-12'>
          {/* Header */}
          <div className='flex items-center gap-4 mb-8'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate(-1)}
              className='text-lii-ash hover:text-lii-cloud'
            >
              <ArrowLeft className='w-5 h-5' />
            </Button>
            <h1 className='text-3xl font-display font-semibold text-lii-cloud'>Checkout</h1>
          </div>

          {/* Payment Error Alert */}
          {paymentError && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3'>
              <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0' />
              <p className='text-red-400 text-sm'>{paymentError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='grid lg:grid-cols-3 gap-8'>
            {/* Main Content */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Shipping Information */}
              <Card className='bg-lii-ink border-lii-gold/10'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-3 text-lii-cloud'>
                    <Truck className='w-5 h-5 text-lii-gold' />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='firstName' className='text-lii-ash'>
                        First Name *
                      </Label>
                      <Input
                        id='firstName'
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                    <div>
                      <Label htmlFor='lastName' className='text-lii-ash'>
                        Last Name *
                      </Label>
                      <Input
                        id='lastName'
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='email' className='text-lii-ash'>
                      Email Address *
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                    />
                  </div>

                  <div>
                    <Label htmlFor='phone' className='text-lii-ash'>
                      Phone Number *
                    </Label>
                    <Input
                      id='phone'
                      type='tel'
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                    />
                  </div>

                  <div>
                    <Label htmlFor='address' className='text-lii-ash'>
                      Street Address *
                    </Label>
                    <Input
                      id='address'
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                    />
                  </div>

                  <div className='grid md:grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='city' className='text-lii-ash'>
                        City *
                      </Label>
                      <Input
                        id='city'
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                    <div>
                      <Label htmlFor='state' className='text-lii-ash'>
                        State *
                      </Label>
                      <Input
                        id='state'
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                    <div>
                      <Label htmlFor='zipCode' className='text-lii-ash'>
                        ZIP Code *
                      </Label>
                      <Input
                        id='zipCode'
                        required
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className='bg-lii-ink border-lii-gold/10'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-3 text-lii-cloud'>
                    <CreditCard className='w-5 h-5 text-lii-gold' />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex items-center gap-3 p-4 bg-lii-gold/5 rounded-lg border border-lii-gold/20'>
                    <Shield className='w-5 h-5 text-lii-gold flex-shrink-0' />
                    <div>
                      <p className='text-lii-cloud font-ui font-medium text-sm'>Secure Payment</p>
                      <p className='text-lii-ash font-ui text-xs'>Your payment information is encrypted and secure.</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='cardNumber' className='text-lii-ash'>
                      Card Number *
                    </Label>
                    <Input
                      id='cardNumber'
                      placeholder='1234 5678 9012 3456'
                      required
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='expiryDate' className='text-lii-ash'>
                        Expiry Date *
                      </Label>
                      <Input
                        id='expiryDate'
                        placeholder='MM/YY'
                        required
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                    <div>
                      <Label htmlFor='cvv' className='text-lii-ash'>
                        CVV *
                      </Label>
                      <Input
                        id='cvv'
                        placeholder='123'
                        required
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className='bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50'
                      />
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='billingAddressSame'
                      checked={formData.billingAddressSame}
                      onCheckedChange={(checked) => handleInputChange('billingAddressSame', !!checked)}
                    />
                    <Label htmlFor='billingAddressSame' className='text-lii-ash text-sm'>
                      Billing address is the same as shipping address
                    </Label>
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
                  {/* Items */}
                  <div className='space-y-3'>
                    {items.map((item) => (
                      <div key={item.id} className='flex gap-3'>
                        <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-lii-cloud font-ui text-sm truncate'>{item.name}</p>
                          {item.variant && <p className='text-lii-ash font-ui text-xs'>{item.variant}</p>}
                          <p className='text-lii-gold font-ui text-sm'>
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className='bg-lii-gold/10' />

                  {/* Totals */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-lii-ash font-ui text-sm'>
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-lii-ash font-ui text-sm'>
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className='flex justify-between text-lii-ash font-ui text-sm'>
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className='bg-lii-gold/10' />
                    <div className='flex justify-between text-lii-cloud font-ui font-semibold'>
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isProcessing}
                    className='w-full font-ui font-medium'
                    variant='primary'
                  >
                    {isProcessing ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay $${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
