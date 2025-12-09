# 🧪 REPZ Platform Testing Checklist

## Current Status
- ✅ Server running: http://localhost:8080
- ✅ Database schema created: ./supabase/reset-and-deploy.sql
- ⏳ Database deployment: **YOU NEED TO DO THIS**
- ⏳ Testing: Ready to start after database deployment

---

## 📋 Quick Testing Steps

### Step 1: Deploy Database (2 minutes)
**YOU MUST DO THIS FIRST!**

1. Go to: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/sql
2. Click "New query"
3. Copy ALL content from `./supabase/reset-and-deploy.sql`
4. Paste in SQL Editor
5. Click "Run"
6. Verify 18 tables created

---

### Step 2: Test User Registration (5 minutes)

#### Test 2.1: Register as Client
1. Open: http://localhost:8080/signup
2. Fill in:
   - Full Name: `John Client`
   - Email: `john@example.com`
   - Password: `TestPass123!`
   - Confirm: `TestPass123!`
   - Role: **Client**
   - ✅ Check "I agree"
3. Click "Create Account"
4. **Expected**: Success message or redirect

#### Test 2.2: Register as Coach
1. Open: http://localhost:8080/signup
2. Fill in:
   - Full Name: `Jane Coach`
   - Email: `jane@example.com`
   - Password: `TestPass123!`
   - Confirm: `TestPass123!`
   - Role: **Coach**
   - ✅ Check "I agree"
3. Click "Create Account"
4. **Expected**: Success message or redirect

---

### Step 3: Test Login (2 minutes)

1. Go to: http://localhost:8080/login
2. Enter:
   - Email: `john@example.com`
   - Password: `TestPass123!`
3. Click "Sign In"
4. **Expected**: Redirect to `/dashboard`

---

### Step 4: Test Client Dashboard (5 minutes)

**After logging in as client:**

1. Check dashboard loads: http://localhost:8080/dashboard
2. Verify sections:
   - [ ] Quick stats cards show
   - [ ] Week calendar displays
   - [ ] Today's workout section
   - [ ] Progress charts render
   - [ ] Goals section visible
   - [ ] Messages area works
   - [ ] Sessions booking available

---

### Step 5: Test Coach Portal (5 minutes)

1. Log out (if logged in)
2. Log in as coach (`jane@example.com`)
3. Go to: http://localhost:8080/coach-admin
4. Verify sections:
   - [ ] Client list displays
   - [ ] Stats dashboard shows
   - [ ] Can click "Create Workout"
   - [ ] Can click "Schedule Session"
   - [ ] Message inbox visible

---

### Step 6: Browser Console Check (1 minute)

1. Press `F12` to open DevTools
2. Click "Console" tab
3. Check for:
   - ❌ Red errors (should be none)
   - ⚠️ Yellow warnings (ok to have some)

---

### Step 7: Mobile Responsive Test (2 minutes)

1. Press `F12` for DevTools
2. Press `Ctrl+Shift+M` for device mode
3. Select "iPhone 12 Pro"
4. Check:
   - [ ] Signup form fits screen
   - [ ] Buttons are tappable size
   - [ ] Text is readable
   - [ ] No horizontal scroll

---

## 🔍 What to Look For

### ✅ Success Indicators:
- Forms submit without errors
- Pages load quickly (< 2 seconds)
- No red errors in console
- Smooth navigation between pages
- Data persists after refresh

### ❌ Common Issues:

| Issue | Cause | Fix |
|-------|-------|-----|
| "relation does not exist" | Database not deployed | Run SQL in Supabase |
| "Invalid API key" | Wrong credentials | Check .env.local |
| Form doesn't submit | Validation errors | Check all fields filled |
| Page not loading | Server not running | Restart with `npm run dev` |

---

## 📊 Testing Progress Tracker

### Authentication
- [ ] Client signup works
- [ ] Coach signup works
- [ ] Login works
- [ ] Logout works
- [ ] Form validation works

### Client Features
- [ ] Dashboard loads
- [ ] Can view profile
- [ ] Can see workouts
- [ ] Can track progress

### Coach Features
- [ ] Admin panel loads
- [ ] Can see client list
- [ ] Can create workout
- [ ] Can schedule session

### Performance
- [ ] Pages load < 2 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Smooth interactions

---

## 🎯 5-Minute Quick Test

If you're short on time, just do this:

1. **Deploy database** (2 min)
2. **Sign up** as client (1 min)
3. **Log in** (30 sec)
4. **Check dashboard** loads (30 sec)
5. **Open console** (F12) check for errors (1 min)

**Total: 5 minutes**

---

## 📝 Test Results Summary

After testing, fill this out:

```
Date: [TODAY'S DATE]
Tester: [YOUR NAME]

Database Deployed: [ ] Yes [ ] No
Total Tests Run: ___/20
Tests Passed: ___
Tests Failed: ___

Issues Found:
1.
2.
3.

Overall Status: [ ] Ready [ ] Needs Work
```

---

## 🚀 Next Steps After Testing

1. If all tests pass → Ready for production!
2. If issues found → Document and fix
3. Share results → Create issue on GitHub

---

## Need Help?

- **Database not deploying?** Make sure you're logged into Supabase
- **Can't see tables?** Refresh the Supabase dashboard
- **Server not running?** Check terminal for errors
- **Forms not working?** Check browser console (F12)

---

**Remember: Database deployment is required before ANY testing can work!**