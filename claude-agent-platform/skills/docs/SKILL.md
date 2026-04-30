---
name: docs
version: 1.0.0
description: Retrieve or synthesize docs for a stack/component. Use for research workflows. Routes to Research agent.
disable-model-invocation: true
---
# /docs

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Retrieve or synthesize docs for a stack/component.

## Parameters

- Required: --query <text>
- Optional: --target <file|dir>, --version <version>

## Example

```text
/docs --query "Prisma transaction API" --version 5
```

## Expected Output

```text
Documentation findings with sources and examples
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Research** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /docs
   raw_arguments: $ARGUMENTS
   required: ['--query <text>']
   optional: ['--target <file|dir>', '--version <version>']
   agent: Research
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


