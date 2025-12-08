"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveEvaluationsCard = void 0;
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var ActiveEvaluationsCard = function (_a) {
    var activeEvaluations = _a.activeEvaluations;
    return (<card_1.Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <lucide_react_1.Activity className="h-5 w-5 text-accent"/>
        <h3 className="text-lg font-bold text-foreground">Active Evaluations</h3>
      </div>

      {activeEvaluations.length > 0 ? (<div className="space-y-4">
          {activeEvaluations.map(function (evaluation) { return (<div key={evaluation.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-foreground">{evaluation.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {evaluation.models.join(" vs ")} • {evaluation.type}
                  </div>
                </div>
                <badge_1.Badge variant="outline">{evaluation.progress}%</badge_1.Badge>
              </div>

              <div className="space-y-2">
                <progress_1.Progress value={evaluation.progress} className="h-2"/>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{evaluation.estimatedTime}</span>
                  <span>Running...</span>
                </div>
              </div>
            </div>); })}
        </div>) : (<div className="text-center py-8 text-muted-foreground">
          <lucide_react_1.Activity className="h-12 w-12 mx-auto mb-2 opacity-50"/>
          <p>No active evaluations</p>
        </div>)}
    </card_1.Card>);
};
exports.ActiveEvaluationsCard = ActiveEvaluationsCard;
