---
name: review
version: 1.0.0
description: Review code, diffs, or files for correctness, security, performance, maintainability, and contract adherence. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /review

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Review code, diffs, or files for correctness, security, performance, maintainability, and contract adherence.

## Parameters

- Required: none
- Optional: --target <file|glob|dir|diff>, --type <correctness|security|performance|maintainability|contract|all>, --min-severity <low|medium|high|critical>

## Example

```text
/review --target src --type all
```

## Expected Output

```text
[REVIEW REPORT] with verdict
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /review
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <file|glob|dir|diff>', '--type <correctness|security|performance|maintainability|contract|all>', '--min-severity <low|medium|high|critical>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


