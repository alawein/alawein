"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTrends = void 0;
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var performanceData = [
    { time: "00:00", cpu: 45, memory: 62, responseTime: 120, throughput: 85 },
    { time: "04:00", cpu: 52, memory: 58, responseTime: 110, throughput: 92 },
    { time: "08:00", cpu: 78, memory: 72, responseTime: 95, throughput: 110 },
    { time: "12:00", cpu: 85, memory: 84, responseTime: 85, throughput: 125 },
    { time: "16:00", cpu: 72, memory: 79, responseTime: 92, throughput: 118 },
    { time: "20:00", cpu: 58, memory: 65, responseTime: 105, throughput: 98 },
];
var chartConfig = {
    cpu: { label: "CPU Usage", color: "hsl(var(--primary))" },
    memory: { label: "Memory Usage", color: "hsl(var(--accent))" },
    responseTime: { label: "Response Time", color: "hsl(var(--primary))" },
    throughput: { label: "Throughput", color: "hsl(var(--accent))" },
};
var PerformanceTrends = function () {
    var metrics = [
        {
            title: "CPU Usage",
            value: "72%",
            change: "+5.2%",
            trend: "up",
            icon: lucide_react_1.Activity,
            color: "text-primary"
        },
        {
            title: "Memory Usage",
            value: "84%",
            change: "-2.1%",
            trend: "down",
            icon: lucide_react_1.Zap,
            color: "text-accent"
        },
        {
            title: "Avg Response Time",
            value: "92ms",
            change: "-8.5%",
            trend: "down",
            icon: lucide_react_1.Clock,
            color: "text-primary"
        },
        {
            title: "Throughput",
            value: "125 req/s",
            change: "+12.3%",
            trend: "up",
            icon: lucide_react_1.TrendingUp,
            color: "text-accent"
        }
    ];
    return (<div className="space-y-6">
      {/* Metrics Summary */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(function (metric, index) { return (<card_1.Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === "up" ? (<lucide_react_1.TrendingUp className="h-3 w-3 text-green-500"/>) : (<lucide_react_1.TrendingDown className="h-3 w-3 text-red-500"/>)}
                  <span className={"text-xs ".concat(metric.trend === "up" ? "text-green-500" : "text-red-500")}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <metric.icon className={"h-8 w-8 ".concat(metric.color)}/>
            </div>
          </card_1.Card>); })}
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <card_1.Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">System Resources</h3>
          <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
            <recharts_1.LineChart data={performanceData}>
              <recharts_1.XAxis dataKey="time"/>
              <recharts_1.YAxis />
              <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
              <recharts_1.Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} dot={{ r: 4 }}/>
              <recharts_1.Line type="monotone" dataKey="memory" stroke="var(--color-memory)" strokeWidth={2} dot={{ r: 4 }}/>
            </recharts_1.LineChart>
          </chart_1.ChartContainer>
        </card_1.Card>

        <card_1.Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Performance Metrics</h3>
          <chart_1.ChartContainer config={chartConfig} className="h-[300px]">
            <recharts_1.AreaChart data={performanceData}>
              <recharts_1.XAxis dataKey="time"/>
              <recharts_1.YAxis />
              <chart_1.ChartTooltip content={<chart_1.ChartTooltipContent />}/>
              <recharts_1.Area type="monotone" dataKey="responseTime" stroke="var(--color-responseTime)" fill="var(--color-responseTime)" fillOpacity={0.3}/>
              <recharts_1.Area type="monotone" dataKey="throughput" stroke="var(--color-throughput)" fill="var(--color-throughput)" fillOpacity={0.3}/>
            </recharts_1.AreaChart>
          </chart_1.ChartContainer>
        </card_1.Card>
      </div>
    </div>);
};
exports.PerformanceTrends = PerformanceTrends;
