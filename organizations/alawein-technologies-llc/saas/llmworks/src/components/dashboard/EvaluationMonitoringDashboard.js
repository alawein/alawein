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
exports.EvaluationMonitoringDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var select_1 = require("@/components/ui/select");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var lucide_react_1 = require("lucide-react");
var chart_1 = require("@/components/ui/chart");
var recharts_1 = require("recharts");
var analytics_1 = require("@/lib/analytics");
var mockEvaluations = [
    {
        id: 'eval_001',
        name: 'GPT-4 vs Claude Reasoning Test',
        type: 'arena',
        status: 'running',
        progress: 67,
        models: ['GPT-4', 'Claude 3.5 Sonnet'],
        startTime: '2024-01-15T10:30:00Z',
        metrics: {
            totalQuestions: 50,
            completedQuestions: 34,
            successRate: 96.2,
            avgResponseTime: 2.3,
            cost: 4.56,
        },
        queue: {},
    },
    {
        id: 'eval_002',
        name: 'MMLU Mathematics Benchmark',
        type: 'benchmark',
        status: 'running',
        progress: 23,
        models: ['Gemini 1.5 Pro', 'Llama 3.1 70B'],
        startTime: '2024-01-15T09:45:00Z',
        metrics: {
            totalQuestions: 200,
            completedQuestions: 46,
            successRate: 89.1,
            avgResponseTime: 1.8,
            cost: 8.23,
        },
        queue: {},
    },
    {
        id: 'eval_003',
        name: 'Creative Writing Challenge',
        type: 'arena',
        status: 'queued',
        progress: 0,
        models: ['GPT-4', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'],
        startTime: '2024-01-15T11:15:00Z',
        metrics: {
            totalQuestions: 25,
            completedQuestions: 0,
            successRate: 0,
            avgResponseTime: 0,
            cost: 0,
        },
        queue: {
            position: 1,
            estimatedStart: '2024-01-15T12:30:00Z',
        },
    },
    {
        id: 'eval_004',
        name: 'Code Generation Test',
        type: 'custom',
        status: 'completed',
        progress: 100,
        models: ['GPT-4', 'Claude 3.5 Sonnet'],
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T09:30:00Z',
        duration: '1h 30m',
        results: {
            winner: 'GPT-4',
            scores: {
                'GPT-4': 87.5,
                'Claude 3.5 Sonnet': 84.2,
            },
            accuracy: 85.9,
        },
        metrics: {
            totalQuestions: 100,
            completedQuestions: 100,
            successRate: 94.7,
            avgResponseTime: 3.1,
            cost: 12.45,
        },
        queue: {},
    },
    {
        id: 'eval_005',
        name: 'TruthfulQA Evaluation',
        type: 'benchmark',
        status: 'failed',
        progress: 15,
        models: ['GPT-4'],
        startTime: '2024-01-15T07:30:00Z',
        endTime: '2024-01-15T07:45:00Z',
        duration: '15m',
        metrics: {
            totalQuestions: 100,
            completedQuestions: 15,
            successRate: 0,
            avgResponseTime: 0,
            cost: 1.23,
        },
        queue: {},
    },
    {
        id: 'eval_006',
        name: 'Medical Question Analysis',
        type: 'custom',
        status: 'paused',
        progress: 45,
        models: ['GPT-4', 'Claude 3.5 Sonnet'],
        startTime: '2024-01-15T06:00:00Z',
        metrics: {
            totalQuestions: 150,
            completedQuestions: 67,
            successRate: 91.8,
            avgResponseTime: 2.8,
            cost: 8.97,
        },
        queue: {},
    },
];
var mockRealTimeMetrics = [
    { time: '10:00', activeEvaluations: 2, queuedEvaluations: 3, throughput: 45 },
    { time: '10:05', activeEvaluations: 3, queuedEvaluations: 2, throughput: 52 },
    { time: '10:10', activeEvaluations: 2, queuedEvaluations: 4, throughput: 38 },
    { time: '10:15', activeEvaluations: 4, queuedEvaluations: 1, throughput: 67 },
    { time: '10:20', activeEvaluations: 3, queuedEvaluations: 3, throughput: 59 },
    { time: '10:25', activeEvaluations: 2, queuedEvaluations: 2, throughput: 43 },
];
var chartConfig = {
    activeEvaluations: { label: 'Active', color: 'hsl(var(--primary))' },
    queuedEvaluations: { label: 'Queued', color: 'hsl(var(--accent))' },
    throughput: { label: 'Throughput', color: 'hsl(var(--secondary))' },
};
var EvaluationMonitoringDashboard = function () {
    var _a = (0, react_1.useState)(mockEvaluations), evaluations = _a[0], setEvaluations = _a[1];
    var _b = (0, react_1.useState)('all'), statusFilter = _b[0], setStatusFilter = _b[1];
    var _c = (0, react_1.useState)('all'), typeFilter = _c[0], setTypeFilter = _c[1];
    var _d = (0, react_1.useState)(mockRealTimeMetrics), realTimeData = _d[0], setRealTimeData = _d[1];
    var _e = (0, react_1.useState)(new Date()), lastUpdated = _e[0], setLastUpdated = _e[1];
    // Simulate real-time updates
    (0, react_1.useEffect)(function () {
        var interval = setInterval(function () {
            setEvaluations(function (prev) {
                return prev.map(function (evaluation) {
                    if (evaluation.status === 'running' && evaluation.progress < 100) {
                        return __assign(__assign({}, evaluation), { progress: Math.min(100, evaluation.progress + Math.random() * 5), metrics: __assign(__assign({}, evaluation.metrics), { completedQuestions: Math.min(evaluation.metrics.totalQuestions, evaluation.metrics.completedQuestions + Math.floor(Math.random() * 3)), cost: evaluation.metrics.cost + Math.random() * 0.1 }) });
                    }
                    return evaluation;
                });
            });
            // Update real-time metrics
            var newTime = new Date();
            var timeString = newTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            setRealTimeData(function (prev) { return __spreadArray(__spreadArray([], prev.slice(-5), true), [
                {
                    time: timeString,
                    activeEvaluations: Math.floor(Math.random() * 5) + 1,
                    queuedEvaluations: Math.floor(Math.random() * 4) + 1,
                    throughput: Math.floor(Math.random() * 30) + 40,
                },
            ], false); });
            setLastUpdated(new Date());
        }, 3000);
        return function () { return clearInterval(interval); };
    }, []);
    var filteredEvaluations = evaluations.filter(function (evaluation) {
        var matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter;
        var matchesType = typeFilter === 'all' || evaluation.type === typeFilter;
        return matchesStatus && matchesType;
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'running':
                return <lucide_react_1.Play className="h-4 w-4 text-blue-500"/>;
            case 'completed':
                return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'failed':
                return <lucide_react_1.AlertCircle className="h-4 w-4 text-red-500"/>;
            case 'paused':
                return <lucide_react_1.Pause className="h-4 w-4 text-yellow-500"/>;
            case 'queued':
                return <lucide_react_1.Clock className="h-4 w-4 text-gray-500"/>;
            default:
                return null;
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'running':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'queued':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return '';
        }
    };
    var getTypeIcon = function (type) {
        switch (type) {
            case 'arena':
                return <lucide_react_1.Swords className="h-4 w-4"/>;
            case 'benchmark':
                return <lucide_react_1.BarChart3 className="h-4 w-4"/>;
            case 'custom':
                return <lucide_react_1.Lightbulb className="h-4 w-4"/>;
        }
    };
    var handleEvaluationAction = function (action, evaluationId) {
        (0, analytics_1.trackEvent)('evaluation_action', { action: action, evaluationId: evaluationId });
        setEvaluations(function (prev) {
            return prev.map(function (evaluation) {
                if (evaluation.id === evaluationId) {
                    switch (action) {
                        case 'pause':
                            return __assign(__assign({}, evaluation), { status: 'paused' });
                        case 'resume':
                            return __assign(__assign({}, evaluation), { status: 'running' });
                        case 'stop':
                            return __assign(__assign({}, evaluation), { status: 'failed', progress: evaluation.progress });
                        default:
                            return evaluation;
                    }
                }
                return evaluation;
            });
        });
    };
    var runningEvaluations = evaluations.filter(function (e) { return e.status === 'running'; }).length;
    var queuedEvaluations = evaluations.filter(function (e) { return e.status === 'queued'; }).length;
    var completedToday = evaluations.filter(function (e) { return e.status === 'completed'; }).length;
    var totalCost = evaluations.reduce(function (sum, e) { return sum + e.metrics.cost; }, 0);
    return (<div className="space-y-6">
      {/* Real-time Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Running</p>
              <p className="text-2xl font-bold text-blue-600">{runningEvaluations}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Activity className="h-3 w-3 text-blue-500"/>
                <span className="text-xs text-muted-foreground">Active now</span>
              </div>
            </div>
            <lucide_react_1.Play className="h-8 w-8 text-blue-500"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Queued</p>
              <p className="text-2xl font-bold text-yellow-600">{queuedEvaluations}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Timer className="h-3 w-3 text-yellow-500"/>
                <span className="text-xs text-muted-foreground">Waiting</span>
              </div>
            </div>
            <lucide_react_1.Clock className="h-8 w-8 text-yellow-500"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{completedToday}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.TrendingUp className="h-3 w-3 text-green-500"/>
                <span className="text-xs text-green-600">+3 vs yesterday</span>
              </div>
            </div>
            <lucide_react_1.CheckCircle className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>

        <card_1.Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <lucide_react_1.Target className="h-3 w-3 text-primary"/>
                <span className="text-xs text-muted-foreground">This session</span>
              </div>
            </div>
            <lucide_react_1.Zap className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
      </div>

      {/* Real-time Chart */}
      <card_1.Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Real-time Activity</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <lucide_react_1.RefreshCw className="h-4 w-4"/>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <chart_1.ChartContainer config={chartConfig} className="h-[200px]">
          <recharts_1.ResponsiveContainer width="100%" height="100%">
            <recharts_1.LineChart data={realTimeData}>
              <recharts_1.XAxis dataKey="time"/>
              <recharts_1.YAxis />
              <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
              <recharts_1.Line type="monotone" dataKey="activeEvaluations" stroke="var(--color-activeEvaluations)" strokeWidth={2} dot={{ fill: 'var(--color-activeEvaluations)' }}/>
              <recharts_1.Line type="monotone" dataKey="throughput" stroke="var(--color-throughput)" strokeWidth={2} dot={{ fill: 'var(--color-throughput)' }}/>
            </recharts_1.LineChart>
          </recharts_1.ResponsiveContainer>
        </chart_1.ChartContainer>
      </card_1.Card>

      {/* Filters */}
      <card_1.Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-4">
            <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
              <select_1.SelectTrigger className="w-40">
                <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
                <select_1.SelectValue placeholder="All Status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                <select_1.SelectItem value="running">Running</select_1.SelectItem>
                <select_1.SelectItem value="queued">Queued</select_1.SelectItem>
                <select_1.SelectItem value="completed">Completed</select_1.SelectItem>
                <select_1.SelectItem value="paused">Paused</select_1.SelectItem>
                <select_1.SelectItem value="failed">Failed</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>

            <select_1.Select value={typeFilter} onValueChange={setTypeFilter}>
              <select_1.SelectTrigger className="w-40">
                <select_1.SelectValue placeholder="All Types"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Types</select_1.SelectItem>
                <select_1.SelectItem value="arena">Arena</select_1.SelectItem>
                <select_1.SelectItem value="benchmark">Benchmark</select_1.SelectItem>
                <select_1.SelectItem value="custom">Custom</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredEvaluations.length} of {evaluations.length} evaluations
          </div>
        </div>
      </card_1.Card>

      {/* Evaluations List */}
      <div className="space-y-4">
        {filteredEvaluations.map(function (evaluation) { return (<card_1.Card key={evaluation.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(evaluation.type)}
                  <div>
                    <h3 className="font-semibold text-foreground">{evaluation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {evaluation.models.join(' vs ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <badge_1.Badge className={getStatusColor(evaluation.status)}>
                    {getStatusIcon(evaluation.status)}
                    {evaluation.status}
                  </badge_1.Badge>
                  {evaluation.queue.position && (<badge_1.Badge variant="outline">
                      Queue #{evaluation.queue.position}
                    </badge_1.Badge>)}
                </div>
              </div>

              {/* Progress */}
              {evaluation.status === 'running' && (<div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress: {evaluation.metrics.completedQuestions} / {evaluation.metrics.totalQuestions}
                    </span>
                    <span className="font-medium">{evaluation.progress.toFixed(1)}%</span>
                  </div>
                  <progress_1.Progress value={evaluation.progress} className="h-2"/>
                </div>)}

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-medium">{evaluation.metrics.successRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Response</p>
                  <p className="font-medium">{evaluation.metrics.avgResponseTime.toFixed(1)}s</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-medium">${evaluation.metrics.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {evaluation.duration ||
                "".concat(Math.floor((Date.now() - new Date(evaluation.startTime).getTime()) / 60000), "m")}
                  </p>
                </div>
              </div>

              {/* Results */}
              {evaluation.results && (<div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Results</p>
                      {evaluation.results.winner && (<p className="font-medium">Winner: {evaluation.results.winner}</p>)}
                      {evaluation.results.accuracy && (<p className="text-sm">Accuracy: {evaluation.results.accuracy}%</p>)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Scores</p>
                      {Object.entries(evaluation.results.scores).map(function (_a) {
                    var model = _a[0], score = _a[1];
                    return (<p key={model} className="text-sm font-medium">
                          {model}: {score}%
                        </p>);
                })}
                    </div>
                  </div>
                </div>)}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Started: {new Date(evaluation.startTime).toLocaleString()}
                  {evaluation.queue.estimatedStart && (<span className="ml-2">
                      • Est. start: {new Date(evaluation.queue.estimatedStart).toLocaleString()}
                    </span>)}
                </div>
                <div className="flex gap-2">
                  {evaluation.status === 'running' && (<>
                      <button_1.Button size="sm" variant="outline" onClick={function () { return handleEvaluationAction('pause', evaluation.id); }}>
                        <lucide_react_1.Pause className="h-4 w-4 mr-1"/>
                        Pause
                      </button_1.Button>
                      <alert_dialog_1.AlertDialog>
                        <alert_dialog_1.AlertDialogTrigger asChild>
                          <button_1.Button size="sm" variant="outline">
                            <lucide_react_1.Square className="h-4 w-4 mr-1"/>
                            Stop
                          </button_1.Button>
                        </alert_dialog_1.AlertDialogTrigger>
                        <alert_dialog_1.AlertDialogContent>
                          <alert_dialog_1.AlertDialogHeader>
                            <alert_dialog_1.AlertDialogTitle>Stop Evaluation?</alert_dialog_1.AlertDialogTitle>
                            <alert_dialog_1.AlertDialogDescription>
                              This will permanently stop the evaluation and you'll lose current progress.
                            </alert_dialog_1.AlertDialogDescription>
                          </alert_dialog_1.AlertDialogHeader>
                          <alert_dialog_1.AlertDialogFooter>
                            <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                            <alert_dialog_1.AlertDialogAction onClick={function () { return handleEvaluationAction('stop', evaluation.id); }}>
                              Stop Evaluation
                            </alert_dialog_1.AlertDialogAction>
                          </alert_dialog_1.AlertDialogFooter>
                        </alert_dialog_1.AlertDialogContent>
                      </alert_dialog_1.AlertDialog>
                    </>)}
                  {evaluation.status === 'paused' && (<button_1.Button size="sm" variant="outline" onClick={function () { return handleEvaluationAction('resume', evaluation.id); }}>
                      <lucide_react_1.Play className="h-4 w-4 mr-1"/>
                      Resume
                    </button_1.Button>)}
                  {(evaluation.status === 'completed' || evaluation.status === 'failed') && (<>
                      <button_1.Button size="sm" variant="outline">
                        <lucide_react_1.Eye className="h-4 w-4 mr-1"/>
                        View Details
                      </button_1.Button>
                      <button_1.Button size="sm" variant="outline">
                        <lucide_react_1.Download className="h-4 w-4 mr-1"/>
                        Export
                      </button_1.Button>
                    </>)}
                </div>
              </div>
            </div>
          </card_1.Card>); })}
      </div>

      {filteredEvaluations.length === 0 && (<div className="text-center py-12">
          <lucide_react_1.Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
          <h3 className="text-lg font-medium text-foreground mb-2">No evaluations found</h3>
          <p className="text-muted-foreground">
            {statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Start your first evaluation to see activity here.'}
          </p>
        </div>)}
    </div>);
};
exports.EvaluationMonitoringDashboard = EvaluationMonitoringDashboard;
