---
name: security-scan
version: 1.0.0
description: Run focused security checks on files, directories, or current diff. Use for security workflows. Routes to Reviewer agent.
disable-model-invocation: true
---
# /security-scan

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Run focused security checks on files, directories, or current diff.

## Parameters

- Required: none
- Optional: --target <file|glob|dir|diff>, --severity <low|medium|high|critical>, --format <text|json|sarif>

## Example

```text
/security-scan --target src --severity high
```

## Expected Output

```text
[REVIEW REPORT] with security findings and fix instructions
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Reviewer** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /security-scan
   raw_arguments: $ARGUMENTS
   required: []
   optional: ['--target <file|glob|dir|diff>', '--severity <low|medium|high|critical>', '--format <text|json|sarif>']
   agent: Reviewer
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


## Detailed Skill Definition

```json
{
  "name": "security-scan",
  "version": "1.0.0",
  "input_contract": {
    "target": {"type": "file|glob|dir", "required": false, "default": "."},
    "severity": {"type": "low|medium|high|critical", "required": false, "default": "medium"},
    "format": {"type": "text|json|sarif", "required": false, "default": "text"}
  },
  "output_contract": {"format": "[REVIEW REPORT]", "fields": ["findings", "severity", "fix", "verdict"]},
  "dependencies": [],
  "execution_steps": [
    {"id": "secrets", "agent": "Reviewer", "action": "Check hardcoded secrets and sensitive literals", "expected_output": "secret findings"},
    {"id": "auth", "agent": "Reviewer", "action": "Check authn/authz boundaries", "expected_output": "auth findings"},
    {"id": "injection", "agent": "Reviewer", "action": "Check injection risks and unsafe parsing", "expected_output": "injection findings"}
  ]
}
```

### Security Checklist

- Secrets, tokens, keys, passwords, connection strings.
- Injection: SQL, command, path traversal, template, LDAP, NoSQL.
- Authn/authz: missing checks, confused deputy, privilege escalation.
- Unsafe defaults: CORS, cookies, TLS, debug flags, admin routes.
- Dependency risk: vulnerable or unpinned critical dependencies.

