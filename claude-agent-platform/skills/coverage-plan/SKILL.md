---
name: coverage-plan
version: 1.0.0
description: Plan coverage increases by risk and value. Use for testing workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /coverage-plan

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Plan coverage increases by risk and value.

## Parameters

- Required: --target <dir|glob>
- Optional: --goal <percent>, --type <unit|integration|e2e|mixed>

## Example

```text
/coverage-plan --target src --goal 85
```

## Expected Output

```text
Prioritized test backlog and suggested /test-gen calls
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /coverage-plan
   raw_arguments: $ARGUMENTS
   required: ['--target <dir|glob>']
   optional: ['--goal <percent>', '--type <unit|integration|e2e|mixed>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


