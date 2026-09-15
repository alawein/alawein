# ADR-20260915-08 B3 secret exposure verified and rotation completed

Date: 2026-09-15
Status: accepted
Supersedes: ADR-20260915-07
Approver: Meshal Alawein (standing Accept-all approvals in Cursor session 2026-09-15; gated line `Approve: rotate supabase credentials F001` observed)
Evidence tier: 1 — GitHub secret-scanning alert metadata + live Supabase dashboard rotation (F001)
Decision: treat B3 as VERIFIED-live; Batch A rotation is mandatory before G8 visibility flip; rotation receipt exists
Why: alerts #1 `supabase_service_key` and #2 `supabase_personal_access_token` were open in public history; both resolved `revoked` after provider-side rotation
What is explicitly not decided: history purge method/timing; whether any private fleet repo shared the project; Pages/visibility flip (F010 / ADR-01)
Enforcement: doctor/secrets scan; G8 remains blocked until history-purge decision; consumers must use new publishable/secret API keys (legacy JWT API keys disabled on menax + kohyr)
Receipt: `docs/superpowers/plans/2026-09-15-audit-batch-e-evidence.md` §F001
