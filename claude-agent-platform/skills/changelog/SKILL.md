---
name: changelog
version: 1.0.0
description: Generate or update CHANGELOG.md from git history. Use for git workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /changelog

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate or update CHANGELOG.md from git history.

## Parameters

- Required: none
- Optional: --from <ref>, --to <ref>, --format <keepachangelog|conventional>

## Example

```text
/changelog --from v1.2.0 --to HEAD
```

## Expected Output

```text
Changelog section diff
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /changelog
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--from <ref>', '--to <ref>', '--format <keepachangelog|conventional>']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


## Detailed Skill Definition

```json
{
  "name": "changelog",
  "version": "1.0.0",
  "input_contract": {
    "from": {"type": "git-ref", "required": false, "default": "last tag"},
    "to": {"type": "git-ref", "required": false, "default": "HEAD"},
    "format": {"type": "keepachangelog|conventional", "required": false, "default": "keepachangelog"}
  },
  "output_contract": {"format": "markdown diff", "fields": ["added", "changed", "fixed", "security", "breaking"]},
  "dependencies": [],
  "execution_steps": [
    {"id": "collect", "agent": "Research", "action": "Inspect git log and changed files", "expected_output": "commit summary"},
    {"id": "classify", "agent": "Reviewer", "action": "Classify changes by release category", "expected_output": "categorized changes"},
    {"id": "write", "agent": "Codex", "action": "Draft changelog section", "expected_output": "CHANGELOG.md diff"}
  ]
}
```

### Changelog Rules

- Prefer user-visible outcomes over raw commit names.
- Separate breaking changes and security fixes.
- Preserve existing changelog style.
- Do not fabricate versions or release dates.

