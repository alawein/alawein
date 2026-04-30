---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
last_updated: 2026-04-25
---

# Bolts Dashboard Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three `—` stat placeholders and two hardcoded fake activity entries in `bolts/src/app/dashboard/page.tsx` with real data derived from the `purchases` table.

**Architecture:** Single Server Component change — add a Supabase query after `getUser()`, derive stats from the result array, rewrite the stats block and Recent Activity section. No migrations, no new components, no client-side state.

**Tech Stack:** Next.js 16 App Router, `@supabase/ssr` Server Component pattern (same as `account/page.tsx`), TypeScript.

---

## File Map

| Action | Path |
|--------|------|
| Modify | `bolts/src/app/dashboard/page.tsx` |

---

### Task 1: Add purchases query and derive stats

**Files:**
- Modify: `bolts/src/app/dashboard/page.tsx:25-33`

- [ ] **Step 1: Add the purchases query after `getUser()`**

  Open `src/app/dashboard/page.tsx`. After line 33 (`const displayName = ...`), add:

  ```typescript
  const { data: rawPurchases } = await supabase
    .from('purchases')
    .select('id, product_name, amount, created_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  const purchases = rawPurchases ?? [];
  const programCount = purchases.length;
  const totalInvested = Math.round(
    purchases.reduce((sum, p) => sum + p.amount, 0) / 100
  );
  const recentActivity = purchases.slice(0, 3);
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  ```

- [ ] **Step 2: Run type-check to confirm no type errors**

  ```bash
  cd bolts && npm run type-check
  ```

  Expected: exits 0 (pre-existing errors for `AppErrorBoundary.tsx` are acceptable — confirm no new errors in `dashboard/page.tsx`).

---

### Task 2: Rewrite the stats block

**Files:**
- Modify: `bolts/src/app/dashboard/page.tsx:82-99`

- [ ] **Step 1: Replace the three stat divs and remove the "coming soon" note**

  Replace this block (lines 82–99):

  ```tsx
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Your Stats</h3>
    <div className="space-y-4">
      <div>
        <div className="text-gray-400 text-sm mb-1">Workouts Completed</div>
        <div className="text-3xl font-bold">—</div>
      </div>
      <div>
        <div className="text-gray-400 text-sm mb-1">Current Streak</div>
        <div className="text-3xl font-bold text-blue-400">—</div>
      </div>
      <div>
        <div className="text-gray-400 text-sm mb-1">Programs Active</div>
        <div className="text-3xl font-bold">—</div>
      </div>
    </div>
    <p className="mt-4 text-xs text-gray-500">Workout tracking coming soon.</p>
  </div>
  ```

  With:

  ```tsx
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Your Stats</h3>
    <div className="space-y-4">
      <div>
        <div className="text-gray-400 text-sm mb-1">Programs</div>
        <div className="text-3xl font-bold">{programCount}</div>
      </div>
      <div>
        <div className="text-gray-400 text-sm mb-1">Total Invested</div>
        <div className="text-3xl font-bold text-blue-400">${totalInvested}</div>
      </div>
      <div>
        <div className="text-gray-400 text-sm mb-1">Member Since</div>
        <div className="text-xl font-bold">{memberSince}</div>
      </div>
    </div>
  </div>
  ```

- [ ] **Step 2: Run type-check**

  ```bash
  npm run type-check
  ```

  Expected: exits 0, no new errors.

---

### Task 3: Rewrite the Recent Activity section

**Files:**
- Modify: `bolts/src/app/dashboard/page.tsx:52-78`

- [ ] **Step 1: Replace hardcoded activity entries with purchase map**

  Replace this block (lines 52–78):

  ```tsx
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
          <span className="text-success">✓</span>
        </div>
        <div>
          <div className="font-semibold">Workout Completed</div>
          <div className="text-sm text-gray-400">
            Foundation Bodyweight - Week 1, Session 2
          </div>
        </div>
        <div className="ml-auto text-sm text-gray-400">2 days ago</div>
      </div>
      <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
          <span className="text-blue-500">📥</span>
        </div>
        <div>
          <div className="font-semibold">Program Downloaded</div>
          <div className="text-sm text-gray-400">Home Starter Circuit</div>
        </div>
        <div className="ml-auto text-sm text-gray-400">5 days ago</div>
      </div>
    </div>
  </div>
  ```

  With:

  ```tsx
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
    <div className="space-y-4">
      {recentActivity.length === 0 ? (
        <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-400">📦</span>
          </div>
          <div>
            <div className="font-semibold text-gray-400">No purchases yet</div>
          </div>
          <Link
            href="/"
            className="ml-auto text-sm text-blue-400 hover:text-blue-300"
          >
            Browse Programs →
          </Link>
        </div>
      ) : (
        recentActivity.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center gap-4 pb-4 border-b border-gray-800"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-500">📥</span>
            </div>
            <div>
              <div className="font-semibold">{purchase.product_name}</div>
              <div className="text-sm text-gray-400">Program purchased</div>
            </div>
            <div className="ml-auto text-sm text-gray-400">
              {new Date(purchase.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  ```

- [ ] **Step 2: Run type-check**

  ```bash
  npm run type-check
  ```

  Expected: exits 0, no new errors.

---

### Task 4: Build verification and commit

**Files:**
- Modify: `bolts/src/app/dashboard/page.tsx` (finalize)

- [ ] **Step 1: Run the full build**

  ```bash
  npm run build
  ```

  Expected: `✓ Compiled successfully`. `/dashboard` appears as `ƒ (Dynamic)` in the route list.

- [ ] **Step 2: Verify the final file reads correctly**

  The top of `src/app/dashboard/page.tsx` should now look like:

  ```typescript
  import { redirect } from 'next/navigation';
  import { cookies } from 'next/headers';
  import { createServerClient } from '@supabase/ssr';
  import Link from 'next/link';
  import ProgressTracker from '@/components/ProgressTracker';

  export default async function DashboardPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { /* Server component — read-only */ },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?redirectTo=/dashboard');

    const displayName = user.user_metadata?.full_name ?? user.email ?? 'there';

    const { data: rawPurchases } = await supabase
      .from('purchases')
      .select('id, product_name, amount, created_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    const purchases = rawPurchases ?? [];
    const programCount = purchases.length;
    const totalInvested = Math.round(
      purchases.reduce((sum, p) => sum + p.amount, 0) / 100
    );
    const recentActivity = purchases.slice(0, 3);
    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    // ... JSX return
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/dashboard/page.tsx
  git commit -m "feat(dashboard): replace fake stats with real purchase data

  Replace three placeholder stats and hardcoded activity entries with
  live purchase data. Stats now show: Programs owned, Total invested,
  Member since. Recent Activity lists last 3 purchases or an empty state
  with a Browse Programs link."
  ```

- [ ] **Step 4: Push**

  ```bash
  git push origin main
  ```
