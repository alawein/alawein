---
title: 'SaaS Readiness Checklist'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# SaaS Readiness Checklist

> **Last Updated:** 2025-12-09  
> **Purpose:** Track what's needed for each platform to be production-ready

---

## Quick Status Overview

| Platform     | Auth | Database | Payments | Monitoring | Domain | Mobile | Status |
| ------------ | ---- | -------- | -------- | ---------- | ------ | ------ | ------ |
| Portfolio    | ❌   | ❌       | ❌       | ⏳         | ⏳     | ❌     | 🟡 80% |
| SimCore      | ⏳   | ⏳       | ❌       | ⏳         | ⏳     | PWA    | 🟡 60% |
| QMLab        | ⏳   | ⏳       | ❌       | ⏳         | ⏳     | ❌     | 🟡 60% |
| LLMWorks     | ⏳   | ⏳       | ❌       | ⏳         | ⏳     | ❌     | 🟡 60% |
| Attributa    | ✅   | ✅       | ⏳       | ⏳         | ⏳     | ❌     | 🟡 70% |
| LiveItIconic | ✅   | ✅       | ✅       | ⏳         | ⏳     | ❌     | 🟢 85% |
| REPZ         | ✅   | ⏳       | ⏳       | ⏳         | ⏳     | ⏳     | 🟡 65% |

**Legend:** ✅ Done | ⏳ In Progress/Planned | ❌ Not Needed

---

## Detailed Checklists by Platform

### Portfolio (malawein.com)

**Type:** Static Personal Site | **Revenue:** None (showcase)

| Category    | Item                         | Status | Notes         |
| ----------- | ---------------------------- | ------ | ------------- |
| **Deploy**  | Lovable.dev deployment       | ⏳     | Test first    |
| **Deploy**  | Vercel deployment            | ⏳     | After Lovable |
| **Deploy**  | Custom domain (malawein.com) | ⏳     | Configure DNS |
| **Monitor** | Sentry error tracking        | ⏳     | Add DSN       |
| **SEO**     | sitemap.xml                  | ✅     | Done          |
| **SEO**     | robots.txt                   | ✅     | Done          |
| **SEO**     | Meta tags / Open Graph       | ⏳     | Verify        |
| **Perf**    | Lighthouse 90+               | ⏳     | Audit needed  |

---

### SimCore (simcore.dev)

**Type:** Educational PWA | **Revenue:** None (open source)

| Category    | Item                         | Status | Notes                  |
| ----------- | ---------------------------- | ------ | ---------------------- |
| **Deploy**  | Lovable.dev deployment       | ⏳     | Test first             |
| **Deploy**  | Vercel deployment            | ⏳     | After Lovable          |
| **Deploy**  | Custom domain (simcore.dev)  | ⏳     | Configure DNS          |
| **Auth**    | Supabase Auth (optional)     | ⏳     | For save/load          |
| **DB**      | Supabase Database (optional) | ⏳     | For save/load          |
| **Monitor** | Sentry error tracking        | ⏳     | Add DSN                |
| **License** | MIT License                  | ✅     | Done                   |
| **Docs**    | CONTRIBUTING.md              | ✅     | Done                   |
| **Mobile**  | PWA configuration            | ✅     | vite-plugin-pwa        |
| **Mobile**  | ~~Capacitor~~                | ❌     | **REMOVED** - PWA only |

---

### QMLab (qmlab.online)

**Type:** Educational Tool | **Revenue:** None (open source)

| Category    | Item                         | Status | Notes             |
| ----------- | ---------------------------- | ------ | ----------------- |
| **Deploy**  | Lovable.dev deployment       | ⏳     | Test first        |
| **Deploy**  | Vercel deployment            | ⏳     | After Lovable     |
| **Deploy**  | Custom domain (qmlab.online) | ⏳     | Configure DNS     |
| **Auth**    | Supabase Auth                | ⏳     | For save/load     |
| **DB**      | Supabase Database            | ⏳     | Experiment states |
| **Monitor** | Sentry error tracking        | ⏳     | Add DSN           |
| **License** | MIT License                  | ✅     | Done              |
| **Docs**    | CONTRIBUTING.md              | ✅     | Done              |

---

### LLMWorks (llmworks.dev)

**Type:** SaaS Tool | **Revenue:** Future (freemium)

| Category    | Item                         | Status | Notes             |
| ----------- | ---------------------------- | ------ | ----------------- |
| **Deploy**  | Lovable.dev deployment       | ⏳     | Test first        |
| **Deploy**  | Vercel deployment            | ⏳     | After Lovable     |
| **Deploy**  | Custom domain (llmworks.dev) | ⏳     | Configure DNS     |
| **Auth**    | Supabase Auth                | ⏳     | Required          |
| **DB**      | Supabase Database            | ⏳     | Benchmark results |
| **API**     | Edge Functions for LLM proxy | ⏳     | Future            |
| **Monitor** | Sentry error tracking        | ⏳     | Add DSN           |
| **License** | MIT License                  | ✅     | Done              |
| **Docs**    | CONTRIBUTING.md              | ✅     | Done              |

---

### Attributa (attributa.dev)

**Type:** SaaS (Freemium) | **Revenue:** $9-29/mo subscriptions

| Category     | Item                          | Status | Notes            |
| ------------ | ----------------------------- | ------ | ---------------- |
| **Deploy**   | Lovable.dev deployment        | ⏳     | Test first       |
| **Deploy**   | Vercel deployment             | ⏳     | After Lovable    |
| **Deploy**   | Custom domain (attributa.dev) | ⏳     | Configure DNS    |
| **Auth**     | Supabase Auth                 | ✅     | Implemented      |
| **DB**       | Supabase Database             | ✅     | Migrations ready |
| **API**      | Edge Function: attributions   | ✅     | Working          |
| **API**      | Edge Function: citations      | ✅     | Working          |
| **API**      | Edge Function: ingest         | ✅     | Working          |
| **API**      | Edge Function: projects       | ✅     | Working          |
| **Payments** | Stripe integration            | ⏳     | Need to set up   |
| **Payments** | Pricing page                  | ⏳     | Need to create   |
| **Payments** | Subscription management       | ⏳     | Stripe Billing   |
| **Monitor**  | Sentry error tracking         | ⏳     | Add DSN          |
| **Legal**    | Terms of Service              | ✅     | Done             |
| **Legal**    | Privacy Policy                | ✅     | Done             |

---

### LiveItIconic (liveiticonic.com)

**Type:** E-commerce | **Revenue:** Product sales

| Category     | Item                             | Status | Notes            |
| ------------ | -------------------------------- | ------ | ---------------- |
| **Deploy**   | Lovable.dev deployment           | ⏳     | Test first       |
| **Deploy**   | Vercel deployment                | ⏳     | After Lovable    |
| **Deploy**   | Custom domain (liveiticonic.com) | ⏳     | Configure DNS    |
| **Auth**     | Supabase Auth                    | ✅     | + Guest checkout |
| **DB**       | Supabase Database                | ✅     | Products, orders |
| **API**      | Edge Function: checkout          | ✅     | Working          |
| **API**      | Edge Function: webhook           | ✅     | Working          |
| **Payments** | Stripe Checkout                  | ✅     | Implemented      |
| **Payments** | Order management                 | ✅     | In database      |
| **Monitor**  | Sentry error tracking            | ⏳     | Add DSN          |
| **Legal**    | Terms of Service                 | ⏳     | Need to add      |
| **Legal**    | Privacy Policy                   | ⏳     | Need to add      |
| **Legal**    | Refund Policy                    | ⏳     | Need to add      |

---

### REPZ (getrepz.app)

**Type:** Mobile-First SaaS | **Revenue:** $4.99-19.99/mo subscriptions

| Category     | Item                        | Status | Notes                |
| ------------ | --------------------------- | ------ | -------------------- |
| **Deploy**   | Lovable.dev deployment      | ⏳     | Test first           |
| **Deploy**   | Vercel deployment           | ⏳     | After Lovable        |
| **Deploy**   | Custom domain (getrepz.app) | ⏳     | Configure DNS        |
| **Auth**     | Vercel Auth/Clerk           | ⏳     | Migrate from mock    |
| **DB**       | Vercel Postgres             | ⏳     | Migrate from mock    |
| **API**      | /api/auth.ts                | ✅     | Exists               |
| **API**      | /api/workouts.ts            | ✅     | Exists               |
| **API**      | /api/intake.ts              | ✅     | Exists               |
| **Payments** | Stripe integration          | ⏳     | Need to set up       |
| **Payments** | Pricing page                | ⏳     | Exists, needs Stripe |
| **Mobile**   | Capacitor config            | ✅     | Configured           |
| **Mobile**   | iOS build                   | ⏳     | Needs Apple Dev      |
| **Mobile**   | Android build               | ⏳     | Needs Play Store     |
| **Monitor**  | Sentry error tracking       | ⏳     | Add DSN              |
| **Legal**    | Terms of Service            | ⏳     | Need to add          |
| **Legal**    | Privacy Policy              | ⏳     | Need to add          |
| **Legal**    | GDPR Compliance             | ✅     | Documented           |

---

## Priority Actions

### Immediate (This Week)

1. [ ] Test all platforms on Lovable.dev
2. [ ] Set up Sentry projects and add DSNs
3. [ ] Remove SimCore Capacitor config

### Short-term (Next 2 Weeks)

4. [ ] Deploy Portfolio to Vercel with malawein.com
5. [ ] Set up Stripe for Attributa
6. [ ] Set up Stripe for REPZ
7. [ ] Connect Supabase for SimCore/QMLab/LLMWorks

### Medium-term (Next Month)

8. [ ] Build REPZ iOS app (Capacitor)
9. [ ] Build REPZ Android app (Capacitor)
10. [ ] Add legal pages to commercial platforms
11. [ ] Full production deployment for all platforms

---

## Related Documents

- [BACKEND-ARCHITECTURE.md](./BACKEND-ARCHITECTURE.md) - Backend strategy
- [DOMAIN-STRATEGY.md](./DOMAIN-STRATEGY.md) - Domain assignments
- [MONITORING-SETUP.md](./MONITORING-SETUP.md) - Error tracking setup
