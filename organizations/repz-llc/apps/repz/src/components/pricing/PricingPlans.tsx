import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PREMIUM_PLANS, type BillingCycle } from '@/types/subscription';
import { PaymentFlow } from '@/features/payment';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingPlansProps {
  showPaymentFlow?: boolean;
  onPlanSelect?: (billingCycle: BillingCycle) => void;
}

export function PricingPlans({ showPaymentFlow = false, onPlanSelect }: PricingPlansProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedBilling, setSelectedBilling] = useState<BillingCycle>('monthly');
  const [showCheckout, setShowCheckout] = useState(showPaymentFlow);

  const handleSelectPlan = (billingCycle: BillingCycle) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setSelectedBilling(billingCycle);
    
    if (onPlanSelect) {
      onPlanSelect(billingCycle);
    } else {
      setShowCheckout(true);
    }
  };

  if (showCheckout) {
    return <PaymentFlow />;
  }

  const monthlyPlan = PREMIUM_PLANS.find(p => p.billingCycle === 'monthly')!;
  const yearlyPlan = PREMIUM_PLANS.find(p => p.billingCycle === 'yearly')!;
  const savings = ((monthlyPlan.price * 12 - yearlyPlan.price) / 100).toFixed(2);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-repz-orange/20 text-repz-orange border-repz-orange">
          <Sparkles className="w-3 h-3 mr-1" />
          Premium Membership
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Unlock Your Full Potential
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Get unlimited access to workout tracking, video library, and advanced analytics
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-4 p-1 rounded-lg bg-gray-800/50 border border-gray-700">
          <button
            onClick={() => setSelectedBilling('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedBilling === 'monthly'
                ? 'bg-repz-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBilling('yearly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
              selectedBilling === 'yearly'
                ? 'bg-repz-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save ${savings}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {/* Free Tier */}
        <Card className="border-gray-700 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Free</CardTitle>
            <CardDescription>Get started with basic features</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-400 ml-2">/forever</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span>Basic workout logging</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span>Limited exercise library</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span>Basic progress tracking</span>
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300"
              disabled
            >
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Tier */}
        <Card className="border-repz-orange border-2 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-repz-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-white">Premium</CardTitle>
            <CardDescription>Everything you need to succeed</CardDescription>
            <div className="mt-4">
              {selectedBilling === 'monthly' ? (
                <>
                  <span className="text-4xl font-bold text-white">
                    ${(monthlyPlan.price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-white">
                    ${(yearlyPlan.price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-400 ml-2">/year</span>
                  <div className="text-sm text-green-400 mt-1">
                    ${((yearlyPlan.price / 12) / 100).toFixed(2)}/month • Save ${savings}
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {(selectedBilling === 'monthly' ? monthlyPlan : yearlyPlan).features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <Check className="h-5 w-5 text-repz-orange flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSelectPlan(selectedBilling)}
              className="w-full bg-repz-orange hover:bg-repz-orange-dark text-white font-semibold"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          What's Included
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-repz-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-repz-orange" />
            </div>
            <h4 className="text-white font-semibold mb-2">Unlimited Tracking</h4>
            <p className="text-gray-400 text-sm">
              Log unlimited workouts, exercises, and sets without restrictions
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-repz-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-repz-orange" />
            </div>
            <h4 className="text-white font-semibold mb-2">Video Library</h4>
            <p className="text-gray-400 text-sm">
              Access our complete library of exercise demonstration videos
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-repz-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-repz-orange" />
            </div>
            <h4 className="text-white font-semibold mb-2">Advanced Analytics</h4>
            <p className="text-gray-400 text-sm">
              Track your progress with detailed charts and insights
            </p>
          </div>
        </div>
      </div>

      {/* FAQ or Trust Signals */}
      <div className="mt-16 text-center">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>No hidden fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
