import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface DocsOptions {
  port?: number;
  build?: boolean;
  deploy?: boolean;
  watch?: boolean;
}

export async function docsCommand(options: DocsOptions) {
  console.log(chalk.cyan('\n📚 Nexus Framework Documentation'));
  console.log(chalk.gray('Interactive documentation with live examples...\n'));

  try {
    if (options.build) {
      await buildDocs();
      return;
    }

    if (options.deploy) {
      await deployDocs();
      return;
    }

    await startDocsServer(options.port || 3002);

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Documentation error: ${error.message}`));
    process.exit(1);
  }
}

async function startDocsServer(port: number) {
  const spinner = ora('Starting documentation server...').start();

  try {
    // Create docs directory if it doesn't exist
    if (!existsSync('docs-site')) {
      await createDocsSite();
    }

    // Start the documentation server
    spinner.text = 'Starting local server...';

    const serverScript = `
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('docs-site'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs-site/index.html'));
});

app.listen(${port}, () => {
  console.log('Documentation server running on http://localhost:${port}');
});
`;

    writeFileSync('docs-server.js', serverScript);
    execSync(`node docs-server.js`, { stdio: 'inherit' });

  } catch (error: any) {
    spinner.fail('Failed to start documentation server');
    throw error;
  }
}

async function createDocsSite() {
  const spinner = ora('Creating documentation site...').start();

  try {
    mkdirSync('docs-site', { recursive: true });
    mkdirSync('docs-site/examples', { recursive: true });
    mkdirSync('docs-site/tutorials', { recursive: true });

    // Create main documentation HTML
    const docsHtml = createDocumentationHTML();
    writeFileSync('docs-site/index.html', docsHtml);

    // Create examples
    await createExamples();

    // Create tutorials
    await createTutorials();

    // Create API reference
    await createAPIReference();

    spinner.succeed('Documentation site created');

  } catch (error: any) {
    spinner.fail('Failed to create documentation site');
    throw error;
  }
}

function createDocumentationHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Framework - Build Multi-Platform Applications</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/prismjs@1.29.0/components/prism-core.min.js"></script>
    <script src="https://unpkg.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <link href="https://unpkg.com/prismjs@1.29.0/themes/prism-tomorrow.css" rel="stylesheet" />
    <style>
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .code-block {
            background: #2d2d2d;
            border-radius: 8px;
            padding: 1rem;
            overflow-x: auto;
        }
        .interactive-demo {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold gradient-text">Nexus</h1>
                    <span class="ml-2 text-gray-500">Framework</span>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="#getting-started" class="text-gray-700 hover:text-purple-600">Get Started</a>
                    <a href="#examples" class="text-gray-700 hover:text-purple-600">Examples</a>
                    <a href="#api" class="text-gray-700 hover:text-purple-600">API</a>
                    <a href="#plugins" class="text-gray-700 hover:text-purple-600">Plugins</a>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        Try Now
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-4">
        <div class="max-w-7xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-6">
                Build Multi-Platform Applications
                <span class="gradient-text"> Faster Than Ever</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Nexus Framework provides everything you need to build, deploy, and scale
                SaaS applications, blogs, e-commerce stores, and more. Zero-config setup,
                intelligent tooling, and unified developer experience.
            </p>
            <div class="flex justify-center space-x-4">
                <button onclick="startInteractiveTour()" class="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700">
                    Start Interactive Tour
                </button>
                <button onclick="scrollToSection('examples')" class="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg text-lg hover:bg-purple-50">
                    View Examples
                </button>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16 px-4 bg-white">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Why Choose Nexus?</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Zero-Config Setup</h3>
                    <p class="text-gray-600">Get started in seconds with intelligent defaults and auto-configuration</p>
                </div>
                <div class="text-center">
                    <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Intelligent Tooling</h3>
                    <p class="text-gray-600">Auto-fixing CLI, smart error detection, and predictive deployments</p>
                </div>
                <div class="text-center">
                    <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Extensible Plugins</h3>
                    <p class="text-gray-600">Rich plugin ecosystem with hooks for every aspect of your application</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive Examples -->
    <section id="examples" class="py-16 px-4">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Try It Yourself</h2>

            <!-- Example 1: Create a SaaS App -->
            <div class="interactive-demo">
                <h3 class="text-2xl font-semibold mb-4">Create a SaaS Application</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-semibold mb-2">Command:</h4>
                        <div class="code-block">
                            <pre><code class="language-bash">nexus init my-saas --template saas
cd my-saas
nexus dev</code></pre>
                        </div>
                        <button onclick="runExample('saas')" class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Run This Example
                        </button>
                    </div>
                    <div id="saas-output" class="bg-gray-100 p-4 rounded">
                        <p class="text-gray-600">Output will appear here...</p>
                    </div>
                </div>
            </div>

            <!-- Example 2: Add Authentication -->
            <div class="interactive-demo">
                <h3 class="text-2xl font-semibold mb-4">Add Authentication</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-semibold mb-2">Configuration:</h4>
                        <div class="code-block">
                            <pre><code class="language-typescript">// nexus.config.ts
export default createNexusConfig('saas', {
  features: {
    authentication: { enabled: true },
    database: { enabled: true },
  },
});</code></pre>
                        </div>
                        <button onclick="runExample('auth')" class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Test Authentication
                        </button>
                    </div>
                    <div id="auth-output" class="bg-gray-100 p-4 rounded">
                        <p class="text-gray-600">Live demo will appear here...</p>
                    </div>
                </div>
            </div>

            <!-- Example 3: Deploy with One Command -->
            <div class="interactive-demo">
                <h3 class="text-2xl font-semibold mb-4">Deploy to Production</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-semibold mb-2">Deployment:</h4>
                        <div class="code-block">
                            <pre><code class="language-bash">nexus deploy --env production
✅ Deployed to https://my-app.nexusapp.com</code></pre>
                        </div>
                        <button onclick="runExample('deploy')" class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Simulate Deployment
                        </button>
                    </div>
                    <div id="deploy-output" class="bg-gray-100 p-4 rounded">
                        <p class="text-gray-600">Deployment status will appear here...</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section id="api" class="py-16 px-4 bg-white">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">API Reference</h2>
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-semibold mb-4">CLI Commands</h3>
                    <div class="space-y-4">
                        <div class="border rounded p-4">
                            <code class="text-purple-600">nexus init</code>
                            <p class="text-gray-600 mt-2">Initialize a new Nexus project</p>
                        </div>
                        <div class="border rounded p-4">
                            <code class="text-purple-600">nexus dev</code>
                            <p class="text-gray-600 mt-2">Start development server</p>
                        </div>
                        <div class="border rounded p-4">
                            <code class="text-purple-600">nexus deploy</code>
                            <p class="text-gray-600 mt-2">Deploy to environment</p>
                        </div>
                        <div class="border rounded p-4">
                            <code class="text-purple-600">nexus doctor</code>
                            <p class="text-gray-600 mt-2">Check project health</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-4">Configuration</h3>
                    <div class="code-block">
                        <pre><code class="language-typescript">interface NexusConfig {
  platform: {
    name: string;
    type: 'saas' | 'oss' | 'blog' | 'store';
  };
  features: {
    authentication: FeatureConfig;
    database: FeatureConfig;
    storage: FeatureConfig;
  };
  deployment: DeploymentConfig;
}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Plugin Ecosystem -->
    <section id="plugins" class="py-16 px-4">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Plugin Ecosystem</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-xl font-semibold mb-2">@nexus/plugin-typescript</h3>
                    <p class="text-gray-600 mb-4">Full TypeScript support with type checking and auto-generated types</p>
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded">npm install @nexus/plugin-typescript</code>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-xl font-semibold mb-2">@nexus/plugin-tailwind</h3>
                    <p class="text-gray-600 mb-4">Tailwind CSS integration with optimized builds</p>
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded">npm install @nexus/plugin-tailwind</code>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-xl font-semibold mb-2">@nexus/plugin-pwa</h3>
                    <p class="text-gray-600 mb-4">Progressive Web App features with service workers</p>
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded">npm install @nexus/plugin-pwa</code>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4">
        <div class="max-w-7xl mx-auto text-center">
            <h3 class="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p class="mb-6">Join thousands of developers building with Nexus</p>
            <div class="flex justify-center space-x-4">
                <button onclick="installNexus()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                    Install Nexus CLI
                </button>
                <a href="https://github.com/nexus/framework" class="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900">
                    View on GitHub
                </a>
            </div>
        </div>
    </footer>

    <script>
        // Interactive demo functionality
        function runExample(type) {
            const output = document.getElementById(\`\${type}-output\`);
            output.innerHTML = '<div class="animate-pulse">Running...</div>';

            setTimeout(() => {
                switch(type) {
                    case 'saas':
                        output.innerHTML = \`
                            <div class="space-y-2">
                                <p class="text-green-600">✅ Created project: my-saas</p>
                                <p class="text-green-600">✅ Installed dependencies</p>
                                <p class="text-green-600">✅ Set up configuration</p>
                                <p class="text-blue-600">🚀 Starting dev server...</p>
                                <p class="text-purple-600">→ Ready at http://localhost:3000</p>
                            </div>
                        \`;
                        break;
                    case 'auth':
                        output.innerHTML = \`
                            <div class="space-y-2">
                                <p class="text-green-600">✅ Authentication enabled</p>
                                <p class="text-green-600">✅ Database configured</p>
                                <div class="mt-4 p-4 bg-white rounded">
                                    <p class="font-semibold mb-2">Sign In Form:</p>
                                    <input type="email" placeholder="Email" class="border rounded px-2 py-1 w-full mb-2">
                                    <input type="password" placeholder="Password" class="border rounded px-2 py-1 w-full mb-2">
                                    <button class="bg-purple-600 text-white px-4 py-2 rounded w-full">Sign In</button>
                                </div>
                            </div>
                        \`;
                        break;
                    case 'deploy':
                        output.innerHTML = \`
                            <div class="space-y-2">
                                <p class="text-blue-600">📦 Building application...</p>
                                <p class="text-blue-600">🚀 Deploying to production...</p>
                                <p class="text-green-600">✅ Health checks passed</p>
                                <p class="text-green-600">✅ Deployment complete!</p>
                                <a href="#" class="text-purple-600 underline">→ https://my-app.nexusapp.com</a>
                            </div>
                        \`;
                        break;
                }
            }, 2000);
        }

        function startInteractiveTour() {
            alert('Interactive tour coming soon! For now, try the examples above.');
        }

        function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        }

        function installNexus() {
            const code = 'npm install -g @nexus/cli';
            navigator.clipboard.writeText(code);
            alert('Copied to clipboard: ' + code);
        }
    </script>
</body>
</html>
`;
}

async function createExamples() {
  const examples = [
    {
      name: 'saas-starter',
      description: 'Full-featured SaaS application with auth, billing, and teams',
      files: {
        'nexus.config.ts': `
export default createNexusConfig('saas', {
  platform: {
    name: 'My SaaS App',
    description: 'A SaaS application built with Nexus',
  },
  features: {
    authentication: { enabled: true },
    database: { enabled: true },
    billing: { enabled: true },
    teams: { enabled: true },
  },
});
        `,
        'src/App.tsx': `
import React from 'react';
import { withAuthenticator } from '@nexus/ui-react';

function App() {
  return (
    <div>
      <h1>Welcome to My SaaS App</h1>
      <button>Upgrade Plan</button>
    </div>
  );
}

export default withAuthenticator(App);
        `,
      },
    },
    {
      name: 'blog-starter',
      description: 'Content-focused blog with CMS and SEO',
      files: {
        'nexus.config.ts': `
export default createNexusConfig('blog', {
  platform: {
    name: 'My Blog',
    description: 'A blog built with Nexus',
  },
  features: {
    database: { enabled: true },
    search: { enabled: true },
    analytics: { enabled: true },
  },
});
        `,
      },
    },
  ];

  for (const example of examples) {
    const exampleDir = `docs-site/examples/${example.name}`;
    mkdirSync(exampleDir, { recursive: true });

    for (const [filename, content] of Object.entries(example.files)) {
      writeFileSync(join(exampleDir, filename), content);
    }
  }
}

async function createTutorials() {
  const tutorials = [
    {
      title: 'Getting Started',
      content: `
# Getting Started with Nexus

## Installation

\`\`\`bash
npm install -g @nexus/cli
\`\`\`

## Create Your First Project

\`\`\`bash
nexus init my-app
cd my-app
nexus dev
\`\`\`

## Next Steps

- Configure your nexus.config.ts
- Add features as needed
- Deploy with one command
      `,
    },
    {
      title: 'Adding Authentication',
      content: `
# Adding Authentication to Your App

## 1. Enable Authentication in Config

\`\`\`typescript
// nexus.config.ts
export default createNexusConfig('saas', {
  features: {
    authentication: { enabled: true },
  },
});
\`\`\`

## 2. Protect Your Components

\`\`\`tsx
import { withAuthenticator } from '@nexus/ui-react';

export default withAuthenticator(MyComponent);
\`\`\`

## 3. Access User Data

\`\`\`tsx
import { useAuth } from '@nexus/ui-react';

function Profile() {
  const { user } = useAuth();
  return <div>Welcome, {user.email}</div>;
}
\`\`\`
      `,
    },
  ];

  for (const tutorial of tutorials) {
    const filename = `docs-site/tutorials/${tutorial.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    writeFileSync(filename, tutorial.content);
  }
}

async function createAPIReference() {
  const apiReference = `
# Nexus API Reference

## Core Concepts

### NexusConfig

The main configuration object for your Nexus application.

\`\`\`typescript
interface NexusConfig {
  platform: PlatformConfig;
  environments: Record<string, EnvironmentConfig>;
  features: FeatureConfig;
  deployment?: DeploymentConfig;
  development?: DevelopmentConfig;
}
\`\`\`

### CLI Commands

#### nexus init

Initialize a new Nexus project.

\`\`\`bash
nexus init [name] [options]
\`\`\`

Options:
- \`--template\`: Project template (saas, blog, store, etc.)
- \`--skip-install\`: Skip npm install
- \`--git\`: Initialize git repository

#### nexus dev

Start the development server.

\`\`\`bash
nexus dev [options]
\`\`\`

Options:
- \`--port\`: Port to run on (default: 3000)
- \`--sandbox\`: Enable cloud sandbox
- \`--debug\`: Enable debug mode

#### nexus deploy

Deploy to an environment.

\`\`\`bash
nexus deploy [options]
\`\`\`

Options:
- \`--env\`: Target environment
- \`--force\`: Force deployment
- \`--rollback\`: Rollback to previous version

## Plugin API

### Creating a Plugin

\`\`\`typescript
import { definePlugin, NexusPlugin } from '@nexus/plugin-system';

export default definePlugin({
  name: 'my-plugin',
  version: '1.0.0',

  onInit: async (context) => {
    // Initialize plugin
  },

  onBuildStart: async (context) => {
    // Run before build
  },
});
\`\`\`

### Available Hooks

- \`onInit\`: Plugin initialization
- \`onConfig\`: Configuration processing
- \`onBuildStart\`: Before build starts
- \`onBuildEnd\`: After build completes
- \`onDeployStart\`: Before deployment
- \`onDeployEnd\`: After deployment
- \`onFileAdd\`: When a file is added
- \`onFileChange\`: When a file changes
- \`onRouteAdd\`: When a route is added
  `;

  writeFileSync('docs-site/api-reference.md', apiReference);
}

async function buildDocs() {
  const spinner = ora('Building documentation...').start();

  try {
    // Build static version of docs
    execSync('npm run build:docs', { stdio: 'pipe' });
    spinner.succeed('Documentation built');
  } catch (error: any) {
    spinner.fail('Build failed');
    throw error;
  }
}

async function deployDocs() {
  const spinner = ora('Deploying documentation...').start();

  try {
    // Deploy to documentation hosting
    execSync('nexus deploy --env docs', { stdio: 'pipe' });
    spinner.succeed('Documentation deployed');
  } catch (error: any) {
    spinner.fail('Deployment failed');
    throw error;
  }
}
