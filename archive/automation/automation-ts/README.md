# Automation CLI (TypeScript)

A TypeScript-based command-line interface for managing AI automation assets, converted from the original Python implementation.

## Features

- **Prompt Management**: List, show, and search AI prompts (27 prompts)
- **Agent Management**: Configure and inspect AI agents (17 agents)
- **Workflow Management**: Define and execute complex automation workflows (6 workflows)
- **Crews Management**: Multi-agent crew definitions and execution (2 crews)
- **Task Routing**: Intelligent routing of tasks to appropriate tools/agents
- **Orchestration Patterns**: Support for 5 Anthropic orchestration patterns
- **Asset Validation**: Validate all automation assets for consistency
- **Workflow Executor**: Execute workflows with multiple patterns support

## Installation

```bash
npm install
npm run build
npm link  # Optional: make globally available
```

## Usage

```bash
# List all prompts
automation prompts list

# Show a specific prompt
automation prompts show orchestrator

# Search prompts
automation prompts search "debugging"

# List agents
automation agents list

# Show agent details
automation agents show coder_agent

# List workflows
automation workflows list

# Show workflow details
automation workflows show code_review

# Route a task to appropriate tools
automation route "debug the code and fix the error"

# List orchestration patterns
automation patterns

# Validate all assets
automation validate

# Execute a workflow (dry run)
automation execute code_review --dry-run

# Execute a workflow with input
automation execute research_pipeline -i '{"topic": "quantum computing"}'

# Show system info
automation info

# Crews management
automation crews list           # List 2 multi-agent crews
automation crews show development_crew  # Show crew details
automation crews stats          # Show crews statistics

# Deployment registry
automation deploy list          # List 30 projects
automation deploy show MEZAN    # Show project details
automation deploy templates     # List 8 deployment templates
automation deploy stats         # Show statistics
```

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## Architecture

```text
automation-ts/
├── src/
│   ├── index.ts            # Main library entry point
│   ├── types/index.ts      # TypeScript interfaces and enums
│   ├── utils/file.ts       # File operations (YAML, Markdown)
│   ├── cli/index.ts        # CLI implementation (Commander.js)
│   ├── executor/index.ts   # Workflow execution engine
│   ├── validation/index.ts # Asset validation system
│   ├── deployment/index.ts # Deployment registry integration
│   ├── crews/index.ts      # Multi-agent crews management
│   └── __tests__/          # Jest tests (31 tests)
├── dist/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
├── QUICKSTART.md
└── .eslintrc.json
```

## Migration from Python

This TypeScript version maintains full compatibility with the original Python CLI while providing:

- **Type Safety**: Full TypeScript type checking
- **Better Performance**: Compiled JavaScript execution
- **Modern Dependencies**: Uses current Node.js ecosystem
- **Enhanced Maintainability**: Strict typing and modern patterns

## Configuration

The CLI expects the same YAML configuration files as the Python version:

- `agents/config/agents.yaml`
- `workflows/config/workflows.yaml`
- `orchestration/config/orchestration.yaml`
- `prompts/` directory with markdown files

## Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Ensure type safety

## License

MIT
