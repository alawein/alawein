---
name: implement
version: 1.0.0
description: Implement TODOs, stubs, interfaces, or missing behavior. Use for code generation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /implement

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Implement TODOs, stubs, interfaces, or missing behavior.

## Parameters

- Required: --target <file|glob>
- Optional: --from-interface <file>, --no-review, --dry-run

## Example

```text
/implement --target src/services/email.ts --from-interface src/types/IEmailService.ts
```

## Expected Output

```text
Implementation diff or generated file plus review verdict
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /implement
   raw_arguments: $ARGUMENTS
   required: ['--target <file|glob>']
   optional: ['--from-interface <file>', '--no-review', '--dry-run']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


