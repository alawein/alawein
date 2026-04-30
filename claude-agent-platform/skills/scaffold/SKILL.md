---
name: scaffold
version: 1.0.0
description: Generate a module, service, feature, CLI, or library scaffold. Use for code generation workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /scaffold

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate a module, service, feature, CLI, or library scaffold.

## Parameters

- Required: --type <module|service|feature|cli|library>, --name <name>
- Optional: --out <dir>, --with-tests, --with-docs, --dry-run

## Example

```text
/scaffold --type service --name PaymentProcessor --with-tests --with-docs
```

## Expected Output

```text
File tree proposal and [CODEX OUTPUT] per generated file
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /scaffold
   raw_arguments: $ARGUMENTS
   required: ['--type <module|service|feature|cli|library>', '--name <name>']
   optional: ['--out <dir>', '--with-tests', '--with-docs', '--dry-run']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


