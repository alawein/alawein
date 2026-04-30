---
name: fix
version: 1.0.0
description: Diagnose and fix a bug, failing test, or stack trace. Use for debugging workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /fix

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Diagnose and fix a bug, failing test, or stack trace.

## Parameters

- Required: --error <text|@file> OR --target <file>
- Optional: --explain, --test, --dry-run

## Example

```text
/fix --error @tmp/failing-test.log --explain
```

## Expected Output

```text
Root cause, diff, [CURSOR OUTPUT], test result
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /fix
   raw_arguments: $ARGUMENTS
   required: ['--error <text|@file> OR --target <file>']
   optional: ['--explain', '--test', '--dry-run']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


