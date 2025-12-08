"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewCards = void 0;
var card_1 = require("@/components/ui/card");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var OverviewCards = function (_a) {
    var metrics = _a.metrics;
    return (<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <card_1.Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">System Load</p>
            <p className="text-2xl font-bold text-foreground">{metrics.systemLoad}%</p>
          </div>
          <lucide_react_1.Activity className="h-8 w-8 text-primary"/>
        </div>
        <progress_1.Progress value={metrics.systemLoad} className="mt-2"/>
      </card_1.Card>

      <card_1.Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold text-foreground">{metrics.activeUsers}</p>
          </div>
          <lucide_react_1.Users className="h-8 w-8 text-accent"/>
        </div>
      </card_1.Card>

      <card_1.Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avg Response</p>
            <p className="text-2xl font-bold text-foreground">{Math.round(metrics.avgResponseTime)}ms</p>
          </div>
          <lucide_react_1.Zap className="h-8 w-8 text-primary"/>
        </div>
      </card_1.Card>

      <card_1.Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Evals</p>
            <p className="text-2xl font-bold text-foreground">{metrics.totalEvaluations.toLocaleString()}</p>
          </div>
          <lucide_react_1.BarChart3 className="h-8 w-8 text-accent"/>
        </div>
      </card_1.Card>
    </div>);
};
exports.OverviewCards = OverviewCards;
