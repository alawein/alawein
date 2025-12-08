"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStatus = void 0;
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var ServiceStatus = function (_a) {
    var systemStatus = _a.systemStatus;
    var getStatusColor = function (status) {
        switch (status) {
            case "operational":
                return "bg-accent/10 text-accent";
            case "degraded":
                return "bg-yellow-500/10 text-yellow-600";
            case "down":
                return "bg-destructive/10 text-destructive";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case "operational":
                return lucide_react_1.CheckCircle;
            case "degraded":
                return lucide_react_1.AlertTriangle;
            case "down":
                return lucide_react_1.AlertTriangle;
            default:
                return lucide_react_1.Clock;
        }
    };
    return (<card_1.Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <lucide_react_1.Server className="h-5 w-5 text-primary"/>
        <h3 className="text-lg font-bold text-foreground">Service Status</h3>
      </div>

      <div className="space-y-3">
        {systemStatus.map(function (service, index) {
            var StatusIcon = getStatusIcon(service.status);
            return (<div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <StatusIcon className="h-5 w-5"/>
                <div>
                  <div className="font-medium text-foreground">{service.service}</div>
                  <div className="text-sm text-muted-foreground">
                    {service.responseTime}ms • {service.uptime}% uptime
                  </div>
                </div>
              </div>
              <badge_1.Badge className={getStatusColor(service.status)}>{service.status}</badge_1.Badge>
            </div>);
        })}
      </div>
    </card_1.Card>);
};
exports.ServiceStatus = ServiceStatus;
