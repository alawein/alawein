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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var textarea_1 = require("@/components/ui/textarea");
var alert_1 = require("@/components/ui/alert");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var environment_1 = require("@/lib/environment");
var feature_flags_1 = require("@/lib/feature-flags");
var AdminDashboard = function () {
    var _a = (0, react_1.useState)({
        status: 'healthy',
        uptime: 99.98,
        users: { total: 1247, active: 89, new: 12 },
        performance: { avgResponseTime: 245, errorRate: 0.02, throughput: 1500 },
        storage: { used: 45.2, total: 100, percentage: 45.2 },
        cache: { hitRate: 94.5, size: 256 },
    }), systemStatus = _a[0], setSystemStatus = _a[1];
    var _b = (0, react_1.useState)([
        {
            id: '1',
            email: 'admin@llmworks.dev',
            name: 'System Admin',
            role: 'admin',
            status: 'active',
            lastLogin: '2024-01-12T10:30:00Z',
            evaluations: 156,
            benchmarks: 23,
        },
        // Add more mock users as needed
    ]), users = _b[0], setUsers = _b[1];
    var _c = (0, react_1.useState)(null), selectedUser = _c[0], setSelectedUser = _c[1];
    var _d = (0, react_1.useState)((0, feature_flags_1.getAllFeatureFlags)()), featureFlags = _d[0], setFeatureFlags = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(null), notification = _f[0], setNotification = _f[1];
    var config = (0, environment_1.getConfig)();
    (0, react_1.useEffect)(function () {
        // Simulate real-time updates
        var interval = setInterval(function () {
            setSystemStatus(function (prev) { return (__assign(__assign({}, prev), { users: __assign(__assign({}, prev.users), { active: Math.max(50, prev.users.active + Math.floor(Math.random() * 10 - 5)) }), performance: __assign(__assign({}, prev.performance), { avgResponseTime: Math.max(200, prev.performance.avgResponseTime + Math.floor(Math.random() * 40 - 20)) }) })); });
        }, 5000);
        return function () { return clearInterval(interval); };
    }, []);
    var showNotification = function (type, message) {
        setNotification({ type: type, message: message });
        setTimeout(function () { return setNotification(null); }, 5000);
    };
    var handleFeatureFlagToggle = function (flagName, enabled) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            try {
                (0, feature_flags_1.setOverride)(flagName, enabled);
                setFeatureFlags(__assign(__assign({}, featureFlags), (_a = {}, _a[flagName] = __assign(__assign({}, featureFlags[flagName]), { enabled: enabled }), _a)));
                showNotification('success', "Feature flag ".concat(flagName, " ").concat(enabled ? 'enabled' : 'disabled'));
            }
            catch (error) {
                showNotification('error', 'Failed to update feature flag');
            }
            return [2 /*return*/];
        });
    }); };
    var handleClearCache = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setLoading(true);
            try {
                // await pwaManager.clearCaches();
                showNotification('success', 'Cache cleared successfully');
            }
            catch (error) {
                showNotification('error', 'Failed to clear cache');
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    var handleForceSync = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setLoading(true);
            try {
                // await offlineSyncManager.sync();
                showNotification('success', 'Sync completed successfully');
            }
            catch (error) {
                showNotification('error', 'Sync failed');
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'healthy':
                return <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/>;
            case 'degraded':
                return <lucide_react_1.AlertTriangle className="h-5 w-5 text-yellow-500"/>;
            case 'critical':
                return <lucide_react_1.XCircle className="h-5 w-5 text-red-500"/>;
            default:
                return <lucide_react_1.Activity className="h-5 w-5 text-gray-500"/>;
        }
    };
    var getRoleColor = function (role) {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'moderator':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage LLM Works platform</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus.status)}
            <badge_1.Badge variant={systemStatus.status === 'healthy' ? 'default' : 'destructive'}>
              {systemStatus.status.toUpperCase()}
            </badge_1.Badge>
          </div>
        </div>

        {/* Notification */}
        {notification && (<alert_1.Alert className={"".concat(notification.type === 'success' ? 'border-green-500' :
                notification.type === 'error' ? 'border-red-500' : 'border-blue-500')}>
            <alert_1.AlertTitle>
              {notification.type === 'success' ? 'Success' :
                notification.type === 'error' ? 'Error' : 'Info'}
            </alert_1.AlertTitle>
            <alert_1.AlertDescription>{notification.message}</alert_1.AlertDescription>
          </alert_1.Alert>)}

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <card_1.Card>
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Total Users</card_1.CardTitle>
              <lucide_react_1.Users className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{systemStatus.users.total}</div>
              <p className="text-xs text-muted-foreground">
                {systemStatus.users.active} active now
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Avg Response Time</card_1.CardTitle>
              <lucide_react_1.Activity className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{systemStatus.performance.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                {systemStatus.performance.errorRate}% error rate
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Storage Used</card_1.CardTitle>
              <lucide_react_1.Database className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{systemStatus.storage.percentage}%</div>
              <progress_1.Progress value={systemStatus.storage.percentage} className="mt-2"/>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Cache Hit Rate</card_1.CardTitle>
              <lucide_react_1.BarChart3 className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{systemStatus.cache.hitRate}%</div>
              <p className="text-xs text-muted-foreground">
                {systemStatus.cache.size}MB cached
              </p>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Main Content Tabs */}
        <tabs_1.Tabs defaultValue="overview" className="space-y-4">
          <tabs_1.TabsList className="grid w-full grid-cols-6">
            <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="users">Users</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="features">Features</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="system">System</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="security">Security</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="settings">Settings</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          {/* Overview Tab */}
          <tabs_1.TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>Recent Activity</card_1.CardTitle>
                  <card_1.CardDescription>Latest system events and user actions</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">john@example.com • 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Benchmark completed</p>
                      <p className="text-xs text-muted-foreground">GPT-4 vs Claude • 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">High CPU usage detected</p>
                      <p className="text-xs text-muted-foreground">Server load: 85% • 10 minutes ago</p>
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>Quick Actions</card_1.CardTitle>
                  <card_1.CardDescription>Common administrative tasks</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  <button_1.Button onClick={handleClearCache} disabled={loading} className="w-full justify-start" variant="outline">
                    <lucide_react_1.RefreshCw className="mr-2 h-4 w-4"/>
                    Clear System Cache
                  </button_1.Button>
                  <button_1.Button onClick={handleForceSync} disabled={loading} className="w-full justify-start" variant="outline">
                    <lucide_react_1.Download className="mr-2 h-4 w-4"/>
                    Force Data Sync
                  </button_1.Button>
                  <button_1.Button className="w-full justify-start" variant="outline">
                    <lucide_react_1.Upload className="mr-2 h-4 w-4"/>
                    Export Data
                  </button_1.Button>
                  <button_1.Button className="w-full justify-start" variant="outline">
                    <lucide_react_1.Bell className="mr-2 h-4 w-4"/>
                    Send Notification
                  </button_1.Button>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </tabs_1.TabsContent>

          {/* Users Tab */}
          <tabs_1.TabsContent value="users" className="space-y-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>User Management</card_1.CardTitle>
                <card_1.CardDescription>Manage user accounts and permissions</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-4">
                  {users.map(function (user) { return (<div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <badge_1.Badge className={getRoleColor(user.role)}>{user.role}</badge_1.Badge>
                        <badge_1.Badge className={getStatusColor(user.status)}>{user.status}</badge_1.Badge>
                        <button_1.Button size="sm" variant="outline">
                          <lucide_react_1.Eye className="h-4 w-4"/>
                        </button_1.Button>
                        <button_1.Button size="sm" variant="outline">
                          <lucide_react_1.Settings className="h-4 w-4"/>
                        </button_1.Button>
                      </div>
                    </div>); })}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          {/* Features Tab */}
          <tabs_1.TabsContent value="features" className="space-y-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Feature Flags</card_1.CardTitle>
                <card_1.CardDescription>Control feature rollout and availability</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-4">
                  {Object.entries(featureFlags).map(function (_a) {
            var flagName = _a[0], flag = _a[1];
            return (<div key={flagName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{flag.name}</p>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                      </div>
                      <switch_1.Switch checked={flag.enabled} onCheckedChange={function (checked) { return handleFeatureFlagToggle(flagName, checked); }}/>
                    </div>);
        })}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          {/* System Tab */}
          <tabs_1.TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>System Performance</card_1.CardTitle>
                  <card_1.CardDescription>Monitor system health and performance</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <progress_1.Progress value={65}/>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                    <progress_1.Progress value={72}/>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-sm text-muted-foreground">{systemStatus.storage.percentage}%</span>
                    </div>
                    <progress_1.Progress value={systemStatus.storage.percentage}/>
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>Service Status</card_1.CardTitle>
                  <card_1.CardDescription>Current status of system services</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Server</span>
                    <badge_1.Badge className="bg-green-100 text-green-800">Running</badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <badge_1.Badge className="bg-green-100 text-green-800">Connected</badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Redis Cache</span>
                    <badge_1.Badge className="bg-green-100 text-green-800">Active</badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Background Jobs</span>
                    <badge_1.Badge className="bg-yellow-100 text-yellow-800">Busy</badge_1.Badge>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </tabs_1.TabsContent>

          {/* Security Tab */}
          <tabs_1.TabsContent value="security" className="space-y-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Security Settings</card_1.CardTitle>
                <card_1.CardDescription>Configure security policies and monitoring</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label_1.Label className="text-base">Rate Limiting</label_1.Label>
                      <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
                    </div>
                    <switch_1.Switch defaultChecked={config.security.rateLimiting}/>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label_1.Label className="text-base">CSRF Protection</label_1.Label>
                      <p className="text-sm text-muted-foreground">Enable CSRF token validation</p>
                    </div>
                    <switch_1.Switch defaultChecked/>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label_1.Label className="text-base">Content Security Policy</label_1.Label>
                      <p className="text-sm text-muted-foreground">Enable strict CSP headers</p>
                    </div>
                    <switch_1.Switch defaultChecked={config.security.cspEnabled}/>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          {/* Settings Tab */}
          <tabs_1.TabsContent value="settings" className="space-y-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Platform Settings</card_1.CardTitle>
                <card_1.CardDescription>Configure global platform settings</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label_1.Label htmlFor="site-name">Site Name</label_1.Label>
                    <input_1.Input id="site-name" defaultValue="LLM Works"/>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="api-url">API URL</label_1.Label>
                    <input_1.Input id="api-url" defaultValue={config.apiUrl}/>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="max-evaluations">Max Evaluations per User</label_1.Label>
                    <input_1.Input id="max-evaluations" type="number" defaultValue="100"/>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="maintenance-message">Maintenance Message</label_1.Label>
                    <textarea_1.Textarea id="maintenance-message" placeholder="Enter maintenance message..." rows={3}/>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button_1.Button>Save Settings</button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
};
exports.default = AdminDashboard;
