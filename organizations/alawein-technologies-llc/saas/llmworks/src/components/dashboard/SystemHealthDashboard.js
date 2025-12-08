"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemHealthDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var chart_1 = require("@/components/ui/chart");
var recharts_1 = require("recharts");
var analytics_1 = require("@/lib/analytics");
var mockSystemMetrics = [
    {
        timestamp: '10:00',
        cpu: 45,
        memory: 67,
        disk: 23,
        network: 89,
        responseTime: 120,
        activeConnections: 156,
        errorRate: 0.2,
    },
    {
        timestamp: '10:05',
        cpu: 52,
        memory: 71,
        disk: 24,
        network: 92,
        responseTime: 135,
        activeConnections: 178,
        errorRate: 0.1,
    },
    {
        timestamp: '10:10',
        cpu: 38,
        memory: 64,
        disk: 23,
        network: 76,
        responseTime: 98,
        activeConnections: 134,
        errorRate: 0.3,
    },
    {
        timestamp: '10:15',
        cpu: 61,
        memory: 78,
        disk: 25,
        network: 85,
        responseTime: 156,
        activeConnections: 203,
        errorRate: 0.4,
    },
    {
        timestamp: '10:20',
        cpu: 43,
        memory: 69,
        disk: 24,
        network: 91,
        responseTime: 112,
        activeConnections: 167,
        errorRate: 0.1,
    },
    {
        timestamp: '10:25',
        cpu: 47,
        memory: 72,
        disk: 23,
        network: 88,
        responseTime: 128,
        activeConnections: 189,
        errorRate: 0.2,
    },
];
var mockServices = [
    {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'healthy',
        uptime: 99.9,
        lastChecked: '1 min ago',
        responseTime: 45,
        errorRate: 0.1,
        version: '2.1.4',
        dependencies: ['auth-service', 'evaluation-engine'],
    },
    {
        id: 'evaluation-engine',
        name: 'Evaluation Engine',
        status: 'healthy',
        uptime: 99.7,
        lastChecked: '2 min ago',
        responseTime: 230,
        errorRate: 0.3,
        version: '1.8.2',
        dependencies: ['model-apis', 'result-store'],
    },
    {
        id: 'auth-service',
        name: 'Authentication Service',
        status: 'healthy',
        uptime: 99.95,
        lastChecked: '30 sec ago',
        responseTime: 23,
        errorRate: 0.05,
        version: '3.2.1',
        dependencies: ['user-db', 'session-store'],
    },
    {
        id: 'model-apis',
        name: 'Model API Aggregator',
        status: 'degraded',
        uptime: 98.2,
        lastChecked: '3 min ago',
        responseTime: 1200,
        errorRate: 2.1,
        version: '1.5.7',
        dependencies: ['openai-api', 'anthropic-api', 'google-api'],
    },
    {
        id: 'result-store',
        name: 'Result Storage',
        status: 'healthy',
        uptime: 99.8,
        lastChecked: '1 min ago',
        responseTime: 67,
        errorRate: 0.2,
        version: '2.3.0',
        dependencies: ['database', 'cache-layer'],
    },
    {
        id: 'notification-service',
        name: 'Notification Service',
        status: 'maintenance',
        uptime: 95.1,
        lastChecked: '10 min ago',
        responseTime: 0,
        errorRate: 0,
        version: '1.4.3',
        dependencies: ['email-provider', 'webhook-dispatcher'],
    },
];
var mockAlerts = [
    {
        id: 'alert-001',
        type: 'warning',
        title: 'High Response Time',
        message: 'Model API Aggregator response time exceeded threshold (>1000ms)',
        service: 'model-apis',
        timestamp: '2 min ago',
        acknowledged: false,
        resolved: false,
    },
    {
        id: 'alert-002',
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'Notification Service maintenance window started',
        service: 'notification-service',
        timestamp: '10 min ago',
        acknowledged: true,
        resolved: false,
    },
    {
        id: 'alert-003',
        type: 'error',
        title: 'API Rate Limit',
        message: 'OpenAI API rate limit reached, fallback to Claude activated',
        service: 'evaluation-engine',
        timestamp: '15 min ago',
        acknowledged: true,
        resolved: true,
    },
    {
        id: 'alert-004',
        type: 'warning',
        title: 'Memory Usage High',
        message: 'System memory usage at 78%, consider scaling',
        service: 'api-gateway',
        timestamp: '20 min ago',
        acknowledged: false,
        resolved: false,
    },
];
var chartConfig = {
    cpu: { label: 'CPU %', color: 'hsl(var(--primary))' },
    memory: { label: 'Memory %', color: 'hsl(var(--accent))' },
    disk: { label: 'Disk %', color: 'hsl(var(--secondary))' },
    responseTime: { label: 'Response Time (ms)', color: 'hsl(var(--primary))' },
    activeConnections: { label: 'Connections', color: 'hsl(var(--accent))' },
    errorRate: { label: 'Error Rate %', color: 'hsl(214 84% 56%)' },
};
var SystemHealthDashboard = function () {
    var _a = (0, react_1.useState)(mockSystemMetrics), systemMetrics = _a[0], setSystemMetrics = _a[1];
    var _b = (0, react_1.useState)(mockServices), services = _b[0], setServices = _b[1];
    var _c = (0, react_1.useState)(mockAlerts), alerts = _c[0], setAlerts = _c[1];
    var _d = (0, react_1.useState)(new Date()), lastUpdated = _d[0], setLastUpdated = _d[1];
    // Simulate real-time updates
    (0, react_1.useEffect)(function () {
        var interval = setInterval(function () {
            // Update system metrics
            var newTime = new Date();
            var timeString = newTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            setSystemMetrics(function (prev) {
                var _a, _b, _c, _d, _e, _f, _g;
                return __spreadArray(__spreadArray([], prev.slice(-5), true), [
                    {
                        timestamp: timeString,
                        cpu: Math.max(20, Math.min(80, ((_a = prev[prev.length - 1]) === null || _a === void 0 ? void 0 : _a.cpu) + (Math.random() - 0.5) * 20)),
                        memory: Math.max(40, Math.min(85, ((_b = prev[prev.length - 1]) === null || _b === void 0 ? void 0 : _b.memory) + (Math.random() - 0.5) * 10)),
                        disk: Math.max(15, Math.min(40, ((_c = prev[prev.length - 1]) === null || _c === void 0 ? void 0 : _c.disk) + (Math.random() - 0.5) * 5)),
                        network: Math.max(60, Math.min(100, ((_d = prev[prev.length - 1]) === null || _d === void 0 ? void 0 : _d.network) + (Math.random() - 0.5) * 15)),
                        responseTime: Math.max(80, Math.min(200, ((_e = prev[prev.length - 1]) === null || _e === void 0 ? void 0 : _e.responseTime) + (Math.random() - 0.5) * 40)),
                        activeConnections: Math.max(100, Math.min(250, ((_f = prev[prev.length - 1]) === null || _f === void 0 ? void 0 : _f.activeConnections) + Math.floor((Math.random() - 0.5) * 30))),
                        errorRate: Math.max(0, Math.min(1, ((_g = prev[prev.length - 1]) === null || _g === void 0 ? void 0 : _g.errorRate) + (Math.random() - 0.5) * 0.2)),
                    },
                ], false);
            });
            setLastUpdated(new Date());
        }, 5000);
        return function () { return clearInterval(interval); };
    }, []);
    var getStatusIcon = function (status) {
        switch (status) {
            case 'healthy':
                return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'degraded':
                return <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>;
            case 'down':
                return <lucide_react_1.XCircle className="h-4 w-4 text-red-500"/>;
            case 'maintenance':
                return <lucide_react_1.Settings className="h-4 w-4 text-blue-500"/>;
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'degraded':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'down':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'maintenance':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };
    var getAlertIcon = function (type) {
        switch (type) {
            case 'error':
                return <lucide_react_1.AlertCircle className="h-4 w-4 text-red-500"/>;
            case 'warning':
                return <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>;
            case 'info':
                return <lucide_react_1.Bell className="h-4 w-4 text-blue-500"/>;
        }
    };
    var getAlertColor = function (type) {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
        }
    };
    var handleAcknowledgeAlert = function (alertId) {
        setAlerts(function (prev) { return prev.map(function (alert) {
            return alert.id === alertId ? __assign(__assign({}, alert), { acknowledged: true }) : alert;
        }); });
        (0, analytics_1.trackEvent)('alert_acknowledged', { alertId: alertId });
    };
    var handleRefresh = function () {
        (0, analytics_1.trackEvent)('system_health_refresh');
        setLastUpdated(new Date());
    };
    var healthyServices = services.filter(function (s) { return s.status === 'healthy'; }).length;
    var degradedServices = services.filter(function (s) { return s.status === 'degraded'; }).length;
    var downServices = services.filter(function (s) { return s.status === 'down'; }).length;
    var avgUptime = services.reduce(function (sum, service) { return sum + service.uptime; }, 0) / services.length;
    var avgResponseTime = services.filter(function (s) { return s.status !== 'maintenance'; }).reduce(function (sum, service) { return sum + service.responseTime; }, 0) / services.filter(function (s) { return s.status !== 'maintenance'; }).length;
    var currentMetrics = systemMetrics[systemMetrics.length - 1];
    var unacknowledgedAlerts = alerts.filter(function (a) { return !a.acknowledged && !a.resolved; }).length;
    return (<div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="text-2xl font-bold text-green-600">Operational</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.CheckCircle className="h-3 w-3 text-green-500"/>
                <span className="text-xs text-green-600">{avgUptime.toFixed(1)}% uptime</span>
              </div>
            </div>
            <lucide_react_1.Server className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-foreground">{unacknowledgedAlerts}</p>
              <div className="flex items-center gap-1 mt-1">
                {unacknowledgedAlerts > 0 ? (<>
                    <lucide_react_1.AlertTriangle className="h-3 w-3 text-yellow-500"/>
                    <span className="text-xs text-yellow-600">Needs attention</span>
                  </>) : (<>
                    <lucide_react_1.CheckCircle className="h-3 w-3 text-green-500"/>
                    <span className="text-xs text-green-600">All clear</span>
                  </>)}
              </div>
            </div>
            <lucide_react_1.Bell className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">{avgResponseTime.toFixed(0)}ms</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Timer className="h-3 w-3 text-primary"/>
                <span className="text-xs text-muted-foreground">Last 5 minutes</span>
              </div>
            </div>
            <lucide_react_1.Zap className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Connections</p>
              <p className="text-2xl font-bold text-foreground">{(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.activeConnections) || 0}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Activity className="h-3 w-3 text-primary"/>
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
            </div>
            <lucide_react_1.Users className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <card_1.Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <lucide_react_1.Cpu className="h-5 w-5 text-primary"/>
              <span className="font-medium">CPU Usage</span>
            </div>
            <span className="text-sm font-medium">{(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.cpu) || 0}%</span>
          </div>
          <progress_1.Progress value={(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.cpu) || 0} className="h-2"/>
          <p className="text-xs text-muted-foreground mt-2">
            {(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.cpu) > 70 ? 'High usage detected' : 'Normal operation'}
          </p>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <lucide_react_1.MemoryStick className="h-5 w-5 text-accent"/>
              <span className="font-medium">Memory Usage</span>
            </div>
            <span className="text-sm font-medium">{(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.memory) || 0}%</span>
          </div>
          <progress_1.Progress value={(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.memory) || 0} className="h-2"/>
          <p className="text-xs text-muted-foreground mt-2">
            {(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.memory) > 80 ? 'Consider scaling up' : 'Optimal usage'}
          </p>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <lucide_react_1.HardDrive className="h-5 w-5 text-secondary"/>
              <span className="font-medium">Disk Usage</span>
            </div>
            <span className="text-sm font-medium">{(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.disk) || 0}%</span>
          </div>
          <progress_1.Progress value={(currentMetrics === null || currentMetrics === void 0 ? void 0 : currentMetrics.disk) || 0} className="h-2"/>
          <p className="text-xs text-muted-foreground mt-2">
            Plenty of storage available
          </p>
        </card_1.Card>
      </div>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">System Performance</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide_react_1.RefreshCw className="h-4 w-4"/>
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <chart_1.ChartContainer config={chartConfig} className="h-[200px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.AreaChart data={systemMetrics}>
                <recharts_1.XAxis dataKey="timestamp"/>
                <recharts_1.YAxis />
                <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                <recharts_1.Area type="monotone" dataKey="cpu" stroke="var(--color-cpu)" fill="var(--color-cpu)" fillOpacity={0.1}/>
                <recharts_1.Area type="monotone" dataKey="memory" stroke="var(--color-memory)" fill="var(--color-memory)" fillOpacity={0.1}/>
              </recharts_1.AreaChart>
            </recharts_1.ResponsiveContainer>
          </chart_1.ChartContainer>
        </card_1.Card>

        <card_1.Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Response Time & Connections</h3>
          <chart_1.ChartContainer config={chartConfig} className="h-[200px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.LineChart data={systemMetrics}>
                <recharts_1.XAxis dataKey="timestamp"/>
                <recharts_1.YAxis yAxisId="left"/>
                <recharts_1.YAxis yAxisId="right" orientation="right"/>
                <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                <recharts_1.Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="var(--color-responseTime)" strokeWidth={2}/>
                <recharts_1.Line yAxisId="right" type="monotone" dataKey="activeConnections" stroke="var(--color-activeConnections)" strokeWidth={2}/>
              </recharts_1.LineChart>
            </recharts_1.ResponsiveContainer>
          </chart_1.ChartContainer>
        </card_1.Card>
      </div>

      {/* Service Status */}
      <card_1.Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Service Status</h3>
          <button_1.Button variant="outline" size="sm" onClick={handleRefresh}>
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Refresh
          </button_1.Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(function (service) { return (<card_1.Card key={service.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className="font-medium">{service.name}</span>
                </div>
                <badge_1.Badge className={getStatusColor(service.status)}>
                  {service.status}
                </badge_1.Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">{service.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response</span>
                  <span className="font-medium">
                    {service.status === 'maintenance' ? 'N/A' : "".concat(service.responseTime, "ms")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className="font-medium">{service.errorRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{service.version}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Last checked: {service.lastChecked}
                </p>
                {service.dependencies.length > 0 && (<p className="text-xs text-muted-foreground mt-1">
                    Dependencies: {service.dependencies.join(', ')}
                  </p>)}
              </div>
            </card_1.Card>); })}
        </div>
      </card_1.Card>

      {/* Active Alerts */}
      <card_1.Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">
            Active Alerts ({unacknowledgedAlerts})
          </h3>
          <div className="flex gap-2">
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Download className="h-4 w-4 mr-2"/>
              Export Logs
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
              Alert Settings
            </button_1.Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {alerts.slice(0, 5).map(function (alert) { return (<div key={alert.id} className={"p-4 rounded-lg border ".concat(getAlertColor(alert.type), " ").concat(alert.acknowledged ? 'opacity-60' : '')}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Service: {alert.service}</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.resolved && (<badge_1.Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Resolved
                    </badge_1.Badge>)}
                  {alert.acknowledged && !alert.resolved && (<badge_1.Badge variant="outline">Acknowledged</badge_1.Badge>)}
                  {!alert.acknowledged && !alert.resolved && (<button_1.Button size="sm" variant="outline" onClick={function () { return handleAcknowledgeAlert(alert.id); }}>
                      Acknowledge
                    </button_1.Button>)}
                </div>
              </div>
            </div>); })}
          
          {alerts.length === 0 && (<div className="text-center py-8 text-muted-foreground">
              <lucide_react_1.CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500"/>
              <p>No active alerts. All systems operational.</p>
            </div>)}
        </div>
      </card_1.Card>
    </div>);
};
exports.SystemHealthDashboard = SystemHealthDashboard;
