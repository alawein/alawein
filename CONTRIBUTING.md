# Contributing Guide (Solo High-Velocity)

This repo is currently a lightweight scaffold. Follow these guardrails to keep `main` clean and
moving fast.

## References

- Root standards: AGENTS.md, AI_DEVELOPMENT_SETTINGS_GUIDE.md, Comprehensive MCP Implementation
  Analysis (workspace root)
- Workflow source: docs/governance/workflow.md

## Branching

- `main`: protected; only PR merges or documented emergency force merges
- `fast/*`: spikes/prototypes (<24h); squash to `main` or delete
- `feat/*`, `fix/*`: scoped work; squash preferred, merge-commit allowed when chronology matters
- `hotfix/*`: urgent fixes; merge-commit allowed
- `release/*`: optional pre-tag stabilization
- Naming: kebab-case, <= 40 chars, max 4 segments (e.g., `feat/auth-oauth`)

## Commits

- Conventional style recommended: `type(scope): subject` (e.g., `feat(api): add pagination`)
- Small, frequent commits; keep unrelated changes out of the same commit
- No secrets, tokens, or .env files ever

## PRs (self-review checklist)

- Scope ≤ ~300 lines diff
- Branch naming follows the model above
- CI green or flake noted; if force merge is needed, document why and the risk
- Docs updated when behavior or workflows change
- Tests added/adjusted when code exists

## CI & Quality

- Current workflow: .github/workflows/ci.yml (placeholder lint/test)
- Replace placeholders with real lint/test/build commands once code is added
- Run the relevant checks locally before opening a PR

## Documentation

- Keep README and docs/governance/workflow.md in sync with workflow changes
- Mirror any future wiki content into `/docs` to avoid drift

## Releases

- Tag milestones as `v{major}.{minor}.{patch}` when code ships
- Maintain CHANGELOG.md using Keep a Changelog format

## Security & Safety

- Never commit credentials or private data; prefer environment variables and local .env (ignored)
- Avoid dangerous patterns (`eval`, unsafe HTML); sanitize user input when applicable
