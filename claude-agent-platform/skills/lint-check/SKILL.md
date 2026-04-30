---
name: lint-check
version: 1.0.0
description: Run or infer the project lint/static-analysis command and summarize issues. Use for testing workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /lint-check

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Run or infer the project lint/static-analysis command and summarize issues.

## Parameters

- Required: none
- Optional: --target <dir|glob>, --command <cmd>, --fix

## Example

```text
/lint-check --target src
```

## Expected Output

```text
Lint/static-analysis summary with actionable findings
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /lint-check
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <dir|glob>', '--command <cmd>', '--fix']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


