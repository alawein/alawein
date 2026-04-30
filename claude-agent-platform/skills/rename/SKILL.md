---
name: rename
version: 1.0.0
description: Rename a symbol or file across a scope. Use for migration workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /rename

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Rename a symbol or file across a scope.

## Parameters

- Required: --from <symbol>, --to <symbol>
- Optional: --type <function|class|variable|file|all>, --scope <dir>

## Example

```text
/rename --from getUserData --to fetchUserProfile --type function
```

## Expected Output

```text
Call-site report, diffs, test result
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /rename
   raw_arguments: $ARGUMENTS
   required: ['--from <symbol>', '--to <symbol>']
   optional: ['--type <function|class|variable|file|all>', '--scope <dir>']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


