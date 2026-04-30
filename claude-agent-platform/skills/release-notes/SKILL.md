---
name: release-notes
version: 1.0.0
description: Produce release notes from changelog, tags, or merged PRs. Use for git workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /release-notes

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Produce release notes from changelog, tags, or merged PRs.

## Parameters

- Required: none
- Optional: --from <ref>, --to <ref>, --audience <dev|user|exec>

## Example

```text
/release-notes --from v2.0.0 --to HEAD --audience user
```

## Expected Output

```text
Release notes markdown
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /release-notes
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--from <ref>', '--to <ref>', '--audience <dev|user|exec>']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


