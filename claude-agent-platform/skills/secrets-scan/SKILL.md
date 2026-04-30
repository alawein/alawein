---
name: secrets-scan
version: 1.0.0
description: Scan for hardcoded secrets and sensitive data. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /secrets-scan

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Scan for hardcoded secrets and sensitive data.

## Parameters

- Required: none
- Optional: --target <file|glob|git-history>, --fix

## Example

```text
/secrets-scan --target . --fix
```

## Expected Output

```text
Findings with file/line/pattern and optional replacement diff
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /secrets-scan
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <file|glob|git-history>', '--fix']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


