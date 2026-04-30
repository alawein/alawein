---
name: test-gen
version: 1.0.0
description: Generate unit, integration, or e2e tests. Use for testing workflows. Routes to Codex agent.
disable-model-invocation: true
---
# /test-gen

<!-- Rationale: Install as a Claude Code skill so this command appears in the slash-command menu. -->

## Description

Generate unit, integration, or e2e tests.

## Parameters

- Required: --target <file|glob>
- Optional: --type <unit|integration|e2e>, --framework <name>, --coverage-target <n>

## Example

```text
/test-gen --target src/services/auth.ts --type unit --coverage-target 90
```

## Expected Output

```text
Test file proposal, [CODEX OUTPUT], run result
```

## Execution Contract

When invoked with `$ARGUMENTS`:

1. Parse arguments and identify missing required inputs.
2. If required inputs are missing, ask one concise question.
3. Activate the **Codex** behavioral profile from `~/.claude/CLAUDE.md`.
4. Use this input contract:
   ```yaml
   command: /test-gen
   raw_arguments: $ARGUMENTS
   required: ['--target <file|glob>']
   optional: ['--type <unit|integration|e2e>', '--framework <name>', '--coverage-target <n>']
   agent: Codex
   ```
5. For file writes, show proposed content or unified diff before applying.
6. For git operations, show commands and require approval before execution.
7. Emit the expected output format exactly.


## Detailed Skill Definition

```json
{
  "name": "test-gen",
  "version": "1.0.0",
  "input_contract": {
    "target": {"type": "file|glob", "required": true},
    "type": {"type": "unit|integration|e2e", "required": false, "default": "unit"},
    "framework": {"type": "string", "required": false},
    "coverage_target": {"type": "integer", "required": false, "default": 80}
  },
  "output_contract": {"format": "[CODEX OUTPUT] + test run summary", "fields": ["test_file", "cases", "coverage_estimate", "run_result"]},
  "dependencies": [],
  "execution_steps": [
    {"id": "detect", "agent": "Research", "action": "Detect existing test style and framework", "expected_output": "framework/style summary"},
    {"id": "generate", "agent": "Codex", "action": "Generate tests covering public behavior and edge cases", "expected_output": "test file proposal"},
    {"id": "review", "agent": "Reviewer", "action": "Review generated tests for brittleness and missing cases", "expected_output": "review verdict"}
  ]
}
```

### Test Quality Rules

- Test behavior, not private implementation details.
- Include success, failure, boundary, and regression cases.
- Reuse local fixtures and factories when they exist.
- Avoid network and time flakiness; mock or inject deterministic dependencies.

