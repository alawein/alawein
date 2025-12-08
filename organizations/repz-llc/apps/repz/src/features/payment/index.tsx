// Simplified Payment Feature - All-in-one component
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type Plan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: ['Unlimited workouts', 'Video library', 'Progress analytics', 'Community access']
  },
  {
    id: 'premium-yearly',
    name: 'Premium',
    price: 199.99,
    interval: 'year',
    features: ['Unlimited workouts', 'Video library', 'Progress analytics', 'Community access', 'Save $40/year']
  }
];

// API Functions
const getSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, subscription_tiers(name)')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

const createCheckout = async (planId: string) => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { planId, successUrl: `${window.location.origin}/payment/success`, cancelUrl: `${window.location.origin}/payment` }
  });
  
  if (error) throw error;
  return data;
};

// Components
const PricingCard = ({ plan, onSelect, loading }: { plan: Plan; onSelect: () => void; loading: boolean }) => (
  <Card className={cn("relative", plan.interval === 'year' && "border-primary")}>
    {plan.interval === 'year' && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
        Best Value
      </div>
    )}
    <CardHeader>
      <CardTitle>{plan.name}</CardTitle>
      <CardDescription>
        <span className="text-3xl font-bold text-foreground">${plan.price}</span>
        <span className="text-muted-foreground">/{plan.interval}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="space-y-2">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
      </Button>
    </CardContent>
  </Card>
);

// Main Component
export const PaymentFlow = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Fetch subscription
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => getSubscription(user!.id),
    enabled: !!user
  });

  // Create checkout
  const checkout = useMutation({
    mutationFn: createCheckout,
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
    },
    onError: () => toast.error('Failed to start checkout')
  });

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    checkout.mutate(planId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (subscription) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Active Subscription</CardTitle>
          <CardDescription>You're currently subscribed to Premium</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your subscription renews on {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">Start your fitness journey today</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={() => handleSubscribe(plan.id)}
            loading={checkout.isPending && selectedPlan === plan.id}
          />
        ))}
      </div>
    </div>
  );
};

// Success/Cancel Pages
export const PaymentSuccess = () => (
  <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
    <div className="mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground">Your subscription is now active</p>
    </div>
    <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
  </div>
);

export const PaymentCancel = () => (
  <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
    <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
    <p className="text-muted-foreground mb-6">You can try again anytime</p>
    <Button onClick={() => window.location.href = '/payment'}>Back to Plans</Button>
  </div>
);
