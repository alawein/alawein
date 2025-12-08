import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Check, Loader2 } from 'lucide-react';
import { PREMIUM_PLANS, type BillingCycle } from '@/types/subscription';
import { Badge } from '@/components/ui/badge';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentFlow({ onSuccess, onCancel }: PaymentFlowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<BillingCycle>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const planId = selectedPlan === 'monthly' ? 'premium-monthly' : 'premium-yearly';
      const plan = PREMIUM_PLANS.find(p => p.id === planId);

      if (!plan) {
        throw new Error('Plan not found');
      }

      // Call Supabase Edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-premium-checkout', {
        body: {
          planId: plan.id,
          billingCycle: plan.billingCycle,
          priceInCents: plan.price,
          returnUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/pricing`
        },
      });

      if (error) throw error;

      if (!data?.url) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe Checkout URL
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'An error occurred during checkout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyPlan = PREMIUM_PLANS.find(p => p.billingCycle === 'monthly')!;
  const yearlyPlan = PREMIUM_PLANS.find(p => p.billingCycle === 'yearly')!;

  const savings = ((monthlyPlan.price * 12 - yearlyPlan.price) / 100).toFixed(2);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">Unlock premium features and take your fitness to the next level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Plan */}
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPlan === 'monthly' 
              ? 'border-repz-orange border-2 shadow-lg shadow-repz-orange/20' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => setSelectedPlan('monthly')}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">Monthly</CardTitle>
                <CardDescription>Pay month-to-month</CardDescription>
              </div>
              {selectedPlan === 'monthly' && (
                <Badge className="bg-repz-orange">Selected</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">${(monthlyPlan.price / 100).toFixed(2)}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </div>
            <ul className="space-y-3">
              {monthlyPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <Check className="h-5 w-5 text-repz-orange flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card 
          className={`cursor-pointer transition-all relative ${
            selectedPlan === 'yearly' 
              ? 'border-repz-orange border-2 shadow-lg shadow-repz-orange/20' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => setSelectedPlan('yearly')}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-green-500 text-white">Save ${savings}</Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">Yearly</CardTitle>
                <CardDescription>Best value - save 17%</CardDescription>
              </div>
              {selectedPlan === 'yearly' && (
                <Badge className="bg-repz-orange">Selected</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">${(yearlyPlan.price / 100).toFixed(2)}</span>
                <span className="text-gray-400 ml-2">/year</span>
              </div>
              <p className="text-sm text-green-400 mt-1">
                ${((yearlyPlan.price / 12) / 100).toFixed(2)}/month when billed annually
              </p>
            </div>
            <ul className="space-y-3">
              {yearlyPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <Check className="h-5 w-5 text-repz-orange flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          size="lg"
          className="bg-repz-orange hover:bg-repz-orange-dark text-white font-semibold px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Subscribe Now
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>✓ Secure payment processing powered by Stripe</p>
        <p>✓ Cancel anytime • No hidden fees • Instant access</p>
      </div>
    </div>
  );
}
