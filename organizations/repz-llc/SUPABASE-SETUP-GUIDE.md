# 🚀 REPZ Platform - Supabase Setup & Integration Guide

**Date**: 2025-01-06  
**Status**: Complete Implementation Ready  
**Estimated Setup Time**: 30-45 minutes

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Deployment](#database-schema-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Storage Buckets Setup](#storage-buckets-setup)
6. [Testing the Integration](#testing-the-integration)
7. [External Services Setup](#external-services-setup)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- ✅ Supabase account (free tier works)
- ✅ Stripe account (test mode)
- ✅ Email service (optional: SendGrid, Resend, or similar)
- ✅ SMS service (optional: Twilio)

### Required Tools
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git
- ✅ Code editor (VS Code recommended)

---

## 2. Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Click "New Project"
5. Fill in project details:
   - **Name**: `repz-platform` (or your choice)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

6. Click "Create new project"
7. Wait 2-3 minutes for project to be ready

### Step 2: Get API Credentials

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (keep this secret!)

---

## 3. Database Schema Deployment

### Method 1: Using Supabase Dashboard (Recommended)

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Open the file: `organizations/repz-llc/supabase/schema.sql`
4. Copy ALL contents (800+ lines)
5. Paste into SQL Editor
6. Click "Run" (bottom right)
7. Wait for execution (should take 5-10 seconds)
8. Check for success message: "Success. No rows returned"

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push schema
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

### Verify Schema Deployment

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - ✅ profiles
   - ✅ client_profiles
   - ✅ coach_profiles
   - ✅ exercises
   - ✅ workout_templates
   - ✅ workouts
   - ✅ workout_logs
   - ✅ body_measurements
   - ✅ performance_metrics
   - ✅ biomarkers
   - ✅ messages
   - ✅ notifications
   - ✅ sessions
   - ✅ payments
   - ✅ subscriptions
   - ✅ non_portal_clients
   - ✅ audit_log
   - ✅ system_settings

3. Click on any table to verify structure

---

## 4. Environment Configuration

### Step 1: Create Environment File

In `organizations/repz-llc/apps/repz/`, create `.env.local`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...

# Stripe Configuration (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your-test-key...

# Optional: Production URLs
VITE_APP_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080/api
```

### Step 2: Update Supabase Service

The file `src/services/supabase.ts` will automatically read these environment variables.

### Step 3: Verify Configuration

```bash
# Navigate to REPZ app
cd organizations/repz-llc/apps/repz

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Should start on http://localhost:8080
```

---

## 5. Storage Buckets Setup

### Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Create these buckets:

#### Bucket 1: avatars
- **Name**: `avatars`
- **Public**: ✅ Yes
- **File size limit**: 2 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket 2: workout-videos
- **Name**: `workout-videos`
- **Public**: ✅ Yes
- **File size limit**: 100 MB
- **Allowed MIME types**: `video/mp4, video/webm`

#### Bucket 3: progress-photos
- **Name**: `progress-photos`
- **Public**: ❌ No (private)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png`

### Set Storage Policies

For each bucket, add RLS policies:

```sql
-- Avatars: Anyone can view, users can upload their own
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Workout videos: Anyone can view, coaches can upload
CREATE POLICY "Public workout videos are viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'workout-videos');

CREATE POLICY "Coaches can upload workout videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'workout-videos' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('coach', 'admin')
  )
);

-- Progress photos: Only owner and their coach can view
CREATE POLICY "Users can view own progress photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 6. Testing the Integration

### Test 1: Authentication

```typescript
// In browser console or test file
import { authService } from '@/services/supabase';

// Sign up test user
const result = await authService.signUp(
  'test@example.com',
  'TestPassword123!',
  'Test User',
  'client'
);

console.log('Sign up result:', result);
```

### Test 2: Database Query

```typescript
import { profileService } from '@/services/supabase';

// Get current user profile
const user = await authService.getCurrentUser();
const profile = await profileService.getProfile(user.id);

console.log('Profile:', profile);
```

### Test 3: Real-time Subscription

```typescript
import { realtimeService } from '@/services/supabase';

// Subscribe to messages
const channel = realtimeService.subscribeToMessages(
  user.id,
  (message) => {
    console.log('New message:', message);
  }
);

// Later: unsubscribe
realtimeService.unsubscribe(channel);
```

### Test 4: File Upload

```typescript
import { storageService } from '@/services/supabase';

// Upload avatar
const file = /* get file from input */;
const url = await storageService.uploadAvatar(user.id, file);

console.log('Avatar URL:', url);
```

---

## 7. External Services Setup

### Stripe Setup

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Switch to **Test Mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy **Publishable key** (starts with `pk_test_`)
5. Add to `.env.local`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

6. Create products in Stripe:
   - Foundation: $49/month
   - Performance: $99/month
   - Adaptive: $199/month
   - Longevity: $399/month

7. Copy product/price IDs and update in code

### Email Service Setup (Optional)

#### Using SendGrid:

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create API key
3. Verify sender email
4. Replace mock in `src/services/external-mocks.ts` with real SendGrid calls

#### Using Resend:

1. Sign up at [https://resend.com](https://resend.com)
2. Create API key
3. Add domain
4. Replace mock with Resend SDK

### SMS Service Setup (Optional)

#### Using Twilio:

1. Sign up at [https://twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Get phone number
4. Replace mock in `src/services/external-mocks.ts` with Twilio SDK

---

## 8. Troubleshooting

### Issue: "Invalid API key"

**Solution**: 
- Verify `.env.local` has correct values
- Restart dev server after changing `.env.local`
- Check Supabase dashboard for correct keys

### Issue: "Row Level Security policy violation"

**Solution**:
- Verify RLS policies are created (check schema.sql)
- Ensure user is authenticated
- Check user role matches policy requirements

### Issue: "Table does not exist"

**Solution**:
- Re-run schema.sql in SQL Editor
- Check for errors in execution
- Verify all tables created in Table Editor

### Issue: "CORS error"

**Solution**:
- Add your local URL to Supabase allowed origins
- Go to **Settings** → **API** → **URL Configuration**
- Add `http://localhost:8080`

### Issue: "Storage bucket not found"

**Solution**:
- Create storage buckets as described in section 5
- Verify bucket names match code
- Check RLS policies on storage

### Issue: "Function does not exist"

**Solution**:
- Verify database functions created (in schema.sql)
- Check function names match service calls
- Re-run schema if needed

---

## 9. Next Steps

### Development Workflow

1. **Start Development Server**:
   ```bash
   cd organizations/repz-llc/apps/repz
   npm run dev
   ```

2. **Test Features**:
   - Sign up as client
   - Sign up as coach
   - Create workouts
   - Log workouts
   - Send messages
   - Schedule sessions

3. **Replace Mocks**:
   - Update `src/services/external-mocks.ts` with real services
   - Test payment flow with Stripe
   - Test email notifications
   - Test SMS notifications

### Production Deployment

1. **Environment Variables**:
   - Set production Supabase URL and keys
   - Set production Stripe keys
   - Set production service keys

2. **Database**:
   - Run schema on production Supabase
   - Set up backups
   - Configure monitoring

3. **Security**:
   - Review RLS policies
   - Enable rate limiting
   - Set up monitoring
   - Configure alerts

4. **Performance**:
   - Enable caching
   - Optimize queries
   - Set up CDN
   - Monitor performance

---

## 10. Quick Reference

### Supabase Service Usage

```typescript
// Import service
import supabaseService from '@/services/supabase';

// Authentication
await supabaseService.auth.signUp(email, password, name);
await supabaseService.auth.signIn(email, password);
await supabaseService.auth.signOut();

// Profiles
await supabaseService.profile.getProfile(userId);
await supabaseService.profile.updateProfile(userId, updates);

// Coaching (for coaches)
await supabaseService.coaching.getClients(coachId);
await supabaseService.coaching.createWorkout(workout);
await supabaseService.coaching.createSession(session);

// Client (for clients)
await supabaseService.client.getTodayWorkout(clientId);
await supabaseService.client.logWorkout(log);
await supabaseService.client.getBodyMeasurements(clientId);

// Messaging
await supabaseService.messaging.getMessages(userId);
await supabaseService.messaging.sendMessage(message);

// Storage
await supabaseService.storage.uploadAvatar(userId, file);
await supabaseService.storage.uploadWorkoutVideo(exerciseId, file);

// Real-time
const channel = supabaseService.realtime.subscribeToMessages(userId, callback);
supabaseService.realtime.unsubscribe(channel);
```

### External Mocks Usage

```typescript
// Import mocks
import externalMocks from '@/services/external-mocks';

// Stripe
await externalMocks.stripe.createPaymentIntent(amount);
await externalMocks.stripe.createSubscription(customerId, priceId);

// Email
await externalMocks.email.sendTemplateEmail(to, 'welcome', data);

// SMS
await externalMocks.sms.sendSMS({ to, body });

// Notifications (combined)
await externalMocks.notification.sendWelcome(email, phone, name);
await externalMocks.notification.sendWorkoutAssigned(email, phone, workoutName, date);

// File Upload
await externalMocks.fileUpload.uploadAvatar(file, userId);
await externalMocks.fileUpload.uploadWorkoutVideo(file, exerciseId);
```

---

## 🎉 Setup Complete!

You now have:
- ✅ Complete Supabase database schema
- ✅ Type-safe API service layer
- ✅ External service mocks
- ✅ Storage buckets configured
- ✅ Real-time subscriptions ready
- ✅ Authentication system working

**Ready to develop!** 🚀

For questions or issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- Project README files
