import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-gray-800 bg-gray-900">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-orange-500/20 p-3">
              <XCircle className="h-16 w-16 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white mb-2">
            Payment Canceled
          </CardTitle>
          <CardDescription className="text-lg">
            Your subscription was not activated
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Information */}
          <div className="bg-gray-800/50 rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-semibold text-white">What Happened?</h3>
            <p className="text-gray-300">
              You canceled the payment process before completing your subscription. 
              No charges were made to your account.
            </p>
          </div>

          {/* Why Subscribe */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Why Subscribe to Premium?</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-repz-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-repz-orange" />
                </div>
                <span>Unlimited workout tracking and progress monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-repz-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-repz-orange" />
                </div>
                <span>Access to our complete exercise video library</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-repz-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-repz-orange" />
                </div>
                <span>Advanced analytics and performance insights</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-repz-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-repz-orange" />
                </div>
                <span>Join our exclusive premium community</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-repz-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-repz-orange" />
                </div>
                <span>Cancel anytime, no long-term commitment</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Need help?</strong> If you encountered any issues during checkout, 
              please contact our support team at{' '}
              <a href="mailto:support@repz.com" className="underline hover:text-blue-200">
                support@repz.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate('/pricing')}
              className="flex-1 bg-repz-orange hover:bg-repz-orange-dark text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Free Plan Option */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-3">
              Not ready to subscribe? You can still use REPZ with our free plan.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Continue with Free Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
