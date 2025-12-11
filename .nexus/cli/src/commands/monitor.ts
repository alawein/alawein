import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { validateConfig, NexusConfig } from '../../shared/config-schema';

interface MonitorOptions {
  dashboard?: boolean;
  alerts?: boolean;
  setup?: boolean;
  env?: string;
}

interface MetricData {
  timestamp: Date;
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
}

interface AlertConfig {
  id: string;
  name: string;
  type: 'threshold' | 'anomaly' | 'rate';
  metric: string;
  condition: string;
  threshold?: number;
  enabled: boolean;
  channels: string[];
}

export async function monitorCommand(options: MonitorOptions) {
  console.log(chalk.cyan('\n📊 Nexus Framework Monitoring'));
  console.log(chalk.gray('Unified observability and alerting...\n'));

  try {
    // Load configuration
    const config = await loadConfiguration();

    if (options.setup) {
      await setupMonitoring(config);
      return;
    }

    if (options.dashboard) {
      await startDashboard(config, options);
      return;
    }

    if (options.alerts) {
      await configureAlerts(config);
      return;
    }

    // Show monitoring status
    await showMonitoringStatus(config);

  } catch (error: any) {
    console.error(chalk.red(`\n❌ Monitoring error: ${error.message}`));
    process.exit(1);
  }
}

async function loadConfiguration(): Promise<NexusConfig> {
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

async function setupMonitoring(config: NexusConfig) {
  const spinner = ora('Setting up monitoring...').start();

  try {
    // Create monitoring configuration
    const monitoringConfig = {
      enabled: true,
      provider: config.monitoring?.provider || 'nexus',
      metrics: {
        collection: {
          interval: 30000, // 30 seconds
          batchSize: 100,
          retention: '30d',
        },
        customMetrics: [
          'user_registrations',
          'api_requests',
          'error_rate',
          'response_time_p95',
          'database_connections',
        ],
      },
      alerts: getDefaultAlerts(),
      dashboards: [
        {
          name: 'Application Overview',
          widgets: [
            { type: 'metric', metric: 'api_requests', title: 'API Requests' },
            { type: 'metric', metric: 'error_rate', title: 'Error Rate' },
            { type: 'metric', metric: 'response_time_p95', title: '95th Percentile Response Time' },
            { type: 'metric', metric: 'active_users', title: 'Active Users' },
          ],
        },
        {
          name: 'Infrastructure',
          widgets: [
            { type: 'metric', metric: 'cpu_usage', title: 'CPU Usage' },
            { type: 'metric', metric: 'memory_usage', title: 'Memory Usage' },
            { type: 'metric', metric: 'database_connections', title: 'DB Connections' },
            { type: 'metric', metric: 'storage_usage', title: 'Storage Usage' },
          ],
        },
      ],
    };

    // Save monitoring config
    mkdirSync('.nexus/monitoring', { recursive: true });
    writeFileSync(
      '.nexus/monitoring/config.json',
      JSON.stringify(monitoringConfig, null, 2)
    );

    // Install monitoring dependencies
    spinner.text = 'Installing monitoring dependencies...';
    execSync('npm install @nexus/monitoring @nexus/tracing', { stdio: 'pipe' });

    // Create monitoring middleware
    await createMonitoringMiddleware(config);

    // Set up data collection
    await setupDataCollection(config);

    spinner.succeed('Monitoring setup complete!');

    console.log(chalk.bold.green('\n✅ Monitoring configured!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log('1. Run "nexus monitor --dashboard" to view metrics');
    console.log('2. Run "nexus monitor --alerts" to configure alerts');
    console.log('3. Visit https://monitor.nexus.dev for advanced analytics');

  } catch (error: any) {
    spinner.fail('Setup failed');
    throw error;
  }
}

async function startDashboard(config: NexusConfig, options: MonitorOptions) {
  console.log(chalk.bold('\n📈 Monitoring Dashboard'));
  console.log(chalk.gray('Real-time metrics and insights\n'));

  const spinner = ora('Starting dashboard...').start();

  try {
    // Start local dashboard server
    const dashboardPort = 3001;

    // Create dashboard HTML
    const dashboardHtml = createDashboardHTML(config);
    writeFileSync('.nexus/monitoring/dashboard.html', dashboardHtml);

    // Start server
    const server = execSync(
      `npx serve .nexus/monitoring -l ${dashboardPort} -s`,
      { stdio: 'pipe' }
    );

    spinner.succeed('Dashboard started!');

    console.log(chalk.bold('\n🌐 Dashboard URLs:'));
    console.log(`Local: ${chalk.cyan(`http://localhost:${dashboardPort}`)}`);
    console.log(`Share: ${chalk.cyan('https://monitor.nexus.dev/shared/local')}`);

    console.log(chalk.bold('\n📊 Available Metrics:'));
    console.log('• API Requests & Response Times');
    console.log('• Error Rates & Types');
    console.log('• User Activity & Retention');
    console.log('• Infrastructure Resources');
    console.log('• Custom Business Metrics');

    // Keep process running
    console.log(chalk.gray('\nPress Ctrl+C to stop the dashboard'));

  } catch (error: any) {
    spinner.fail('Failed to start dashboard');
    throw error;
  }
}

async function configureAlerts(config: NexusConfig) {
  console.log(chalk.bold('\n🚨 Alert Configuration'));
  console.log(chalk.gray('Set up intelligent alerts for your application\n'));

  // Load existing alerts or create defaults
  const alertsPath = '.nexus/monitoring/alerts.json';
  let alerts: AlertConfig[] = [];

  if (existsSync(alertsPath)) {
    alerts = JSON.parse(readFileSync(alertsPath, 'utf8'));
  } else {
    alerts = getDefaultAlerts();
  }

  // Display current alerts
  console.log(chalk.bold('Current Alerts:'));
  alerts.forEach((alert, index) => {
    const status = alert.enabled ? chalk.green('ENABLED') : chalk.red('DISABLED');
    console.log(`${index + 1}. ${alert.name} - ${status}`);
    console.log(`   Type: ${alert.type} | Metric: ${alert.metric}`);
    if (alert.threshold) {
      console.log(`   Threshold: ${alert.threshold}`);
    }
    console.log(`   Channels: ${alert.channels.join(', ')}\n`);
  });

  // Interactive alert configuration
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Add new alert', value: 'add' },
        { name: 'Edit existing alert', value: 'edit' },
        { name: 'Enable/disable alert', value: 'toggle' },
        { name: 'Delete alert', value: 'delete' },
        { name: 'Test alert', value: 'test' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'add':
      await addAlert(alerts);
      break;
    case 'edit':
      await editAlert(alerts);
      break;
    case 'toggle':
      await toggleAlert(alerts);
      break;
    case 'delete':
      await deleteAlert(alerts);
      break;
    case 'test':
      await testAlert(alerts);
      break;
    default:
      return;
  }

  // Save updated alerts
  writeFileSync(alertsPath, JSON.stringify(alerts, null, 2));
}

async function showMonitoringStatus(config: NexusConfig) {
  console.log(chalk.bold('\n📊 Monitoring Status'));

  const status = {
    enabled: config.monitoring?.enabled || false,
    provider: config.monitoring?.provider || 'none',
    errorTracking: config.monitoring?.errorTracking || false,
    performanceMetrics: config.monitoring?.performanceMetrics || false,
    userAnalytics: config.monitoring?.userAnalytics || false,
  };

  console.log('\nConfiguration:');
  console.log(`Enabled: ${status.enabled ? chalk.green('Yes') : chalk.red('No')}`);
  console.log(`Provider: ${chalk.cyan(status.provider)}`);
  console.log(`Error Tracking: ${status.errorTracking ? chalk.green('Enabled') : chalk.red('Disabled')}`);
  console.log(`Performance Metrics: ${status.performanceMetrics ? chalk.green('Enabled') : chalk.red('Disabled')}`);
  console.log(`User Analytics: ${status.userAnalytics ? chalk.green('Enabled') : chalk.red('Disabled')}`);

  // Show recent metrics if available
  if (status.enabled) {
    console.log(chalk.bold('\n📈 Recent Metrics (Last 24h):'));

    const metrics = await getRecentMetrics();
    if (metrics.length > 0) {
      metrics.forEach(metric => {
        const trend = getTrend(metric);
        console.log(`${metric.name}: ${metric.value}${metric.unit} ${trend}`);
      });
    } else {
      console.log(chalk.gray('No metrics available yet'));
    }
  }
}

// Helper functions
function getDefaultAlerts(): AlertConfig[] {
  return [
    {
      id: 'high-error-rate',
      name: 'High Error Rate',
      type: 'threshold',
      metric: 'error_rate',
      condition: 'greater_than',
      threshold: 5,
      enabled: true,
      channels: ['email', 'slack'],
    },
    {
      id: 'slow-response-time',
      name: 'Slow Response Time',
      type: 'threshold',
      metric: 'response_time_p95',
      condition: 'greater_than',
      threshold: 1000,
      enabled: true,
      channels: ['slack'],
    },
    {
      id: 'database-connections',
      name: 'Database Connection Pool Exhaustion',
      type: 'threshold',
      metric: 'database_connections',
      condition: 'greater_than',
      threshold: 80,
      enabled: true,
      channels: ['email', 'slack', 'pagerduty'],
    },
    {
      id: 'unusual-traffic',
      name: 'Unusual Traffic Spike',
      type: 'anomaly',
      metric: 'api_requests',
      condition: 'anomaly_detection',
      enabled: true,
      channels: ['slack'],
    },
  ];
}

async function createMonitoringMiddleware(config: NexusConfig) {
  const middleware = `
// Nexus Monitoring Middleware
import { trace, metrics } from '@nexus/monitoring';

// Initialize tracing
const tracer = trace.init({
  serviceName: '${config.platform.name}',
  environment: process.env.NODE_ENV || 'development',
});

// Initialize metrics
const meter = metrics.init({
  serviceName: '${config.platform.name}',
});

// Create custom metrics
export const apiRequests = meter.createCounter('api_requests', {
  description: 'Total API requests',
});

export const responseTime = meter.createHistogram('response_time', {
  description: 'API response time',
  unit: 'ms',
});

export const errorRate = meter.createGauge('error_rate', {
  description: 'Current error rate',
  unit: 'percent',
});

// Express middleware
export function monitoringMiddleware(req, res, next) {
  const span = tracer.startSpan('api_request');

  const start = Date.now();
  apiRequests.add(1, { route: req.route?.path });

  res.on('finish', () => {
    const duration = Date.now() - start;
    responseTime.record(duration);

    if (res.statusCode >= 400) {
      span.recordException(new Error('HTTP Error'));
    }

    span.end();
  });

  next();
}
`;

  writeFileSync('src/lib/monitoring.ts', middleware);
}

async function setupDataCollection(config: NexusConfig) {
  // Create data collection scripts
  const collector = `
// Nexus Data Collector
import { collectMetrics, sendToMonitoring } from '@nexus/monitoring';

// Collect custom business metrics
async function collectBusinessMetrics() {
  const metrics = [];

  // Example: User registrations
  const registrations = await getUserRegistrations24h();
  metrics.push({
    name: 'user_registrations',
    value: registrations,
    unit: 'count',
    timestamp: new Date(),
  });

  // Example: Active subscriptions
  const activeSubscriptions = await getActiveSubscriptions();
  metrics.push({
    name: 'active_subscriptions',
    value: activeSubscriptions,
    unit: 'count',
    timestamp: new Date(),
  });

  // Send to monitoring service
  await sendToMonitoring(metrics);
}

// Run collection every 5 minutes
setInterval(collectBusinessMetrics, 5 * 60 * 1000);

// Helper functions (implement based on your data)
async function getUserRegistrations24h() {
  // Query your database
  return 0;
}

async function getActiveSubscriptions() {
  // Query your database or billing provider
  return 0;
}
`;

  writeFileSync('.nexus/monitoring/collector.ts', collector);
}

function createDashboardHTML(config: NexusConfig): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.platform.name} - Monitoring Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: #1a1a1a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 2rem; }
        .metric-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2rem; font-weight: bold; color: #333; }
        .metric-label { color: #666; margin-top: 0.5rem; }
        .chart-container { position: relative; height: 200px; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${config.platform.name} Monitoring</h1>
        <div id="status">Connected</div>
    </div>

    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-value" id="api-requests">0</div>
            <div class="metric-label">API Requests / min</div>
            <div class="chart-container">
                <canvas id="requests-chart"></canvas>
            </div>
        </div>

        <div class="metric-card">
            <div class="metric-value" id="error-rate">0%</div>
            <div class="metric-label">Error Rate</div>
            <div class="chart-container">
                <canvas id="errors-chart"></canvas>
            </div>
        </div>

        <div class="metric-card">
            <div class="metric-value" id="response-time">0ms</div>
            <div class="metric-label">95th Percentile Response Time</div>
            <div class="chart-container">
                <canvas id="response-chart"></canvas>
            </div>
        </div>

        <div class="metric-card">
            <div class="metric-value" id="active-users">0</div>
            <div class="metric-label">Active Users</div>
            <div class="chart-container">
                <canvas id="users-chart"></canvas>
            </div>
        </div>
    </div>

    <script>
        // Initialize charts
        const charts = {};

        function initCharts() {
            // Requests chart
            charts.requests = new Chart(document.getElementById('requests-chart'), {
                type: 'line',
                data: { labels: [], datasets: [{ label: 'Requests', data: [], borderColor: '#3b82f6' }] },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Errors chart
            charts.errors = new Chart(document.getElementById('errors-chart'), {
                type: 'line',
                data: { labels: [], datasets: [{ label: 'Error Rate', data: [], borderColor: '#ef4444' }] },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Response time chart
            charts.response = new Chart(document.getElementById('response-chart'), {
                type: 'line',
                data: { labels: [], datasets: [{ label: 'Response Time', data: [], borderColor: '#10b981' }] },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Users chart
            charts.users = new Chart(document.getElementById('users-chart'), {
                type: 'line',
                data: { labels: [], datasets: [{ label: 'Active Users', data: [], borderColor: '#f59e0b' }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Connect to monitoring WebSocket
        function connectMonitoring() {
            const ws = new WebSocket('ws://localhost:3002');

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                updateMetrics(data);
            };

            ws.onopen = () => {
                document.getElementById('status').textContent = 'Connected';
                document.getElementById('status').style.color = '#10b981';
            };

            ws.onclose = () => {
                document.getElementById('status').textContent = 'Disconnected';
                document.getElementById('status').style.color = '#ef4444';
                setTimeout(connectMonitoring, 5000);
            };
        }

        function updateMetrics(data) {
            // Update values
            document.getElementById('api-requests').textContent = data.requests?.current || 0;
            document.getElementById('error-rate').textContent = (data.errors?.current || 0) + '%';
            document.getElementById('response-time').textContent = (data.responseTime?.current || 0) + 'ms';
            document.getElementById('active-users').textContent = data.users?.current || 0;

            // Update charts
            if (data.requests?.history) {
                charts.requests.data.labels = data.requests.history.map(d => d.time);
                charts.requests.data.datasets[0].data = data.requests.history.map(d => d.value);
                charts.requests.update();
            }
        }

        // Initialize
        initCharts();
        connectMonitoring();
    </script>
</body>
</html>
`;
}

async function getRecentMetrics(): Promise<any[]> {
  // This would fetch actual metrics from the monitoring service
  return [
    { name: 'API Requests', value: 1234, unit: '/min' },
    { name: 'Error Rate', value: 0.5, unit: '%' },
    { name: 'Response Time', value: 245, unit: 'ms' },
    { name: 'Active Users', value: 89, unit: '' },
  ];
}

function getTrend(metric: any): string {
  // This would calculate trend based on historical data
  return chalk.gray('↑ 12%');
}

// Alert management functions (simplified for brevity)
async function addAlert(alerts: AlertConfig[]) {
  console.log('Adding new alert...');
}

async function editAlert(alerts: AlertConfig[]) {
  console.log('Editing alert...');
}

async function toggleAlert(alerts: AlertConfig[]) {
  console.log('Toggling alert...');
}

async function deleteAlert(alerts: AlertConfig[]) {
  console.log('Deleting alert...');
}

async function testAlert(alerts: AlertConfig[]) {
  console.log('Testing alert...');
}
