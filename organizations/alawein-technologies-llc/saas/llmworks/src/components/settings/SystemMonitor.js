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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMonitor = void 0;
var react_1 = require("react");
var OverviewCards_1 = require("./system-monitor/OverviewCards");
var ServiceStatus_1 = require("./system-monitor/ServiceStatus");
var ActiveEvaluations_1 = require("./system-monitor/ActiveEvaluations");
var PerformanceTrends_1 = require("./system-monitor/PerformanceTrends");
var SystemMonitor = function () {
    var _a = (0, react_1.useState)([
        { service: "Arena Service", status: "operational", responseTime: 45, uptime: 99.9 },
        { service: "Bench Service", status: "operational", responseTime: 62, uptime: 99.8 },
        { service: "Model Gateway", status: "degraded", responseTime: 120, uptime: 98.5 },
        { service: "Database", status: "operational", responseTime: 23, uptime: 99.9 },
        { service: "Authentication", status: "operational", responseTime: 31, uptime: 100 }
    ]), systemStatus = _a[0], setSystemStatus = _a[1];
    var _b = (0, react_1.useState)([
        {
            id: "eval-1",
            name: "MMLU Full Suite",
            type: "benchmark",
            progress: 67,
            estimatedTime: "12 min remaining",
            models: ["GPT-4o", "Claude 3.5 Sonnet"]
        },
        {
            id: "eval-2",
            name: "Climate Change Debate",
            type: "arena",
            progress: 34,
            estimatedTime: "8 min remaining",
            models: ["Gemini 1.5 Pro", "Llama 3.1 70B"]
        }
    ]), activeEvaluations = _b[0], setActiveEvaluations = _b[1];
    var _c = (0, react_1.useState)({
        totalEvaluations: 2847,
        activeUsers: 156,
        systemLoad: 73,
        avgResponseTime: 58
    }), metrics = _c[0], setMetrics = _c[1];
    (0, react_1.useEffect)(function () {
        // Simulate real-time updates
        var interval = setInterval(function () {
            setActiveEvaluations(function (prev) {
                return prev.map(function (evaluation) { return (__assign(__assign({}, evaluation), { progress: Math.min(100, evaluation.progress + Math.random() * 5) })); });
            });
            setMetrics(function (prev) { return (__assign(__assign({}, prev), { systemLoad: Math.max(30, Math.min(95, prev.systemLoad + (Math.random() - 0.5) * 10)), avgResponseTime: Math.max(20, Math.min(150, prev.avgResponseTime + (Math.random() - 0.5) * 20)) })); });
        }, 3000);
        return function () { return clearInterval(interval); };
    }, []);
    return (<div className="space-y-6">
      <OverviewCards_1.OverviewCards metrics={metrics}/>

      <ServiceStatus_1.ServiceStatus systemStatus={systemStatus}/>

      <ActiveEvaluations_1.ActiveEvaluationsCard activeEvaluations={activeEvaluations}/>

      <PerformanceTrends_1.PerformanceTrends />
    </div>);
};
exports.SystemMonitor = SystemMonitor;
