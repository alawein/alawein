---
name: refactor
version: 1.0.0
description: Restructure code without changing behavior. Use for refactoring workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /refactor

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Restructure code without changing behavior.

## Parameters

- Required: --target <file|glob>, --goal <description>
- Optional: --scope <function|class|file|project>, --format, --dry-run

## Example

```text
/refactor --target src/controllers --goal "extract validation layer" --scope project
```

## Expected Output

```text
Refactor plan, diffs, tests, [CURSOR OUTPUT]
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /refactor
   raw_arguments: $ARGUMENTS
   required: ['--target <file|glob>', '--goal <description>']
   optional: ['--scope <function|class|file|project>', '--format', '--dry-run']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


