"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.StrategicCommandPanel = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var progress_1 = require("@/components/ui/progress");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var StrategicCommandPanelComponent = function () {
    var _a = (0, react_1.useState)('overview'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(''), commandInput = _b[0], setCommandInput = _b[1];
    var _c = (0, react_1.useState)([]), commandHistory = _c[0], setCommandHistory = _c[1];
    var _d = (0, react_1.useState)(false), isExecuting = _d[0], setIsExecuting = _d[1];
    var _e = (0, react_1.useState)(3), notifications = _e[0], setNotifications = _e[1];
    var terminalRef = (0, react_1.useRef)(null);
    var commandModules = [
        {
            id: 'eval-engine',
            name: 'Evaluation Engine',
            status: 'online',
            cpu: 67,
            memory: 45,
            uptime: '7d 14h 23m',
            version: 'v2.1.4',
            lastUpdate: '2 hours ago'
        },
        {
            id: 'model-registry',
            name: 'Model Registry',
            status: 'online',
            cpu: 23,
            memory: 18,
            uptime: '12d 8h 45m',
            version: 'v1.8.2',
            lastUpdate: '6 hours ago'
        },
        {
            id: 'result-analyzer',
            name: 'Result Analyzer',
            status: 'maintenance',
            cpu: 0,
            memory: 12,
            uptime: '0h 0m',
            version: 'v1.5.1',
            lastUpdate: '1 hour ago'
        },
        {
            id: 'security-monitor',
            name: 'Security Monitor',
            status: 'online',
            cpu: 12,
            memory: 8,
            uptime: '15d 3h 12m',
            version: 'v3.0.1',
            lastUpdate: '3 minutes ago'
        },
    ];
    var activeSessions = [
        {
            id: '1',
            user: 'admin@llmworks.dev',
            model: 'GPT-4 Turbo',
            task: 'Strategic Analysis Benchmark',
            duration: '14:23',
            progress: 78,
            priority: 'high'
        },
        {
            id: '2',
            user: 'researcher@university.edu',
            model: 'Claude-3 Opus',
            task: 'Creative Problem Solving',
            duration: '06:45',
            progress: 34,
            priority: 'medium'
        },
        {
            id: '3',
            user: 'devops@company.com',
            model: 'Gemini Ultra',
            task: 'Performance Stress Test',
            duration: '28:17',
            progress: 92,
            priority: 'critical'
        },
    ];
    var systemLogs = [
        {
            id: '1',
            timestamp: '14:23:45',
            level: 'info',
            module: 'EVAL_ENGINE',
            message: 'Strategic evaluation batch completed successfully - 247 models processed'
        },
        {
            id: '2',
            timestamp: '14:22:31',
            level: 'warning',
            module: 'SECURITY',
            message: 'Unusual request pattern detected from IP 192.168.1.45 - rate limiting applied'
        },
        {
            id: '3',
            timestamp: '14:21:18',
            level: 'success',
            module: 'REGISTRY',
            message: 'New model registered: LLaMA-3-70B-Instruct with strategic capabilities'
        },
        {
            id: '4',
            timestamp: '14:20:09',
            level: 'error',
            module: 'ANALYZER',
            message: 'Memory threshold exceeded in result processing - automatic cleanup initiated'
        },
        {
            id: '5',
            timestamp: '14:19:42',
            level: 'info',
            module: 'NETWORK',
            message: 'Load balancer health check passed - all nodes operational'
        },
    ];
    var executeCommand = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockResponses, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!commandInput.trim())
                        return [2 /*return*/];
                    setIsExecuting(true);
                    setCommandHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), ["$ ".concat(commandInput)], false); });
                    // Simulate command execution
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 1:
                    // Simulate command execution
                    _a.sent();
                    mockResponses = {
                        'status': 'System Status: All modules operational ✓\nEvaluation Engine: Online (67% CPU)\nModel Registry: Online (23% CPU)\nSecurity Monitor: Online (12% CPU)',
                        'help': 'Available commands:\n  status - Show system status\n  restart <module> - Restart a module\n  logs <level> - Show filtered logs\n  sessions - List active sessions\n  metrics - Display performance metrics',
                        'logs error': 'Error logs from last hour:\n[14:20:09] ANALYZER: Memory threshold exceeded\n[13:45:23] NETWORK: Connection timeout to node-3',
                        'metrics': 'Performance Metrics:\nCPU Usage: 45.7%\nMemory Usage: 62.3%\nNetwork I/O: 1.2 GB/s\nActive Sessions: 247\nToday\'s Evaluations: 12,847',
                    };
                    response = mockResponses[commandInput.toLowerCase()] ||
                        "Command executed: ".concat(commandInput, "\nResponse: Operation completed successfully");
                    setCommandHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [response, ''], false); });
                    setCommandInput('');
                    setIsExecuting(false);
                    // Auto-scroll to bottom
                    setTimeout(function () {
                        if (terminalRef.current) {
                            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                        }
                    }, 100);
                    return [2 /*return*/];
            }
        });
    }); };
    var getStatusColor = function (status) {
        switch (status) {
            case 'online': return 'text-green-500 bg-green-500/10 border-green-500/30';
            case 'offline': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
            case 'maintenance': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            case 'error': return 'text-red-500 bg-red-500/10 border-red-500/30';
            default: return 'text-muted-foreground bg-muted/10 border-muted/30';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'online': return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'offline': return <lucide_react_1.Power className="h-4 w-4 text-gray-500"/>;
            case 'maintenance': return <lucide_react_1.Settings className="h-4 w-4 text-yellow-500"/>;
            case 'error': return <lucide_react_1.AlertTriangle className="h-4 w-4 text-red-500"/>;
            default: return <lucide_react_1.Clock className="h-4 w-4 text-muted-foreground"/>;
        }
    };
    var getLogLevelColor = function (level) {
        switch (level) {
            case 'info': return 'text-blue-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            case 'success': return 'text-green-400';
            default: return 'text-muted-foreground';
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'critical': return 'rank-platinum strategic-rank';
            case 'high': return 'rank-gold strategic-rank';
            case 'medium': return 'rank-silver strategic-rank';
            case 'low': return 'rank-bronze strategic-rank';
            default: return 'performance-standard strategic-rank';
        }
    };
    return (<div className="glass-panel w-full max-w-7xl mx-auto">
      <card_1.CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.Terminal className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <card_1.CardTitle className="heading-refined text-lg">Strategic Command Panel</card_1.CardTitle>
              <p className="text-xs text-muted-foreground">
                Advanced system control and monitoring interface
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button_1.Button variant="ghost" size="sm" className="glass-minimal">
              <lucide_react_1.Bell className="h-4 w-4 mr-2"/>
              <span className="text-xs">{notifications}</span>
            </button_1.Button>
            <badge_1.Badge className="performance-elite strategic-rank">AUTHORIZED</badge_1.Badge>
          </div>
        </div>
      </card_1.CardHeader>

      <card_1.CardContent>
        <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <tabs_1.TabsList className="glass-subtle p-1 rounded-xl grid grid-cols-4 w-full max-w-md">
            <tabs_1.TabsTrigger value="overview" className="text-xs">Overview</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="modules" className="text-xs">Modules</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="sessions" className="text-xs">Sessions</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="terminal" className="text-xs">Terminal</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="overview" className="space-y-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Health */}
              <card_1.Card className="glass-subtle border-border/20">
                <card_1.CardHeader className="pb-3">
                  <card_1.CardTitle className="text-sm flex items-center gap-2">
                    <lucide_react_1.Shield className="h-4 w-4 text-primary"/>
                    System Health
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Overall Status</span>
                    <badge_1.Badge className="performance-elite strategic-rank">OPTIMAL</badge_1.Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>CPU Usage</span>
                      <span>45.7%</span>
                    </div>
                    <progress_1.Progress value={45.7} className="h-1"/>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Memory</span>
                      <span>62.3%</span>
                    </div>
                    <progress_1.Progress value={62.3} className="h-1"/>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Network I/O</span>
                      <span>1.2 GB/s</span>
                    </div>
                    <progress_1.Progress value={78} className="h-1"/>
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              {/* Active Operations */}
              <card_1.Card className="glass-subtle border-border/20">
                <card_1.CardHeader className="pb-3">
                  <card_1.CardTitle className="text-sm flex items-center gap-2">
                    <lucide_react_1.Zap className="h-4 w-4 text-primary"/>
                    Active Operations
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Evaluations Today</span>
                    <span className="text-sm font-bold text-primary">12,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Active Sessions</span>
                    <span className="text-sm font-bold text-secondary">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Models Online</span>
                    <span className="text-sm font-bold text-accent">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Queue Depth</span>
                    <span className="text-sm font-bold text-green-500">23</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              {/* Security Status */}
              <card_1.Card className="glass-subtle border-border/20">
                <card_1.CardHeader className="pb-3">
                  <card_1.CardTitle className="text-sm flex items-center gap-2">
                    <lucide_react_1.Lock className="h-4 w-4 text-primary"/>
                    Security Status
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Threat Level</span>
                    <badge_1.Badge className="performance-superior strategic-rank">LOW</badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Failed Attempts</span>
                    <span className="text-sm font-bold text-red-500">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Active Firewalls</span>
                    <span className="text-sm font-bold text-green-500">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Scan</span>
                    <span className="text-xs text-muted-foreground">2m ago</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="modules" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">System Modules</h3>
              <div className="flex gap-2">
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.RotateCcw className="h-4 w-4 mr-2"/>
                  Refresh
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
                  Configure
                </button_1.Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {commandModules.map(function (module) { return (<card_1.Card key={module.id} className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300">
                  <card_1.CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(module.status)}
                        <div>
                          <div className="text-sm font-medium">{module.name}</div>
                          <div className="text-xs text-muted-foreground">{module.version}</div>
                        </div>
                      </div>
                      <badge_1.Badge className={"text-xs ".concat(getStatusColor(module.status))}>
                        {module.status.toUpperCase()}
                      </badge_1.Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">CPU</div>
                        <div className="flex items-center gap-2">
                          <progress_1.Progress value={module.cpu} className="h-1 flex-1"/>
                          <span className="text-xs font-mono">{module.cpu}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Memory</div>
                        <div className="flex items-center gap-2">
                          <progress_1.Progress value={module.memory} className="h-1 flex-1"/>
                          <span className="text-xs font-mono">{module.memory}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Uptime: {module.uptime}</span>
                      <span>Updated: {module.lastUpdate}</span>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="sessions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Active Sessions</h3>
              <div className="flex gap-2">
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.Search className="h-4 w-4 mr-2"/>
                  Search
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
                  Filter
                </button_1.Button>
              </div>
            </div>

            <div className="space-y-3">
              {activeSessions.map(function (session) { return (<card_1.Card key={session.id} className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300">
                  <card_1.CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <badge_1.Badge className={getPriorityColor(session.priority)}>
                          {session.priority}
                        </badge_1.Badge>
                        <div>
                          <div className="text-sm font-medium">{session.task}</div>
                          <div className="text-xs text-muted-foreground">
                            {session.user} • {session.model}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{session.progress}%</div>
                        <div className="text-xs text-muted-foreground">{session.duration}</div>
                      </div>
                    </div>
                    <progress_1.Progress value={session.progress} className="h-2"/>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="terminal" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Strategic Command Terminal</h3>
              <div className="flex gap-2">
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.Download className="h-4 w-4 mr-2"/>
                  Export
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" className="glass-minimal">
                  <lucide_react_1.Code className="h-4 w-4 mr-2"/>
                  Clear
                </button_1.Button>
              </div>
            </div>

            {/* Terminal */}
            <card_1.Card className="glass-subtle border-border/20 bg-black/20">
              <card_1.CardContent className="p-0">
                <div ref={terminalRef} className="font-mono text-xs text-green-400 p-4 h-64 overflow-y-auto scrollbar-elegant" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                  <div className="text-primary mb-2">LLM Works Strategic Command Terminal v2.1.4</div>
                  <div className="text-muted-foreground mb-4">Type 'help' for available commands</div>
                  
                  {commandHistory.map(function (line, index) { return (<div key={index} className={line.startsWith('$') ? 'text-blue-400' : 'text-green-400'}>
                      {line}
                    </div>); })}
                  
                  <div className="flex items-center mt-2">
                    <span className="text-blue-400 mr-2">$</span>
                    <input_1.Input value={commandInput} onChange={function (e) { return setCommandInput(e.target.value); }} onKeyDown={function (e) {
            if (e.key === 'Enter') {
                executeCommand();
            }
        }} className="border-0 bg-transparent text-green-400 p-0 h-auto focus-visible:ring-0" placeholder="Enter command..." disabled={isExecuting}/>
                    {isExecuting && (<div className="ml-2 text-yellow-400 animate-pulse">executing...</div>)}
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* System Logs */}
            <card_1.Card className="glass-subtle border-border/20">
              <card_1.CardHeader className="pb-3">
                <card_1.CardTitle className="text-sm flex items-center gap-2">
                  <lucide_react_1.Eye className="h-4 w-4 text-primary"/>
                  System Logs
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-2">
                {systemLogs.map(function (log) { return (<div key={log.id} className="flex items-start gap-3 text-xs">
                    <span className="text-muted-foreground font-mono">{log.timestamp}</span>
                    <span className={"font-mono ".concat(getLogLevelColor(log.level), " min-w-[4rem]")}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="text-primary font-mono">{log.module}:</span>
                    <span className="text-muted-foreground flex-1">{log.message}</span>
                  </div>); })}
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.CardContent>
    </div>);
};
exports.StrategicCommandPanel = (0, react_1.memo)(StrategicCommandPanelComponent);
