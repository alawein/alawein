# 🚀 REPZ Platform - Quick Start Guide

**Time to complete**: 10-15 minutes  
**What you'll have**: Fully functional REPZ platform running locally

---

## 📋 What We'll Do

1. ✅ Create Supabase account & project (5 min)
2. ✅ Deploy database schema (2 min)
3. ✅ Configure environment (1 min)
4. ✅ Start the app (2 min)
5. ✅ Test it works (2 min)

---

## Step 1: Create Supabase Project

### 1.1 Go to Supabase
👉 **Open this link**: https://supabase.com/dashboard

### 1.2 Sign Up/Login
- Click "Start your project"
- Sign in with GitHub (easiest) or email

### 1.3 Create New Project
- Click **"New Project"** (green button)
- Fill in:
  - **Name**: `repz-platform`
  - **Database Password**: Click "Generate a password" 
    - ⚠️ **IMPORTANT**: Copy and save this password somewhere safe!
  - **Region**: Choose closest to you (e.g., "US East (North Virginia)")
  - **Pricing Plan**: Free
- Click **"Create new project"**
- ⏳ Wait 2-3 minutes (grab a coffee ☕)

---

## Step 2: Get Your API Keys

Once your project is ready (you'll see the dashboard):

### 2.1 Navigate to Settings
- Click **Settings** (gear icon) in the left sidebar
- Click **API** in the settings menu

### 2.2 Copy These Two Values

You'll see:

**Project URL** (looks like this):
```
https://abcdefghijklmnop.supabase.co
```
📋 **Copy this entire URL**

**anon public** key (long string starting with `eyJ`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNDU1NTU1NSwiZXhwIjoyMDIwMTMxNTU1fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
📋 **Copy this entire key**

**Keep these handy - you'll need them in Step 3!**

---

## Step 3: Deploy Database Schema

### 3.1 Open SQL Editor
- In your Supabase project, click **SQL Editor** in the left sidebar
- Click **"New query"** button

### 3.2 Get the Schema File
- In VS Code, open: `organizations/repz-llc/supabase/schema.sql`
- Press `Ctrl+A` (Windows) or `Cmd+A` (Mac) to select all
- Press `Ctrl+C` (Windows) or `Cmd+C` (Mac) to copy

### 3.3 Run the Schema
- Go back to Supabase SQL Editor
- Click in the editor and paste (`Ctrl+V` or `Cmd+V`)
- Click **"Run"** button (bottom right)
- ⏳ Wait 5-10 seconds
- You should see: ✅ **"Success. No rows returned"**

### 3.4 Verify It Worked
- Click **Table Editor** in the left sidebar
- You should see a list of tables:
  - profiles
  - client_profiles
  - workouts
  - messages
  - sessions
  - (and more!)

**If you see these tables, you're golden! ✅**

---

## Step 4: Configure Environment

### Now I'll create your .env.local file!

**Just paste your values here in the chat:**

```
My Supabase URL: [paste here]
My Supabase anon key: [paste here]
```

**Example:**
```
My Supabase URL: https://abcdefghijklmnop.supabase.co
My Supabase anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Once you paste them, I'll create the `.env.local` file for you automatically! 🎉

---

## Step 5: Start the Application

### 5.1 Install Dependencies (if not already done)
```bash
cd organizations/repz-llc/apps/repz
npm install
```

### 5.2 Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v7.2.2  ready in 1234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

---

## Step 6: Test It Works!

### 6.1 Open Browser
👉 Go to: http://localhost:8080

### 6.2 Create Test Account
- You should see the REPZ homepage
- Click **"Sign Up"** or **"Get Started"**
- Fill in:
  - **Email**: your-email@example.com
  - **Password**: TestPassword123!
  - **Name**: Test User
  - **Role**: Client
- Click **"Sign Up"**

### 6.3 Check Email
- Check your email inbox
- Click the verification link from Supabase
- You'll be redirected back to the app

### 6.4 Explore the Dashboard
You should now see:
- ✅ Client Dashboard
- ✅ Today's Workout section
- ✅ Week Calendar
- ✅ Progress Charts
- ✅ Goals
- ✅ Messages
- ✅ Sessions

**If you see all this, congratulations! 🎉 You're done!**

---

## 🎯 What You Can Do Now

### As a Client:
- View today's workout
- Log exercises
- Track progress
- Message your coach
- View upcoming sessions

### Test Coach Features:
1. Sign out
2. Sign up again with a different email
3. Select "Coach" as role
4. You'll see the Coaching Portal with:
   - Client management
   - Workout creation
   - Session scheduling
   - Message inbox

---

## 🐛 Troubleshooting

### "Invalid API key" error
**Fix**: 
1. Check your `.env.local` file
2. Make sure you copied the full URL and key
3. Restart the dev server:
   - Press `Ctrl+C` in terminal
   - Run `npm run dev` again

### "Table does not exist" error
**Fix**:
1. Go back to Supabase SQL Editor
2. Re-run the schema.sql
3. Check for any error messages

### Can't see tables in Supabase
**Fix**:
1. Refresh the Supabase page
2. Check SQL Editor for errors
3. Make sure the schema ran successfully

### Server won't start
**Fix**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port 8080 already in use
**Fix**:
```bash
# Use a different port
npm run dev -- --port 3000
```

---

## 📞 Need Help?

**I'm here to help!** Just tell me:
1. Which step you're on
2. What you're seeing
3. Any error messages

**Let's get you up and running! 🚀**

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema deployed (18 tables visible)
- [ ] .env.local file created with your keys
- [ ] Dependencies installed
- [ ] Dev server running on localhost:8080
- [ ] Can sign up and log in
- [ ] Can see client dashboard

**All checked? You're ready to build! 💪**
