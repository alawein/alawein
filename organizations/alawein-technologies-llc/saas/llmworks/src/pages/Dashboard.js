"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
var react_1 = require("react");
var Navigation_1 = require("@/components/Navigation");
var Dashboard_1 = require("@/components/Dashboard");
var AnalyticsDashboard_1 = require("@/components/analytics/AnalyticsDashboard");
var ModelManagementDashboard_1 = require("@/components/dashboard/ModelManagementDashboard");
var EvaluationMonitoringDashboard_1 = require("@/components/dashboard/EvaluationMonitoringDashboard");
var CostTrackingDashboard_1 = require("@/components/dashboard/CostTrackingDashboard");
var SystemHealthDashboard_1 = require("@/components/dashboard/SystemHealthDashboard");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var seo_1 = require("@/lib/seo");
function DashboardPage() {
    (0, react_1.useEffect)(function () {
        (0, seo_1.setSEO)({
            title: "Dashboard | LLM Works",
            description: "Monitor your AI evaluation activities, recent runs, and performance insights.",
            path: "/dashboard",
        });
        (0, seo_1.injectJsonLd)({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "LLM Works Dashboard",
            url: "".concat(window.location.origin, "/dashboard"),
            description: "Control center for AI evaluation, monitoring, and analytics.",
            isPartOf: { "@type": "SoftwareApplication", name: "LLM Works" }
        }, "ld-dashboard");
    }, []);
    return (<div className="min-h-screen bg-background">
      <Navigation_1.Navigation />
      <main id="main" className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your evaluation activities, recent runs, and performance insights</p>
          </div>
          <button_1.Button asChild variant="outline">
            <react_router_dom_1.Link to="/" aria-label="Back to Home">
              <lucide_react_1.Home className="h-4 w-4 mr-2" aria-hidden="true"/>
              Back to Home
            </react_router_dom_1.Link>
          </button_1.Button>
        </header>

        <tabs_1.Tabs defaultValue="overview" className="w-full">
          <tabs_1.TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-6">
            <tabs_1.TabsTrigger value="overview" className="flex items-center gap-2">
              <lucide_react_1.BarChart3 className="h-4 w-4"/>
              <span className="hidden sm:inline">Overview</span>
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="models" className="flex items-center gap-2">
              <lucide_react_1.Brain className="h-4 w-4"/>
              <span className="hidden sm:inline">Models</span>
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="monitoring" className="flex items-center gap-2">
              <lucide_react_1.Play className="h-4 w-4"/>
              <span className="hidden sm:inline">Monitoring</span>
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="costs" className="flex items-center gap-2">
              <lucide_react_1.DollarSign className="h-4 w-4"/>
              <span className="hidden sm:inline">Costs</span>
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="health" className="flex items-center gap-2">
              <lucide_react_1.Shield className="h-4 w-4"/>
              <span className="hidden sm:inline">Health</span>
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="analytics" className="flex items-center gap-2">
              <lucide_react_1.Activity className="h-4 w-4"/>
              <span className="hidden sm:inline">Analytics</span>
            </tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="overview">
            <Dashboard_1.Dashboard />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="models">
            <ModelManagementDashboard_1.ModelManagementDashboard />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="monitoring">
            <EvaluationMonitoringDashboard_1.EvaluationMonitoringDashboard />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="costs">
            <CostTrackingDashboard_1.CostTrackingDashboard />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="health">
            <SystemHealthDashboard_1.SystemHealthDashboard />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="analytics">
            <AnalyticsDashboard_1.AnalyticsDashboard />
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </main>
    </div>);
}
