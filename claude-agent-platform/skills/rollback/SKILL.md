---
name: rollback
version: 1.0.0
description: Restore the last local Claude config operation or file backup. Use for extensibility workflows. Routes to Extender agent.
disable-model-invocation: true
---
# /rollback

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Restore the last local Claude config operation or file backup.

## Parameters

- Required: none
- Optional: --target <claude-config|last-operation|path>

## Example

```text
/rollback --target claude-config
```

## Expected Output

```text
Restored backup path and current state
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Extender** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /rollback
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <claude-config|last-operation|path>']
   agent: Extender
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


