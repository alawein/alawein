# 🧪 REPZ Platform - Complete Testing Guide

## 📋 Prerequisites

Before you can test, you need to deploy the database schema to Supabase.

---

## Step 1: Deploy Database Schema (2 minutes)

### **Option A: Via Supabase Dashboard (Recommended)**

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/sql
   - Click "New query"

2. **Copy the Schema**:
   - Open `organizations/repz-llc/supabase/reset-and-deploy.sql` in VS Code
   - Press `Ctrl+A` to select all
   - Press `Ctrl+C` to copy

3. **Paste and Run**:
   - Paste in Supabase SQL Editor (`Ctrl+V`)
   - Click "Run" button
   - Wait for "Success" message

4. **Verify**:
   - Go to: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/editor
   - You should see 18 tables:
     - profiles
     - client_profiles
     - coach_profiles
     - exercises
     - workout_templates
     - workouts
     - workout_logs
     - body_measurements
     - performance_metrics
     - biomarkers
     - messages
     - notifications
     - sessions
     - payments
     - subscriptions
     - non_portal_clients
     - audit_log
     - system_settings

### **Option B: Via Supabase CLI**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref lvmcumsfpjjcgnnovvzs

# Deploy the schema
cd organizations/repz-llc
supabase db push
```

---

## Step 2: Test the Application

### **A. Visual Verification (Already Done!)**

The browser should already be open at http://localhost:8081/signup

**Check:**
- ✅ All text is clearly visible (dark labels)
- ✅ Orange theme is present (logo, button, links)
- ✅ Input fields have good contrast
- ✅ Form looks professional

---

### **B. Authentication Testing**

#### **Test 1: Sign Up as Client**

1. **Fill in the form**:
   - Full Name: `Test Client`
   - Email: `testclient@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
   - Role: Select "Client"
   - Check "I agree to the Terms of Service"

2. **Click "Create Account"**

3. **Expected Result**:
   - Success message: "Account created! Check your email to verify your account."
   - Redirected to login page
   - Email sent to testclient@example.com (check Supabase Auth logs)

4. **Verify in Database**:
   - Go to: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/editor
   - Open `profiles` table
   - You should see the new user with email `testclient@example.com`

#### **Test 2: Sign Up as Coach**

1. **Go back to signup**: http://localhost:8081/signup

2. **Fill in the form**:
   - Full Name: `Test Coach`
   - Email: `testcoach@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
   - Role: Select "Coach"
   - Check "I agree to the Terms of Service"

3. **Click "Create Account"**

4. **Expected Result**:
   - Success message
   - Redirected to login page
   - Email sent

#### **Test 3: Login**

1. **Go to login page**: http://localhost:8081/login

2. **Enter credentials**:
   - Email: `testclient@example.com`
   - Password: `TestPassword123!`

3. **Click "Sign In"**

4. **Expected Result**:
   - Successfully logged in
   - Redirected to `/dashboard`
   - Client dashboard loads with:
     - Quick stats (workouts, weight, sessions, streak)
     - Week calendar
     - Today's workout section
     - Progress charts
     - Goals section

#### **Test 4: Form Validation**

1. **Go to signup**: http://localhost:8081/signup

2. **Test empty form**:
   - Click "Create Account" without filling anything
   - **Expected**: Error messages appear for all required fields

3. **Test invalid email**:
   - Enter: `notanemail`
   - **Expected**: "Please enter a valid email address"

4. **Test weak password**:
   - Enter: `123`
   - **Expected**: "Password must be at least 8 characters"

5. **Test password mismatch**:
   - Password: `TestPassword123!`
   - Confirm: `DifferentPassword123!`
   - **Expected**: "Passwords do not match"

6. **Test password strength indicator**:
   - Enter: `weak` - Should show "Very Weak" (red)
   - Enter: `Weak123` - Should show "Fair" (yellow)
   - Enter: `Strong123!` - Should show "Good" (blue)
   - Enter: `VeryStrong123!@#` - Should show "Strong" (green)

---

### **C. Client Portal Testing**

**Prerequisites**: Logged in as client

#### **Test 1: Dashboard**

1. **Navigate to**: http://localhost:8081/dashboard

2. **Verify sections load**:
   - ✅ Quick stats cards
   - ✅ Week calendar
   - ✅ Today's workout
   - ✅ Progress charts
   - ✅ Goals section
   - ✅ Messages section
   - ✅ Sessions section

#### **Test 2: Workout Logging**

1. **Go to "Today's Workout" tab**

2. **If no workout assigned**:
   - Should show "No workout scheduled for today"

3. **If workout assigned** (need coach to assign):
   - Expand an exercise
   - Enter: Sets: 3, Reps: 10, Weight: 50, RPE: 7
   - Click "Log Set"
   - **Expected**: Set logged successfully

#### **Test 3: Progress Tracking**

1. **Go to "Progress" tab**

2. **Check charts**:
   - Weight chart
   - Body fat chart
   - Strength chart

3. **Add measurement**:
   - Click "Add Measurement"
   - Enter weight, body fat, etc.
   - Save
   - **Expected**: Chart updates

#### **Test 4: Goals**

1. **Go to "Goals" tab**

2. **Create goal**:
   - Click "Add Goal"
   - Enter: "Lose 10 lbs"
   - Set deadline
   - Save
   - **Expected**: Goal appears in list

---

### **D. Coach Portal Testing**

**Prerequisites**: Logged in as coach

#### **Test 1: Coach Dashboard**

1. **Navigate to**: http://localhost:8081/coach-admin

2. **Verify sections**:
   - ✅ Client list
   - ✅ Stats dashboard
   - ✅ Workout creation
   - ✅ Session scheduling
   - ✅ Message inbox

#### **Test 2: Client Management**

1. **View client list**:
   - Should show all clients
   - Search functionality
   - Filter by status

2. **View client details**:
   - Click on a client
   - See profile, workouts, progress

#### **Test 3: Workout Creation**

1. **Click "Create Workout"**

2. **Fill in details**:
   - Name: "Upper Body Day"
   - Select client
   - Add exercises
   - Set sets/reps
   - Schedule date

3. **Save**

4. **Expected**: Workout created and assigned to client

#### **Test 4: Session Scheduling**

1. **Click "Schedule Session"**

2. **Fill in details**:
   - Select client
   - Choose type (video, phone, in-person, assessment)
   - Set date/time
   - Add notes

3. **Save**

4. **Expected**: Session scheduled, client notified

---

### **E. Real-time Features Testing**

#### **Test 1: Messaging**

1. **Open two browser windows**:
   - Window 1: Coach logged in
   - Window 2: Client logged in

2. **Coach sends message**:
   - Go to Messages
   - Select client
   - Type message
   - Send

3. **Expected**: Message appears in client's inbox in real-time (without refresh)

#### **Test 2: Notifications**

1. **Coach assigns workout**

2. **Expected**: Client receives notification immediately

---

### **F. Error Handling Testing**

#### **Test 1: Network Errors**

1. **Disconnect internet**

2. **Try to submit form**

3. **Expected**: Error message "Network error, please try again"

#### **Test 2: Invalid Data**

1. **Try to create workout with invalid data**

2. **Expected**: Validation errors displayed

---

## Step 3: Browser Console Testing

### **Check for Errors**

1. **Open browser console**: Press `F12`

2. **Go to Console tab**

3. **Look for**:
   - ❌ Red errors (should be none)
   - ⚠️ Yellow warnings (acceptable)
   - ℹ️ Blue info (normal)

4. **Common issues**:
   - "Failed to fetch" - Database not deployed
   - "Invalid API key" - Check .env.local
   - "Relation does not exist" - Database not deployed

---

## Step 4: Performance Testing

### **Check Load Times**

1. **Open browser DevTools**: Press `F12`

2. **Go to Network tab**

3. **Reload page**: Press `Ctrl+R`

4. **Check**:
   - Page load: Should be < 2 seconds
   - API calls: Should be < 500ms
   - Images: Should load quickly

---

## Step 5: Mobile Testing

### **Responsive Design**

1. **Open browser DevTools**: Press `F12`

2. **Click device toolbar icon** (or press `Ctrl+Shift+M`)

3. **Select device**:
   - iPhone 12 Pro
   - iPad
   - Galaxy S20

4. **Test**:
   - ✅ Form is usable
   - ✅ Buttons are tappable
   - ✅ Text is readable
   - ✅ Layout adapts

---

## 🐛 Troubleshooting

### **Issue: "Relation does not exist"**

**Cause**: Database schema not deployed

**Fix**: Run the SQL script in Supabase (Step 1)

### **Issue: "Invalid API key"**

**Cause**: Wrong credentials in .env.local

**Fix**: 
1. Check `organizations/repz-llc/apps/repz/.env.local`
2. Verify URL and key match Supabase project

### **Issue: "Network error"**

**Cause**: Server not running or wrong URL

**Fix**:
1. Check server is running: http://localhost:8081
2. Restart server: `npm run dev`

### **Issue: Form doesn't submit**

**Cause**: Validation errors or database issue

**Fix**:
1. Check browser console for errors
2. Verify all required fields filled
3. Check database is deployed

---

## ✅ Testing Checklist

### **Pre-Testing**
- [ ] Database schema deployed
- [ ] Server running on port 8081
- [ ] Browser open at /signup
- [ ] .env.local configured

### **Authentication**
- [ ] Can sign up as client
- [ ] Can sign up as coach
- [ ] Can log in
- [ ] Can log out
- [ ] Form validation works
- [ ] Password strength indicator works

### **Client Portal**
- [ ] Dashboard loads
- [ ] Can view workouts
- [ ] Can log exercises
- [ ] Can track progress
- [ ] Can set goals
- [ ] Can send messages
- [ ] Can book sessions

### **Coach Portal**
- [ ] Dashboard loads
- [ ] Can view clients
- [ ] Can create workouts
- [ ] Can schedule sessions
- [ ] Can send messages
- [ ] Can track client progress

### **Real-time**
- [ ] Messages appear in real-time
- [ ] Notifications work
- [ ] Updates sync across devices

### **Performance**
- [ ] Page loads < 2 seconds
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Smooth interactions

---

## 🎯 Quick Test Script

**5-Minute Smoke Test:**

```bash
# 1. Deploy database (if not done)
# Run reset-and-deploy.sql in Supabase

# 2. Open browser
start http://localhost:8081/signup

# 3. Sign up
# Fill form, create account

# 4. Log in
# Use credentials from step 3

# 5. Check dashboard
# Verify it loads

# 6. Open console (F12)
# Check for errors

# Done! ✅
```

---

## 📞 Need Help?

**Common Questions:**

**Q: Where do I run the SQL script?**  
A: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/sql

**Q: How do I check if database is deployed?**  
A: Go to Table Editor, you should see 18 tables

**Q: Can I test without deploying database?**  
A: No, authentication requires the database

**Q: How do I reset the database?**  
A: Run reset-and-deploy.sql again (it drops and recreates everything)

---

**Ready to test? Start with Step 1: Deploy the database!** 🚀
