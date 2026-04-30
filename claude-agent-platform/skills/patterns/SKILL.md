---
name: patterns
version: 1.0.0
description: Find project or canonical implementation patterns. Use for research workflows. Routes to Research agent.
disable-model-invocation: true
---
# /patterns

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Find project or canonical implementation patterns.

## Parameters

- Required: --query <pattern>
- Optional: --target <dir>, --prefer-local

## Example

```text
/patterns --query "repository pattern for services" --prefer-local
```

## Expected Output

```text
Pattern findings, tradeoffs, next agent recommendation
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Research** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /patterns
   raw_arguments: $ARGUMENTS
   required: ['--query <pattern>']
   optional: ['--target <dir>', '--prefer-local']
   agent: Research
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


