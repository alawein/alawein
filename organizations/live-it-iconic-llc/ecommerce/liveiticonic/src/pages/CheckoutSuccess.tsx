import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, Mail, Package, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface OrderDetails {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        // Retrieve session details from Stripe
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-checkout-session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lii-bg pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lii-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lii-cloud">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-lii-bg pt-24">
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="bg-lii-ink border-lii-gold/10">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-display font-semibold text-lii-cloud mb-2">
                Order Not Found
              </h1>
              <p className="text-lii-ash mb-6">
                {error || 'We couldn\'t find your order details. Please check your email for confirmation.'}
              </p>
              <Button onClick={() => navigate('/collection')} variant="primary">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Order Confirmed - Live It Iconic"
        description="Your order has been successfully placed."
      />

      <div className="min-h-screen bg-lii-bg pt-24">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-display font-semibold text-lii-cloud mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lii-ash text-lg">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Order Details */}
            <Card className="lg:col-span-2 bg-lii-ink border-lii-gold/10">
              <CardContent className="pt-6 space-y-6">
                {/* Order Number */}
                <div>
                  <p className="text-lii-ash text-sm mb-1">Order Number</p>
                  <p className="text-lii-cloud font-display font-semibold text-xl">
                    {orderDetails.orderNumber}
                  </p>
                </div>

                <Separator className="bg-lii-gold/10" />

                {/* Confirmation Email */}
                <div className="flex items-start gap-3 p-4 bg-lii-gold/5 rounded-lg border border-lii-gold/20">
                  <Mail className="w-5 h-5 text-lii-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-lii-cloud font-medium text-sm mb-1">
                      Confirmation Email Sent
                    </p>
                    <p className="text-lii-ash text-sm">
                      We've sent a confirmation email to <span className="text-lii-gold">{orderDetails.email}</span>
                    </p>
                  </div>
                </div>

                <Separator className="bg-lii-gold/10" />

                {/* Order Items */}
                <div>
                  <h3 className="text-lii-cloud font-display font-semibold mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-lii-cloud font-medium">{item.name}</p>
                          <p className="text-lii-ash text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-lii-gold font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-lii-gold/10" />

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lii-cloud font-display font-semibold mb-3">
                    Shipping Address
                  </h3>
                  <div className="text-lii-ash space-y-1">
                    <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                    <p>{orderDetails.shippingAddress.address}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                <Separator className="bg-lii-gold/10" />

                {/* Total */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-lii-cloud font-display font-semibold">Total Paid</span>
                  <span className="text-lii-gold font-display font-semibold">
                    ${orderDetails.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="space-y-6">
              <Card className="bg-lii-ink border-lii-gold/10">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lii-cloud font-display font-semibold">
                    What's Next?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-lii-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lii-gold font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <p className="text-lii-cloud font-medium text-sm">Order Processing</p>
                        <p className="text-lii-ash text-xs">We're preparing your items</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-lii-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lii-gold font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <p className="text-lii-cloud font-medium text-sm">Shipping</p>
                        <p className="text-lii-ash text-xs">Estimated 3-5 business days</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-lii-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lii-gold font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <p className="text-lii-cloud font-medium text-sm">Delivery</p>
                        <p className="text-lii-ash text-xs">Track your package</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/orders/${orderDetails.id}`)}
                  variant="primary"
                  className="w-full"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full border-lii-gold/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  onClick={() => navigate('/collection')}
                  variant="ghost"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>

          {/* Support */}
          <Card className="bg-lii-ink border-lii-gold/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lii-cloud font-display font-semibold mb-2">
                  Need Help?
                </h3>
                <p className="text-lii-ash text-sm mb-4">
                  Our customer support team is here to assist you
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    size="sm"
                    className="border-lii-gold/20"
                  >
                    Contact Support
                  </Button>
                  <Button
                    onClick={() => navigate('/policies')}
                    variant="ghost"
                    size="sm"
                  >
                    Return Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
