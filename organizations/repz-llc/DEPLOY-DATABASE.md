# Database Deployment Guide - REPZ Platform

## Quick Deploy (2 minutes)

### Option 1: Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/lvmcumsfpjjcgnnovvzs/sql/new
2. Copy the entire content of `supabase/reset-and-deploy.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. Verify: Should see "Success. No rows returned"
6. Check Tables tab: Should show 18 tables

### Option 2: Supabase CLI
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref lvmcumsfpjjcgnnovvzs

# Deploy the schema
supabase db push ./organizations/repz-llc/supabase/reset-and-deploy.sql
```

### Option 3: Using psql
```bash
# Connection string
psql "postgresql://postgres:[YOUR-PASSWORD]@db.lvmcumsfpjjcgnnovvzs.supabase.co:5432/postgres" -f ./organizations/repz-llc/supabase/reset-and-deploy.sql
```

## Verification Queries

After deployment, run these queries in Supabase SQL Editor to verify:

### 1. Check Tables Created (Should return 18 rows)
```sql
SELECT COUNT(*) as table_count
FROM pg_tables
WHERE schemaname = 'public';
```

### 2. List All Tables
```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected tables:
- audit_log
- biomarkers
- body_measurements
- client_profiles
- coach_profiles
- exercises
- messages
- non_portal_clients
- notifications
- payments
- performance_metrics
- profiles
- sessions
- subscriptions
- system_settings
- workout_logs
- workout_templates
- workouts

### 3. Check RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;
```
Should show all tables with RLS enabled.

### 4. Check Functions Created
```sql
SELECT proname as function_name
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace;
```

Expected functions:
- handle_new_user
- update_updated_at_column
- has_minimum_tier
- get_client_coach

### 5. Check Triggers
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## Troubleshooting

### Error: "permission denied"
- Make sure you're using the service role key or logged in as admin
- Try running in Supabase Dashboard SQL Editor

### Error: "table already exists"
- The script should drop all tables first
- If it fails, manually drop all tables:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Error: "type already exists"
- Run the reset-and-deploy.sql script which handles type cleanup

## Success Indicators
✅ 18 tables created
✅ All RLS policies active
✅ 4 functions created
✅ 6+ triggers active
✅ No error messages
✅ Auth trigger working (handle_new_user)

## Next Steps
After successful deployment:
1. Start the development server
2. Test authentication
3. Test both portals
4. Create test data