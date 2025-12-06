# Automation CLI - Quick Start Guide

Get up and running with the TypeScript Automation CLI in under 5 minutes.

## Installation

```bash
cd automation-ts
npm install
npm run build
```

## Basic Commands

### 1. View System Info

```bash
npx automation info
```

Output:
```
============================================================
AUTOMATION SYSTEM INFO
============================================================

Version: 1.0.0
Automation Path: C:\Users\mesha\Desktop\GitHub\automation

Assets:
  - Prompts: 27
  - Agents: 17
  - Workflows: 6
  - Patterns: 5 (Anthropic)
```

### 2. List Available Prompts

```bash
npx automation prompts list
```

Shows all 27 prompts organized by category (system, project, tasks).

### 3. List Available Agents

```bash
npx automation agents list
```

Shows all 17 agents organized by category (research, development, content, security, operations).

### 4. Route a Task

```bash
npx automation route "debug the authentication error in login"
```

Output:
```
============================================================
TASK ROUTING RESULT
============================================================

Task: debug the authentication error in login

Detected Type: debugging
Confidence: 57%

Recommended Tools:
  → cline
    cursor
    claude_code
```

### 5. Validate All Assets

```bash
npx automation validate
```

Checks all agents, workflows, prompts, and orchestration configs for errors.

### 6. Execute a Workflow (Dry Run)

```bash
npx automation execute code_review --dry-run
```

Shows the execution plan without actually running the workflow.

### 7. View Deployment Registry

```bash
npx automation deploy list
npx automation deploy stats
npx automation deploy templates
```

## Command Reference

| Command | Description |
|---------|-------------|
| `prompts list` | List all prompts |
| `prompts show <name>` | Show prompt content |
| `prompts search <query>` | Search prompts |
| `agents list` | List all agents |
| `agents show <name>` | Show agent details |
| `workflows list` | List all workflows |
| `workflows show <name>` | Show workflow details |
| `route <task>` | Route task to tools |
| `patterns` | List orchestration patterns |
| `validate` | Validate all assets |
| `execute <workflow>` | Execute a workflow |
| `info` | Show system info |
| `deploy list` | List projects in registry |
| `deploy show <name>` | Show project details |
| `deploy templates` | List deployment templates |
| `deploy stats` | Show deployment statistics |

## Programmatic Usage

```typescript
import { 
  WorkflowExecutor, 
  AssetValidator, 
  DeploymentManager,
  loadYamlFile 
} from 'automation-cli';

// Validate assets
const validator = new AssetValidator();
const results = validator.validateAll();

// Execute workflow
const executor = new WorkflowExecutor();
const result = await executor.execute(workflow, inputs);

// Access deployment registry
const deployManager = new DeploymentManager();
const projects = deployManager.listProjects();
```

## Integration with Atlas CLI

The TypeScript CLI integrates with the `atlas` PowerShell CLI:

```powershell
atlas automation prompts list
atlas automation route "implement new feature"
atlas prompts list  # shortcut
atlas route "fix bug"  # shortcut
```

## Next Steps

1. **Explore prompts**: `npx automation prompts show orchestrator`
2. **Check agents**: `npx automation agents show coder_agent`
3. **View workflows**: `npx automation workflows show research_pipeline`
4. **Run validation**: `npx automation validate`
