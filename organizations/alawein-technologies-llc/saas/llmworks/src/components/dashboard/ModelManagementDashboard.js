"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelManagementDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var progress_1 = require("@/components/ui/progress");
var select_1 = require("@/components/ui/select");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var lucide_react_1 = require("lucide-react");
var analytics_1 = require("@/lib/analytics");
var mockModels = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        version: 'gpt-4-0125-preview',
        status: 'active',
        performance: {
            accuracy: 92.3,
            latency: 2.1,
            throughput: 45,
            cost: 0.03,
        },
        usage: {
            totalRequests: 1247,
            successRate: 98.2,
            avgTokensPerRequest: 523,
            monthlySpend: 234.56,
        },
        limits: {
            rateLimit: 10000,
            dailyQuota: 50000,
            usedQuota: 12340,
        },
        lastActive: '2 minutes ago',
        configuration: {
            temperature: 0.7,
            maxTokens: 4096,
            topP: 0.9,
        },
    },
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        version: 'claude-3-5-sonnet-20241022',
        status: 'active',
        performance: {
            accuracy: 89.7,
            latency: 1.8,
            throughput: 52,
            cost: 0.015,
        },
        usage: {
            totalRequests: 892,
            successRate: 99.1,
            avgTokensPerRequest: 612,
            monthlySpend: 187.23,
        },
        limits: {
            rateLimit: 8000,
            dailyQuota: 40000,
            usedQuota: 8921,
        },
        lastActive: '5 minutes ago',
        configuration: {
            temperature: 0.7,
            maxTokens: 8192,
            topP: 0.9,
        },
    },
    {
        id: 'gemini-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        version: 'gemini-1.5-pro',
        status: 'paused',
        performance: {
            accuracy: 87.4,
            latency: 3.2,
            throughput: 38,
            cost: 0.005,
        },
        usage: {
            totalRequests: 643,
            successRate: 96.8,
            avgTokensPerRequest: 445,
            monthlySpend: 78.45,
        },
        limits: {
            rateLimit: 5000,
            dailyQuota: 30000,
            usedQuota: 6432,
        },
        lastActive: '2 hours ago',
        configuration: {
            temperature: 0.5,
            maxTokens: 2048,
            topP: 0.8,
        },
    },
    {
        id: 'llama-70b',
        name: 'Llama 3.1 70B',
        provider: 'meta',
        version: 'meta-llama/Llama-3.1-70B-Instruct',
        status: 'error',
        performance: {
            accuracy: 84.2,
            latency: 4.1,
            throughput: 28,
            cost: 0.001,
        },
        usage: {
            totalRequests: 234,
            successRate: 87.2,
            avgTokensPerRequest: 389,
            monthlySpend: 12.67,
        },
        limits: {
            rateLimit: 2000,
            dailyQuota: 15000,
            usedQuota: 2341,
        },
        lastActive: '1 day ago',
        configuration: {
            temperature: 0.6,
            maxTokens: 1024,
            topP: 0.7,
        },
    },
];
var ModelManagementDashboard = function () {
    var _a = (0, react_1.useState)(mockModels), models = _a[0], setModels = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('all'), statusFilter = _c[0], setStatusFilter = _c[1];
    var _d = (0, react_1.useState)('all'), providerFilter = _d[0], setProviderFilter = _d[1];
    var _e = (0, react_1.useState)(null), selectedModel = _e[0], setSelectedModel = _e[1];
    var filteredModels = models.filter(function (model) {
        var matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
        var matchesStatus = statusFilter === 'all' || model.status === statusFilter;
        var matchesProvider = providerFilter === 'all' || model.provider === providerFilter;
        return matchesSearch && matchesStatus && matchesProvider;
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'active':
                return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'paused':
                return <lucide_react_1.Pause className="h-4 w-4 text-yellow-500"/>;
            case 'error':
                return <lucide_react_1.AlertTriangle className="h-4 w-4 text-red-500"/>;
            case 'offline':
                return <lucide_react_1.Clock className="h-4 w-4 text-gray-500"/>;
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'offline':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };
    var getProviderLogo = function (provider) {
        var iconClasses = 'h-6 w-6';
        switch (provider) {
            case 'openai':
                return <lucide_react_1.Brain className={"".concat(iconClasses, " text-green-600")}/>;
            case 'anthropic':
                return <lucide_react_1.Brain className={"".concat(iconClasses, " text-orange-600")}/>;
            case 'google':
                return <lucide_react_1.Brain className={"".concat(iconClasses, " text-blue-600")}/>;
            case 'meta':
                return <lucide_react_1.Brain className={"".concat(iconClasses, " text-blue-800")}/>;
            case 'custom':
                return <lucide_react_1.Brain className={"".concat(iconClasses, " text-purple-600")}/>;
        }
    };
    var handleModelAction = function (action, model) {
        (0, analytics_1.trackEvent)('model_action', { action: action, modelId: model.id });
        // Implementation would update model status, etc.
        console.log("Action: ".concat(action, " on model: ").concat(model.name));
    };
    var totalActiveModels = models.filter(function (m) { return m.status === 'active'; }).length;
    var totalMonthlySpend = models.reduce(function (sum, model) { return sum + model.usage.monthlySpend; }, 0);
    var avgSuccessRate = models.reduce(function (sum, model) { return sum + model.usage.successRate; }, 0) / models.length;
    var avgAccuracy = models.reduce(function (sum, model) { return sum + model.performance.accuracy; }, 0) / models.length;
    return (<div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Models</p>
              <p className="text-2xl font-bold text-foreground">{totalActiveModels}</p>
              <p className="text-xs text-green-600">
                <lucide_react_1.TrendingUp className="inline h-3 w-3"/> +2 this week
              </p>
            </div>
            <lucide_react_1.Activity className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Spend</p>
              <p className="text-2xl font-bold text-foreground">${totalMonthlySpend.toFixed(2)}</p>
              <p className="text-xs text-red-600">
                <lucide_react_1.TrendingUp className="inline h-3 w-3"/> +$23.45 vs last month
              </p>
            </div>
            <lucide_react_1.DollarSign className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              <p className="text-2xl font-bold text-foreground">{avgSuccessRate.toFixed(1)}%</p>
              <p className="text-xs text-green-600">
                <lucide_react_1.TrendingUp className="inline h-3 w-3"/> +1.2% this week
              </p>
            </div>
            <lucide_react_1.CheckCircle className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className="text-2xl font-bold text-foreground">{avgAccuracy.toFixed(1)}%</p>
              <p className="text-xs text-green-600">
                <lucide_react_1.TrendingUp className="inline h-3 w-3"/> +0.8% this week
              </p>
            </div>
            <lucide_react_1.Zap className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
      </div>

      {/* Filters and Search */}
      <card_1.Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <lucide_react_1.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
              <input_1.Input placeholder="Search models..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10 w-64"/>
            </div>

            <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
              <select_1.SelectTrigger className="w-36">
                <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
                <select_1.SelectValue placeholder="Status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                <select_1.SelectItem value="active">Active</select_1.SelectItem>
                <select_1.SelectItem value="paused">Paused</select_1.SelectItem>
                <select_1.SelectItem value="error">Error</select_1.SelectItem>
                <select_1.SelectItem value="offline">Offline</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>

            <select_1.Select value={providerFilter} onValueChange={setProviderFilter}>
              <select_1.SelectTrigger className="w-36">
                <select_1.SelectValue placeholder="Provider"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Providers</select_1.SelectItem>
                <select_1.SelectItem value="openai">OpenAI</select_1.SelectItem>
                <select_1.SelectItem value="anthropic">Anthropic</select_1.SelectItem>
                <select_1.SelectItem value="google">Google</select_1.SelectItem>
                <select_1.SelectItem value="meta">Meta</select_1.SelectItem>
                <select_1.SelectItem value="custom">Custom</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <button_1.Button>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            Add Model
          </button_1.Button>
        </div>
      </card_1.Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map(function (model) { return (<card_1.Card key={model.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getProviderLogo(model.provider)}
                  <div>
                    <h3 className="font-semibold text-foreground">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <badge_1.Badge className={getStatusColor(model.status)}>
                    {getStatusIcon(model.status)}
                    {model.status}
                  </badge_1.Badge>
                  <dropdown_menu_1.DropdownMenu>
                    <dropdown_menu_1.DropdownMenuTrigger asChild>
                      <button_1.Button variant="ghost" size="sm">
                        <lucide_react_1.MoreVertical className="h-4 w-4"/>
                      </button_1.Button>
                    </dropdown_menu_1.DropdownMenuTrigger>
                    <dropdown_menu_1.DropdownMenuContent align="end">
                      <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleModelAction('configure', model); }}>
                        <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
                        Configure
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleModelAction('test', model); }}>
                        <lucide_react_1.Play className="h-4 w-4 mr-2"/>
                        Test Connection
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleModelAction('pause', model); }}>
                        <lucide_react_1.Pause className="h-4 w-4 mr-2"/>
                        Pause
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleModelAction('delete', model); }} className="text-red-600">
                        <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                        Delete
                      </dropdown_menu_1.DropdownMenuItem>
                    </dropdown_menu_1.DropdownMenuContent>
                  </dropdown_menu_1.DropdownMenu>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{model.performance.accuracy}%</span>
                  </div>
                  <progress_1.Progress value={model.performance.accuracy} className="h-2"/>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{model.usage.successRate}%</span>
                  </div>
                  <progress_1.Progress value={model.usage.successRate} className="h-2"/>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Requests</p>
                  <p className="font-medium">{model.usage.totalRequests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-medium">{model.performance.latency}s</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost/req</p>
                  <p className="font-medium">${model.performance.cost}</p>
                </div>
              </div>

              {/* Quota Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Quota Usage</span>
                  <span className="font-medium">
                    {model.limits.usedQuota.toLocaleString()} / {model.limits.dailyQuota.toLocaleString()}
                  </span>
                </div>
                <progress_1.Progress value={(model.limits.usedQuota / model.limits.dailyQuota) * 100} className="h-2"/>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Last active: {model.lastActive}
                </span>
                <span className="text-xs font-medium text-foreground">
                  ${model.usage.monthlySpend.toFixed(2)}/month
                </span>
              </div>
            </div>
          </card_1.Card>); })}
      </div>

      {filteredModels.length === 0 && (<div className="text-center py-12">
          <lucide_react_1.Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
          <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' || providerFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by adding your first model.'}
          </p>
          <button_1.Button>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            Add Model
          </button_1.Button>
        </div>)}
    </div>);
};
exports.ModelManagementDashboard = ModelManagementDashboard;
