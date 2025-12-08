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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var performance_1 = require("@/lib/performance");
var service_worker_1 = require("@/lib/service-worker");
exports.PerformanceDashboard = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)({
        score: 0,
        metrics: {},
        swStatus: { supported: false, registered: false, active: false, waiting: false },
        offline: false,
    }), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, score, metrics, swStatus, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            (0, performance_1.getPerformanceScore)(),
                            (0, performance_1.getPerformanceMetrics)(),
                            (0, service_worker_1.getSwStatus)(),
                        ])];
                case 1:
                    _a = _b.sent(), score = _a[0], metrics = _a[1], swStatus = _a[2];
                    setData({
                        score: score,
                        metrics: metrics,
                        swStatus: swStatus,
                        offline: (0, service_worker_1.isOffline)(),
                    });
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error('[PerformanceDashboard] Failed to load data:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        loadData();
        // Refresh data every 30 seconds
        var interval = setInterval(loadData, 30000);
        return function () { return clearInterval(interval); };
    }, []);
    var getScoreColor = function (score) {
        if (score >= 90)
            return "text-green-600";
        if (score >= 70)
            return "text-yellow-600";
        return "text-red-600";
    };
    var getScoreVariant = function (score) {
        if (score >= 90)
            return "default";
        if (score >= 70)
            return "secondary";
        return "destructive";
    };
    var formatTime = function (ms) {
        if (ms === undefined)
            return "N/A";
        if (ms < 1000)
            return "".concat(Math.round(ms), "ms");
        return "".concat((ms / 1000).toFixed(2), "s");
    };
    if (isLoading) {
        return (<card_1.Card className="p-6">
        <div className="flex items-center justify-center">
          <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin text-primary mr-2"/>
          <span>Loading performance data...</span>
        </div>
      </card_1.Card>);
    }
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
          <p className="text-muted-foreground">Real-time performance monitoring and Core Web Vitals</p>
        </div>
        <div className="flex items-center gap-2">
          {data.offline ? (<badge_1.Badge variant="destructive" className="flex items-center gap-1">
              <lucide_react_1.WifiOff className="h-3 w-3"/>
              Offline
            </badge_1.Badge>) : (<badge_1.Badge variant="default" className="flex items-center gap-1">
              <lucide_react_1.Wifi className="h-3 w-3"/>
              Online
            </badge_1.Badge>)}
          <button_1.Button variant="outline" size="sm" onClick={loadData}>
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Refresh
          </button_1.Button>
        </div>
      </div>

      {/* Performance Score Overview */}
      <card_1.Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Performance Score</h3>
          <badge_1.Badge variant={getScoreVariant(data.score)} className="text-lg px-3 py-1">
            {data.score}/100
          </badge_1.Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className={"h-3 rounded-full transition-all duration-300 ".concat(data.score >= 90 ? "bg-green-600" :
            data.score >= 70 ? "bg-yellow-600" : "bg-red-600")} style={{ width: "".concat(data.score, "%") }}/>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-green-600">Good</div>
            <div className="text-muted-foreground">90-100</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-yellow-600">Needs Improvement</div>
            <div className="text-muted-foreground">50-89</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-600">Poor</div>
            <div className="text-muted-foreground">0-49</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Current</div>
            <div className={"font-bold ".concat(getScoreColor(data.score))}>{data.score}</div>
          </div>
        </div>
      </card_1.Card>

      <tabs_1.Tabs defaultValue="vitals" className="w-full">
        <tabs_1.TabsList className="grid w-full grid-cols-3">
          <tabs_1.TabsTrigger value="vitals">Core Web Vitals</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="caching">Caching & SW</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="resources">Resource Analysis</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="vitals" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Largest Contentful Paint */}
            <card_1.Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <lucide_react_1.Eye className="h-4 w-4 text-primary"/>
                <span className="font-medium">LCP</span>
              </div>
              <div className="text-2xl font-bold">
                {formatTime(data.metrics.lcp)}
              </div>
              <p className="text-xs text-muted-foreground">Largest Contentful Paint</p>
              <div className="mt-2">
                <badge_1.Badge variant={!data.metrics.lcp ? "secondary" :
            data.metrics.lcp <= 2500 ? "default" :
                data.metrics.lcp <= 4000 ? "secondary" : "destructive"} className="text-xs">
                  {!data.metrics.lcp ? "Loading..." :
            data.metrics.lcp <= 2500 ? "Good" :
                data.metrics.lcp <= 4000 ? "Needs Improvement" : "Poor"}
                </badge_1.Badge>
              </div>
            </card_1.Card>

            {/* First Input Delay */}
            <card_1.Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <lucide_react_1.Zap className="h-4 w-4 text-primary"/>
                <span className="font-medium">FID</span>
              </div>
              <div className="text-2xl font-bold">
                {formatTime(data.metrics.fid)}
              </div>
              <p className="text-xs text-muted-foreground">First Input Delay</p>
              <div className="mt-2">
                <badge_1.Badge variant={!data.metrics.fid ? "secondary" :
            data.metrics.fid <= 100 ? "default" :
                data.metrics.fid <= 300 ? "secondary" : "destructive"} className="text-xs">
                  {!data.metrics.fid ? "Loading..." :
            data.metrics.fid <= 100 ? "Good" :
                data.metrics.fid <= 300 ? "Needs Improvement" : "Poor"}
                </badge_1.Badge>
              </div>
            </card_1.Card>

            {/* Cumulative Layout Shift */}
            <card_1.Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <lucide_react_1.TrendingUp className="h-4 w-4 text-primary"/>
                <span className="font-medium">CLS</span>
              </div>
              <div className="text-2xl font-bold">
                {data.metrics.cls ? data.metrics.cls.toFixed(3) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Cumulative Layout Shift</p>
              <div className="mt-2">
                <badge_1.Badge variant={!data.metrics.cls ? "secondary" :
            data.metrics.cls <= 0.1 ? "default" :
                data.metrics.cls <= 0.25 ? "secondary" : "destructive"} className="text-xs">
                  {!data.metrics.cls ? "Loading..." :
            data.metrics.cls <= 0.1 ? "Good" :
                data.metrics.cls <= 0.25 ? "Needs Improvement" : "Poor"}
                </badge_1.Badge>
              </div>
            </card_1.Card>

            {/* Time to First Byte */}
            <card_1.Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <lucide_react_1.Clock className="h-4 w-4 text-primary"/>
                <span className="font-medium">TTFB</span>
              </div>
              <div className="text-2xl font-bold">
                {formatTime(data.metrics.ttfb)}
              </div>
              <p className="text-xs text-muted-foreground">Time to First Byte</p>
              <div className="mt-2">
                <badge_1.Badge variant={!data.metrics.ttfb ? "secondary" :
            data.metrics.ttfb <= 200 ? "default" :
                data.metrics.ttfb <= 500 ? "secondary" : "destructive"} className="text-xs">
                  {!data.metrics.ttfb ? "Loading..." :
            data.metrics.ttfb <= 200 ? "Good" :
                data.metrics.ttfb <= 500 ? "Needs Improvement" : "Poor"}
                </badge_1.Badge>
              </div>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="caching" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Service Worker Status */}
            <card_1.Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <lucide_react_1.Activity className="h-5 w-5"/>
                Service Worker Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Supported</span>
                  {data.swStatus.supported ? (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>) : (<lucide_react_1.AlertTriangle className="h-4 w-4 text-red-600"/>)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Registered</span>
                  {data.swStatus.registered ? (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>) : (<lucide_react_1.AlertTriangle className="h-4 w-4 text-red-600"/>)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Active</span>
                  {data.swStatus.active ? (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>) : (<lucide_react_1.AlertTriangle className="h-4 w-4 text-red-600"/>)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Update Available</span>
                  {data.swStatus.waiting ? (<lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-600"/>) : (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>)}
                </div>
              </div>
            </card_1.Card>

            {/* Connection Status */}
            <card_1.Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {data.offline ? (<lucide_react_1.WifiOff className="h-5 w-5 text-red-600"/>) : (<lucide_react_1.Wifi className="h-5 w-5 text-green-600"/>)}
                Connection Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <badge_1.Badge variant={data.offline ? "destructive" : "default"}>
                    {data.offline ? "Offline" : "Online"}
                  </badge_1.Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Caching</span>
                  <badge_1.Badge variant={data.swStatus.active ? "default" : "secondary"}>
                    {data.swStatus.active ? "Active" : "Inactive"}
                  </badge_1.Badge>
                </div>
              </div>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="resources">
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Resource Analysis</h3>
              <button_1.Button variant="outline" size="sm" onClick={performance_1.analyzeResourceTiming}>
                <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
                Analyze Resources
              </button_1.Button>
            </div>
            <p className="text-muted-foreground">
              Click "Analyze Resources" to see detailed resource timing analysis in the console.
              This will show the slowest loading resources and resource type breakdown.
            </p>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
});
exports.PerformanceDashboard.displayName = 'PerformanceDashboard';
