"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDashboard = AnalyticsDashboard;
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var chart_1 = require("@/components/ui/chart");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var analytics_1 = require("@/lib/analytics");
var pageViewData = [
    { page: "/", views: 1250, bounceRate: 35 },
    { page: "/arena", views: 890, bounceRate: 28 },
    { page: "/bench", views: 720, bounceRate: 22 },
    { page: "/dashboard", views: 560, bounceRate: 18 },
    { page: "/settings", views: 340, bounceRate: 45 },
];
var userFlowData = [
    { hour: "00", pageViews: 45, events: 12, users: 8 },
    { hour: "04", pageViews: 52, events: 18, users: 12 },
    { hour: "08", pageViews: 180, events: 65, users: 35 },
    { hour: "12", pageViews: 285, events: 120, users: 58 },
    { hour: "16", pageViews: 220, events: 95, users: 42 },
    { hour: "20", pageViews: 160, events: 55, users: 28 },
];
var eventData = [
    { name: "CTA Clicks", value: 45, color: "hsl(var(--primary))" },
    { name: "Tab Changes", value: 32, color: "hsl(var(--accent))" },
    { name: "Page Views", value: 18, color: "hsl(var(--muted))" },
    { name: "Downloads", value: 5, color: "hsl(var(--secondary))" },
];
var chartConfig = {
    pageViews: { label: "Page Views", color: "hsl(var(--primary))" },
    events: { label: "Events", color: "hsl(var(--accent))" },
    users: { label: "Users", color: "hsl(var(--secondary))" },
    views: { label: "Views", color: "hsl(var(--primary))" },
    bounceRate: { label: "Bounce Rate", color: "hsl(var(--accent))" },
};
function AnalyticsDashboard() {
    var handleExport = function () {
        (0, analytics_1.trackEvent)("analytics_export", { type: "csv", timestamp: Date.now() });
        // Export logic would go here
    };
    var metrics = [
        { label: "Total Page Views", value: "3,760", change: "+12.5%", icon: lucide_react_1.Eye },
        { label: "Unique Users", value: "183", change: "+8.2%", icon: lucide_react_1.Users },
        { label: "Avg Session Duration", value: "4m 32s", change: "+15.3%", icon: lucide_react_1.Clock },
        { label: "Event Interactions", value: "310", change: "+22.1%", icon: lucide_react_1.Activity },
    ];
    return (<div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(function (metric, index) { return (<card_1.Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <lucide_react_1.TrendingUp className="h-3 w-3 text-green-500"/>
                  <span className="text-xs text-green-500">{metric.change}</span>
                </div>
              </div>
              <metric.icon className="h-8 w-8 text-primary"/>
            </div>
          </card_1.Card>); })}
      </div>

      {/* Analytics Tabs */}
      <tabs_1.Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <tabs_1.TabsList>
            <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="pages">Pages</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="events">Events</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="users">User Flow</tabs_1.TabsTrigger>
          </tabs_1.TabsList>
          <button_1.Button onClick={handleExport} variant="outline" size="sm">
            <lucide_react_1.Download className="h-4 w-4 mr-2"/>
            Export Data
          </button_1.Button>
        </div>

        <tabs_1.TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <card_1.Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Hourly Activity</h3>
              <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
                <recharts_1.LineChart data={userFlowData}>
                  <recharts_1.XAxis dataKey="hour"/>
                  <recharts_1.YAxis />
                  <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                  <recharts_1.Line type="monotone" dataKey="pageViews" stroke="var(--color-pageViews)" strokeWidth={2}/>
                  <recharts_1.Line type="monotone" dataKey="events" stroke="var(--color-events)" strokeWidth={2}/>
                </recharts_1.LineChart>
              </chart_1.ChartContainer>
            </card_1.Card>

            <card_1.Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Event Distribution</h3>
              <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
                <recharts_1.PieChart>
                  <recharts_1.Pie data={eventData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {eventData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
                  </recharts_1.Pie>
                  <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                </recharts_1.PieChart>
              </chart_1.ChartContainer>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="pages">
          <card_1.Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Page Performance</h3>
            <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
              <recharts_1.BarChart data={pageViewData}>
                <recharts_1.XAxis dataKey="page"/>
                <recharts_1.YAxis />
                <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                <recharts_1.Bar dataKey="views" fill="var(--color-views)"/>
              </recharts_1.BarChart>
            </chart_1.ChartContainer>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="events">
          <card_1.Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Event Timeline</h3>
            <div className="space-y-4">
              {[
            { event: "cta_click", source: "hero", target: "arena", time: "2 min ago" },
            { event: "arena_tab_change", tab: "debate", time: "5 min ago" },
            { event: "page_view", path: "/bench", time: "8 min ago" },
            { event: "cta_click", source: "home", target: "dashboard", time: "12 min ago" },
        ].map(function (event, index) { return (<div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{event.event}</div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(event).filter(function (_a) {
            var k = _a[0];
            return k !== "event" && k !== "time";
        }).map(function (_a) {
            var k = _a[0], v = _a[1];
            return "".concat(k, ": ").concat(v);
        }).join(", ")}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{event.time}</div>
                </div>); })}
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="users">
          <card_1.Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">User Journey</h3>
            <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
              <recharts_1.LineChart data={userFlowData}>
                <recharts_1.XAxis dataKey="hour"/>
                <recharts_1.YAxis />
                <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
                <recharts_1.Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={3}/>
              </recharts_1.LineChart>
            </chart_1.ChartContainer>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
