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
var DebateMode = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/arena/DebateMode"); }).then(function (m) { return ({ default: m.DebateMode }); }); });
var CreativeSandbox = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/arena/CreativeSandbox"); }).then(function (m) { return ({ default: m.CreativeSandbox }); }); });
var ExplanationChallenge = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/arena/ExplanationChallenge"); }).then(function (m) { return ({ default: m.ExplanationChallenge }); }); });
var EnhancedDebateArena = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/arena/EnhancedDebateArena"); }).then(function (m) { return ({ default: m.EnhancedDebateArena }); }); });
var DemoScenarios = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/arena/DemoScenarios"); }).then(function (m) { return ({ default: m.DemoScenarios }); }); });
var Arena = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)("overview"), activeMode = _a[0], setActiveMode = _a[1];
    var _b = (0, react_1.useState)(null), selectedDemo = _b[0], setSelectedDemo = _b[1];
    var _c = (0, react_1.useState)(false), isDemoPlaying = _c[0], setIsDemoPlaying = _c[1];
    (0, react_1.useEffect)(function () {
        (0, seo_1.setSEO)({
            title: "The Arena | LLM Works",
            description: "Open‑source interactive evaluation that runs in your browser. Debates, creative tasks, explanations.",
            path: "/arena",
        });
        (0, seo_1.injectJsonLd)({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "The Arena — Interactive AI Evaluation",
            url: "".concat(window.location.origin, "/arena"),
            description: "Local‑first multi‑agent testing: debates, creative, explanations.",
            isPartOf: {
                "@type": "SoftwareApplication",
                name: "LLM Works",
            },
        }, "ld-arena");
    }, []);
    var modes = [
        {
            id: "debate",
            icon: lucide_react_1.Swords,
            title: "Debate Mode",
            description: "Pit models against each other in structured debates",
            features: ["Proponent vs Skeptic", "Citation Requirements", "Multi-round scoring"],
            status: "Available",
            color: "bg-accent/10 text-accent"
        },
        {
            id: "enhanced-debate",
            icon: lucide_react_1.Trophy,
            title: "Neural Arena",
            description: "Epic AI battles with real-time combat visualization",
            features: ["AI Personality Avatars", "Epic Confrontation Effects", "Battle State Animations"],
            status: "Available",
            color: "bg-yellow-500/10 text-yellow-600"
        },
        {
            id: "creative",
            icon: lucide_react_1.Lightbulb,
            title: "Creative Sandbox",
            description: "Collaborative creative tasks with iterative refinement",
            features: ["Creator + Refiner roles", "Brand voice adherence", "Creative scoring"],
            status: "Available",
            color: "bg-primary/10 text-primary"
        },
        {
            id: "explanation",
            icon: lucide_react_1.GraduationCap,
            title: "Explanation Challenge",
            description: "Test adaptive explanation abilities",
            features: ["Expert + Student roles", "Clarity optimization", "Empathy scoring"],
            status: "Available",
            color: "bg-accent/10 text-accent"
        }
    ];
    return (<div className="min-h-screen bg-background">
      <Navigation_1.Navigation />
      
      <main id="main" className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <lucide_react_1.Swords className="h-4 w-4 text-accent"/>
            <span className="text-sm font-medium text-accent neural-text">INTERACTIVE EVALUATION</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            THE ARENA — INTERACTIVE TESTING
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test models through debates, creative tasks, and explanations. Get comparative analysis through structured interactions.
          </p>
        </div>

        {/* Interactive Arena */}
        <tabs_1.Tabs value={activeMode} onValueChange={function (val) { setActiveMode(val); (0, analytics_1.trackEvent)('arena_tab_change', { tab: val }); }} className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-6 mb-8">
            <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="scenarios">Demo Scenarios</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="debate">Debate Mode</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="enhanced-debate">Neural Arena</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="creative">Creative Sandbox</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="explanation">Explanation Challenge</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="overview" className="space-y-8">
            {/* Interaction Modes */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {modes.map(function (mode) { return (<card_1.Card key={mode.id} className="p-8 shadow-medium hover:shadow-strong transition-all duration-300 group">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className={"p-3 rounded-lg ".concat(mode.color.split(' text-')[0], " group-hover:scale-110 transition-transform")}>
                        <mode.icon className={"h-8 w-8 ".concat(mode.color.split(' ')[1])}/>
                      </div>
                      <badge_1.Badge variant={mode.status === "Available" ? "default" : "secondary"}>
                        {mode.status}
                      </badge_1.Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-4">{mode.title}</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">{mode.description}</p>

                    <div className="space-y-3 mb-6">
                      {mode.features.map(function (feature, index) { return (<div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>); })}
                    </div>

                    <button_1.Button variant={mode.status === "Available" ? "gradient" : "secondary"} className="w-full" onClick={function () { return mode.status === "Available" && setActiveMode(mode.id); }} disabled={mode.status !== "Available"}>
                      {mode.status === "Available" ? (<>
                          <lucide_react_1.Play className="h-4 w-4"/>
                          Launch Mode
                        </>) : ("Coming Soon")}
                    </button_1.Button>
                  </div>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="scenarios">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Demo Scenarios..."/>}>
              <DemoScenarios onScenarioSelect={function (scenario) {
            setSelectedDemo(scenario);
            (0, analytics_1.trackEvent)('demo_scenario_selected', { scenario: scenario.id });
        }} onScenarioStart={function () {
            setIsDemoPlaying(true);
            setActiveMode('enhanced-debate');
            (0, analytics_1.trackEvent)('demo_scenario_started', { scenario: selectedDemo === null || selectedDemo === void 0 ? void 0 : selectedDemo.id });
        }} onScenarioStop={function () {
            setIsDemoPlaying(false);
            (0, analytics_1.trackEvent)('demo_scenario_stopped', { scenario: selectedDemo === null || selectedDemo === void 0 ? void 0 : selectedDemo.id });
        }} currentScenarioId={selectedDemo === null || selectedDemo === void 0 ? void 0 : selectedDemo.id} isPlaying={isDemoPlaying}/>
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="debate">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Debate Mode..."/>}>
              <DebateMode />
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="creative">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Creative Sandbox..."/>}>
              <CreativeSandbox />
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="enhanced-debate">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Neural Arena..."/>}>
              <EnhancedDebateArena topic="The future of artificial intelligence will be more beneficial than harmful to humanity" leftDebater={{
            id: "analytical-ai",
            name: "Logic Prime",
            personality: "analytical",
            energy: 85,
            battleState: "idle",
            arguments: []
        }} rightDebater={{
            id: "creative-ai",
            name: "Spark Mind",
            personality: "creative",
            energy: 90,
            battleState: "idle",
            arguments: []
        }} onDebateComplete={function (winner, finalScore) {
            (0, analytics_1.trackEvent)('enhanced_debate_complete', { winner: winner, finalScore: finalScore });
            console.log('Debate completed:', { winner: winner, finalScore: finalScore });
        }}/>
            </react_1.Suspense>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="explanation">
            <react_1.Suspense fallback={<LoadingSpinner_1.LoadingSpinner size="lg" text="Loading Explanation Challenge..."/>}>
              <ExplanationChallenge />
            </react_1.Suspense>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>

        {/* Quick Start Section */}
        <card_1.Card className="p-8 gradient-surface shadow-medium">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">Start Interactive Testing</h3>
              <p className="text-muted-foreground mb-4">
                Configure your models, set up interaction parameters, and run evaluations that reveal model capabilities and limitations.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <lucide_react_1.Users className="h-4 w-4 text-accent"/>
                  <span className="text-sm text-muted-foreground">Multi-agent orchestration</span>
                </div>
                <div className="flex items-center gap-2">
                  <lucide_react_1.MessageCircle className="h-4 w-4 text-accent"/>
                  <span className="text-sm text-muted-foreground">Real-time interaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <lucide_react_1.Trophy className="h-4 w-4 text-accent"/>
                  <span className="text-sm text-muted-foreground">AI-powered judging</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button_1.Button variant="hero" size="lg">
                <lucide_react_1.Settings className="h-4 w-4"/>
                Configure Models
                <lucide_react_1.ArrowRight className="h-4 w-4"/>
              </button_1.Button>
              <button_1.Button variant="outline">
                View Documentation
              </button_1.Button>
            </div>
          </div>
        </card_1.Card>
      </main>
    </div>);
});
Arena.displayName = 'Arena';
exports.default = Arena;
