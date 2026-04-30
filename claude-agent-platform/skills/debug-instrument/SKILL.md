---
name: debug-instrument
version: 1.0.0
description: Add targeted temporary logging, tracing, or profiling instrumentation. Use for debugging workflows. Routes to Cursor agent.
disable-model-invocation: true
---
# /debug-instrument

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Add targeted temporary logging, tracing, or profiling instrumentation.

## Parameters

- Required: --target <file|function>
- Optional: --mode <log|trace|profile>, --remove-after

## Example

```text
/debug-instrument --target src/services/payment.ts --mode trace
```

## Expected Output

```text
Instrumentation diff and cleanup instructions
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Cursor** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /debug-instrument
   raw_arguments: $ARGUMENTS
   required: ['--target <file|function>']
   optional: ['--mode <log|trace|profile>', '--remove-after']
   agent: Cursor
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


