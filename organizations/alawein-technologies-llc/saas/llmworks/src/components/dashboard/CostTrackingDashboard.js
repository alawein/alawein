"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostTrackingDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var progress_1 = require("@/components/ui/progress");
var select_1 = require("@/components/ui/select");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var chart_1 = require("@/components/ui/chart");
var recharts_1 = require("recharts");
var analytics_1 = require("@/lib/analytics");
var date_fns_1 = require("date-fns");
var mockCostData = [
    {
        date: '2024-01-01',
        totalCost: 45.67,
        apiCosts: { openai: 25.30, anthropic: 12.45, google: 5.67, meta: 2.25 },
        usage: { totalTokens: 125000, evaluations: 15, avgCostPerEvaluation: 3.04 },
    },
    {
        date: '2024-01-02',
        totalCost: 52.34,
        apiCosts: { openai: 28.90, anthropic: 15.22, google: 6.12, meta: 2.10 },
        usage: { totalTokens: 142000, evaluations: 18, avgCostPerEvaluation: 2.91 },
    },
    {
        date: '2024-01-03',
        totalCost: 38.91,
        apiCosts: { openai: 21.45, anthropic: 10.33, google: 4.88, meta: 2.25 },
        usage: { totalTokens: 98000, evaluations: 12, avgCostPerEvaluation: 3.24 },
    },
    {
        date: '2024-01-04',
        totalCost: 67.23,
        apiCosts: { openai: 35.67, anthropic: 18.90, google: 8.45, meta: 4.21 },
        usage: { totalTokens: 178000, evaluations: 22, avgCostPerEvaluation: 3.05 },
    },
    {
        date: '2024-01-05',
        totalCost: 78.45,
        apiCosts: { openai: 42.30, anthropic: 21.15, google: 10.25, meta: 4.75 },
        usage: { totalTokens: 195000, evaluations: 25, avgCostPerEvaluation: 3.14 },
    },
];
var mockModelUsage = [
    {
        modelId: 'gpt-4',
        modelName: 'GPT-4',
        provider: 'OpenAI',
        usage: {
            totalTokens: 125000,
            inputTokens: 75000,
            outputTokens: 50000,
            requests: 245,
        },
        cost: {
            total: 156.75,
            inputCost: 56.25,
            outputCost: 100.50,
            perRequest: 0.64,
        },
        trend: {
            change: 12.5,
            direction: 'up',
        },
    },
    {
        modelId: 'claude-3-sonnet',
        modelName: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        usage: {
            totalTokens: 98000,
            inputTokens: 58000,
            outputTokens: 40000,
            requests: 189,
        },
        cost: {
            total: 89.45,
            inputCost: 34.80,
            outputCost: 54.65,
            perRequest: 0.47,
        },
        trend: {
            change: 8.3,
            direction: 'up',
        },
    },
    {
        modelId: 'gemini-pro',
        modelName: 'Gemini 1.5 Pro',
        provider: 'Google',
        usage: {
            totalTokens: 67000,
            inputTokens: 42000,
            outputTokens: 25000,
            requests: 134,
        },
        cost: {
            total: 23.45,
            inputCost: 12.60,
            outputCost: 10.85,
            perRequest: 0.18,
        },
        trend: {
            change: -5.2,
            direction: 'down',
        },
    },
    {
        modelId: 'llama-70b',
        modelName: 'Llama 3.1 70B',
        provider: 'Meta',
        usage: {
            totalTokens: 45000,
            inputTokens: 30000,
            outputTokens: 15000,
            requests: 78,
        },
        cost: {
            total: 8.90,
            inputCost: 6.00,
            outputCost: 2.90,
            perRequest: 0.11,
        },
        trend: {
            change: -12.8,
            direction: 'down',
        },
    },
];
var mockBudgets = [
    {
        id: 'monthly-main',
        name: 'Monthly Evaluation Budget',
        limit: 1000,
        spent: 678.45,
        period: 'monthly',
        alerts: [
            { percentage: 50, enabled: true },
            { percentage: 75, enabled: true },
            { percentage: 90, enabled: true },
        ],
    },
    {
        id: 'weekly-testing',
        name: 'Weekly Testing Budget',
        limit: 250,
        spent: 189.23,
        period: 'weekly',
        alerts: [
            { percentage: 80, enabled: true },
            { percentage: 95, enabled: true },
        ],
    },
];
var chartConfig = {
    totalCost: { label: 'Total Cost', color: 'hsl(var(--primary))' },
    openai: { label: 'OpenAI', color: '#10a37f' },
    anthropic: { label: 'Anthropic', color: '#d97706' },
    google: { label: 'Google', color: '#2563eb' },
    meta: { label: 'Meta', color: '#1e40af' },
    evaluations: { label: 'Evaluations', color: 'hsl(var(--accent))' },
    tokens: { label: 'Tokens', color: 'hsl(var(--secondary))' },
};
var CostTrackingDashboard = function () {
    var _a = (0, react_1.useState)(mockCostData), costData = _a[0], setCostData = _a[1];
    var _b = (0, react_1.useState)(mockModelUsage), modelUsage = _b[0], setModelUsage = _b[1];
    var _c = (0, react_1.useState)(mockBudgets), budgets = _c[0], setBudgets = _c[1];
    var _d = (0, react_1.useState)('30d'), selectedPeriod = _d[0], setSelectedPeriod = _d[1];
    var _e = (0, react_1.useState)({}), dateRange = _e[0], setDateRange = _e[1];
    var totalSpent = costData.reduce(function (sum, day) { return sum + day.totalCost; }, 0);
    var avgDailySpend = totalSpent / costData.length;
    var totalTokens = costData.reduce(function (sum, day) { return sum + day.usage.totalTokens; }, 0);
    var totalEvaluations = costData.reduce(function (sum, day) { return sum + day.usage.evaluations; }, 0);
    // Calculate provider breakdown for pie chart
    var providerBreakdown = [
        { name: 'OpenAI', value: costData.reduce(function (sum, day) { return sum + day.apiCosts.openai; }, 0), color: '#10a37f' },
        { name: 'Anthropic', value: costData.reduce(function (sum, day) { return sum + day.apiCosts.anthropic; }, 0), color: '#d97706' },
        { name: 'Google', value: costData.reduce(function (sum, day) { return sum + day.apiCosts.google; }, 0), color: '#2563eb' },
        { name: 'Meta', value: costData.reduce(function (sum, day) { return sum + day.apiCosts.meta; }, 0), color: '#1e40af' },
    ];
    var handleExportData = function () {
        (0, analytics_1.trackEvent)('cost_data_export', { period: selectedPeriod });
        // Export logic would go here
    };
    var getBudgetStatus = function (budget) {
        var percentage = (budget.spent / budget.limit) * 100;
        if (percentage >= 90)
            return { color: 'red', status: 'danger' };
        if (percentage >= 75)
            return { color: 'yellow', status: 'warning' };
        return { color: 'green', status: 'good' };
    };
    var getTrendIcon = function (direction) {
        switch (direction) {
            case 'up':
                return <lucide_react_1.ArrowUpRight className="h-4 w-4 text-red-500"/>;
            case 'down':
                return <lucide_react_1.ArrowDownRight className="h-4 w-4 text-green-500"/>;
            case 'stable':
                return <div className="h-4 w-4"/>;
        }
    };
    var getTrendColor = function (direction) {
        switch (direction) {
            case 'up':
                return 'text-red-600';
            case 'down':
                return 'text-green-600';
            case 'stable':
                return 'text-muted-foreground';
        }
    };
    return (<div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.TrendingUp className="h-3 w-3 text-red-500"/>
                <span className="text-xs text-red-600">+15.2% this period</span>
              </div>
            </div>
            <lucide_react_1.DollarSign className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-bold text-foreground">${avgDailySpend.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.TrendingDown className="h-3 w-3 text-green-500"/>
                <span className="text-xs text-green-600">-3.8% vs last period</span>
              </div>
            </div>
            <lucide_react_1.BarChart3 className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tokens</p>
              <p className="text-2xl font-bold text-foreground">{(totalTokens / 1000).toFixed(0)}K</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Zap className="h-3 w-3 text-primary"/>
                <span className="text-xs text-muted-foreground">{totalEvaluations} evaluations</span>
              </div>
            </div>
            <lucide_react_1.Brain className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cost per Evaluation</p>
              <p className="text-2xl font-bold text-foreground">
                ${(totalSpent / totalEvaluations).toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Target className="h-3 w-3 text-green-500"/>
                <span className="text-xs text-green-600">-8.1% efficiency gain</span>
              </div>
            </div>
            <lucide_react_1.CreditCard className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
      </div>

      {/* Budget Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgets.map(function (budget) {
            var status = getBudgetStatus(budget);
            var percentage = (budget.spent / budget.limit) * 100;
            return (<card_1.Card key={budget.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{budget.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {budget.period} • ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                  </p>
                </div>
                {status.status === 'danger' && (<lucide_react_1.AlertTriangle className="h-5 w-5 text-red-500"/>)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
                <progress_1.Progress value={percentage} className="h-2"/>
              </div>
            </card_1.Card>);
        })}
      </div>

      {/* Controls */}
      <card_1.Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <select_1.Select value={selectedPeriod} onValueChange={function (value) { return setSelectedPeriod(value); }}>
              <select_1.SelectTrigger className="w-40">
                <lucide_react_1.Calendar className="h-4 w-4 mr-2"/>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="7d">Last 7 days</select_1.SelectItem>
                <select_1.SelectItem value="30d">Last 30 days</select_1.SelectItem>
                <select_1.SelectItem value="90d">Last 90 days</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>

            <popover_1.Popover>
              <popover_1.PopoverTrigger asChild>
                <button_1.Button variant="outline">
                  <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
                  Custom Range
                </button_1.Button>
              </popover_1.PopoverTrigger>
              <popover_1.PopoverContent className="w-auto p-0" align="start">
                <calendar_1.Calendar initialFocus mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2}/>
              </popover_1.PopoverContent>
            </popover_1.Popover>
          </div>

          <div className="flex gap-2">
            <button_1.Button variant="outline" size="sm" onClick={handleExportData}>
              <lucide_react_1.Download className="h-4 w-4 mr-2"/>
              Export
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
              Budget Settings
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
              Refresh
            </button_1.Button>
          </div>
        </div>
      </card_1.Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <card_1.Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Cost Trend</h3>
          <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.LineChart data={costData}>
                <recharts_1.XAxis dataKey="date" tickFormatter={function (value) { return (0, date_fns_1.format)(new Date(value), 'MMM dd'); }}/>
                <recharts_1.YAxis tickFormatter={function (value) { return "$".concat(value); }}/>
                <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />} labelFormatter={function (value) { return (0, date_fns_1.format)(new Date(value), 'MMM dd, yyyy'); }}/>
                <recharts_1.Line type="monotone" dataKey="totalCost" stroke="var(--color-totalCost)" strokeWidth={2} dot={{ fill: 'var(--color-totalCost)' }}/>
              </recharts_1.LineChart>
            </recharts_1.ResponsiveContainer>
          </chart_1.ChartContainer>
        </card_1.Card>

        {/* Provider Breakdown */}
        <card_1.Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Cost by Provider</h3>
          <div className="flex items-center justify-center">
            <chart_1.ChartContainer config={chartConfig} className="h-[300px] w-[300px]">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.PieChart>
                  <recharts_1.Pie data={providerBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, ": ").concat((percent * 100).toFixed(0), "%");
    }}>
                    {providerBreakdown.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
                  </recharts_1.Pie>
                  <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />} formatter={function (value) { return ["$".concat(Number(value).toFixed(2)), 'Cost']; }}/>
                </recharts_1.PieChart>
              </recharts_1.ResponsiveContainer>
            </chart_1.ChartContainer>
          </div>
        </card_1.Card>
      </div>

      {/* Model Usage Table */}
      <card_1.Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Model Usage & Costs</h3>
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.Download className="h-4 w-4 mr-2"/>
            Export Details
          </button_1.Button>
        </div>
        
        <div className="overflow-x-auto">
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow>
                <table_1.TableHead>Model</table_1.TableHead>
                <table_1.TableHead>Tokens</table_1.TableHead>
                <table_1.TableHead>Requests</table_1.TableHead>
                <table_1.TableHead>Total Cost</table_1.TableHead>
                <table_1.TableHead>Cost/Request</table_1.TableHead>
                <table_1.TableHead>Trend</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {modelUsage.map(function (model) { return (<table_1.TableRow key={model.modelId}>
                  <table_1.TableCell>
                    <div>
                      <div className="font-medium">{model.modelName}</div>
                      <div className="text-sm text-muted-foreground">{model.provider}</div>
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <div>
                      <div className="font-medium">{model.usage.totalTokens.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        In: {model.usage.inputTokens.toLocaleString()} • 
                        Out: {model.usage.outputTokens.toLocaleString()}
                      </div>
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell className="font-medium">
                    {model.usage.requests.toLocaleString()}
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <div>
                      <div className="font-medium">${model.cost.total.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        In: ${model.cost.inputCost.toFixed(2)} • 
                        Out: ${model.cost.outputCost.toFixed(2)}
                      </div>
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell className="font-medium">
                    ${model.cost.perRequest.toFixed(3)}
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(model.trend.direction)}
                      <span className={"text-sm font-medium ".concat(getTrendColor(model.trend.direction))}>
                        {Math.abs(model.trend.change).toFixed(1)}%
                      </span>
                    </div>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </div>
      </card_1.Card>

      {/* Cost Optimization Recommendations */}
      <card_1.Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Cost Optimization Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <lucide_react_1.AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5"/>
            <div>
              <h4 className="font-medium text-foreground">High OpenAI Usage</h4>
              <p className="text-sm text-muted-foreground mt-1">
                OpenAI accounts for 65% of your costs. Consider using Claude 3.5 Sonnet for similar performance at lower cost.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <lucide_react_1.Target className="h-5 w-5 text-green-600 mt-0.5"/>
            <div>
              <h4 className="font-medium text-foreground">Optimization Opportunity</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your cost per evaluation decreased 8.1% this period. Consider batching similar evaluations to maintain this efficiency.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <lucide_react_1.Zap className="h-5 w-5 text-blue-600 mt-0.5"/>
            <div>
              <h4 className="font-medium text-foreground">Token Optimization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Reduce prompt length by 15-20% to save on input token costs without affecting evaluation quality.
              </p>
            </div>
          </div>
        </div>
      </card_1.Card>
    </div>);
};
exports.CostTrackingDashboard = CostTrackingDashboard;
