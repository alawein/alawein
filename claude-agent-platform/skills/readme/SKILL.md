---
name: readme
version: 1.0.0
description: Generate or update README.md. Use for documentation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /readme

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate or update README.md.

## Parameters

- Required: none
- Optional: --target <dir>, --sections <csv>, --update

## Example

```text
/readme --target . --sections "overview,install,usage,api" --update
```

## Expected Output

```text
README diff and missing-info checklist
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /readme
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <dir>', '--sections <csv>', '--update']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


