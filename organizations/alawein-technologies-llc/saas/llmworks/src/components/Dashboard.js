"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var skeleton_1 = require("@/components/ui/skeleton");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var analytics_1 = require("@/lib/analytics");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var Dashboard = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)(true), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        // Simulate data loading
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 1000);
        // Track dashboard view
        (0, analytics_1.trackEvent)("dashboard_viewed", { timestamp: Date.now() });
        return function () { return clearTimeout(timer); };
    }, []);
    var recentActivity = [
        {
            id: 1,
            type: "debate",
            title: "AI Regulation Debate",
            models: ["GPT-4o", "Claude 3.5 Sonnet"],
            timestamp: "2 hours ago",
            result: "GPT-4o won with 92% accuracy",
            icon: lucide_react_1.Swords,
            status: "completed"
        },
        {
            id: 2,
            type: "benchmark",
            title: "MMLU Benchmark",
            models: ["Gemini 1.5 Pro", "Llama 3.1 70B"],
            timestamp: "4 hours ago",
            result: "Gemini 1.5 Pro: 87.4% accuracy",
            icon: lucide_react_1.BarChart3,
            status: "completed"
        },
        {
            id: 3,
            type: "creative",
            title: "Coffee Brand Campaign",
            models: ["Claude 3.5 Sonnet", "GPT-4o"],
            timestamp: "1 day ago",
            result: "Creative score: 88/100",
            icon: lucide_react_1.Lightbulb,
            status: "completed"
        },
        {
            id: 4,
            type: "explanation",
            title: "Quantum Physics for Kids",
            models: ["GPT-4o", "Claude 3.5 Sonnet"],
            timestamp: "2 days ago",
            result: "Clarity: 91%, Empathy: 85%",
            icon: lucide_react_1.GraduationCap,
            status: "completed"
        }
    ];
    var stats = [
        {
            label: "Total Evaluations",
            value: "2,847",
            change: "+12.5%",
            icon: lucide_react_1.Activity,
            status: "trust"
        },
        {
            label: "Active Models",
            value: "8",
            change: "+2",
            icon: lucide_react_1.Users,
            status: "trust"
        },
        {
            label: "Avg Accuracy",
            value: "87.3%",
            change: "+2.1%",
            icon: lucide_react_1.Trophy,
            status: "trust"
        },
        {
            label: "This Month",
            value: "234",
            change: "+18.2%",
            icon: lucide_react_1.TrendingUp,
            status: "trust"
        }
    ];
    var quickActions = [
        {
            title: "Start Debate",
            description: "Pit models against each other",
            icon: lucide_react_1.Swords,
            href: "/arena",
            color: "bg-accent/10 text-accent hover:bg-accent/20",
            action: "debate_started"
        },
        {
            title: "Run Benchmark",
            description: "Test systematic performance",
            icon: lucide_react_1.BarChart3,
            href: "/bench",
            color: "bg-primary/10 text-primary hover:bg-primary/20",
            action: "benchmark_started"
        },
        {
            title: "Creative Challenge",
            description: "Test collaborative creativity",
            icon: lucide_react_1.Lightbulb,
            href: "/arena",
            color: "bg-accent/10 text-accent hover:bg-accent/20",
            action: "creative_challenge_started"
        },
        {
            title: "Explanation Test",
            description: "Evaluate teaching ability",
            icon: lucide_react_1.GraduationCap,
            href: "/arena",
            color: "bg-primary/10 text-primary hover:bg-primary/20",
            action: "explanation_test_started"
        }
    ];
    var handleQuickAction = function (action, title) {
        (0, analytics_1.trackEvent)("quick_action_clicked", { action: action, title: title });
    };
    var handleRefresh = function () {
        setIsLoading(true);
        setError(null);
        (0, analytics_1.trackEvent)("dashboard_refreshed");
        setTimeout(function () { return setIsLoading(false); }, 800);
    };
    if (error) {
        return (<div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <lucide_react_1.AlertCircle className="h-12 w-12 text-destructive"/>
        <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <button_1.Button onClick={handleRefresh} variant="outline">
          <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
          Try Again
        </button_1.Button>
      </div>);
    }
    return (<div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (Array.from({ length: 4 }).map(function (_, index) { return (<card_1.Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <skeleton_1.Skeleton className="h-4 w-24"/>
                  <skeleton_1.Skeleton className="h-8 w-16"/>
                  <skeleton_1.Skeleton className="h-4 w-12"/>
                </div>
                <skeleton_1.Skeleton className="h-12 w-12 rounded-xl"/>
              </div>
            </card_1.Card>); })) : (stats.map(function (stat, index) { return (<card_1.Card key={index} className={"\n              group p-6 border-border/50 bg-card/60 backdrop-blur-sm\n              transition-all duration-300 hover:shadow-trust hover:-translate-y-1\n              ".concat(stat.status === 'trust' ? 'hover:border-trust/50' : '', "\n            ")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                <p className="text-sm text-trust flex items-center gap-1 font-medium">
                  <lucide_react_1.TrendingUp className="h-3 w-3"/>
                  {stat.change}
                </p>
              </div>
              <div className={"\n                p-3 rounded-xl transition-all duration-300\n                ".concat(stat.status === 'trust'
                ? 'bg-trust/10 group-hover:bg-trust/20 group-hover:shadow-trust'
                : 'bg-primary/10 group-hover:bg-primary/20', "\n              ")}>
                <stat.icon className={"h-6 w-6 ".concat(stat.status === 'trust' ? 'text-trust' : 'text-primary')}/>
              </div>
            </div>
            </card_1.Card>); }))}
      </div>

      {/* Quick Actions */}
      <card_1.Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (Array.from({ length: 4 }).map(function (_, index) { return (<skeleton_1.Skeleton key={index} className="h-24 rounded-lg"/>); })) : (quickActions.map(function (action, index) { return (<button_1.Button key={index} variant="outline" size="lg" asChild className={"h-auto p-4 flex flex-col items-center gap-2 ".concat(action.color, " border-border hover:border-current")} onClick={function () { return handleQuickAction(action.action, action.title); }}>
                <react_router_dom_1.Link to={action.href}>
                  <action.icon className="h-6 w-6"/>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-80">{action.description}</div>
                  </div>
                </react_router_dom_1.Link>
              </button_1.Button>); }))}
        </div>
      </card_1.Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <button_1.Button variant="ghost" size="sm">
                View All
                <lucide_react_1.ArrowRight className="h-4 w-4 ml-1"/>
              </button_1.Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (Array.from({ length: 4 }).map(function (_, index) { return (<div key={index} className="flex items-start gap-4 p-4">
                    <skeleton_1.Skeleton className="h-8 w-8 rounded-lg"/>
                    <div className="flex-1 space-y-2">
                      <skeleton_1.Skeleton className="h-4 w-3/4"/>
                      <skeleton_1.Skeleton className="h-3 w-1/2"/>
                      <skeleton_1.Skeleton className="h-3 w-1/3"/>
                      <skeleton_1.Skeleton className="h-3 w-1/4"/>
                    </div>
                  </div>); })) : (recentActivity.map(function (activity) { return (<div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <activity.icon className="h-4 w-4 text-accent"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{activity.title}</h4>
                      <badge_1.Badge variant="outline" className="text-xs">
                        {activity.type}
                      </badge_1.Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {activity.models.join(" vs ")}
                    </p>
                    <p className="text-sm text-accent font-medium mb-1">
                      {activity.result}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <lucide_react_1.Clock className="h-3 w-3"/>
                      {activity.timestamp}
                    </div>
                  </div>
                </div>); }))}
            </div>
          </card_1.Card>
        </div>

        {/* Performance Insights */}
        <div className="space-y-6">
          <card_1.Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Top Performers</h3>
            <div className="space-y-3">
              {[
            { model: "GPT-4o", score: 92.3, trend: "+2.1%" },
            { model: "Claude 3.5 Sonnet", score: 89.7, trend: "+1.8%" },
            { model: "Gemini 1.5 Pro", score: 87.4, trend: "+0.9%" },
            { model: "Llama 3.1 70B", score: 84.2, trend: "-0.3%" }
        ].map(function (performer, index) { return (<div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{performer.model}</div>
                    <div className="text-sm text-muted-foreground">{performer.score}% avg</div>
                  </div>
                  <badge_1.Badge className={"".concat(performer.trend.startsWith('+')
                ? 'bg-accent/10 text-accent'
                : 'bg-primary/10 text-primary')}>
                    {performer.trend}
                  </badge_1.Badge>
                </div>); })}
            </div>
          </card_1.Card>

          <card_1.Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arena Sessions</span>
                <span className="font-medium text-foreground">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Benchmark Runs</span>
                <span className="font-medium text-foreground">78</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Evaluations</span>
                <span className="font-medium text-foreground">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium text-accent">94.2%</span>
              </div>
            </div>
          </card_1.Card>
        </div>
      </div>
    </div>);
});
exports.Dashboard = Dashboard;
Dashboard.displayName = "Dashboard";
exports.default = (0, ErrorBoundary_1.withErrorBoundary)(Dashboard);
