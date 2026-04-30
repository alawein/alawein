---
name: test-run
version: 1.0.0
description: Run and summarize project tests. Use for testing workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /test-run

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Run and summarize project tests.

## Parameters

- Required: none
- Optional: --scope <file|dir|all>, --watch, --command <cmd>

## Example

```text
/test-run --scope src/services
```

## Expected Output

```text
Pass/fail summary, failing tests, first actionable error
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /test-run
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--scope <file|dir|all>', '--watch', '--command <cmd>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


