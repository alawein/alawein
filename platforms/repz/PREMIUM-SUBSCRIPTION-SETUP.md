# REPZ Premium Subscription Setup Guide

This guide covers the complete setup and testing of the premium subscription system.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Stripe Configuration](#stripe-configuration)
5. [Supabase Edge Functions](#supabase-edge-functions)
6. [Frontend Integration](#frontend-integration)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- Supabase CLI installed (`npm install -g supabase`)
- Stripe account (test mode)
- Supabase project created
- Git repository access

---

## Environment Setup

### 1. Copy Environment File

```bash
cd organizations/repz-llc/apps/repz
cp .env.premium.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
# Get from Stripe Dashboard > Developers > API Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Get from Supabase Dashboard > Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

---

## Database Setup

### 1. Verify Subscription Tiers Table

The `subscription_tiers` table should already exist. Verify with:

```sql
SELECT * FROM subscription_tiers WHERE name = 'premium';
```

### 2. Seed Premium Tiers (if needed)

```sql
-- Monthly Premium Tier
INSERT INTO subscription_tiers (
  name,
  display_name,
  description,
  price_cents,
  billing_period,
  features,
  is_active,
  is_popular,
  sort_order
) VALUES (
  'premium',
  'Premium',
  'Unlimited workout tracking, video library, and advanced analytics',
  1999,
  'monthly',
  '{"unlimited_tracking": true, "video_library": true, "progress_analytics": true, "community_access": true, "mobile_app": true}'::jsonb,
  true,
  true,
  1
) ON CONFLICT (name, billing_period) DO NOTHING;

-- Yearly Premium Tier
INSERT INTO subscription_tiers (
  name,
  display_name,
  description,
  price_cents,
  billing_period,
  features,
  is_active,
  is_popular,
  sort_order
) VALUES (
  'premium',
  'Premium',
  'Unlimited workout tracking, video library, and advanced analytics',
  19999,
  'annual',
  '{"unlimited_tracking": true, "video_library": true, "progress_analytics": true, "community_access": true, "mobile_app": true, "save_40_per_year": true}'::jsonb,
  true,
  true,
  2
) ON CONFLICT (name, billing_period) DO NOTHING;
```

### 3. Verify Subscriptions Table

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions';
```

---

## Stripe Configuration

### 1. Create Products in Stripe Dashboard

1. Go to **Products** > **Add Product**
2. Create "REPZ Premium Monthly"
   - Price: $19.99
   - Billing: Monthly
   - Copy the Price ID (starts with `price_`)
3. Create "REPZ Premium Yearly"
   - Price: $199.99
   - Billing: Yearly
   - Copy the Price ID

### 2. Configure Webhook

1. Go to **Developers** > **Webhooks** > **Add Endpoint**
2. Endpoint URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing Secret** (starts with `whsec_`)

### 3. Update Environment Variables

Add to Supabase Edge Functions secrets:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Supabase Edge Functions

### 1. Deploy Edge Functions

```bash
cd organizations/repz-llc/apps/repz

# Deploy checkout function
supabase functions deploy create-premium-checkout

# Deploy webhook function
supabase functions deploy stripe-webhook
```

### 2. Set Function Secrets

```bash
# Set all required secrets
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  SUPABASE_URL=https://your-project.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Test Edge Functions

```bash
# Test checkout function
curl -X POST https://your-project.supabase.co/functions/v1/create-premium-checkout \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "premium-monthly",
    "billingCycle": "monthly",
    "priceInCents": 1999,
    "returnUrl": "http://localhost:5173/payment-success",
    "cancelUrl": "http://localhost:5173/pricing"
  }'
```

---

## Frontend Integration

### 1. Install Dependencies

```bash
npm install @stripe/stripe-js
```

### 2. Add Routes

Update your router configuration to include:

```typescript
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCancel from '@/pages/PaymentCancel';

// Add routes
{
  path: '/payment-success',
  element: <PaymentSuccess />
},
{
  path: '/payment-cancel',
  element: <PaymentCancel />
},
{
  path: '/pricing',
  element: <PricingPlans />
}
```

### 3. Add Pricing Link to Navigation

```typescript
<Link to="/pricing">Upgrade to Premium</Link>
```

---

## Testing

### Test Checklist

#### 1. Component Rendering
- [ ] PricingPlans component displays correctly
- [ ] Monthly/Yearly toggle works
- [ ] Plan cards show correct prices
- [ ] Features list displays properly

#### 2. Payment Flow
- [ ] Click "Get Started" redirects to Stripe Checkout
- [ ] Stripe Checkout displays correct amount
- [ ] Test card (4242 4242 4242 4242) processes successfully
- [ ] Redirects to success page after payment
- [ ] Cancel button redirects to cancel page

#### 3. Subscription Management
- [ ] useSubscription hook fetches subscription data
- [ ] Subscription status updates in real-time
- [ ] hasTierAccess function works correctly
- [ ] Cancel subscription function works
- [ ] Reactivate subscription function works

#### 4. Webhook Processing
- [ ] checkout.session.completed creates subscription
- [ ] customer.subscription.updated updates status
- [ ] customer.subscription.deleted marks as canceled
- [ ] invoice.payment_succeeded activates subscription
- [ ] invoice.payment_failed marks as past_due

### Test Cards

Use these Stripe test cards:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | Requires authentication |

### Manual Testing Steps

#### Test 1: Successful Payment

```bash
1. Navigate to /pricing
2. Select Monthly plan
3. Click "Get Started"
4. Enter test card: 4242 4242 4242 4242
5. Complete checkout
6. Verify redirect to /payment-success
7. Check database for new subscription record
8. Verify subscription status in dashboard
```

#### Test 2: Canceled Payment

```bash
1. Navigate to /pricing
2. Select Yearly plan
3. Click "Get Started"
4. Click "Back" or close Stripe Checkout
5. Verify redirect to /payment-cancel
6. Check no subscription was created
```

#### Test 3: Webhook Processing

```bash
# Trigger webhook manually
stripe trigger checkout.session.completed

# Check Supabase logs
supabase functions logs stripe-webhook

# Verify subscription in database
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
```

---

## Deployment

### Production Checklist

- [ ] Replace test Stripe keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Set production environment variables
- [ ] Deploy edge functions to production
- [ ] Test with real payment (small amount)
- [ ] Monitor Stripe Dashboard for events
- [ ] Set up error alerting
- [ ] Configure backup webhook endpoint

### Deploy Commands

```bash
# Deploy to production
npm run build
supabase functions deploy create-premium-checkout --project-ref your-prod-ref
supabase functions deploy stripe-webhook --project-ref your-prod-ref

# Set production secrets
supabase secrets set --project-ref your-prod-ref \
  STRIPE_SECRET_KEY=sk_live_... \
  STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Troubleshooting

### Issue: Checkout session not creating

**Solution:**
1. Check browser console for errors
2. Verify VITE_STRIPE_PUBLIC_KEY is set
3. Check edge function logs: `supabase functions logs create-premium-checkout`
4. Verify Stripe API key is valid

### Issue: Webhook not processing

**Solution:**
1. Check webhook signing secret is correct
2. Verify webhook endpoint URL in Stripe Dashboard
3. Check edge function logs: `supabase functions logs stripe-webhook`
4. Test webhook with Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`

### Issue: Subscription not showing in database

**Solution:**
1. Check webhook was received (Stripe Dashboard > Webhooks)
2. Verify subscription_tiers table has premium tier
3. Check edge function logs for errors
4. Manually trigger webhook: `stripe trigger checkout.session.completed`

### Issue: Payment succeeds but subscription inactive

**Solution:**
1. Check subscription status in Stripe Dashboard
2. Verify webhook processed successfully
3. Check database subscription status
4. Manually update if needed:
```sql
UPDATE subscriptions 
SET status = 'active' 
WHERE stripe_subscription_id = 'sub_...';
```

---

## Monitoring

### Key Metrics to Track

1. **Conversion Rate**: Pricing page visits → Successful payments
2. **Failed Payments**: Track and investigate failures
3. **Churn Rate**: Canceled subscriptions
4. **MRR**: Monthly Recurring Revenue
5. **Webhook Success Rate**: % of webhooks processed successfully

### Stripe Dashboard

Monitor these sections:
- **Payments** > Recent payments
- **Subscriptions** > Active subscriptions
- **Developers** > Webhooks > Event logs
- **Developers** > Logs > API requests

### Supabase Dashboard

Monitor:
- **Edge Functions** > Logs
- **Database** > Table Editor > subscriptions
- **Auth** > Users (subscription status)

---

## Support

### Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)

### Contact

For issues or questions:
- Email: dev@repz.com
- Slack: #repz-dev
- GitHub Issues: [repz-llc/repz](https://github.com/repz-llc/repz/issues)

---

## Changelog

### v1.0.0 (2025-01-06)
- Initial premium subscription implementation
- Monthly ($19.99) and Yearly ($199.99) plans
- Stripe Checkout integration
- Webhook processing
- Success/Cancel pages
- Subscription management hooks
