---
name: docs-gen
version: 1.0.0
description: Generate inline or external documentation for code. Use for documentation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /docs-gen

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate inline or external documentation for code.

## Parameters

- Required: --target <file|glob>
- Optional: --format <jsdoc|tsdoc|docstring|markdown|openapi>, --out <file>, --include-examples

## Example

```text
/docs-gen --target src/api --format openapi --out docs/api.yaml
```

## Expected Output

```text
Documentation diff/file and coverage summary
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /docs-gen
   raw_arguments: $ARGUMENTS
   required: ['--target <file|glob>']
   optional: ['--format <jsdoc|tsdoc|docstring|markdown|openapi>', '--out <file>', '--include-examples']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


