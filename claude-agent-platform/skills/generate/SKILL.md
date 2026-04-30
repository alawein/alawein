---
name: generate
version: 1.0.0
description: Generate a new file from a specification. Use for code generation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /generate

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate a new file from a specification.

## Parameters

- Required: --spec <text|@file>, --out <path>
- Optional: --lang <language>, --style <@file>, --no-review, --dry-run, --force

## Example

```text
/generate --spec "REST endpoint for user login with JWT" --out src/routes/auth.ts
```

## Expected Output

```text
[CODEX OUTPUT] plus review report unless --no-review
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /generate
   raw_arguments: $ARGUMENTS
   required: ['--spec <text|@file>', '--out <path>']
   optional: ['--lang <language>', '--style <@file>', '--no-review', '--dry-run', '--force']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


