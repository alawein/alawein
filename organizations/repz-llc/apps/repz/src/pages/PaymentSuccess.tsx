import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subscription, loading, refetch } = useSubscription();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Refetch subscription to get updated status
    const verifyPayment = async () => {
      setVerifying(true);
      
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refetch subscription
      await refetch();
      
      setVerifying(false);
    };

    verifyPayment();
  }, [refetch]);

  const sessionId = searchParams.get('session_id');

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-800 bg-gray-900">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-repz-orange animate-spin mb-4" />
              <p className="text-gray-400">Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-gray-800 bg-gray-900">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-500/20 p-3">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white mb-2">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome to REPZ Premium
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Subscription Details */}
          {subscription && (
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Your Subscription</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Plan</p>
                  <p className="text-white font-medium capitalize">{subscription.tier}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="text-green-400 font-medium capitalize">{subscription.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Started</p>
                  <p className="text-white font-medium">
                    {subscription.currentPeriodStart.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Next Billing</p>
                  <p className="text-white font-medium">
                    {subscription.currentPeriodEnd.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">What's Next?</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Access unlimited workout tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Browse our complete video library</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Track your progress with advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Join our premium community</span>
              </li>
            </ul>
          </div>

          {/* Receipt Info */}
          {sessionId && (
            <div className="text-sm text-gray-400 text-center pt-4 border-t border-gray-800">
              <p>A receipt has been sent to your email.</p>
              <p className="text-xs mt-1">Session ID: {sessionId.slice(0, 20)}...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-repz-orange hover:bg-repz-orange-dark text-white"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate('/workouts')}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Start Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
