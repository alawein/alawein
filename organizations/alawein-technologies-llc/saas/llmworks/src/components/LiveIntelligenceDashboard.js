"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveIntelligenceDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var LiveIntelligenceDashboardComponent = function () {
    var _a = (0, react_1.useState)(false), isExpanded = _a[0], setIsExpanded = _a[1];
    var _b = (0, react_1.useState)(new Date()), lastUpdate = _b[0], setLastUpdate = _b[1];
    var _c = (0, react_1.useState)(true), autoRefresh = _c[0], setAutoRefresh = _c[1];
    // Mock real-time data
    var systemMetrics = (0, react_1.useMemo)(function () { return [
        { id: 'cpu', label: 'Processing Power', value: 73, unit: '%', status: 'optimal', trend: 'up', change: 5.2 },
        { id: 'memory', label: 'Memory Usage', value: 45, unit: '%', status: 'optimal', trend: 'stable', change: 0.1 },
        { id: 'throughput', label: 'Evaluation Throughput', value: 1247, unit: 'req/min', status: 'optimal', trend: 'up', change: 12.3 },
        { id: 'latency', label: 'Response Latency', value: 89, unit: 'ms', status: 'warning', trend: 'down', change: -3.1 },
    ]; }, []);
    var activeEvaluations = (0, react_1.useMemo)(function () { return [
        {
            id: '1',
            modelA: 'GPT-4 Turbo',
            modelB: 'Claude-3 Opus',
            task: 'Strategic Reasoning Challenge',
            progress: 78,
            estimatedCompletion: '2m 34s',
            priority: 'high'
        },
        {
            id: '2',
            modelA: 'Gemini Ultra',
            modelB: 'GPT-3.5 Turbo',
            task: 'Creative Problem Solving',
            progress: 34,
            estimatedCompletion: '5m 12s',
            priority: 'medium'
        },
        {
            id: '3',
            modelA: 'Claude-3 Sonnet',
            modelB: 'LLaMA-2 70B',
            task: 'Analytical Benchmarking',
            progress: 91,
            estimatedCompletion: '45s',
            priority: 'low'
        },
    ]; }, []);
    var threatAlerts = (0, react_1.useMemo)(function () { return [
        {
            id: '1',
            type: 'performance',
            severity: 'medium',
            message: 'Elevated response times detected in EU-West region',
            timestamp: '2 minutes ago',
            resolved: false
        },
        {
            id: '2',
            type: 'security',
            severity: 'low',
            message: 'Unusual traffic pattern from 192.168.1.x range',
            timestamp: '7 minutes ago',
            resolved: true
        },
    ]; }, []);
    // Auto-refresh simulation
    (0, react_1.useEffect)(function () {
        if (!autoRefresh)
            return;
        var interval = setInterval(function () {
            setLastUpdate(new Date());
        }, 5000); // Update every 5 seconds
        return function () { return clearInterval(interval); };
    }, [autoRefresh]);
    var getStatusColor = function (status) {
        switch (status) {
            case 'optimal': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'critical': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'optimal': return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'warning': return <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>;
            case 'critical': return <lucide_react_1.AlertTriangle className="h-4 w-4 text-red-500"/>;
            default: return <lucide_react_1.Clock className="h-4 w-4 text-muted-foreground"/>;
        }
    };
    var getTrendIcon = function (trend, change) {
        var color = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground';
        switch (trend) {
            case 'up': return <lucide_react_1.TrendingUp className={"h-3 w-3 ".concat(color)}/>;
            case 'down': return <lucide_react_1.TrendingDown className={"h-3 w-3 ".concat(color)}/>;
            default: return <div className="w-3 h-3 rounded-full bg-muted-foreground/50"/>;
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'high': return 'rank-gold strategic-rank';
            case 'medium': return 'rank-silver strategic-rank';
            case 'low': return 'rank-bronze strategic-rank';
            default: return 'performance-standard strategic-rank';
        }
    };
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
            default: return 'text-muted-foreground bg-muted/10 border-muted/30';
        }
    };
    return (<div className={"glass-panel transition-all duration-500 ".concat(isExpanded ? 'fixed inset-4 z-50' : 'w-full max-w-4xl')}>
      <card_1.CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.Activity className="h-5 w-5 text-primary animate-pulse"/>
            </div>
            <div>
              <card_1.CardTitle className="heading-refined text-lg">Live Intelligence Dashboard</card_1.CardTitle>
              <p className="text-xs text-muted-foreground">
                Real-time strategic command center • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button_1.Button variant="ghost" size="sm" onClick={function () { return setAutoRefresh(!autoRefresh); }} className="glass-minimal px-3 py-1">
              <lucide_react_1.RefreshCw className={"h-4 w-4 mr-2 ".concat(autoRefresh ? 'animate-spin' : '')}/>
              <span className="text-xs">{autoRefresh ? 'LIVE' : 'PAUSED'}</span>
            </button_1.Button>
            
            <button_1.Button variant="ghost" size="sm" onClick={function () { return setIsExpanded(!isExpanded); }} className="glass-minimal p-2">
              <lucide_react_1.Maximize2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
        </div>
      </card_1.CardHeader>

      <card_1.CardContent className="space-y-6">
        {/* System Metrics Grid */}
        <div>
          <h3 className="heading-refined text-sm mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            System Performance Matrix
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map(function (metric) { return (<card_1.Card key={metric.id} className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300">
                <card_1.CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-xs font-medium">{metric.label}</span>
                    </div>
                    {getTrendIcon(metric.trend, metric.change)}
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <span className="heading-display text-xl font-bold">{metric.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground mb-1">{metric.unit}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <progress_1.Progress value={Math.min(metric.value, 100)} className="h-1 flex-1"/>
                    <span className={"text-xs font-mono ".concat(metric.change > 0 ? 'text-green-500' : metric.change < 0 ? 'text-red-500' : 'text-muted-foreground')}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>
        </div>

        {/* Active Evaluations */}
        <div>
          <h3 className="heading-refined text-sm mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            Active Strategic Evaluations
          </h3>
          
          <div className="space-y-3">
            {activeEvaluations.map(function (evaluation) { return (<card_1.Card key={evaluation.id} className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300">
                <card_1.CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <badge_1.Badge className={getPriorityColor(evaluation.priority)}>
                        {evaluation.priority}
                      </badge_1.Badge>
                      <div>
                        <div className="text-sm font-medium">{evaluation.task}</div>
                        <div className="text-xs text-muted-foreground">
                          {evaluation.modelA} vs {evaluation.modelB}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{evaluation.progress}%</div>
                      <div className="text-xs text-muted-foreground">ETA: {evaluation.estimatedCompletion}</div>
                    </div>
                  </div>
                  
                  <progress_1.Progress value={evaluation.progress} className="h-2"/>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>
        </div>

        {/* Threat Intelligence */}
        <div>
          <h3 className="heading-refined text-sm mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-accent to-primary rounded-full"></div>
            Threat Intelligence Alerts
          </h3>
          
          <div className="space-y-2">
            {threatAlerts.map(function (alert) { return (<div key={alert.id} className={"glass-minimal p-3 rounded-lg border ".concat(getSeverityColor(alert.severity), " ").concat(alert.resolved ? 'opacity-50' : '')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {alert.type === 'security' && <lucide_react_1.Shield className="h-4 w-4"/>}
                      {alert.type === 'performance' && <lucide_react_1.Zap className="h-4 w-4"/>}
                      {alert.type === 'reliability' && <lucide_react_1.Database className="h-4 w-4"/>}
                      <badge_1.Badge variant="outline" className={"text-xs ".concat(getSeverityColor(alert.severity))}>
                        {alert.severity.toUpperCase()}
                      </badge_1.Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm">{alert.message}</div>
                      <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                    </div>
                  </div>
                  
                  {alert.resolved && (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>)}
                </div>
              </div>); })}
          </div>
        </div>

        {/* Command Status */}
        <div className="flex items-center justify-center pt-4 border-t border-border/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 glass-minimal px-3 py-2 rounded-full">
              <lucide_react_1.Users className="h-4 w-4 text-primary"/>
              <span className="text-xs font-medium">47 Active Models</span>
            </div>
            
            <div className="flex items-center gap-2 glass-minimal px-3 py-2 rounded-full">
              <lucide_react_1.Cpu className="h-4 w-4 text-secondary"/>
              <span className="text-xs font-medium">12.4K Evaluations Today</span>
            </div>
            
            <div className="flex items-center gap-2 glass-minimal px-3 py-2 rounded-full">
              <lucide_react_1.Network className="h-4 w-4 text-accent"/>
              <span className="text-xs font-medium">99.7% Uptime</span>
            </div>
          </div>
        </div>
      </card_1.CardContent>
    </div>);
};
exports.LiveIntelligenceDashboard = (0, react_1.memo)(LiveIntelligenceDashboardComponent);
