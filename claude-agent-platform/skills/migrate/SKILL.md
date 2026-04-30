---
name: migrate
version: 1.0.0
description: Migrate code between versions, frameworks, modules, or patterns. Use for migration workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /migrate

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Migrate code between versions, frameworks, modules, or patterns.

## Parameters

- Required: --from <spec>, --to <spec>, --target <file|glob>
- Optional: --dry-run, --compat, --notes

## Example

```text
/migrate --from "CommonJS" --to "ESM" --target "src/**/*.js"
```

## Expected Output

```text
Migration report, diffs, manual follow-ups
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /migrate
   raw_arguments: $ARGUMENTS
   required: ['--from <spec>', '--to <spec>', '--target <file|glob>']
   optional: ['--dry-run', '--compat', '--notes']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


