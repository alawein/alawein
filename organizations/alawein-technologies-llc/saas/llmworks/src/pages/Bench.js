"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var Navigation_1 = require("@/components/Navigation");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var lucide_react_1 = require("lucide-react");
var seo_1 = require("@/lib/seo");
var analytics_1 = require("@/lib/analytics");
var BenchmarkRunner = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/bench/BenchmarkRunner"); }).then(function (m) { return ({ default: m.BenchmarkRunner }); }); });
var CustomTestBuilder = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/bench/CustomTestBuilder"); }).then(function (m) { return ({ default: m.CustomTestBuilder }); }); });
var ResultsViewer = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/bench/ResultsViewer"); }).then(function (m) { return ({ default: m.ResultsViewer }); }); });
var Bench = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)("overview"), activeTab = _a[0], setActiveTab = _a[1];
    (0, react_1.useEffect)(function () {
        (0, seo_1.setSEO)({
            title: "The Bench | LLM Works",
            description: "Open‑source benchmarking that runs in your browser. MMLU, TruthfulQA, GSM8K, custom tests.",
            path: "/bench",
        });
        (0, seo_1.injectJsonLd)({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "The Bench — AI Benchmarking Suite",
            url: "".concat(window.location.origin, "/bench"),
            description: "Standardized benchmarks and custom tests with auditable reports.",
            isPartOf: {
                "@type": "SoftwareApplication",
                name: "LLM Works",
            },
        }, "ld-bench");
    }, []);
    var benchmarks = [
        {
            id: "mmlu",
            name: "MMLU",
            description: "Massive Multitask Language Understanding - 57 academic subjects",
            tasks: 15459,
            avgTime: "~45 min",
            status: "Ready",
            difficulty: "Advanced",
            color: "bg-accent/10 text-accent"
        },
        {
            id: "truthfulqa",
            name: "TruthfulQA",
            description: "Tests resistance to generating false information and misconceptions",
            tasks: 817,
            avgTime: "~20 min",
            status: "Ready",
            difficulty: "Expert",
            color: "bg-primary/10 text-primary"
        },
        {
            id: "gsm8k",
            name: "GSM8K",
            description: "Grade School Math problems requiring multi-step reasoning",
            tasks: 1319,
            avgTime: "~30 min",
            status: "Ready",
            difficulty: "Intermediate",
            color: "bg-accent/10 text-accent"
        },
        {
            id: "custom",
            name: "Custom Tests",
            description: "Upload your own evaluation datasets and criteria",
            tasks: "Variable",
            avgTime: "Variable",
            status: "Available",
            difficulty: "Custom",
            color: "bg-muted text-muted-foreground"
        }
    ];
    var metrics = [
        { label: "Accuracy", description: "Percentage of correct answers", icon: lucide_react_1.Target },
        { label: "Brier Score", description: "Calibration of confidence scores", icon: lucide_react_1.TrendingUp },
        { label: "Citation Quality", description: "Validity of provided sources", icon: lucide_react_1.CheckCircle },
        { label: "Elo Rating", description: "Dynamic competitive ranking", icon: lucide_react_1.BarChart3 }
    ];
    return (<div className="min-h-screen bg-background">
      <Navigation_1.Navigation />
      
      <main id="main" className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <lucide_react_1.BarChart3 className="h-4 w-4 text-primary"/>
            <span className="text-sm font-medium text-primary neural-text">STANDARDIZED BENCHMARKING</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            THE BENCH — BENCHMARK EVALUATION
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Run standardized benchmarks. Generate detailed reports with performance analysis and audit trails.
          </p>
        </div>

        {/* Benchmark Interface */}
        <tabs_1.Tabs value={activeTab} onValueChange={function (val) { setActiveTab(val); (0, analytics_1.trackEvent)('bench_tab_change', { tab: val }); }} className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-4 mb-8">
            <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="runner">Run Benchmarks</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="custom">Custom Tests</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="results">View Results</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="overview" className="space-y-8">
            {/* Available Benchmarks */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-8">Available Benchmarks</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {benchmarks.map(function (benchmark) { return (<card_1.Card key={benchmark.id} className="p-6 shadow-medium hover:shadow-strong transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{benchmark.name}</h3>
                        <badge_1.Badge variant={benchmark.status === "Ready" ? "default" : "secondary"}>
                          {benchmark.status}
                        </badge_1.Badge>
                      </div>
                      <badge_1.Badge className={benchmark.color}>
                        {benchmark.difficulty}
                      </badge_1.Badge>
                    </div>

                    <p className="text-muted-foreground mb-6">{benchmark.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <lucide_react_1.Target className="h-4 w-4 text-accent"/>
                        <div>
                          <div className="text-sm font-medium text-foreground">{benchmark.tasks}</div>
                          <div className="text-xs text-muted-foreground">Tasks</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <lucide_react_1.Clock className="h-4 w-4 text-accent"/>
                        <div>
                          <div className="text-sm font-medium text-foreground">{benchmark.avgTime}</div>
                          <div className="text-xs text-muted-foreground">Avg Time</div>
                        </div>
                      </div>
                    </div>

                    <button_1.Button variant="gradient" className="w-full group-hover:shadow-glow" onClick={function () { return setActiveTab("runner"); }}>
                      <lucide_react_1.Play className="h-4 w-4"/>
                      Run Benchmark
                    </button_1.Button>
                  </card_1.Card>); })}
              </div>
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="runner">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Benchmark Runner..."/>}>
              <BenchmarkRunner />
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="custom">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Custom Test Builder..."/>}>
              <CustomTestBuilder />
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="results">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Results Viewer..."/>}>
              <ResultsViewer />
            </react_1.Suspense>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>

        {/* Evaluation Metrics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Evaluation Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map(function (metric, index) { return (<card_1.Card key={index} className="p-6 text-center shadow-medium hover:shadow-strong transition-all duration-300">
                <metric.icon className="h-8 w-8 text-accent mx-auto mb-4"/>
                <h3 className="text-lg font-bold text-foreground mb-2">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </card_1.Card>); })}
          </div>
        </div>

        {/* Quick Actions */}
        <card_1.Card className="p-8 gradient-surface shadow-medium">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">Start Benchmarking</h3>
              <p className="text-muted-foreground mb-4">
                Select your models, choose your benchmarks, and generate detailed evaluation reports 
                with performance analytics and detailed reporting.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <lucide_react_1.BarChart3 className="h-4 w-4 text-primary"/>
                  <span className="text-sm text-muted-foreground">Automated scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <lucide_react_1.TrendingUp className="h-4 w-4 text-primary"/>
                  <span className="text-sm text-muted-foreground">Performance tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <lucide_react_1.Download className="h-4 w-4 text-primary"/>
                  <span className="text-sm text-muted-foreground">Exportable reports</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button_1.Button variant="hero" size="lg">
                <lucide_react_1.Settings className="h-4 w-4"/>
                Configure Evaluation
                <lucide_react_1.ArrowRight className="h-4 w-4"/>
              </button_1.Button>
              <button_1.Button variant="outline">
                View Sample Reports
              </button_1.Button>
            </div>
          </div>
        </card_1.Card>
      </main>
    </div>);
});
Bench.displayName = 'Bench';
exports.default = Bench;
