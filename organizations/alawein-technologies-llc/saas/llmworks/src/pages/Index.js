"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var HeroSection_1 = require("@/components/HeroSection");
var FeaturesSection_1 = require("@/components/FeaturesSection");
var Navigation_1 = require("@/components/Navigation");
var Footer_1 = require("@/components/Footer");
var LiveIntelligenceDashboard_1 = require("@/components/LiveIntelligenceDashboard");
var StrategicCommandPanel_1 = require("@/components/StrategicCommandPanel");
var TechnicalSpecsDrawer_1 = require("@/components/TechnicalSpecsDrawer");
var XPProgressionSystem_1 = require("@/components/XPProgressionSystem");
var ShowcaseDemo_1 = require("@/components/ShowcaseDemo");
var FeatureTour_1 = require("@/components/FeatureTour");
var PortfolioPresentation_1 = require("@/components/PortfolioPresentation");
var PixelBattleScene_1 = require("@/components/PixelBattleScene");
var DynamicLeaderboard_1 = require("@/components/DynamicLeaderboard");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var seo_1 = require("@/lib/seo");
var analytics_1 = require("@/lib/analytics");
var IndexPage = function () {
    var _a = (0, react_1.useState)(false), portfolioMode = _a[0], setPortfolioMode = _a[1];
    (0, react_1.useEffect)(function () {
        (0, seo_1.setSEO)({
            title: "LLM Works — Open‑Source Model Evaluation Platform",
            description: "Evaluate LLM reliability through interactive testing and rigorous benchmarking. Open-source evaluation platform with auditable results.",
            path: "/",
        });
        (0, seo_1.injectJsonLd)({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "LLM Works",
            url: window.location.origin,
            description: "Open‑source LLM evaluation platform: Arena (interactive testing) and Bench (rigorous benchmarking) with auditable results."
        }, "ld-home");
    }, []);
    var handleCTAClick = function (target) {
        (0, analytics_1.trackEvent)("cta_click", { source: "home", target: target });
    };
    return (<div className="min-h-screen bg-background">
      <Navigation_1.Navigation />
      <main id="main">
        <HeroSection_1.HeroSection />
        <FeaturesSection_1.FeaturesSection />
        
        {/* Interactive Showcase Demo */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="showcase-section" style={{
            background: "\n              radial-gradient(circle at 50% 20%, hsl(var(--color-primary) / 0.04), transparent 60%),\n              radial-gradient(circle at 30% 80%, hsl(var(--color-secondary) / 0.03), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/4 left-8 w-px h-40 bg-gradient-to-b from-primary/20 to-transparent"></div>
          <div className="absolute bottom-1/4 right-12 w-px h-32 bg-gradient-to-t from-secondary/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.Zap className="h-4 w-4 text-primary animate-pulse"/>
                    <span className="heading-refined text-sm text-primary tracking-wide">PORTFOLIO DEMONSTRATION</span>
                    <lucide_react_1.Zap className="h-4 w-4 text-primary animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="showcase-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Interactive Feature</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Showcase Demo
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Experience all Strategic Command Center features in an automated demonstration. 
                  Perfect for showcasing the platform's capabilities, gaming elements, and enterprise-grade interfaces.
                </p>
              </div>
            </header>

            {/* Showcase Demo Component */}
            <div style={{ '--stagger-index': 3 }}>
              <ShowcaseDemo_1.ShowcaseDemo />
            </div>

            {/* Feature Tour Guide */}
            <div style={{ '--stagger-index': 4 }} className="mt-12">
              <FeatureTour_1.FeatureTour tourType="comprehensive"/>
            </div>

            {/* Portfolio Presentation Mode */}
            <div style={{ '--stagger-index': 5 }} className="mt-8 text-center">
              <PortfolioPresentation_1.PortfolioPresentation isActive={portfolioMode} onToggle={function () { return setPortfolioMode(function (prev) { return !prev; }); }}/>
            </div>

            {/* Pixel Battle Scene Demonstration */}
            <div style={{ '--stagger-index': 6 }} className="mt-12">
              <div className="text-center mb-8">
                <h3 className="heading-refined text-2xl mb-4">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Live Battle Arena
                  </span>
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience tactical AI evaluations in our pixel-art battle arena with real-time energy visualization
                </p>
              </div>
              <PixelBattleScene_1.PixelBattleScene contenders={[
            {
                id: 'strategic-alpha',
                name: 'Strategic Alpha',
                type: 'analytical',
                energy: 85,
                status: 'ready',
                tacticalAdvantages: ['Logic', 'Analysis', 'Strategy']
            },
            {
                id: 'creative-nexus',
                name: 'Creative Nexus',
                type: 'creative',
                energy: 92,
                status: 'ready',
                tacticalAdvantages: ['Innovation', 'Artistry', 'Vision']
            }
        ]} battlePhase="preparation"/>
            </div>
          </div>
        </section>
        
        {/* Live Intelligence Dashboard Showcase */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="dashboard-section" style={{
            background: "\n              radial-gradient(circle at 20% 20%, hsl(var(--color-secondary) / 0.03), transparent 60%),\n              radial-gradient(circle at 80% 80%, hsl(var(--color-primary) / 0.02), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/4 right-10 w-px h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
          <div className="absolute bottom-1/4 left-16 w-px h-24 bg-gradient-to-t from-secondary/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.Activity className="h-4 w-4 text-primary animate-pulse"/>
                    <span className="heading-refined text-sm text-primary tracking-wide">STRATEGIC INTELLIGENCE HQ</span>
                    <lucide_react_1.Activity className="h-4 w-4 text-primary animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="dashboard-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Real-Time Command</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Intelligence Center
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Monitor live strategic evaluations, track system performance, and analyze threat intelligence 
                  in real-time through our sophisticated command dashboard.
                </p>
              </div>
            </header>

            {/* Live Dashboard */}
            <div style={{ '--stagger-index': 3 }}>
              <LiveIntelligenceDashboard_1.LiveIntelligenceDashboard />
            </div>
          </div>
        </section>

        {/* Strategic Command Panel Showcase */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="command-section" style={{
            background: "\n              radial-gradient(circle at 70% 30%, hsl(var(--color-accent) / 0.03), transparent 60%),\n              radial-gradient(circle at 30% 70%, hsl(var(--color-primary) / 0.02), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/3 left-8 w-px h-40 bg-gradient-to-b from-accent/20 to-transparent"></div>
          <div className="absolute bottom-1/3 right-12 w-px h-32 bg-gradient-to-t from-primary/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/10 to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.Terminal className="h-4 w-4 text-accent animate-pulse"/>
                    <span className="heading-refined text-sm text-accent tracking-wide">ADVANCED CONTROL INTERFACE</span>
                    <lucide_react_1.Terminal className="h-4 w-4 text-accent animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="command-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Strategic Command</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                      Control Center
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Advanced system control with module management, session monitoring, and terminal access. 
                  Enterprise-grade operational control for serious AI evaluation deployments.
                </p>
              </div>
            </header>

            {/* Command Panel */}
            <div style={{ '--stagger-index': 3 }}>
              <StrategicCommandPanel_1.StrategicCommandPanel />
            </div>
          </div>
        </section>

        {/* Commander Progression System Showcase */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="progression-section" style={{
            background: "\n              radial-gradient(circle at 30% 40%, hsl(var(--color-accent) / 0.03), transparent 60%),\n              radial-gradient(circle at 70% 60%, hsl(var(--color-primary) / 0.02), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/3 left-12 w-px h-32 bg-gradient-to-b from-accent/20 to-transparent"></div>
          <div className="absolute bottom-1/3 right-8 w-px h-36 bg-gradient-to-t from-primary/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/10 to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.Activity className="h-4 w-4 text-accent animate-pulse"/>
                    <span className="heading-refined text-sm text-accent tracking-wide">COMMANDER PROGRESSION</span>
                    <lucide_react_1.Activity className="h-4 w-4 text-accent animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="progression-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Level Up Your</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                      Strategic Command
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Advance through commander ranks, unlock achievements, and earn XP through strategic evaluations. 
                  Build your reputation as an elite AI tactical analyst.
                </p>
              </div>
            </header>

            {/* XP Progression System */}
            <div style={{ '--stagger-index': 3 }}>
              <XPProgressionSystem_1.XPProgressionSystem />
            </div>
          </div>
        </section>

        {/* Elite Rankings Showcase */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="rankings-section" style={{
            background: "\n              radial-gradient(circle at 20% 30%, hsl(var(--color-secondary) / 0.03), transparent 60%),\n              radial-gradient(circle at 80% 70%, hsl(var(--color-accent) / 0.02), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/4 left-8 w-px h-40 bg-gradient-to-b from-secondary/20 to-transparent"></div>
          <div className="absolute bottom-1/4 right-12 w-px h-32 bg-gradient-to-t from-accent/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-accent/10 to-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.Crown className="h-4 w-4 text-secondary animate-pulse"/>
                    <span className="heading-refined text-sm text-secondary tracking-wide">ELITE COMMANDER RANKINGS</span>
                    <lucide_react_1.Crown className="h-4 w-4 text-secondary animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="rankings-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Battle for</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                      Strategic Supremacy
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Witness elite commanders compete in tiered rankings. Climb through Bronze to Legendary status, 
                  earn achievements, and prove your strategic mastery in the ultimate AI evaluation arena.
                </p>
              </div>
            </header>

            {/* Dynamic Gaming Leaderboard */}
            <div style={{ '--stagger-index': 3 }}>
              <DynamicLeaderboard_1.DynamicLeaderboard />
            </div>
          </div>
        </section>

        {/* Technical Specifications Showcase */}
        <section className="relative py-32 overflow-hidden" aria-labelledby="specs-section" style={{
            background: "\n              radial-gradient(circle at 40% 20%, hsl(var(--color-primary) / 0.03), transparent 60%),\n              radial-gradient(circle at 60% 80%, hsl(var(--color-secondary) / 0.02), transparent 60%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-20"></div>
          <div className="absolute top-1/4 right-6 w-px h-36 bg-gradient-to-b from-primary/20 to-transparent"></div>
          <div className="absolute bottom-1/4 left-10 w-px h-28 bg-gradient-to-t from-secondary/15 to-transparent"></div>
          
          <div className="container-elegant relative z-10">
            {/* Enhanced Header */}
            <header className="text-center mb-16 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <lucide_react_1.FileText className="h-4 w-4 text-primary animate-pulse"/>
                    <span className="heading-refined text-sm text-primary tracking-wide">TECHNICAL DOCUMENTATION</span>
                    <lucide_react_1.FileText className="h-4 w-4 text-primary animate-pulse"/>
                  </div>
                </div>
              </div>
              
              <div style={{ '--stagger-index': 1 }}>
                <h2 id="specs-section" className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto">
                  <span className="block">Enterprise-Grade</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Technical Specifications
                    </span>
                  </span>
                </h2>
              </div>
              
              <div style={{ '--stagger-index': 2 }}>
                <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
                  Comprehensive technical documentation including system architecture, API specifications, 
                  security framework, and performance metrics. Built for enterprise deployment and scale.
                </p>
              </div>
            </header>

            {/* Technical Specs */}
            <div style={{ '--stagger-index': 3 }}>
              <TechnicalSpecsDrawer_1.TechnicalSpecsDrawer />
            </div>
          </div>
        </section>

        {/* Sophisticated Call to Action Section */}
        <section className="relative py-32 overflow-hidden section-angled" aria-labelledby="cta-section" style={{
            background: "\n              radial-gradient(circle at 30% 30%, hsl(var(--color-primary) / 0.05), transparent 70%),\n              radial-gradient(circle at 70% 70%, hsl(var(--color-accent) / 0.03), transparent 70%),\n              var(--color-background)\n            "
        }}>
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 subtle-texture opacity-30"></div>
          <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
          <div className="absolute bottom-1/4 right-16 w-px h-24 bg-gradient-to-t from-secondary/15 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
          
          <div className="container-elegant text-center relative z-10">
            <div className="max-w-5xl mx-auto stagger-children">
              
              {/* Enhanced Status Badge */}
              <div className="flex justify-center mb-12" style={{ '--stagger-index': 0 }}>
                <div className="glass-subtle px-6 py-3 rounded-full border-0 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
                    <span className="heading-refined text-sm text-primary tracking-wide">STRATEGIC SYSTEMS ONLINE</span>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Sophisticated Typography */}
              <div className="space-y-8 mb-16" style={{ '--stagger-index': 1 }}>
                <h2 id="cta-section" className="heading-display text-6xl md:text-7xl lg:text-8xl font-display">
                  <span className="block">Which AI</span>
                  <span className="block">
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Reigns Supreme?
                    </span>
                  </span>
                </h2>
                
                <p className="body-elegant text-xl md:text-2xl max-w-3xl mx-auto opacity-80 leading-relaxed">
                  Step into the arena where artificial minds engage in strategic evaluations. 
                  Witness intellect, creativity, and tactical analysis compete for superiority.
                </p>
              </div>
              
              {/* Sophisticated CTA Buttons */}
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16" style={{ '--stagger-index': 2 }}>
                <div className="magnetic-hover transition-transform duration-300">
                  <button_1.Button asChild size="lg" className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group min-h-[60px] px-12 relative overflow-hidden" aria-label="Enter the combat arena">
                    <react_router_dom_1.Link to="/arena" onClick={function () { return handleCTAClick("arena"); }} className="flex items-center gap-4">
                      <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                        <lucide_react_1.Zap className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true"/>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="heading-refined text-lg">Enter Arena</span>
                        <span className="text-sm opacity-90 font-normal">Begin strategic evaluation</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </react_router_dom_1.Link>
                  </button_1.Button>
                </div>
                
                <div className="magnetic-hover transition-transform duration-300">
                  <button_1.Button asChild variant="outline" size="lg" className="btn-elegant btn-outline border-primary/30 hover:border-primary/50 min-h-[60px] px-12 group relative overflow-hidden">
                    <react_router_dom_1.Link to="/bench" onClick={function () { return handleCTAClick("bench"); }} className="flex items-center gap-4">
                      <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                        <lucide_react_1.BarChart3 className="h-6 w-6 transition-all duration-300 group-hover:scale-110" aria-hidden="true"/>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="heading-refined text-lg">View Rankings</span>
                        <span className="text-sm opacity-70 font-normal">See the leaderboard</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </react_router_dom_1.Link>
                  </button_1.Button>
                </div>
              </div>

              {/* Battle Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" style={{ '--stagger-index': 3 }}>
                <div className="card-sophisticated group text-center">
                  <div className="glass-subtle p-1 rounded-xl mb-4 mx-auto w-fit group-hover:shadow-lg transition-all">
                    <div className="glass-minimal p-4 rounded-lg">
                      <div className="heading-display text-3xl text-primary mb-2">12K+</div>
                      <div className="body-elegant text-sm opacity-70">Strategic Evaluations</div>
                    </div>
                  </div>
                </div>
                
                <div className="card-sophisticated group text-center">
                  <div className="glass-subtle p-1 rounded-xl mb-4 mx-auto w-fit group-hover:shadow-lg transition-all">
                    <div className="glass-minimal p-4 rounded-lg">
                      <div className="heading-display text-3xl text-secondary mb-2">47</div>
                      <div className="body-elegant text-sm opacity-70">AI Models Tested</div>
                    </div>
                  </div>
                </div>
                
                <div className="card-sophisticated group text-center">
                  <div className="glass-subtle p-1 rounded-xl mb-4 mx-auto w-fit group-hover:shadow-lg transition-all">
                    <div className="glass-minimal p-4 rounded-lg">
                      <div className="heading-display text-3xl text-accent mb-2">98%</div>
                      <div className="body-elegant text-sm opacity-70">System Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer_1.Footer />
    </div>);
};
exports.default = (0, react_1.memo)(IndexPage);
