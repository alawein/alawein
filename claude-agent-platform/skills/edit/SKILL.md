---
name: edit
version: 1.0.0
description: Make a surgical edit to an existing target. Use for refactoring workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /edit

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Make a surgical edit to an existing target.

## Parameters

- Required: --target <file|glob>, --instruction <text>
- Optional: --scope <function|class|file|project>, --no-test

## Example

```text
/edit --target src/auth.ts --instruction "reject expired refresh tokens"
```

## Expected Output

```text
Unified diff and [CURSOR OUTPUT]
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /edit
   raw_arguments: $ARGUMENTS
   required: ['--target <file|glob>', '--instruction <text>']
   optional: ['--scope <function|class|file|project>', '--no-test']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


