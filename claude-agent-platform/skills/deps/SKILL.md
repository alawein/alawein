---
name: deps
version: 1.0.0
description: Audit dependencies for outdated versions, licenses, duplicates, and vulnerabilities. Use for architecture workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /deps

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Audit dependencies for outdated versions, licenses, duplicates, and vulnerabilities.

## Parameters

- Required: none
- Optional: --check <outdated|licenses|duplicates|vulnerabilities|all>, --target <manifest>

## Example

```text
/deps --check all
```

## Expected Output

```text
Dependency report with severity and remediation
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /deps
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--check <outdated|licenses|duplicates|vulnerabilities|all>', '--target <manifest>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


## Detailed Skill Definition

```json
{
  "name": "deps",
  "version": "1.0.0",
  "input_contract": {
    "check": {"type": "outdated|licenses|duplicates|vulnerabilities|all", "required": false, "default": "all"},
    "target": {"type": "manifest", "required": false, "default": "auto-detect"}
  },
  "output_contract": {"format": "dependency report", "fields": ["manifest", "risk", "recommendation", "manual_steps"]},
  "dependencies": [],
  "execution_steps": [
    {"id": "detect", "agent": "Research", "action": "Detect package manager and manifests", "expected_output": "manifest list"},
    {"id": "audit", "agent": "Reviewer", "action": "Analyze dependency risks", "expected_output": "risk report"},
    {"id": "plan", "agent": "Orchestrator", "action": "Create safe upgrade plan", "expected_output": "ordered remediation plan"}
  ]
}
```

### Dependency Rules

- Do not upgrade major versions without migration notes.
- Prefer lockfile-preserving commands.
- Flag license ambiguity separately from security risk.
- Recommend official package-manager audit commands when available.

