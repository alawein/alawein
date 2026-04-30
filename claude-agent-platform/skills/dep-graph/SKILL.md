---
name: dep-graph
version: 1.0.0
description: Produce dependency graph and risk hotspots. Use for architecture workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /dep-graph

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Produce dependency graph and risk hotspots.

## Parameters

- Required: none
- Optional: --target <dir>, --depth <n>, --include-tests

## Example

```text
/dep-graph --target src --depth 3
```

## Expected Output

```text
Graph, central nodes, cycle report
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /dep-graph
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <dir>', '--depth <n>', '--include-tests']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


