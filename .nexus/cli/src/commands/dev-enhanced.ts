import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, watchFile, unwatchFile } from 'fs';
import { join, resolve } from 'path';
import { WebSocket, WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import express from 'express';
import { validateConfig } from '../../shared/config-schema';

interface DevOptions {
  port?: number;
  sandbox?: boolean;
  mock?: boolean;
  debug?: boolean;
  inspect?: boolean;
}

export async function devCommand(options: DevOptions) {
  console.log(chalk.cyan('\n🚀 Nexus Development Server'));
  console.log(chalk.gray('Starting with hot reload and intelligent error detection...\n'));

  const port = options.port || 3000;
  const spinner = ora('Initializing development environment...').start();

  try {
    // Load and validate configuration
    const config = await loadConfiguration();

    // Start the development server
    spinner.text = 'Starting development server...';
    const devServer = await startDevServer(port, config, options);

    // Start hot reload watcher
    spinner.text = 'Setting up hot reload...';
    const hotReload = setupHotReload(config, options);

    // Start error monitoring
    spinner.text = 'Initializing intelligent error detection...';
    const errorMonitor = setupErrorMonitoring(config, options);

    // Start sandbox if enabled
    if (options.sandbox) {
      spinner.text = 'Starting Nexus sandbox...';
      await startSandbox(config);
    }

    spinner.succeed('Development server ready!');

    // Display server information
    displayServerInfo(port, config, options);

    // Handle graceful shutdown
    setupGracefulShutdown(devServer, hotReload, errorMonitor);

  } catch (error: any) {
    spinner.fail('Failed to start development server');
    console.error(chalk.red(error.message));

    if (options.debug) {
      console.error(chalk.gray(error.stack));
    }

    process.exit(1);
  }
}

async function loadConfiguration() {
  const configPath = '.nexus/nexus.config.ts';

  if (!existsSync(configPath)) {
    throw new Error('nexus.config.ts not found. Run "nexus init" to create a new project.');
  }

  try {
    const config = require(configPath);
    return validateConfig(config.default || config);
  } catch (error: any) {
    throw new Error(`Invalid configuration: ${error.message}`);
  }
}

async function startDevServer(port: number, config: any, options: DevOptions) {
  const app = express();

  // Middleware for error handling
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // API routes for development
  setupDevRoutes(app, config, options);

  // Serve static files
  app.use(express.static('dist'));

  // Fallback to index.html for SPA
  app.get('*', (req, res) => {
    res.sendFile(resolve('dist/index.html'));
  });

  // Start WebSocket server for hot reload
  const wss = new WebSocketServer({ port: port + 1 });
  setupWebSocketServer(wss);

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve({ server, wss });
    });
  });
}

function setupDevRoutes(app: express.Application, config: any, options: DevOptions) {
  // Configuration endpoint
  app.get('/api/nexus-config', (req, res) => {
    res.json({
      platform: config.platform,
      features: config.features,
      environment: 'development',
    });
  });

  // Mock data endpoints
  if (options.mock) {
    setupMockDataRoutes(app, config);
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Error simulation endpoint (for testing)
  if (options.debug) {
    app.post('/api/simulate-error', (req, res) => {
      const { type, message } = req.body;
      throw new Error(`Simulated ${type}: ${message}`);
    });
  }
}

function setupMockDataRoutes(app: express.Application, config: any) {
  // Mock authentication
  app.post('/api/auth/login', (req, res) => {
    res.json({
      user: { id: 'mock-user', email: 'dev@example.com' },
      token: 'mock-token',
    });
  });

  // Mock API responses based on features
  if (config.features.database?.enabled) {
    app.get('/api/data/*', (req, res) => {
      res.json({ data: [], total: 0, page: 1 });
    });
  }

  if (config.features.billing?.enabled) {
    app.get('/api/billing/subscription', (req, res) => {
      res.json({
        status: 'active',
        tier: 'pro',
        renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  }
}

function setupWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', (ws) => {
    console.log(chalk.gray('Client connected to hot reload'));

    ws.on('close', () => {
      console.log(chalk.gray('Client disconnected from hot reload'));
    });
  });

  // Broadcast function for hot reload
  (wss as any).broadcast = (data: any) => {
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
}

function setupHotReload(config: any, options: DevOptions) {
  const watcher = chokidar.watch(['src/**/*', '.nexus/**/*'], {
    ignored: /node_modules|\.git/,
    persistent: true,
  });

  watcher.on('change', (path) => {
    console.log(chalk.blue(`File changed: ${path}`));

    // Trigger appropriate reload based on file type
    if (path.endsWith('.css')) {
      broadcastHotReload({ type: 'css', path });
    } else if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      // Trigger rebuild and full reload
      triggerRebuild(path);
    } else if (path.startsWith('.nexus/')) {
      // Configuration changed - restart server
      console.log(chalk.yellow('Configuration changed. Restarting server...'));
      restartServer();
    }
  });

  return watcher;
}

function triggerRebuild(filePath: string) {
  console.log(chalk.blue('Rebuilding...'));

  try {
    execSync('npm run build', { stdio: 'pipe' });
    broadcastHotReload({ type: 'full', path: filePath });
    console.log(chalk.green('Build complete'));
  } catch (error: any) {
    console.error(chalk.red('Build failed:'));
    console.error(chalk.gray(error.stdout?.toString() || error.message));

    // Send error to client
    broadcastHotReload({
      type: 'error',
      message: error.message,
      details: error.stdout?.toString(),
    });
  }
}

function broadcastHotReload(data: any) {
  // This would be connected to the WebSocket server
  // Implementation depends on how we store the server instance
}

function setupErrorMonitoring(config: any, options: DevOptions) {
  const errorPatterns = {
    // Common React errors
    'Cannot read property': 'Check if the object exists before accessing its properties',
    'is not a function': 'Verify the function is properly imported and bound',
    'Maximum update depth exceeded': 'Check for infinite loops in useEffect or render',

    // Common TypeScript errors
    'Property does not exist': 'Add the property to the type definition',
    'Cannot find module': 'Install the missing package or check import path',

    // Common Nexus errors
    'Authentication failed': 'Check your Nexus configuration and credentials',
    'Network error': 'Verify your internet connection and API endpoints',
  };

  // Monitor console errors in development
  process.on('uncaughtException', (error) => {
    const suggestion = findErrorSuggestion(error.message, errorPatterns);
    console.error(chalk.red('\n🚨 Uncaught Error:'));
    console.error(chalk.gray(error.message));

    if (suggestion) {
      console.error(chalk.yellow('\n💡 Suggestion:'));
      console.error(chalk.gray(suggestion));
    }

    if (options.debug) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
  });

  return { errorPatterns };
}

function findErrorSuggestion(message: string, patterns: Record<string, string>): string | null {
  for (const [pattern, suggestion] of Object.entries(patterns)) {
    if (message.includes(pattern)) {
      return suggestion;
    }
  }
  return null;
}

async function startSandbox(config: any) {
  console.log(chalk.blue('Starting Nexus sandbox backend...'));

  try {
    // This would start the actual Nexus sandbox
    execSync('nexus sandbox start', { stdio: 'pipe' });
    console.log(chalk.green('Sandbox started successfully'));
  } catch (error: any) {
    throw new Error(`Failed to start sandbox: ${error.message}`);
  }
}

function displayServerInfo(port: number, config: any, options: DevOptions) {
  console.log(chalk.bold('\n📡 Server Information:'));
  console.log(`🌐 Local:    ${chalk.cyan(`http://localhost:${port}`)}`);
  console.log(`🔌 Hot Reload: ${chalk.cyan(`ws://localhost:${port + 1}`)}`);

  if (options.sandbox) {
    console.log(`🏖️  Sandbox:  ${chalk.cyan('http://localhost:20002')}`);
  }

  console.log(chalk.bold('\n🔧 Features:'));
  console.log(`${options.mock ? '✅' : '❌'} Mock Data`);
  console.log(`${options.debug ? '✅' : '❌'} Debug Mode`);
  console.log(`${options.inspect ? '✅' : '❌'} Inspector`);

  console.log(chalk.bold('\n⚡ Shortcuts:'));
  console.log(`${chalk.cyan('r')} - Restart server`);
  console.log(`${chalk.cyan('c')} - Clear console`);
  console.log(`${chalk.cyan('d')} - Toggle debug mode`);
  console.log(`${chalk.cyan('q')} - Quit`);

  console.log(chalk.gray('\nPress Ctrl+C to stop the server'));
}

function setupGracefulShutdown(server: any, watcher: any, errorMonitor: any) {
  const shutdown = () => {
    console.log(chalk.yellow('\n\nShutting down gracefully...'));

    if (server.server) {
      server.server.close();
    }

    if (server.wss) {
      server.wss.close();
    }

    if (watcher) {
      watcher.close();
    }

    console.log(chalk.green('Server stopped'));
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Handle stdin for shortcuts
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (key) => {
    switch (key) {
      case 'r':
        console.log(chalk.blue('\nRestarting server...'));
        restartServer();
        break;
      case 'c':
        console.clear();
        displayServerInfo(3000, {}, {});
        break;
      case 'd':
        console.log(chalk.yellow('\nDebug mode toggled'));
        break;
      case 'q':
        shutdown();
        break;
    }
  });
}

function restartServer() {
  console.log(chalk.blue('Restarting...'));
  // Implementation would restart the server
  // For now, just log the action
}
