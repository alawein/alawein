---
name: branch
version: 1.0.0
description: Create a branch name from a task description. Use for git workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /branch

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Create a branch name from a task description.

## Parameters

- Required: --task <description>
- Optional: --type <feature|fix|chore|hotfix>, --from <branch>, --dry-run

## Example

```text
/branch --task "add password reset flow" --type feature
```

## Expected Output

```text
Branch command proposal and created branch if approved
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /branch
   raw_arguments: $ARGUMENTS
   required: ['--task <description>']
   optional: ['--type <feature|fix|chore|hotfix>', '--from <branch>', '--dry-run']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


