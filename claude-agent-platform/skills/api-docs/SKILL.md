---
name: api-docs
version: 1.0.0
description: Generate API reference from routes, controllers, schemas, or specs. Use for documentation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /api-docs

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate API reference from routes, controllers, schemas, or specs.

## Parameters

- Required: --target <dir|glob>
- Optional: --format <openapi|markdown>, --out <file>

## Example

```text
/api-docs --target src/routes --format openapi --out docs/openapi.yaml
```

## Expected Output

```text
API docs file and validation notes
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /api-docs
   raw_arguments: $ARGUMENTS
   required: ['--target <dir|glob>']
   optional: ['--format <openapi|markdown>', '--out <file>']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


