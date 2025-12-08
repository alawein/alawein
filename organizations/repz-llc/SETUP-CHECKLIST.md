# ✅ REPZ Platform Setup Checklist

Follow these steps in order. Check off each item as you complete it.

---

## Step 1: Create Supabase Account & Project (5 minutes)

### 1.1 Create Account
- [ ] Go to https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign up with GitHub, Google, or email
- [ ] Verify your email if needed

### 1.2 Create Project
- [ ] Click "New Project" (green button)
- [ ] Fill in:
  - **Organization**: Create new or select existing
  - **Name**: `repz-platform` (or your choice)
  - **Database Password**: Click "Generate a password" and **SAVE IT SOMEWHERE SAFE**
  - **Region**: Choose closest to you (e.g., US East, Europe West)
  - **Pricing Plan**: Free (perfect for development)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for setup to complete (you'll see a progress bar)

---

## Step 2: Get Your API Keys (2 minutes)

Once your project is ready:

- [ ] In the left sidebar, click **Settings** (gear icon at bottom)
- [ ] Click **API** in the settings menu
- [ ] You'll see two important values:

### Copy These Values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
- [ ] Copy this URL (you'll need it in Step 4)

**anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTU1NTUsImV4cCI6MjAyMDEzMTU1NX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- [ ] Copy this key (you'll need it in Step 4)

**Keep these safe! You'll need them in a moment.**

---

## Step 3: Deploy Database Schema (3 minutes)

### 3.1 Open SQL Editor
- [ ] In your Supabase project, click **SQL Editor** in the left sidebar
- [ ] Click **New Query** button (top right)

### 3.2 Copy Schema
- [ ] Open the file: `organizations/repz-llc/supabase/schema.sql` in VS Code
- [ ] Select ALL content (Ctrl+A or Cmd+A)
- [ ] Copy it (Ctrl+C or Cmd+C)

### 3.3 Run Schema
- [ ] Go back to Supabase SQL Editor
- [ ] Paste the schema into the editor (Ctrl+V or Cmd+V)
- [ ] Click **Run** button (bottom right corner)
- [ ] Wait 5-10 seconds
- [ ] You should see: "Success. No rows returned"

### 3.4 Verify Tables Created
- [ ] Click **Table Editor** in the left sidebar
- [ ] You should see these tables:
  - profiles
  - client_profiles
  - coach_profiles
  - exercises
  - workouts
  - workout_logs
  - messages
  - sessions
  - (and more - 18 total)

**If you see these tables, you're good! ✅**

---

## Step 4: Configure Environment Variables (2 minutes)

### 4.1 Create .env.local File

I'll create this file for you. Just tell me:
1. Your Supabase Project URL (from Step 2)
2. Your Supabase anon key (from Step 2)

**Paste them in the chat and I'll create the file for you!**

The file will look like this:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
```

---

## Step 5: Create Storage Buckets (3 minutes)

### 5.1 Create Avatars Bucket
- [ ] In Supabase, click **Storage** in left sidebar
- [ ] Click **Create a new bucket**
- [ ] Fill in:
  - **Name**: `avatars`
  - **Public bucket**: ✅ Check this box
  - **File size limit**: 2 MB
  - **Allowed MIME types**: Leave empty (allows all images)
- [ ] Click **Create bucket**

### 5.2 Create Workout Videos Bucket
- [ ] Click **Create a new bucket** again
- [ ] Fill in:
  - **Name**: `workout-videos`
  - **Public bucket**: ✅ Check this box
  - **File size limit**: 100 MB
- [ ] Click **Create bucket**

### 5.3 Create Progress Photos Bucket
- [ ] Click **Create a new bucket** again
- [ ] Fill in:
  - **Name**: `progress-photos`
  - **Public bucket**: ❌ Leave unchecked (private)
  - **File size limit**: 5 MB
- [ ] Click **Create bucket**

**You should now see 3 buckets in Storage! ✅**

---

## Step 6: Install Dependencies & Start Server (2 minutes)

### 6.1 Install Dependencies
```bash
cd organizations/repz-llc/apps/repz
npm install
```

### 6.2 Start Development Server
```bash
npm run dev
```

**Server should start at: http://localhost:8080**

---

## Step 7: Test the Application (5 minutes)

### 7.1 Open Browser
- [ ] Go to http://localhost:8080
- [ ] You should see the REPZ homepage

### 7.2 Create Test Account
- [ ] Click "Sign Up"
- [ ] Fill in:
  - Email: your-email@example.com
  - Password: TestPassword123!
  - Name: Test User
  - Role: Client
- [ ] Click "Sign Up"
- [ ] Check your email for verification link
- [ ] Click verification link

### 7.3 Test Features
- [ ] Log in with your account
- [ ] You should see the Client Dashboard
- [ ] Check that you can:
  - View today's workout
  - See the week calendar
  - Navigate between tabs
  - View messages section

**If everything works, you're done! 🎉**

---

## Step 8: Create Coach Account (Optional)

To test the coaching portal:

### 8.1 Sign Out
- [ ] Click your profile icon
- [ ] Click "Sign Out"

### 8.2 Create Coach Account
- [ ] Click "Sign Up"
- [ ] Use a different email
- [ ] Select "Coach" as role
- [ ] Complete signup

### 8.3 Test Coaching Portal
- [ ] Log in as coach
- [ ] You should see the Coaching Portal
- [ ] Try creating a workout
- [ ] Try scheduling a session

---

## Troubleshooting

### Issue: "Invalid API key"
**Solution**: 
- Double-check your .env.local file
- Make sure you copied the full key
- Restart the dev server (Ctrl+C, then `npm run dev`)

### Issue: "Table does not exist"
**Solution**:
- Go back to Step 3
- Re-run the schema.sql in SQL Editor
- Check for any error messages

### Issue: Can't see tables in Table Editor
**Solution**:
- Refresh the page
- Check that schema ran successfully
- Look for error messages in SQL Editor

### Issue: Server won't start
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## 🎉 Success Criteria

You're done when:
- ✅ Supabase project created
- ✅ Database schema deployed (18 tables visible)
- ✅ Storage buckets created (3 buckets)
- ✅ Environment variables configured
- ✅ Dev server running on localhost:8080
- ✅ Can sign up and log in
- ✅ Can see dashboard

---

## Next Steps After Setup

Once everything is working:

1. **Explore Features**:
   - Create workouts as coach
   - Log workouts as client
   - Send messages
   - Schedule sessions

2. **Customize**:
   - Add your branding
   - Customize colors
   - Add your content

3. **Deploy**:
   - Set up production Supabase
   - Deploy to Vercel/Netlify
   - Configure custom domain

---

## Need Help?

**I'm here to help!** Just tell me:
- Which step you're on
- What you're seeing
- Any error messages

Let's get you set up! 🚀
