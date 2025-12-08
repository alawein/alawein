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
exports.BenchmarkRunner = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var checkbox_1 = require("@/components/ui/checkbox");
var lucide_react_1 = require("lucide-react");
var BenchmarkRunner = function () {
    var _a, _b, _c;
    var _d = (0, react_1.useState)([]), selectedModels = _d[0], setSelectedModels = _d[1];
    var _e = (0, react_1.useState)([]), selectedBenchmarks = _e[0], setSelectedBenchmarks = _e[1];
    var _f = (0, react_1.useState)(false), isRunning = _f[0], setIsRunning = _f[1];
    var _g = (0, react_1.useState)(null), progress = _g[0], setProgress = _g[1];
    var _h = (0, react_1.useState)([]), results = _h[0], setResults = _h[1];
    var _j = (0, react_1.useState)(false), showResults = _j[0], setShowResults = _j[1];
    var models = [
        { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
        { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
        { id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "Meta" }
    ];
    var benchmarks = [
        {
            id: "mmlu",
            name: "MMLU",
            description: "57 academic subjects",
            tasks: 15459,
            estimatedTime: "45 min",
            difficulty: "Advanced"
        },
        {
            id: "truthfulqa",
            name: "TruthfulQA",
            description: "Truthfulness evaluation",
            tasks: 817,
            estimatedTime: "20 min",
            difficulty: "Expert"
        },
        {
            id: "gsm8k",
            name: "GSM8K",
            description: "Grade school math",
            tasks: 1319,
            estimatedTime: "30 min",
            difficulty: "Intermediate"
        }
    ];
    var toggleModelSelection = function (modelId) {
        setSelectedModels(function (prev) {
            return prev.includes(modelId)
                ? prev.filter(function (id) { return id !== modelId; })
                : __spreadArray(__spreadArray([], prev, true), [modelId], false);
        });
    };
    var toggleBenchmarkSelection = function (benchmarkId) {
        setSelectedBenchmarks(function (prev) {
            return prev.includes(benchmarkId)
                ? prev.filter(function (id) { return id !== benchmarkId; })
                : __spreadArray(__spreadArray([], prev, true), [benchmarkId], false);
        });
    };
    var startBenchmark = function () { return __awaiter(void 0, void 0, void 0, function () {
        var totalTasks, currentTask, _loop_1, _i, selectedModels_1, modelId, mockResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedModels.length === 0 || selectedBenchmarks.length === 0)
                        return [2 /*return*/];
                    setIsRunning(true);
                    setResults([]);
                    setShowResults(false);
                    totalTasks = selectedBenchmarks.reduce(function (sum, benchmarkId) {
                        var benchmark = benchmarks.find(function (b) { return b.id === benchmarkId; });
                        return sum + ((benchmark === null || benchmark === void 0 ? void 0 : benchmark.tasks) || 0);
                    }, 0) * selectedModels.length;
                    currentTask = 0;
                    _loop_1 = function (modelId) {
                        var model, _loop_2, _b, selectedBenchmarks_1, benchmarkId;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    model = models.find(function (m) { return m.id === modelId; });
                                    _loop_2 = function (benchmarkId) {
                                        var benchmark, i;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    benchmark = benchmarks.find(function (b) { return b.id === benchmarkId; });
                                                    if (!benchmark || !model)
                                                        return [2 /*return*/, "continue"];
                                                    i = 0;
                                                    _d.label = 1;
                                                case 1:
                                                    if (!(i < benchmark.tasks)) return [3 /*break*/, 4];
                                                    currentTask++;
                                                    setProgress({
                                                        current: currentTask,
                                                        total: totalTasks,
                                                        currentTask: "".concat(benchmark.name, " - Task ").concat(i + 1),
                                                        model: model.name
                                                    });
                                                    // Simulate processing time
                                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                                                case 2:
                                                    // Simulate processing time
                                                    _d.sent();
                                                    _d.label = 3;
                                                case 3:
                                                    i++;
                                                    return [3 /*break*/, 1];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _b = 0, selectedBenchmarks_1 = selectedBenchmarks;
                                    _c.label = 1;
                                case 1:
                                    if (!(_b < selectedBenchmarks_1.length)) return [3 /*break*/, 4];
                                    benchmarkId = selectedBenchmarks_1[_b];
                                    return [5 /*yield**/, _loop_2(benchmarkId)];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _b++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, selectedModels_1 = selectedModels;
                    _a.label = 1;
                case 1:
                    if (!(_i < selectedModels_1.length)) return [3 /*break*/, 4];
                    modelId = selectedModels_1[_i];
                    return [5 /*yield**/, _loop_1(modelId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    mockResults = selectedModels.map(function (modelId) {
                        var model = models.find(function (m) { return m.id === modelId; });
                        return {
                            model: (model === null || model === void 0 ? void 0 : model.name) || modelId,
                            accuracy: Math.random() * 0.3 + 0.7, // 70-100%
                            brierScore: Math.random() * 0.2 + 0.1, // 0.1-0.3 (lower is better)
                            citationQuality: Math.random() * 0.25 + 0.75, // 75-100%
                            avgTime: Math.random() * 2000 + 1000, // 1-3 seconds
                            eloRating: Math.random() * 400 + 1000 // 1000-1400
                        };
                    }).sort(function (a, b) { return b.accuracy - a.accuracy; });
                    setResults(mockResults);
                    setIsRunning(false);
                    setProgress(null);
                    setShowResults(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var exportResults = function () {
        var data = {
            timestamp: new Date().toISOString(),
            benchmarks: selectedBenchmarks,
            results: results
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "benchmark-results-".concat(Date.now(), ".json");
        a.click();
    };
    return (<div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <card_1.Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <lucide_react_1.Target className="h-5 w-5 text-primary"/>
            <h3 className="text-lg font-bold text-foreground">Select Models</h3>
          </div>
          
          <div className="space-y-3">
            {models.map(function (model) { return (<div key={model.id} className="flex items-center space-x-2">
                <checkbox_1.Checkbox id={model.id} checked={selectedModels.includes(model.id)} onCheckedChange={function () { return toggleModelSelection(model.id); }}/>
                <label htmlFor={model.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{model.name}</span>
                    <badge_1.Badge variant="outline" className="text-xs">{model.provider}</badge_1.Badge>
                  </div>
                </label>
              </div>); })}
          </div>
        </card_1.Card>

        {/* Benchmark Selection */}
        <card_1.Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <lucide_react_1.BarChart3 className="h-5 w-5 text-accent"/>
            <h3 className="text-lg font-bold text-foreground">Select Benchmarks</h3>
          </div>
          
          <div className="space-y-3">
            {benchmarks.map(function (benchmark) { return (<div key={benchmark.id} className="flex items-center space-x-2">
                <checkbox_1.Checkbox id={benchmark.id} checked={selectedBenchmarks.includes(benchmark.id)} onCheckedChange={function () { return toggleBenchmarkSelection(benchmark.id); }}/>
                <label htmlFor={benchmark.id} className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{benchmark.name}</span>
                      <badge_1.Badge className={benchmark.difficulty === "Expert" ? "bg-accent/10 text-accent" :
                benchmark.difficulty === "Advanced" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"}>
                        {benchmark.difficulty}
                      </badge_1.Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {benchmark.description} • {benchmark.tasks.toLocaleString()} tasks • {benchmark.estimatedTime}
                    </div>
                  </div>
                </label>
              </div>); })}
          </div>
        </card_1.Card>
      </div>

      {/* Control Panel */}
      <card_1.Card className="p-6 gradient-surface">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Benchmark Execution</h3>
            <p className="text-sm text-muted-foreground">
              {selectedModels.length} model(s) × {selectedBenchmarks.length} benchmark(s) selected
            </p>
          </div>
          <div className="flex gap-2">
            <button_1.Button onClick={startBenchmark} disabled={selectedModels.length === 0 || selectedBenchmarks.length === 0 || isRunning} variant="gradient">
              <lucide_react_1.Play className="h-4 w-4"/>
              {isRunning ? "Running..." : "Start Benchmark"}
            </button_1.Button>
            {showResults && (<button_1.Button onClick={exportResults} variant="outline">
                <lucide_react_1.Download className="h-4 w-4"/>
                Export Results
              </button_1.Button>)}
          </div>
        </div>

        {/* Progress Display */}
        {progress && (<div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                {progress.model} • {progress.currentTask}
              </span>
              <span className="text-muted-foreground">
                {progress.current.toLocaleString()} / {progress.total.toLocaleString()} tasks
              </span>
            </div>
            <progress_1.Progress value={(progress.current / progress.total) * 100} className="h-2"/>
          </div>)}
      </card_1.Card>

      {/* Results Display */}
      {showResults && results.length > 0 && (<div className="space-y-6">
          {/* Leaderboard */}
          <card_1.Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <lucide_react_1.TrendingUp className="h-5 w-5 text-primary"/>
              <h3 className="text-lg font-bold text-foreground">Benchmark Results</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-sm font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-2 text-sm font-medium text-muted-foreground">Model</th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">Accuracy</th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">Brier Score</th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">Citation Quality</th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">Avg Time (ms)</th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">Elo Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(function (result, index) { return (<tr key={result.model} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {index === 0 && <lucide_react_1.CheckCircle className="h-4 w-4 text-accent"/>}
                          <span className="font-medium text-foreground">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-foreground">{result.model}</span>
                      </td>
                      <td className="py-3 text-center">
                        <badge_1.Badge className="bg-primary/10 text-primary">
                          {(result.accuracy * 100).toFixed(1)}%
                        </badge_1.Badge>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-foreground">{result.brierScore.toFixed(3)}</span>
                      </td>
                      <td className="py-3 text-center">
                        <badge_1.Badge className="bg-accent/10 text-accent">
                          {(result.citationQuality * 100).toFixed(1)}%
                        </badge_1.Badge>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-muted-foreground">{Math.round(result.avgTime)}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="font-medium text-foreground">{Math.round(result.eloRating)}</span>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>
          </card_1.Card>

          {/* Performance Insights */}
          <card_1.Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.AlertTriangle className="h-5 w-5 text-accent"/>
              <h3 className="text-lg font-bold text-foreground">Performance Insights</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Key Findings</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• {(_a = results[0]) === null || _a === void 0 ? void 0 : _a.model} achieved highest accuracy at {(((_b = results[0]) === null || _b === void 0 ? void 0 : _b.accuracy) * 100).toFixed(1)}%</p>
                  <p>• Average citation quality across models: {((results.reduce(function (sum, r) { return sum + r.citationQuality; }, 0) / results.length) * 100).toFixed(1)}%</p>
                  <p>• Fastest model: {(_c = results.sort(function (a, b) { return a.avgTime - b.avgTime; })[0]) === null || _c === void 0 ? void 0 : _c.model}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recommendations</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Consider model ensemble for optimal performance</p>
                  <p>• Monitor citation quality for factual accuracy</p>
                  <p>• Track performance trends over time</p>
                </div>
              </div>
            </div>
          </card_1.Card>
        </div>)}
    </div>);
};
exports.BenchmarkRunner = BenchmarkRunner;
