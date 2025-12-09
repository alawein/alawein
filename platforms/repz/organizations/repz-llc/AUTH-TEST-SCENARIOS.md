# Authentication Test Scenarios - REPZ Platform

## Test Environment
- **URL**: http://localhost:8080
- **Database**: Supabase (lvmcumsfpjjcgnnovvzs)
- **Status**: Development Server Running

## Test Cases

### 1. Coach Registration
**URL**: http://localhost:8080/signup

**Test Data**:
```
Full Name: John Coach
Email: test.coach@repz.com
Password: TestPassword123!
Confirm Password: TestPassword123!
Role: Coach
Terms: ✅ Accepted
```

**Expected Behavior**:
- Form validates all fields
- Password strength indicator shows strong
- Creates user in Supabase auth.users
- Creates profile in profiles table with role='coach'
- Creates coach_profile entry
- Redirects to dashboard or email verification
- No console errors

**Verification Query**:
```sql
SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    cp.id as coach_profile_id
FROM profiles p
LEFT JOIN coach_profiles cp ON cp.user_id = p.id
WHERE p.email = 'test.coach@repz.com';
```

### 2. Client Registration
**URL**: http://localhost:8080/signup

**Test Data**:
```
Full Name: Jane Client
Email: test.client@repz.com
Password: TestPassword123!
Confirm Password: TestPassword123!
Role: Client
Terms: ✅ Accepted
```

**Expected Behavior**:
- Form validates all fields
- Creates user in Supabase auth.users
- Creates profile in profiles table with role='client'
- Creates client_profile entry
- Redirects to onboarding or dashboard
- No console errors

**Verification Query**:
```sql
SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    cp.id as client_profile_id
FROM profiles p
LEFT JOIN client_profiles cp ON cp.user_id = p.id
WHERE p.email = 'test.client@repz.com';
```

### 3. Login Test
**URL**: http://localhost:8080/login

**Test Scenarios**:
1. **Valid Coach Login**
   - Email: test.coach@repz.com
   - Password: TestPassword123!
   - Expected: Redirect to /coach-admin

2. **Valid Client Login**
   - Email: test.client@repz.com
   - Password: TestPassword123!
   - Expected: Redirect to /dashboard

3. **Invalid Credentials**
   - Email: test.coach@repz.com
   - Password: WrongPassword
   - Expected: Error message "Invalid login credentials"

4. **Non-existent User**
   - Email: nonexistent@repz.com
   - Password: AnyPassword123!
   - Expected: Error message

### 4. Password Reset Flow
**URL**: http://localhost:8080/forgot-password

**Test Steps**:
1. Enter email: test.coach@repz.com
2. Click "Send Reset Link"
3. Check Supabase Auth logs for email
4. Verify success message displayed
5. Check no errors in console

### 5. Protected Routes
**Test Without Authentication**:
- `/dashboard` - Should redirect to login
- `/coach-admin` - Should redirect to login
- `/profile` - Should redirect to login

**Test With Wrong Role**:
- Login as client, try to access `/coach-admin`
- Login as coach, try to access client-specific routes

### 6. Session Persistence
1. Login successfully
2. Refresh page
3. Should remain logged in
4. Check localStorage for supabase.auth.token

### 7. Logout Test
1. Login successfully
2. Click logout button
3. Should redirect to homepage
4. Try accessing protected route
5. Should redirect to login

## Browser Console Checks
During all tests, monitor for:
- ❌ JavaScript errors
- ❌ Failed network requests
- ❌ CORS issues
- ❌ Missing environment variables
- ✅ Successful Supabase connections
- ✅ Proper token storage

## Database Verification
After each registration, verify in Supabase:
1. auth.users table has new entry
2. public.profiles has corresponding entry
3. Role-specific profile created (coach_profiles or client_profiles)
4. Timestamps are correct
5. handle_new_user trigger executed

## Performance Metrics
- Signup form submission: < 2 seconds
- Login response: < 1 second
- Route transitions: < 500ms
- Token refresh: < 500ms

## Security Checks
- ✅ Passwords are hashed (never visible in database)
- ✅ Tokens stored securely in localStorage
- ✅ HTTPS enforced in production
- ✅ CORS properly configured
- ✅ Rate limiting on auth endpoints
- ✅ SQL injection protection
- ✅ XSS protection

## Edge Cases
1. **Duplicate Email**: Try registering with existing email
2. **Weak Password**: Test password validation rules
3. **Network Interruption**: Disconnect during signup
4. **Token Expiry**: Test refresh token flow
5. **Multiple Tabs**: Login in one tab, check others
6. **Browser Back**: Use back button after login

## Success Criteria
- [ ] All registration forms work
- [ ] Login/logout cycle complete
- [ ] Protected routes enforced
- [ ] Role-based access working
- [ ] Session persistence verified
- [ ] No console errors
- [ ] Database entries created correctly
- [ ] Performance within targets