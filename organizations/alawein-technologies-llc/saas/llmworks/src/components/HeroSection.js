"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSection = void 0;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var analytics_1 = require("@/lib/analytics");
var skeleton_1 = require("@/components/ui/skeleton");
var AIBattleAnimation_1 = require("@/components/AIBattleAnimation");
var LazyBenchmarkPanel = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("@/components/BenchmarkPanel"); }).then(function (m) { return ({ default: m.BenchmarkPanel }); }); });
var HeroSectionComponent = function () {
    var sectionRef = (0, react_1.useRef)(null);
    var magneticRef = (0, react_1.useRef)(null);
    var handleCTAClick = function (target) {
        (0, analytics_1.trackEvent)("cta_click", { source: "hero", target: target });
    };
    // Magnetic hover effect for the primary CTA
    (0, react_1.useEffect)(function () {
        var handleMouseMove = function (e) {
            if (!magneticRef.current)
                return;
            var rect = magneticRef.current.getBoundingClientRect();
            var x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            var y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            magneticRef.current.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
        };
        var handleMouseLeave = function () {
            if (!magneticRef.current)
                return;
            magneticRef.current.style.transform = 'translate(0px, 0px)';
        };
        var element = magneticRef.current;
        if (element) {
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);
        }
        return function () {
            if (element) {
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);
    return (<section ref={sectionRef} className="relative min-h-screen overflow-hidden glass-panel" style={{
            background: "\n          radial-gradient(circle at 25% 25%, hsl(var(--color-primary) / 0.03), transparent 50%),\n          radial-gradient(circle at 75% 75%, hsl(var(--color-secondary) / 0.02), transparent 50%),\n          var(--color-background)\n        "
        }}>
      {/* Sophisticated Background Effects */}
      <div className="absolute inset-0 subtle-texture opacity-40"></div>
      <div className="hero-asymmetric absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5"></div>
      
      <div className="container-elegant relative z-10">
        <div className="hero-grid min-h-screen">
          {/* Enhanced Content Section */}
          <div className="flex flex-col justify-center space-y-8 lg:pt-16 order-1 stagger-children">
            {/* Refined Status Badge */}
            <div className="space-y-6" style={{ '--stagger-index': 0 }}>
              <badge_1.Badge className="inline-flex items-center gap-2 px-4 py-2 glass-panel border-0 text-sm font-medium">
                <lucide_react_1.Swords className="h-4 w-4 text-primary"/>
                <span className="heading-refined text-primary">Strategic Evaluation Command</span>
              </badge_1.Badge>
            </div>
            
            {/* Sophisticated Typography */}
            <div className="space-y-6" style={{ '--stagger-index': 1 }}>
              <h1 className="heading-display fluid-heading font-display">
                <span className="block">
                  Architect Superior
                </span>
                <span className="block">
                  <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    AI Through Strategy
                  </span>
                </span>
              </h1>
              
              <p className="body-elegant fluid-body max-w-lg">
                Deploy models in strategic engagements. Through tactical evaluations, intelligence challenges, 
                and rigorous analysis, discover which AI commands the field of artificial intelligence.
              </p>
            </div>
            
            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6" style={{ '--stagger-index': 2 }}>
              <div ref={magneticRef} className="magnetic-hover transition-transform duration-300 ease-out-expo">
                <button_1.Button size="lg" className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group min-h-[52px] px-8" asChild>
                  <react_router_dom_1.Link to="/arena" onClick={function () { return handleCTAClick("arena"); }}>
                    <lucide_react_1.Zap className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"/>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Enter Arena</span>
                      <span className="text-xs opacity-90 font-normal">Start strategic tests</span>
                    </div>
                    <lucide_react_1.ArrowUpRight className="h-4 w-4 ml-2 opacity-70 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
                  </react_router_dom_1.Link>
                </button_1.Button>
              </div>
              
              <button_1.Button variant="outline" size="lg" asChild className="btn-elegant btn-outline border-primary/30 hover:border-primary/50 min-h-[52px] px-8 group">
                <react_router_dom_1.Link to="/bench" onClick={function () { return handleCTAClick("bench"); }}>
                  <lucide_react_1.BarChart3 className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"/>
                  <span className="font-semibold">View Leaderboard</span>
                </react_router_dom_1.Link>
              </button_1.Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 opacity-70" style={{ '--stagger-index': 3 }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Transparent Results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Real-time Evaluations</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Benchmark Panel with AI Battle Animation */}
          <div className="flex items-center justify-center lg:justify-start order-2" style={{ '--stagger-index': 4 }}>
            <div className="w-full max-w-lg space-y-6">
              {/* AI Battle Animation */}
              <div className="w-full" data-tour="battle-animation">
                <AIBattleAnimation_1.AIBattleAnimation />
              </div>
              
              {/* Benchmark Panel */}
              <react_1.Suspense fallback={<div className="glass-panel h-96 rounded-xl animate-pulse">
                    <skeleton_1.Skeleton className="h-full w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted/20"/>
                  </div>}>
                <div className="glass-panel rounded-xl p-1">
                  <LazyBenchmarkPanel />
                </div>
              </react_1.Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>);
};
exports.HeroSection = (0, react_1.memo)(HeroSectionComponent);
