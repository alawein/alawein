# AI - Unified AI Resources

This directory consolidates all AI-related resources across the monorepo.

## Structure

```
ai/
├── config/          # AI configurations (ethics, review rules)
├── docs/            # AI documentation and guides
├── tools/           # AI CLI tools and utilities
└── tests/           # AI-related tests
```

## Related Locations

| Location              | Purpose               | Status |
| --------------------- | --------------------- | ------ |
| `tools/ai/`           | Primary AI tools      | Active |
| `tools/ai-review/`    | Code review checklist | Active |
| `docs/ai/`            | AI guides             | Active |
| `docs/ai-knowledge/`  | Prompts, workflows    | Active |
| `.metaHub/ai-review/` | AI review config      | Active |
| `.metaHub/ethics/`    | AI ethics config      | Active |

## Quick Links

- [AI Orchestration Guide](../docs/ai/AI-TOOLS-ORCHESTRATION.md)
- [AI Ethics Config](../metaHub/ethics/ai-ethics.yaml)
- [AI Review Checklist](../tools/ai-review/checklist.ts)

## Usage

```bash
# AI tools
npm run ai-review          # Code review checklist
npm run ethics             # Ethics review

# AI monitoring
npm run ai:dashboard       # AI dashboard
npm run ai:monitor         # AI monitor
```
