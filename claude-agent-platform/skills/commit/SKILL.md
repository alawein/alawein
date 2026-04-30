---
name: commit
version: 1.0.0
description: Create a Conventional Commit from staged or unstaged diff. Use for git workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /commit

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Create a Conventional Commit from staged or unstaged diff.

## Parameters

- Required: none
- Optional: --scope <scope>, --type <feat|fix|docs|chore|refactor|test|perf>, --breaking, --dry-run

## Example

```text
/commit --scope auth --dry-run
```

## Expected Output

```text
Commit message and approval gate before git commit
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /commit
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--scope <scope>', '--type <feat|fix|docs|chore|refactor|test|perf>', '--breaking', '--dry-run']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


