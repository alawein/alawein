---
name: audit
version: 1.0.0
description: Full security and correctness audit. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /audit

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Full security and correctness audit.

## Parameters

- Required: none
- Optional: --target <file|glob|dir>, --severity <low|medium|high|critical>, --format <text|json|sarif>

## Example

```text
/audit --target src --severity high
```

## Expected Output

```text
[REVIEW REPORT] with security dimension included
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /audit
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <file|glob|dir>', '--severity <low|medium|high|critical>', '--format <text|json|sarif>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


