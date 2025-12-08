import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mail, User, UserPlus } from 'lucide-react';

interface GuestCheckoutOptionProps {
  checkoutType: 'guest' | 'account';
  onCheckoutTypeChange: (type: 'guest' | 'account') => void;
  isAuthenticated: boolean;
}

export function GuestCheckoutOption({
  checkoutType,
  onCheckoutTypeChange,
  isAuthenticated,
}: GuestCheckoutOptionProps) {
  if (isAuthenticated) {
    return null; // Don't show if user is already logged in
  }

  return (
    <Card className="bg-lii-ink border-lii-gold/10 mb-6">
      <CardContent className="pt-6">
        <RadioGroup
          value={checkoutType}
          onValueChange={(value) => onCheckoutTypeChange(value as 'guest' | 'account')}
          className="space-y-4"
        >
          {/* Guest Checkout Option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="guest" id="guest" className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor="guest"
                className="text-lii-cloud font-medium cursor-pointer flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-lii-gold" />
                Checkout as Guest
              </Label>
              <p className="text-lii-ash text-sm mt-1">
                Quick checkout with email only. You can create an account later.
              </p>
            </div>
          </div>

          {/* Create Account Option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="account" id="account" className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor="account"
                className="text-lii-cloud font-medium cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-lii-gold" />
                Create an Account
              </Label>
              <p className="text-lii-ash text-sm mt-1">
                Save your information for faster checkout next time and track your orders.
              </p>
            </div>
          </div>
        </RadioGroup>

        {checkoutType === 'account' && (
          <div className="mt-4 p-4 bg-lii-gold/5 rounded-lg border border-lii-gold/20">
            <p className="text-lii-cloud text-sm font-medium mb-2">Benefits of creating an account:</p>
            <ul className="text-lii-ash text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lii-gold"></span>
                Track your orders in real-time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lii-gold"></span>
                Save addresses for faster checkout
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lii-gold"></span>
                Access exclusive member benefits
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lii-gold"></span>
                View order history and reorder easily
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
