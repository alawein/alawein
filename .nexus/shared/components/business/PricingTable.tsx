import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
  disabled?: boolean;
  current?: boolean;
}

interface PricingTableProps {
  tiers: PricingTier[];
  onSubscribe: (tierId: string) => void;
  loading?: boolean;
  className?: string;
}

export function PricingTable({ tiers, onSubscribe, loading, className }: PricingTableProps) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-3', className)}>
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className={cn(
            'relative',
            tier.highlighted && 'border-primary shadow-lg scale-105',
            tier.disabled && 'opacity-60'
          )}
        >
          {tier.highlighted && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
          )}

          {tier.current && (
            <div className="absolute -top-4 right-4">
              <Badge variant="secondary">Current Plan</Badge>
            </div>
          )}

          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{tier.name}</CardTitle>
            <CardDescription className="text-sm">{tier.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                {tier.price === 0 ? 'Free' : `$${tier.price}`}
              </span>
              {tier.price > 0 && (
                <span className="text-muted-foreground">/{tier.interval}</span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {tier.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              variant={tier.highlighted ? 'default' : 'outline'}
              onClick={() => onSubscribe(tier.id)}
              disabled={tier.disabled || tier.current || loading}
              loading={loading}
            >
              {tier.current ? 'Current Plan' : tier.disabled ? 'Coming Soon' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

interface SubscriptionStatusProps {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  tier: string;
  trialEndsAt?: Date;
  renewsAt?: Date;
  className?: string;
}

export function SubscriptionStatus({
  status,
  tier,
  trialEndsAt,
  renewsAt,
  className,
}: SubscriptionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'trialing':
        return 'text-blue-600 bg-blue-50';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50';
      case 'canceled':
        return 'text-red-600 bg-red-50';
      case 'unpaid':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'unpaid':
        return 'Unpaid';
      default:
        return 'Unknown';
    }
  };

  const getDaysLeft = () => {
    if (!trialEndsAt) return null;
    const days = Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className={cn('flex items-center justify-between p-4 rounded-lg border', className)}>
      <div className="flex items-center space-x-3">
        <div className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor())}>
          {getStatusText()}
        </div>
        <span className="font-medium">{tier} Plan</span>
      </div>

      <div className="text-sm text-muted-foreground">
        {status === 'trialing' && trialEndsAt && (
          <span>{getDaysLeft()} days left in trial</span>
        )}
        {status === 'active' && renewsAt && (
          <span>Renews {renewsAt.toLocaleDateString()}</span>
        )}
        {status === 'canceled' && renewsAt && (
          <span>Access ends {renewsAt.toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  unit: string;
  icon?: React.ReactNode;
  className?: string;
}

export function UsageCard({ title, used, limit, unit, icon, className }: UsageCardProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {used.toLocaleString()} / {limit === -1 ? '∞' : limit.toLocaleString()} {unit}
            </span>
            <span className={cn(isNearLimit && 'text-yellow-600', isAtLimit && 'text-red-600')}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-primary'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {isNearLimit && (
            <p className="text-xs text-muted-foreground">
              {isAtLimit ? 'You have reached your limit' : 'You are approaching your limit'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
