---
name: arch-review
version: 1.0.0
description: Analyze architecture, coupling, and layer violations. Use for architecture workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /arch-review

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Analyze architecture, coupling, and layer violations.

## Parameters

- Required: none
- Optional: --target <dir>, --depth <n>, --format <text|json>

## Example

```text
/arch-review --target src --depth 4
```

## Expected Output

```text
ASCII dependency graph, violations, recommendations
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /arch-review
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <dir>', '--depth <n>', '--format <text|json>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


