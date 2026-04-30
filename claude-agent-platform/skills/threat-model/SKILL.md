---
name: threat-model
version: 1.0.0
description: Create a threat model for a feature or architecture. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /threat-model

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Create a threat model for a feature or architecture.

## Parameters

- Required: --target <feature|dir|doc>
- Optional: --method <stride|attack-tree>, --out <file>

## Example

```text
/threat-model --target "OAuth login flow" --method stride
```

## Expected Output

```text
Assets, trust boundaries, threats, mitigations, residual risk
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /threat-model
   raw_arguments: $ARGUMENTS
   required: ['--target <feature|dir|doc>']
   optional: ['--method <stride|attack-tree>', '--out <file>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


