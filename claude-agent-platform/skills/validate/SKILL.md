---
name: validate
version: 1.0.0
description: Validate output against a spec, schema, or acceptance criteria. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /validate

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Validate output against a spec, schema, or acceptance criteria.

## Parameters

- Required: --target <file|dir|diff>, --against <spec|@file>
- Optional: --format <text|json>

## Example

```text
/validate --target src/auth.ts --against @tickets/auth-reset.md
```

## Expected Output

```text
Contract adherence report and gaps
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /validate
   raw_arguments: $ARGUMENTS
   required: ['--target <file|dir|diff>', '--against <spec|@file>']
   optional: ['--format <text|json>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


