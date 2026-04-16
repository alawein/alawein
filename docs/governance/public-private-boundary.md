---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last_updated: 2026-04-15
---

# Public/private boundary

`alawein/alawein` is the public profile repository.

It keeps:

- `README.md`
- `projects.json`
- `projects.schema.json`
- `profile-from-guides.yaml`
- `service-metadata.yaml`
- public-safe governance docs and validation scripts

It does not keep:

- full repo catalog and generated control-plane feeds
- dashboard state or inventory exports
- Notion, GitHub metadata, or Vercel sync automation
- private agent hook surfaces

The private source of truth for those surfaces is
`knowledge-base/db/ops/alawein-control-plane/`.
