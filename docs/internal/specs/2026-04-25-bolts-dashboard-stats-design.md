---
title: "Bolts Dashboard — Real Purchase Stats"
date: 2026-04-25
status: approved
type: canonical
last_updated: 2026-04-25
---

# Design Spec: Bolts Dashboard — Real Purchase Stats

- **Repo:** `bolts/`
- **File changed:** `src/app/dashboard/page.tsx` (only)
- **Status:** Approved for implementation

## Problem

The dashboard currently shows `—` for all three stat blocks (Workouts Completed,
Current Streak, Programs Active) and renders two hardcoded fake activity entries.
These metrics are fitness-tracker vocabulary transplanted from a workout app;
they have no meaning for a PDF storefront customer.

## Decision

Replace with purchase-derived stats. Bolts sells fitness PDF programs. The truth
a customer cares about is: how many programs they own, how much they have spent,
and when they joined. All three are derivable from the existing `purchases` table
with no schema changes.

## Data Layer

Single Supabase query added to `DashboardPage` after `getUser()`:

```typescript
const { data: purchases } = await supabase
  .from('purchases')
  .select('id, product_name, amount, created_at')
  .eq('user_id', user.id)
  .eq('status', 'completed')
  .order('created_at', { ascending: false });
```

Derived in-component from the array (no aggregation query):

| Variable | Derivation |
|----------|-----------|
| `programCount` | `purchases.length` |
| `totalInvested` | `Math.round(purchases.reduce((sum, p) => sum + p.amount, 0) / 100)` |
| `recentActivity` | `purchases.slice(0, 3)` |
| `memberSince` | `user.created_at` (already on the user object) |

`amount` is stored in cents (confirmed from account page: `purchase.amount / 100`).

## UI Changes

### Stats block — label and value replacements

| Old label | New label | Value |
|-----------|-----------|-------|
| Workouts Completed | Programs | `programCount` |
| Current Streak | Total Invested | `$${totalInvested}` |
| Programs Active | Member Since | `user.created_at` formatted as `"MMM YYYY"` |

### Recent Activity

Replace the two hardcoded entries with a map over `recentActivity`:

- **When purchases exist:** Each row shows a download icon, `{product_name} purchased`,
  and a relative date (`new Date(created_at).toLocaleDateString()`).
- **When no purchases:** Single row — "No purchases yet" with a "Browse Programs →"
  link to `/`.
- Cap at 3 entries.

## Edge Cases

| Case | Handling |
|------|----------|
| Zero purchases | Stats show `0` / `$0` / member date; activity shows empty state |
| Query error | `purchases ?? []` — stats degrade to zero gracefully, no crash |
| Fractional cents | `Math.round` — no decimal display for storefront amounts |
| Missing display name | Existing fallback: `full_name ?? email ?? 'there'` |

No loading states — Server Component; data arrives before render.

## Scope

- **One file changed:** `src/app/dashboard/page.tsx`
- **No migrations**
- **No new components**
- Existing JSX grid structure (sidebar + activity layout) preserved
