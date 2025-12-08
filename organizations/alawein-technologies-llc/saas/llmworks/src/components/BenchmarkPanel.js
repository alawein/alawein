"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarkPanel = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var MicroInteractions_1 = require("@/components/MicroInteractions");
// Mock data with better typing
var mockBenchmarkData = [
    { name: "GPT-4", score: 92, trend: "up", change: "+3.2%" },
    { name: "Claude-3", score: 89, trend: "up", change: "+2.8%" },
    { name: "Gemini Pro", score: 85, trend: "down", change: "-1.5%" },
    { name: "PaLM-2", score: 81, trend: "stable", change: "0.0%" },
    { name: "LLaMA-2", score: 78, trend: "up", change: "+1.9%" },
];
var statusConfig = {
    active: {
        icon: lucide_react_1.Clock,
        className: "bg-primary/20 text-primary border-primary/30",
        dotClass: "bg-primary"
    },
    warning: {
        icon: lucide_react_1.AlertCircle,
        className: "bg-warning/20 text-warning border-warning/30",
        dotClass: "bg-warning"
    },
    success: {
        icon: lucide_react_1.CheckCircle,
        className: "bg-success/20 text-success border-success/30",
        dotClass: "bg-success"
    }
};
var EvaluationCard = (0, react_1.memo)(function (_a) {
    var title = _a.title, metric = _a.metric, status = _a.status, Icon = _a.icon, trend = _a.trend;
    var config = statusConfig[status];
    var StatusIcon = config.icon;
    var _b = (0, react_1.useState)(false), isHovered = _b[0], setIsHovered = _b[1];
    return (<MicroInteractions_1.RippleEffect>
      <MicroInteractions_1.GlowOnHover glowIntensity="subtle">
        <card_1.Card className="relative p-4 glass-subtle border-border/20 transition-all duration-500 hover:shadow-lg group cursor-pointer" onMouseEnter={function () { return setIsHovered(true); }} onMouseLeave={function () { return setIsHovered(false); }}>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          
          <card_1.CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <card_1.CardTitle className="heading-refined text-sm">{title}</card_1.CardTitle>
              <div className="glass-minimal p-1.5 rounded-lg group-hover:shadow-md transition-all duration-300">
                <StatusIcon className={"h-4 w-4 transition-all duration-300 ".concat(isHovered ? 'text-primary scale-110' : 'text-muted-foreground')} aria-hidden="true"/>
              </div>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent className="pt-0 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="heading-display text-2xl transition-colors duration-300 group-hover:text-primary">
                {metric}
              </span>
              {trend && (<span className="body-elegant text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
                  {trend}
                </span>)}
            </div>
            <div className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 ".concat(config.className)}>
              <div className={"w-2 h-2 rounded-full ".concat(config.dotClass, " ").concat(isHovered ? 'animate-pulse' : '')} aria-hidden="true"/>
              <span className="font-medium">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </MicroInteractions_1.GlowOnHover>
    </MicroInteractions_1.RippleEffect>);
});
EvaluationCard.displayName = 'EvaluationCard';
var TrendIcon = (0, react_1.memo)(function (_a) {
    var trend = _a.trend, className = _a.className;
    var icons = {
        up: lucide_react_1.TrendingUp,
        down: lucide_react_1.TrendingDown,
        stable: lucide_react_1.Minus
    };
    var colors = {
        up: "text-success",
        down: "text-destructive",
        stable: "text-muted-foreground"
    };
    var IconComponent = icons[trend] || lucide_react_1.Minus;
    var colorClass = colors[trend] || "text-muted-foreground";
    return <IconComponent className={"h-4 w-4 ".concat(colorClass, " ").concat(className)} aria-hidden="true"/>;
});
TrendIcon.displayName = 'TrendIcon';
exports.BenchmarkPanel = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)(false), isVisible = _a[0], setIsVisible = _a[1];
    var panelRef = (0, react_1.useRef)(null);
    var evaluationMetrics = (0, react_1.useMemo)(function () { return [
        { title: "Confidence", metric: "94.2%", status: "success", icon: lucide_react_1.CheckCircle, trend: "+2.1%" },
        { title: "Reliability", metric: "87.8%", status: "active", icon: lucide_react_1.Clock, trend: "+0.8%" },
        { title: "Bias Score", metric: "2.1/10", status: "warning", icon: lucide_react_1.AlertCircle, trend: "-0.3%" },
    ]; }, []);
    (0, react_1.useEffect)(function () {
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.1 });
        if (panelRef.current) {
            observer.observe(panelRef.current);
        }
        return function () { return observer.disconnect(); };
    }, []);
    return (<MicroInteractions_1.SlideInView direction="up" delay={200}>
      <MicroInteractions_1.MagneticHover strength={0.1}>
        <div ref={panelRef} className="glass-panel w-full max-w-md mx-auto border-border/10 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden" role="region" aria-labelledby="benchmark-title">
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/2 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl"></div>
          
          <card_1.CardHeader className="pb-6 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="glass-subtle p-2 rounded-xl">
                  <lucide_react_1.Trophy className="h-5 w-5 text-primary"/>
                </div>
                <card_1.CardTitle id="benchmark-title" className="heading-refined text-lg">
                  Strategic Analytics
                </card_1.CardTitle>
              </div>
              <badge_1.Badge className="glass-minimal border-0 bg-success/20 text-success px-3 py-1.5">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" aria-hidden="true"/>
                <span className="font-medium text-xs">LIVE</span>
              </badge_1.Badge>
            </div>
            <card_1.CardDescription className="body-elegant">
              Real-time strategic intelligence and model performance tracking
            </card_1.CardDescription>
          </card_1.CardHeader>
          
          <card_1.CardContent className="space-y-8 relative z-10">
            {/* Enhanced Models List */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                <h3 className="heading-refined text-sm text-foreground">Strategic Rankings</h3>
              </div>
              
              <MicroInteractions_1.StaggeredChildren staggerDelay={80}>
                <div className="space-y-3" role="list" aria-label="Model rankings">
                  {mockBenchmarkData.map(function (model, index) { return (<MicroInteractions_1.RippleEffect key={model.name}>
                      <div className="group flex items-center justify-between p-3 glass-subtle hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden" role="listitem">
                        {/* Rank indicator with glow */}
                        <div className="flex items-center gap-4">
                          <div className={"\n                            strategic-rank flex items-center justify-center w-8 h-6 text-xs font-bold transition-all duration-300 group-hover:scale-110\n                            ".concat(index === 0 ? 'rank-platinum' :
                index === 1 ? 'rank-gold' :
                    index === 2 ? 'rank-silver' :
                        index === 3 ? 'rank-bronze' :
                            'performance-standard', "\n                          ")}>
                            #{index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="heading-refined text-sm group-hover:text-primary transition-colors">
                              {model.name}
                            </span>
                            <span className="body-elegant text-xs text-muted-foreground">
                              Strategic AI Model
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <progress_1.Progress value={model.score} className="w-20 h-2" aria-label={"".concat(model.name, " score: ").concat(model.score, "%")}/>
                          <div className="text-right">
                            <div className="heading-display text-sm font-bold group-hover:text-primary transition-colors">
                              {model.score}
                            </div>
                            <div className="flex items-center gap-1 justify-end">
                              <TrendIcon trend={model.trend} className="group-hover:scale-110 transition-transform"/>
                              <span className={"body-elegant text-xs transition-colors ".concat(model.trend === 'up' ? 'text-success group-hover:text-success/80' :
                model.trend === 'down' ? 'text-destructive group-hover:text-destructive/80' :
                    'text-muted-foreground group-hover:text-muted-foreground/80')}>
                                {model.change}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </div>
                    </MicroInteractions_1.RippleEffect>); })}
                </div>
              </MicroInteractions_1.StaggeredChildren>
            </div>

            {/* Enhanced Quick Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
                <h3 className="heading-refined text-sm text-foreground">Strategic Metrics</h3>
              </div>
              
              <MicroInteractions_1.StaggeredChildren staggerDelay={100}>
                <div className="grid grid-cols-1 gap-3" role="list" aria-label="Evaluation metrics">
                  {evaluationMetrics.map(function (metric, index) { return (<div key={metric.title} role="listitem" style={{ '--stagger-index': index + 3 }}>
                      <EvaluationCard {...metric}/>
                    </div>); })}
                </div>
              </MicroInteractions_1.StaggeredChildren>
            </div>

            {/* Strategic Status Indicator */}
            <div className="flex items-center justify-center pt-4 border-t border-border/10">
              <div className="flex items-center gap-3 glass-minimal px-4 py-2 rounded-full">
                <lucide_react_1.Zap className="h-4 w-4 text-primary animate-pulse"/>
                <span className="body-elegant text-xs text-primary font-medium">
                  Strategic Systems Online
                </span>
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              </div>
            </div>
          </card_1.CardContent>
        </div>
      </MicroInteractions_1.MagneticHover>
    </MicroInteractions_1.SlideInView>);
});
exports.BenchmarkPanel.displayName = 'BenchmarkPanel';
