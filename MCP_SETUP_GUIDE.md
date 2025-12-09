# Complete MCP Setup Guide for Desktop IDEs

**Author:** Automated Configuration Management **Created:** 2025-12-09
**Version:** 2.0.0 **Context:** Context7 (Smithery.ai) - Universal IDE
Configuration

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [MCP Basics](#mcp-basics)
3. [Platform-Specific Setup](#platform-specific-setup)
4. [Recommended MCP Servers](#recommended-mcp-servers)
5. [Environment Variables & API Keys](#environment-variables--api-keys)
6. [Common Issues & Fixes](#common-issues--fixes)
7. [Security Best Practices](#security-best-practices)
8. [Advanced Integration](#advanced-integration)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Set Environment Variables (Windows PowerShell)

```powershell
# GitHub API Access
$env:GITHUB_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Search & Web APIs
$env:BRAVE_SEARCH_API_KEY = "your_brave_search_key"
$env:TAVILY_API_KEY = "tvly-your_key"
$env:FIRECRAWL_API_KEY = "fc-your_key"

# Make permanent (Optional)
[System.Environment]::SetEnvironmentVariable("GITHUB_PAT", "$env:GITHUB_PAT", "User")
```

### 2. Verify Installation

```bash
node --version    # Should be 18+
npm --version     # Should be 9+
npx --version     # Should be 9+
```

### 3. Test MCP Server

```bash
npx @modelcontextprotocol/server-filesystem C:/Users/mesha/Desktop
```

---

## MCP Basics

### What is MCP?

The **Model Context Protocol** is a standardized way for AI assistants to
interact with:

- File systems (secure, configurable access)
- Version control systems (Git, GitHub)
- Web APIs and external services
- Databases and data sources
- Custom tools and integrations

### Key Concepts

| Concept        | Explanation                                                      |
| -------------- | ---------------------------------------------------------------- |
| **MCP Server** | A service that provides tools/resources (runs locally or remote) |
| **MCP Client** | Your IDE/Editor that connects to servers                         |
| **Transport**  | How communication happens: STDIO (local), HTTP (remote)          |
| **Resources**  | Data/files the server can access                                 |
| **Tools**      | Actions/functions the server can perform                         |

### Official Specification

- **Standard:** https://modelcontextprotocol.io/
- **Transport Protocols:** STDIO, HTTP, SSE (deprecated)
- **Latest Version:** 2025-06-18

---

## Platform-Specific Setup

### Claude Desktop

**Location:** `%APPDATA%\Claude\claude_desktop_config.json`

**Current Configuration (Fixed):**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/mesha/Desktop",
        "C:/Users/mesha/Documents",
        "C:/Users/mesha/Downloads"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_SEARCH_API_KEY}"
      }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "time": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-time"]
    },
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

**After changes:**

- Restart Claude Desktop completely
- Check Settings → Developer → MCP indicator

---

### Claude Code (CLI)

**Location:** `~/.claude.json` (user scope) or `.mcp.json` (project scope)

**Installation:**

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Add MCP servers
claude mcp add filesystem --scope user
claude mcp add github --scope user
```

**Manual Configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    }
  }
}
```

---

### Cursor Editor

**Location:** `%APPDATA%\Cursor\User\mcp.json`

**Fixed Configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/mesha/Desktop",
        "C:/Users/mesha/Documents"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

**⚠️ IMPORTANT:** SSE protocol removed (deprecated as of 2025-03-26)

---

### VS Code

**Location:** `%APPDATA%\Code\User\mcp.json`

**Fixed Configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/mesha/Desktop",
        "C:/Users/mesha/Documents",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

### Windsurf Editor

**Location:** `%APPDATA%\Windsurf\yolo.json`

**With YOLO Mode + MCPs (Fixed):**

The Windsurf YOLO configuration now includes:

- **Cascade Mode:** Multi-file editing with auto-approval
- **Flow Mode:** Continuous refactoring
- **MCPs Integration:** Filesystem, GitHub, Git, Fetch, Memory, Sequential
  Thinking
- **Safety Gates:**
  - Destructive commands blocked (rm -rf, DROP DATABASE, etc.)
  - Requires confirmation for: git push --force, npm publish, deployments
  - File size limits: 50MB read, 10MB write
  - Rate limiting: 60 commands/min, 100 file ops/min

**Features:**

- Auto-approve: Safe git operations, npm install, testing, building
- Block: rm -rf, database drops, system shutdowns
- Confirm: force pushes, publishing, deployments, sensitive ops
- Logging: Full audit trail with 30-day retention

---

### JetBrains IDEs (IntelliJ, PyCharm, WebStorm, Rider, Android Studio)

**Location:** Settings | Tools | MCP Server

**Configuration:** Use MCP Proxy to expose IDE to external clients

```json
{
  "mcpServers": {
    "jetbrains": {
      "command": "npx",
      "args": [
        "@jetbrains/mcp-proxy"
      ],
      "env": {
        "IDE_PORT": "63342",
        "HOST": "127.0.0.1"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/mesha/Desktop/GitHub"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    }
  }
}
```

**IDE Settings:**

- Enable "Run shell commands without confirmation (brave mode)"
- Configure allowed ports (default: 63342)

---

## Recommended MCP Servers

### Tier 1: Essential (Recommended for all users)

#### Filesystem Server

```json
{
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "C:/Users/mesha/Desktop",
      "C:/Users/mesha/Documents",
      "C:/Users/mesha/Desktop/GitHub"
    ]
  }
}
```

**Use Case:** File operations with secure, configurable access **GitHub:**
https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

#### Git Server

```json
{
  "git": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-git",
      "C:/Users/mesha/Desktop/GitHub"
    ]
  }
}
```

**Use Case:** Clone, commit, push, branch management, history search **GitHub:**
https://github.com/modelcontextprotocol/servers/tree/main/src/git

#### GitHub Server (Official)

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@github/github-mcp-server"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
    }
  }
}
```

**Use Case:** Issue management, PR review, commit history, branch creation
**GitHub:** https://github.com/github/github-mcp-server **Docs:**
https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server

#### Fetch Server

```json
{
  "fetch": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-fetch"]
  }
}
```

**Use Case:** Web scraping, content conversion to markdown, API calls

---

### Tier 2: Advanced (Recommended for development)

#### Memory Server

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

**Use Case:** Persistent knowledge graph across conversations

#### Sequential Thinking Server

```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}
```

**Use Case:** Complex multi-step problem solving with dynamic reasoning

#### Time Server

```json
{
  "time": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-time"]
  }
}
```

**Use Case:** Time/timezone operations, scheduled tasks

---

### Tier 3: Database Servers (Optional)

#### PostgreSQL Server

```json
{
  "postgres": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-postgres",
      "postgresql://user:password@localhost:5432/database"
    ]
  }
}
```

#### SQLite Server

```json
{
  "sqlite": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-sqlite",
      "C:/Users/mesha/path/to/database.db"
    ]
  }
}
```

#### MySQL Server

```json
{
  "mysql": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-mysql"],
    "env": {
      "MYSQL_HOST": "localhost",
      "MYSQL_PORT": "3306",
      "MYSQL_USER": "${MYSQL_USER}",
      "MYSQL_PASSWORD": "${MYSQL_PASSWORD}",
      "MYSQL_DATABASE": "your_database"
    }
  }
}
```

---

### Tier 4: Specialized Services

#### Brave Search

```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "${BRAVE_SEARCH_API_KEY}"
    }
  }
}
```

**Register:** https://api.search.brave.com

#### Tavily Search

```json
{
  "tavily": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/tavily-search"],
    "env": {
      "TAVILY_API_KEY": "${TAVILY_API_KEY}"
    }
  }
}
```

**Register:** https://tavily.com/

#### Docker

```json
{
  "docker": {
    "command": "npx",
    "args": ["@jpmorganchase/mcp-server-docker"],
    "env": {
      "DOCKER_HOST": "unix:///var/run/docker.sock"
    }
  }
}
```

#### AWS Services

```json
{
  "aws": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-aws"],
    "env": {
      "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY}",
      "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_KEY}",
      "AWS_REGION": "us-east-1"
    }
  }
}
```

#### Slack

```json
{
  "slack": {
    "command": "npx",
    "args": ["@alchemistsimulator/mcp-server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
      "SLACK_WORKSPACE_ID": "${SLACK_WORKSPACE_ID}"
    }
  }
}
```

---

## Environment Variables & API Keys

### Setting Environment Variables (Windows)

#### PowerShell (Recommended)

```powershell
# Set for current session
$env:GITHUB_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:BRAVE_SEARCH_API_KEY = "your_key_here"

# Make permanent (User scope)
[System.Environment]::SetEnvironmentVariable("GITHUB_PAT", "$env:GITHUB_PAT", "User")

# Verify
$env:GITHUB_PAT  # Check if set
[System.Environment]::GetEnvironmentVariable("GITHUB_PAT", "User")  # Check permanent
```

#### Command Prompt

```cmd
# Set for current session
set GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Make permanent (Admin required)
setx GITHUB_PAT "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Required API Keys

| Service          | Env Variable           | Purpose                    | Get Token                                              |
| ---------------- | ---------------------- | -------------------------- | ------------------------------------------------------ |
| **GitHub**       | `GITHUB_PAT`           | Repo access, PRs, issues   | Settings > Developer Settings > Personal Access Tokens |
| **Brave Search** | `BRAVE_SEARCH_API_KEY` | Privacy-focused web search | https://api.search.brave.com                           |
| **Tavily**       | `TAVILY_API_KEY`       | AI web search              | https://tavily.com/                                    |
| **FireCrawl**    | `FIRECRAWL_API_KEY`    | Web scraping, parsing      | https://www.firecrawl.dev                              |
| **Sentry**       | `SENTRY_AUTH_TOKEN`    | Error monitoring           | https://sentry.io                                      |

### Secure Storage (Recommended)

Instead of environment variables, use OS secure storage:

#### Windows Credential Manager

```powershell
# Store credential
cmdkey /add:github /user:your_username /pass:ghp_token_here

# Retrieve in .env or scripts
$token = powershell -Command `
  "(New-Object PSCredential 'user', (ConvertTo-SecureString -AsPlainText 'pass' -Force)).GetNetworkCredential().Password"
```

#### Using 1Password CLI (Premium Option)

```bash
# Sync MCP servers with 1Password
op run -- claude_sync_mcps.sh
```

---

## Common Issues & Fixes

### Issue 1: "Server Failed to Start"

**Symptoms:** Server in config but not available in chat

**Solutions:**

1. **Check Node.js Installation**

   ```bash
   node --version    # Should be 18+
   npm --version     # Should be 9+
   ```

2. **Test Server Directly**

   ```bash
   npx @modelcontextprotocol/server-filesystem C:/Users/mesha/Desktop
   ```

3. **Verify Absolute Paths**

   ```json
   "WRONG": "./path/to/folder",
   "RIGHT": "C:/Users/mesha/Desktop"
   ```

4. **Restart IDE completely** (not just reload)

---

### Issue 2: "GITHUB_PAT Environment Variable Not Found"

**Symptoms:** GitHub server fails with auth error

**Solutions:**

```powershell
# 1. Check if variable is set
$env:GITHUB_PAT

# 2. Set it temporarily
$env:GITHUB_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 3. Make it permanent
[System.Environment]::SetEnvironmentVariable("GITHUB_PAT", "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx", "User")

# 4. RESTART Claude Desktop/IDE completely!
# (Environment changes require restart)
```

---

### Issue 3: "JSON Syntax Error"

**Symptoms:** MCP config doesn't load, no error message

**Solutions:**

```bash
# Validate JSON
powershell -Command "Get-Content claude_desktop_config.json | ConvertFrom-Json"

# Common mistakes:
# ❌ Trailing comma
# ❌ Single quotes (use double quotes)
# ❌ Unescaped backslashes
```

---

### Issue 4: "Path Not Found" (Windows)

**Symptoms:** Filesystem server can't access paths

**Solutions:**

```json
// Use forward slashes OR double backslashes
"CORRECT": "C:/Users/mesha/Desktop",
"ALSO_CORRECT": "C:\\Users\\mesha\\Desktop",
"WRONG": "C:\Users\mesha\Desktop",

// For UNC paths:
"\\\\server\\share"
```

---

### Issue 5: "Port Already in Use" (HTTP servers)

**Symptoms:** "Port 8000 is already in use"

```powershell
# Find what's using the port
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Use different port in config
"command": "node",
"args": ["./server.js", "--port", "8001"]
```

---

### Issue 6: "Protocol Output Not Valid JSON-RPC"

**Symptoms:** "MCP server only writes JSON-RPC messages"

**Solution:** Ensure all console output goes to stderr:

```javascript
// ✅ CORRECT
console.error('Debug info'); // -> stderr
process.stdout.write(JSON.stringify(message) + '\n'); // -> stdout (JSON-RPC)

// ❌ WRONG
console.log('Debug info'); // -> stdout (breaks protocol!)
```

---

## Security Best Practices

### 1. Never Hardcode Credentials

```json
// ❌ NEVER DO THIS
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}

// ✅ DO THIS
{
  "env": {
    "GITHUB_TOKEN": "${GITHUB_PAT}"
  }
}
```

### 2. Use Environment Variables

```json
{
  "env": {
    "API_KEY": "${MY_API_KEY}",
    "DB_URL": "${DATABASE_URL}",
    "SECRET_TOKEN": "${SECRET_TOKEN}"
  }
}
```

### 3. Credential Sources (Recommended Order)

1. **OS Secure Storage** (Keychain, Credential Manager)
2. **Environment Variables** (shell profile)
3. **1Password / Vault** (secret management)
4. **Encrypted .env** (local only, never commit)

### 4. Scope Tokens Minimally

**GitHub Token Scopes:**

- ✅ `repo` (read/write to your own repos)
- ✅ `read:org` (read organization data)
- ✅ `user:email` (get email)
- ❌ `admin:org_hook` (not needed)
- ❌ `admin:repo_hook` (not needed)

### 5. Rotate Credentials Regularly

```bash
# Every 90 days:
# - Regenerate GitHub PAT
# - Update API keys
# - Audit access logs
```

### 6. .gitignore Configuration

```
# Never commit configs with secrets
claude_desktop_config.json
.claude.json
.mcp.json
.cursor/mcp.json
.vscode/mcp.json

# Never commit environment files
.env
.env.local
.env.*.local
.env.production

# Never commit keys
*.key
*.pem
*.p12
credentials.json
secrets.json
```

### 7. Audit Trail & Monitoring

```json
{
  "logging": {
    "enabled": true,
    "log_level": "info",
    "log_commands": true,
    "log_file_operations": true,
    "retention_days": 30,
    "include_context": true
  }
}
```

---

## Advanced Integration

### Integrating with Agent Orchestration

Your existing agent and orchestration system can be enhanced with MCPs:

```json
{
  "mcpServers": {
    "orchestrator": {
      "command": "python",
      "args": ["C:/Users/mesha/Desktop/GitHub/automation/orchestrator.py"],
      "env": {
        "ORCHESTRATION_CONFIG": "${ORCHEX_CONFIG}",
        "AGENT_MODE": "YOLO",
        "GOVERNANCE_LEVEL": "SECURE"
      }
    },
    "agent-executor": {
      "command": "node",
      "args": ["C:/Users/mesha/Desktop/GitHub/automation/agent-executor.js"]
    }
  }
}
```

### Multi-Agent Workflow Support

```json
{
  "agents": [
    {
      "name": "analysis-agent",
      "mcp_servers": ["filesystem", "github", "memory"],
      "tools": ["code_analysis", "pattern_detection"]
    },
    {
      "name": "implementation-agent",
      "mcp_servers": ["filesystem", "git", "sequential-thinking"],
      "tools": ["file_write", "test_execution"]
    },
    {
      "name": "validation-agent",
      "mcp_servers": ["git", "github", "fetch"],
      "tools": ["pr_review", "build_verification"]
    }
  ]
}
```

### Context7 (Smithery.ai) Integration

```json
{
  "context7_integration": {
    "enabled": true,
    "api_key": "${CONTEXT7_API_KEY}",
    "orchestration_id": "2050028a-ac58-42f3-a1be-284f21ee9132",
    "sync_configs": true,
    "auto_update": true
  }
}
```

---

## Troubleshooting

### Debugging Checklist

- [ ] Node.js version: `node --version` (should be 18+)
- [ ] NPM version: `npm --version` (should be 9+)
- [ ] JSON valid: `jq . < config.json`
- [ ] Paths absolute: No relative paths (./path)
- [ ] Env vars set: `echo $GITHUB_PAT`
- [ ] Env vars exported: Set in shell profile, not just terminal
- [ ] IDE restarted: Full restart, not just reload
- [ ] Ports available: `netstat -ano | findstr :PORT`
- [ ] Firewall open: Check Windows Defender Firewall
- [ ] No placeholder values: No "your_token_here"

### Getting Help

1. **Check MCP Specification:** https://modelcontextprotocol.io/
2. **Official Servers:** https://github.com/modelcontextprotocol/servers
3. **GitHub MCP Server:** https://github.com/github/github-mcp-server
4. **Community:** https://github.com/punkpeye/awesome-mcp-servers
5. **Registries:**
   - PulseMCP: https://www.pulsemcp.com/servers
   - MCP Central: https://mcpcentral.io/servers

### Logs & Diagnostics

**Claude Desktop logs:**

```
%APPDATA%\Claude\logs
```

**VS Code:**

```
Output Panel > Claude Code
```

**Windsurf:**

```
Settings > Logs
```

---

## Quick Reference

### Install All Essential Servers

```bash
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @github/github-mcp-server
npm install -g @modelcontextprotocol/server-fetch
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-time
```

### Environment Setup (PowerShell)

```powershell
# Set all required variables
$env:GITHUB_PAT = "ghp_your_token"
$env:BRAVE_SEARCH_API_KEY = "your_key"
$env:TAVILY_API_KEY = "your_key"
$env:FIRECRAWL_API_KEY = "your_key"

# Make permanent
@(
  "GITHUB_PAT",
  "BRAVE_SEARCH_API_KEY",
  "TAVILY_API_KEY",
  "FIRECRAWL_API_KEY"
) | ForEach-Object {
  [System.Environment]::SetEnvironmentVariable($_, (Get-Variable -Name $_ -ValueOnly), "User")
}
```

### Verify Installation

```bash
npx @modelcontextprotocol/server-filesystem C:/Users/mesha/Desktop
# Should start without errors and wait for connections
```

---

## Summary

| Tool                  | Config Location                               | Status   | MCPs                                                              |
| --------------------- | --------------------------------------------- | -------- | ----------------------------------------------------------------- |
| **Claude Desktop**    | `%APPDATA%\Claude\claude_desktop_config.json` | ✅ Fixed | Filesystem, GitHub, Git, Fetch, Memory, Sequential Thinking, Time |
| **Claude Code (CLI)** | `~/.claude.json`                              | ✅ Ready | Same as above                                                     |
| **Cursor**            | `%APPDATA%\Cursor\User\mcp.json`              | ✅ Fixed | Filesystem, GitHub, Git, Fetch, Sentry                            |
| **VS Code**           | `%APPDATA%\Code\User\mcp.json`                | ✅ Fixed | Filesystem, GitHub, Git, Fetch, Memory                            |
| **Windsurf**          | `%APPDATA%\Windsurf\yolo.json`                | ✅ Fixed | + YOLO Safety Gates                                               |
| **JetBrains IDEs**    | Settings > Tools > MCP Server                 | ✅ Ready | All + IDE Proxy                                                   |

---

## Additional Resources

- **MCP Official:** https://modelcontextprotocol.io/
- **GitHub MCP:** https://github.com/github/github-mcp-server
- **Server Registry:** https://github.com/modelcontextprotocol/registry
- **Community Servers:** https://www.pulsemcp.com/servers
- **Claude Desktop Guide:**
  https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop
- **JetBrains Docs:** https://www.jetbrains.com/help/idea/mcp-server.html

---

**Last Updated:** 2025-12-09 **Version:** 2.0.0 **Scope:** Universal across all
desktop IDEs with Context7 compatibility
