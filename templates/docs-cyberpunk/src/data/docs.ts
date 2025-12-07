export interface DocSection {
  title: string;
  items: DocItem[];
}

export interface DocItem {
  title: string;
  slug: string;
  description?: string;
}

export const docsSidebar: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction', description: 'Welcome to our documentation' },
      { title: 'Installation', slug: 'installation', description: 'How to install and set up' },
      { title: 'Quick Start', slug: 'quick-start', description: 'Get up and running in minutes' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Architecture', slug: 'architecture', description: 'Understanding the system design' },
      { title: 'Configuration', slug: 'configuration', description: 'Customize your setup' },
      { title: 'Authentication', slug: 'authentication', description: 'Secure your application' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'REST API', slug: 'rest-api', description: 'RESTful API endpoints' },
      { title: 'GraphQL', slug: 'graphql', description: 'GraphQL schema and queries' },
      { title: 'Webhooks', slug: 'webhooks', description: 'Event-driven integrations' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Deployment', slug: 'deployment', description: 'Deploy to production' },
      { title: 'Testing', slug: 'testing', description: 'Write and run tests' },
      { title: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and solutions' },
    ],
  },
];

export const docsContent: Record<string, { title: string; content: string }> = {
  introduction: {
    title: 'Introduction',
    content: `
# Introduction

Welcome to our comprehensive documentation. This guide will help you understand and use our platform effectively.

## What is this?

Our platform provides a powerful set of tools for building modern applications. Whether you're a beginner or an experienced developer, you'll find everything you need here.

## Key Features

- **Easy to Use**: Get started in minutes with our intuitive API
- **Scalable**: Built to handle millions of requests
- **Secure**: Enterprise-grade security out of the box
- **Extensible**: Customize and extend to fit your needs

## Next Steps

Ready to get started? Head over to the [Installation](/docs/installation) guide to set up your environment.
    `,
  },
  installation: {
    title: 'Installation',
    content: `
# Installation

Get up and running with our platform in just a few steps.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or higher
- npm or pnpm package manager
- A code editor (VS Code recommended)

## Quick Install

\`\`\`bash
npm install @example/sdk
\`\`\`

Or with pnpm:

\`\`\`bash
pnpm add @example/sdk
\`\`\`

## Configuration

Create a configuration file in your project root:

\`\`\`javascript
// config.js
export default {
  apiKey: process.env.API_KEY,
  environment: 'production',
};
\`\`\`

## Verify Installation

Run the following command to verify everything is set up correctly:

\`\`\`bash
npx @example/sdk verify
\`\`\`

You should see a success message if everything is configured properly.
    `,
  },
  'quick-start': {
    title: 'Quick Start',
    content: `
# Quick Start

Get your first project running in under 5 minutes.

## Step 1: Initialize

Create a new project:

\`\`\`bash
npx create-example-app my-app
cd my-app
\`\`\`

## Step 2: Configure

Add your API key to the environment:

\`\`\`bash
echo "API_KEY=your-api-key" > .env
\`\`\`

## Step 3: Run

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Your app is now running at \`http://localhost:3000\`!

## What's Next?

- Explore the [Core Concepts](/docs/architecture)
- Check out the [API Reference](/docs/rest-api)
- Read our [Deployment Guide](/docs/deployment)
    `,
  },
};

