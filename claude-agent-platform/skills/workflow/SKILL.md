---
name: workflow
version: 1.0.0
description: Run a named workflow template as a skill chain. Use for workflow workflows. Routes to Orchestrator agent.
disable-model-invocation: true
---
# /workflow

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Run a named workflow template as a skill chain.

## Parameters

- Required: --name <pr-ready|new-feature|bug-fix>
- Optional: --dry-run, --from <step>, --only <step>

## Example

```text
/workflow --name pr-ready --dry-run
```

## Expected Output

```text
Workflow plan, step outputs, final verdict
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Orchestrator** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /workflow
   raw_arguments: $ARGUMENTS
   required: ['--name <pr-ready|new-feature|bug-fix>']
   optional: ['--dry-run', '--from <step>', '--only <step>']
   agent: Orchestrator
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


