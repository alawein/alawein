---
name: extend
version: 1.0.0
description: Scan the current repo and propose local Claude configuration, skills, and workflows. Use for extensibility workflows. Routes to Extender agent.
disable-model-invocation: true
---
# /extend

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Scan the current repo and propose local Claude configuration, skills, and workflows.

## Parameters

- Required: none
- Optional: --root <dir>, --force, --approve, --rollback

## Example

```text
/extend --root . --force
```

## Expected Output

```text
[EXTENDER PROPOSAL] and approval instructions
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Extender** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /extend
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--root <dir>', '--force', '--approve', '--rollback']
   agent: Extender
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


## Detailed Skill Definition

```json
{
  "name": "extend",
  "version": "1.0.0",
  "input_contract": {
    "root": {"type": "path", "required": false, "default": "."},
    "force": {"type": "boolean", "required": false, "default": false},
    "approve": {"type": "boolean", "required": false, "default": false},
    "rollback": {"type": "boolean", "required": false, "default": false}
  },
  "output_contract": {"format": "[EXTENDER PROPOSAL]", "fields": ["stack", "commands", "conflicts", "proposal_path"]},
  "dependencies": [],
  "execution_steps": [
    {"id": "scan", "agent": "Extender", "action": "Run repo-scanner.sh", "expected_output": "scan JSON"},
    {"id": "propose", "agent": "Extender", "action": "Run generate-local-claude.sh --dry-run", "expected_output": "proposal"},
    {"id": "approve", "agent": "Extender", "action": "Write only if user approves", "expected_output": "state update"}
  ]
}
```

### Local Extension Rules

- Never write `.claude/CLAUDE.md` without approval.
- Always create a backup before replacing local config.
- Detect same-name skill conflicts and explain native precedence risk.
- Store repo-specific skills in `.claude/skills/` only after approval.

