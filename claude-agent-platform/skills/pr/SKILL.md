---
name: pr
version: 1.0.0
description: Draft a pull request body from current branch diff. Use for git workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /pr

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Draft a pull request body from current branch diff.

## Parameters

- Required: none
- Optional: --base <branch>, --template <file>, --include-tests

## Example

```text
/pr --base main --include-tests
```

## Expected Output

```text
Markdown PR body with summary, changes, tests, risks
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /pr
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--base <branch>', '--template <file>', '--include-tests']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


