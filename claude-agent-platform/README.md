---
type: canonical
source: claude-agent-platform
sla: on-change
audience: [agents, contributors]
---

# Claude Agent Platform — Source

Version-controlled source for the global Claude Code platform installed at `~/.claude/`.

## Structure

| Directory | Installed to | Contents |
|---|---|---|
| `bin/` | `~/.claude/bin/` | Platform scripts (scanner, extender, validator, rollback) |
| `global/CLAUDE.md` | `~/.claude/CLAUDE.md` | Global agent config, slash commands, safety rules |
| `agents/` | `~/.claude/agents/` | Agent role definitions |
| `skills/` | `~/.claude/skills/` | Slash command skill implementations |
| `workflows/` | `~/.claude/workflows/` | Named workflow templates |
| `schemas/` | `~/.claude/schemas/` | Skill/agent JSON schemas |

## Workflow

**After editing files here → apply to live platform:**
```bash
bash claude-agent-platform/sync-to-home.sh
```

**After Claude Code modifies `~/.claude/` directly → capture back to source:**
```bash
bash claude-agent-platform/sync-from-home.sh
git -C . diff --stat
git add claude-agent-platform/
git commit -m "chore(platform): sync from ~/.claude/"
```

## Why this lives in alawein/

The platform spans all orgs (alawein, kohyr, menax-inc) but its source needs:
- Git history (track what changed and when)
- Dropbox backup (survive machine changes)
- One authoritative location

The runtime still runs from `~/.claude/` — that is where Claude Code looks.
