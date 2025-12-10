# CodeMap CLI

Visual code map generator for the Alawein monorepo. Generates ASCII, Mermaid,
and SVG diagrams from codebase analysis.

## Quick Start

```bash
# Navigate to codemap directory
cd scripts/codemap

# Install dependencies
npm install

# List available diagrams
npx ts-node cli.ts list

# Generate all diagrams
npx ts-node cli.ts generate --all

# Generate specific category
npx ts-node cli.ts generate --category architecture
```

## Usage

```bash
npx ts-node cli.ts <command> [options]
```

### Commands

| Command    | Description             |
| ---------- | ----------------------- |
| `generate` | Generate diagram(s)     |
| `list`     | List available diagrams |
| `help`     | Show help message       |

### Options

| Option             | Description                         |
| ------------------ | ----------------------------------- |
| `--all`            | Generate all diagrams               |
| `--name <name>`    | Generate specific diagram           |
| `--category <cat>` | Generate all diagrams in category   |
| `--format <fmt>`   | Output format (ascii, mermaid, svg) |
| `--output <dir>`   | Output directory                    |

### Categories

- `architecture` - System architecture diagrams
- `database` - Database schema ERDs
- `components` - React component hierarchies
- `state` - State management flows
- `api` - API service diagrams
- `cicd` - CI/CD pipeline diagrams
- `testing` - Testing strategy diagrams

## Examples

```bash
# Generate architecture diagrams
npx ts-node cli.ts generate --category architecture

# Generate specific diagram as Mermaid
npx ts-node cli.ts generate --name auth-flow --format mermaid

# Generate database ERDs
npx ts-node cli.ts generate --category database

# Generate to custom directory
npx ts-node cli.ts generate --all --output ./docs/diagrams
```

## Output Formats

### ASCII (`.txt`)

- Terminal-friendly
- Quick reference
- No dependencies for viewing

### Mermaid (`.mmd`)

- GitHub-rendered
- Interactive in VS Code
- Embeddable in Markdown

### SVG (`.svg`)

- High-quality graphics
- Scalable
- Documentation-ready

## Hybrid Approach: Cascade Integration

For complex SVG diagrams, use Cascade (Windsurf AI):

```text
"Generate SVG diagram for auth-flow"
"Create detailed architecture SVG with all platforms"
"Generate ERD diagram for REPZ database schema"
```

Cascade can:

- Analyze code context in real-time
- Generate detailed, styled SVGs
- Include accurate relationships
- Add custom styling and colors

## Available Diagrams

### Architecture (8)

- `monorepo-structure` - Root directory layout
- `platform-overview` - 7 platforms overview
- `llc-ownership` - LLC ownership hierarchy
- `tech-stack` - Technology stack layers
- `deployment-architecture` - Deployment flow
- `data-flow` - Data flow sequence
- `package-dependencies` - Package relationships
- `ci-cd-pipeline` - CI/CD workflow

### Database (4)

- `repz-schema` - REPZ database ERD
- `liveiticonic-schema` - LiveItIconic ERD
- `shared-tables` - Shared tables ERD
- `rls-policies` - RLS policy map

### Components (5)

- `component-tree` - React component hierarchy
- `ui-package` - @monorepo/ui structure
- `feature-modules` - Feature module structure
- `provider-stack` - Provider hierarchy
- `hook-dependencies` - Hook dependencies

### State (3)

- `state-layers` - State management layers
- `auth-state-machine` - Auth state machine
- `react-query-cache` - React Query cache

### API (5)

- `api-service` - ApiService class diagram
- `edge-functions` - Edge function map
- `request-flow` - Request flow sequence
- `error-hierarchy` - Error class hierarchy
- `auth-flow` - Authentication flow

### CI/CD (3)

- `workflow-map` - GitHub Actions map
- `pr-pipeline` - PR check pipeline
- `deployment-pipeline` - Deployment pipeline

### Testing (2)

- `testing-pyramid` - Testing pyramid
- `test-coverage` - Coverage by package

## Output Directory

Generated diagrams are saved to `scripts/codemap/output/` by default.

```
output/
├── monorepo-structure.txt
├── monorepo-structure.mmd
├── platform-overview.svg
├── auth-flow.mmd
└── ...
```

## Viewing Diagrams

### Mermaid

- **VS Code**: Install "Mermaid Preview" extension
- **GitHub**: Mermaid renders automatically in `.md` files
- **Online**: Use [mermaid.live](https://mermaid.live)

### SVG

- Open in any browser
- Embed in documentation
- Use in presentations

### ASCII

- View in terminal: `cat output/monorepo-structure.txt`
- Include in code comments
- Use in CLI help text
