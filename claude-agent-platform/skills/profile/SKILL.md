---
name: profile
version: 1.0.0
description: Analyze bottlenecks in a function, module, or command. Use for profiling workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /profile

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Analyze bottlenecks in a function, module, or command.

## Parameters

- Required: --target <file|function|command>
- Optional: --context <usage>, --budget <latency|memory>

## Example

```text
/profile --target src/utils/dataTransform.ts --context "10k rows"
```

## Expected Output

```text
Ranked bottlenecks and measurement plan
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /profile
   raw_arguments: $ARGUMENTS
   required: ['--target <file|function|command>']
   optional: ['--context <usage>', '--budget <latency|memory>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


