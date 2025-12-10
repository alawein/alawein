# 🤖 Claude Opus Superprompt - Complete REPZ Platform Setup

**Purpose**: Deploy and test the complete REPZ fitness coaching platform with
Supabase integration  
**Target AI**: Claude Opus (with MCP/Supabase access)  
**Estimated Time**: 10-15 minutes  
**Complexity**: Medium

---

## 📋 Context & Background

You are tasked with completing the setup and deployment of the REPZ fitness
coaching platform. The codebase is 95% complete with 4,580+ lines of
production-ready code already implemented. Your job is to:

1. Deploy the database schema to Supabase
2. Verify the deployment
3. Test the authentication flow
4. Validate all features work correctly

---

## 🎯 Your Mission

Complete the REPZ platform setup by deploying the database and testing all
features. You have access to:

- Supabase MCP server for database operations
- File system access to read/write files
- Command execution for running the dev server
- Browser automation for testing

---

## 📦 What's Already Done

### ✅ Complete Implementation (4,580+ lines)

- **Database Schema**: `organizations/repz-llc/supabase/reset-and-deploy.sql`
  (800+ lines)
  - 18 tables with complete structure
  - Row Level Security (RLS) policies
  - Triggers and functions
  - Indexes for performance

- **Coaching Portal**:
  `organizations/repz-llc/apps/repz/src/features/coaching-portal/index.tsx` (964
  lines)
  - Client management
  - Workout creation
  - Session scheduling
  - Message inbox

- **Client Portal**:
  `organizations/repz-llc/apps/repz/src/features/client-portal/index.tsx` (958
  lines)
  - Dashboard with stats
  - Workout logging
  - Progress tracking
  - Goal management

- **Supabase Integration**:
  `organizations/repz-llc/apps/repz/src/services/supabase.ts` (658 lines)
  - Type-safe API layer
  - Authentication service
  - Real-time subscriptions
  - Storage service

- **External Mocks**:
  `organizations/repz-llc/apps/repz/src/services/external-mocks.ts` (450+ lines)
  - Stripe payment mocks
  - Email service mocks
  - SMS service mocks

### ✅ Configuration Complete

- **Environment**: `organizations/repz-llc/apps/repz/.env.local`

  ```env
  VITE_SUPABASE_URL=https://lvmcumsfpjjcgnnovvzs.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWN1bXNmcGpqY2dubm92dnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzgxNjMsImV4cCI6MjA2OTAxNDE2M30.C5v_PRCHOjyP8onQyjCT003YCUI2byoU0AXiizZynJI
  ```

- **Supabase Project**:
  - Project ID: `lvmcumsfpjjcgnnovvzs`
  - Project URL: `https://lvmcumsfpjjcgnnovvzs.supabase.co`
  - Region: US West 1

---

## 🚀 Your Tasks (Step-by-Step)

### Task 1: Connect to Supabase via MCP

**Objective**: Establish connection to the Supabase project

**MCP Configuration**:

```json
{
  "servers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=lvmcumsfpjjcgnnovvzs"
    }
  }
}
```

**Actions**:

1. Use the Supabase MCP server to connect
2. Verify connection is successful
3. List existing tables (should be empty or have old tables)

**Expected Result**: Connection established, ready to deploy schema

---

### Task 2: Deploy Database Schema

**Objective**: Create all 18 tables with RLS policies, triggers, and functions

**Schema File**: `organizations/repz-llc/supabase/reset-and-deploy.sql`

**What the Schema Does**:

1. Drops all existing tables (clean slate)
2. Creates 18 new tables:
   - profiles (user accounts)
   - client_profiles (client-specific data)
   - coach_profiles (coach-specific data)
   - exercises (exercise library)
   - workout_templates (reusable workouts)
   - workouts (assigned workouts)
   - workout_logs (exercise performance)
   - body_measurements (weight, body fat, etc.)
   - performance_metrics (strength, endurance)
   - biomarkers (blood work, etc.)
   - messages (coach-client messaging)
   - notifications (system notifications)
   - sessions (coaching sessions)
   - payments (payment records)
   - subscriptions (subscription management)
   - non_portal_clients (offline clients)
   - audit_log (system audit trail)
   - system_settings (configuration)

3. Sets up Row Level Security (RLS) policies
4. Creates helper functions
5. Sets up triggers for auto-updates

**Actions**:

1. Read the schema file: `organizations/repz-llc/supabase/reset-and-deploy.sql`
2. Execute the SQL using Supabase MCP
3. Verify all 18 tables were created
4. Check for any errors

**Expected Result**:

- Success message
- 18 tables visible in database
- No errors

**Verification Query**:

```sql
SELECT
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should return 18 tables.

---

### Task 3: Verify Database Structure

**Objective**: Confirm all tables, policies, and functions are correctly set up

**Actions**:

1. List all tables in public schema
2. Verify RLS is enabled on all tables
3. Check that functions exist:
   - `handle_new_user()`
   - `update_updated_at_column()`
   - `has_minimum_tier()`
   - `get_client_coach()`

4. Verify triggers are active:
   - `on_auth_user_created`
   - `update_profiles_updated_at`
   - `update_client_profiles_updated_at`
   - `update_coach_profiles_updated_at`
   - `update_workouts_updated_at`
   - `update_sessions_updated_at`

**Verification Queries**:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check functions exist
SELECT proname
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace;

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

**Expected Result**: All checks pass

---

### Task 4: Start Development Server

**Objective**: Get the React application running

**Actions**:

1. Navigate to: `organizations/repz-llc/apps/repz`
2. Check if dependencies are installed (node_modules exists)
3. If not, run: `npm install`
4. Start server: `npm run dev`
5. Wait for server to be ready (should show "ready in XXXms")

**Expected Output**:

```
VITE v7.2.6  ready in 1155 ms
➜  Local:   http://localhost:8080/
```

**Expected Result**: Server running on port 8080

---

### Task 5: Test Authentication Flow

**Objective**: Verify user signup and login work correctly

**Test Account Details**:

- Email: `test-coach@repz.com`
- Password: `TestPassword123!`
- Name: `Test Coach`
- Role: `coach`

**Actions**:

1. Open browser to: `http://localhost:8080/signup`
2. Fill in signup form:
   - Full Name: "Test Coach"
   - Email: "test-coach@repz.com"
   - Password: "TestPassword123!"
   - Confirm Password: "TestPassword123!"
   - Role: Select "Coach"
   - Accept terms: Check the checkbox
3. Click "Create Account"
4. Observe the result

**Expected Behavior**:

- Form submits successfully
- User is created in Supabase
- Redirected to email verification page OR dashboard
- No console errors

**Verification Query**:

```sql
SELECT id, email, full_name, role
FROM public.profiles
WHERE email = 'test-coach@repz.com';
```

Should return the new user.

**If Email Verification Required**:

- Check Supabase Auth logs for verification email
- Note: In development, you may need to manually verify or disable email
  verification

---

### Task 6: Test Client Signup

**Objective**: Verify client accounts work differently from coach accounts

**Test Account Details**:

- Email: `test-client@repz.com`
- Password: `TestPassword123!`
- Name: `Test Client`
- Role: `client`

**Actions**:

1. Sign out (if logged in)
2. Go to: `http://localhost:8080/signup`
3. Create client account
4. Verify client profile is created

**Verification Query**:

```sql
SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    cp.id as client_profile_id
FROM public.profiles p
LEFT JOIN public.client_profiles cp ON cp.user_id = p.id
WHERE p.email = 'test-client@repz.com';
```

Should show profile AND client_profile.

---

### Task 7: Test Coaching Portal

**Objective**: Verify coaching portal loads and functions

**Prerequisites**: Logged in as coach

**Actions**:

1. Navigate to: `http://localhost:8080/coach-admin`
2. Verify page loads without errors
3. Check that these sections are visible:
   - Client list
   - Workout creation button
   - Session scheduling button
   - Message inbox
   - Stats dashboard

4. Try to create a test workout:
   - Click "Create Workout"
   - Fill in workout details
   - Add exercises
   - Assign to test client
   - Save

**Expected Result**:

- Portal loads successfully
- All sections render
- Can create workout
- Workout saved to database

**Verification Query**:

```sql
SELECT id, name, client_id, coach_id, scheduled_date, status
FROM public.workouts
ORDER BY created_at DESC
LIMIT 5;
```

---

### Task 8: Test Client Portal

**Objective**: Verify client portal loads and functions

**Prerequisites**: Logged in as client

**Actions**:

1. Navigate to: `http://localhost:8080/dashboard`
2. Verify page loads without errors
3. Check that these sections are visible:
   - Quick stats (workouts, weight, sessions, streak)
   - Week calendar
   - Today's workout
   - Progress charts
   - Goals section
   - Messages section
   - Sessions section

4. Try to log a workout:
   - Go to "Today's Workout" tab
   - Expand an exercise
   - Enter sets, reps, weight, RPE
   - Click "Log Set"

**Expected Result**:

- Portal loads successfully
- All sections render
- Can log workout
- Data saved to database

**Verification Query**:

```sql
SELECT id, client_id, exercise_name, sets_completed, reps_completed, weight_kg
FROM public.workout_logs
ORDER BY created_at DESC
LIMIT 5;
```

---

### Task 9: Test Real-time Features

**Objective**: Verify real-time subscriptions work

**Actions**:

1. Open two browser windows:
   - Window 1: Coach logged in
   - Window 2: Client logged in

2. In coach window:
   - Send a message to the client

3. In client window:
   - Verify message appears in real-time (without refresh)

4. Check browser console for:
   - WebSocket connection established
   - Real-time events firing
   - No errors

**Expected Result**: Messages appear in real-time

---

### Task 10: Test Data Persistence

**Objective**: Verify data persists across sessions

**Actions**:

1. Create some test data:
   - Create a workout as coach
   - Log an exercise as client
   - Send a message
   - Create a goal

2. Sign out
3. Sign back in
4. Verify all data is still there

**Expected Result**: All data persists correctly

---

### Task 11: Check for Errors

**Objective**: Identify and document any issues

**Actions**:

1. Check browser console (F12) for:
   - JavaScript errors
   - Network errors
   - Warning messages

2. Check server terminal for:
   - Build errors
   - Runtime errors
   - Warning messages

3. Check Supabase logs for:
   - Database errors
   - Auth errors
   - RLS policy violations

**Expected Result**: No critical errors

---

### Task 12: Performance Check

**Objective**: Verify application performs well

**Actions**:

1. Check page load times:
   - Homepage: < 2 seconds
   - Dashboard: < 3 seconds
   - Portal pages: < 3 seconds

2. Check query performance:
   - Profile load: < 500ms
   - Workout list: < 1 second
   - Message load: < 1 second

3. Check for:
   - Unnecessary re-renders
   - Memory leaks
   - Slow queries

**Expected Result**: Good performance across the board

---

### Task 13: Create Test Report

**Objective**: Document all test results

**Actions**:

1. Create a file: `organizations/repz-llc/TEST-REPORT.md`
2. Document:
   - What was tested
   - Test results (pass/fail)
   - Any errors found
   - Performance metrics
   - Recommendations

**Template**:

```markdown
# REPZ Platform - Test Report

**Date**: [Current Date] **Tester**: Claude Opus **Duration**: [Time taken]

## Summary

- Total Tests: 12
- Passed: X
- Failed: Y
- Warnings: Z

## Detailed Results

### 1. Database Deployment

- Status: [PASS/FAIL]
- Tables Created: [18/18]
- Errors: [None/List]

### 2. Authentication

- Signup: [PASS/FAIL]
- Login: [PASS/FAIL]
- Logout: [PASS/FAIL]

[Continue for all tests...]

## Issues Found

1. [Issue description]
2. [Issue description]

## Recommendations

1. [Recommendation]
2. [Recommendation]

## Conclusion

[Overall assessment]
```

---

## 🎯 Success Criteria

You've successfully completed the setup when:

1. ✅ Database deployed (18 tables created)
2. ✅ RLS policies active
3. ✅ Triggers and functions working
4. ✅ Server running without errors
5. ✅ Can create coach account
6. ✅ Can create client account
7. ✅ Coaching portal loads and functions
8. ✅ Client portal loads and functions
9. ✅ Can create workouts
10. ✅ Can log exercises
11. ✅ Messages work
12. ✅ Real-time updates work
13. ✅ Data persists
14. ✅ No critical errors
15. ✅ Test report created

---

## 🔧 Troubleshooting Guide

### Issue: Can't connect to Supabase MCP

**Solution**:

- Verify MCP server URL is correct
- Check project_ref matches: `lvmcumsfpjjcgnnovvzs`
- Try alternative: Use Supabase CLI if MCP unavailable

### Issue: Schema deployment fails

**Solution**:

- Check for syntax errors in SQL
- Verify you have admin access
- Try running in smaller chunks
- Check Supabase logs for specific error

### Issue: Tables already exist

**Solution**:

- The reset script should drop them first
- If it fails, manually drop tables:
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  ```
- Then re-run the schema

### Issue: RLS policy violations

**Solution**:

- Check user is authenticated
- Verify user role matches policy requirements
- Check policy definitions in schema

### Issue: Authentication fails

**Solution**:

- Verify Supabase URL and anon key in .env.local
- Check auth.users table exists
- Verify handle_new_user trigger is active
- Check Supabase Auth settings

### Issue: Real-time not working

**Solution**:

- Check WebSocket connection in browser console
- Verify Supabase Realtime is enabled
- Check subscription code in supabase.ts
- Verify RLS policies allow reads

### Issue: Server won't start

**Solution**:

- Check node_modules exists
- Run `npm install` if needed
- Check for port conflicts (8080)
- Verify package.json scripts

---

## 📊 Expected Outcomes

### Database

- 18 tables created
- All RLS policies active
- All triggers working
- All functions created
- No errors in logs

### Application

- Server running on port 8080
- No build errors
- No runtime errors
- All routes accessible
- All components rendering

### Features

- Authentication working
- Profile creation working
- Coaching portal functional
- Client portal functional
- Workout management working
- Message system working
- Session scheduling working
- Progress tracking working

### Performance

- Page loads < 3 seconds
- Queries < 1 second
- No memory leaks
- Smooth interactions

---

## 💡 Additional Context

### Project Structure

```
organizations/repz-llc/
├── supabase/
│   ├── schema.sql (original)
│   └── reset-and-deploy.sql (use this!)
├── apps/repz/
│   ├── src/
│   │   ├── features/
│   │   │   ├── coaching-portal/index.tsx
│   │   │   ├── client-portal/index.tsx
│   │   │   └── payment/index.tsx
│   │   └── services/
│   │       ├── supabase.ts
│   │       └── external-mocks.ts
│   ├── .env.local (configured)
│   └── package.json
├── QUICK-START.md
├── SETUP-CHECKLIST.md
├── SUPABASE-SETUP-GUIDE.md
└── CURRENT-STATUS.md
```

### Key Files to Reference

- **Schema**: `organizations/repz-llc/supabase/reset-and-deploy.sql`
- **Supabase Service**:
  `organizations/repz-llc/apps/repz/src/services/supabase.ts`
- **Coaching Portal**:
  `organizations/repz-llc/apps/repz/src/features/coaching-portal/index.tsx`
- **Client Portal**:
  `organizations/repz-llc/apps/repz/src/features/client-portal/index.tsx`
- **Environment**: `organizations/repz-llc/apps/repz/.env.local`

### Important Notes

1. The schema file is self-contained - it drops and recreates everything
2. RLS policies are strict - users can only see their own data
3. The trigger `on_auth_user_created` automatically creates profiles
4. Mock services are in place for Stripe, email, and SMS
5. Real-time subscriptions are configured but need testing

---

## 🚀 Final Instructions

1. **Start with database deployment** - This is the critical blocker
2. **Verify thoroughly** - Check tables, policies, functions
3. **Test systematically** - Follow the test plan step by step
4. **Document everything** - Create the test report
5. **Report issues** - Note any problems found
6. **Provide recommendations** - Suggest improvements

**Your goal**: Get the REPZ platform fully functional and tested, then provide a
comprehensive report of the results.

**Time estimate**: 10-15 minutes for a thorough job

**Good luck! 🎉**
