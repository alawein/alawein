---
name: lookup
version: 1.0.0
description: Look up API, library, or codebase facts. Use for research workflows. Routes to Research agent.
disable-model-invocation: true
---
# /lookup

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Look up API, library, or codebase facts.

## Parameters

- Required: --query <text>
- Optional: --source <codebase|official|web>, --stack <name>

## Example

```text
/lookup --query "FastAPI dependency injection for auth" --source official
```

## Expected Output

```text
[RESEARCH OUTPUT]
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Research** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /lookup
   raw_arguments: $ARGUMENTS
   required: ['--query <text>']
   optional: ['--source <codebase|official|web>', '--stack <name>']
   agent: Research
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


