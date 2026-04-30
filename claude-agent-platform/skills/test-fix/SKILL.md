---
name: test-fix
version: 1.0.0
description: Fix failing tests while preserving intended behavior. Use for testing workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /test-fix

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Fix failing tests while preserving intended behavior.

## Parameters

- Required: --test-file <file>
- Optional: --error <text|@file>, --allow-impl-change

## Example

```text
/test-fix --test-file src/services/auth.test.ts --error @fail.log
```

## Expected Output

```text
Test diff, optional implementation diff, run result
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /test-fix
   raw_arguments: $ARGUMENTS
   required: ['--test-file <file>']
   optional: ['--error <text|@file>', '--allow-impl-change']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


