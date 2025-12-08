"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonTable = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var table_1 = require("@/components/ui/table");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var METRIC_ROWS = [
    { key: 'accuracy', label: 'Accuracy', format: 'percent', higherBetter: true },
    { key: 'speed', label: 'Speed', format: 'percent', higherBetter: true },
    { key: 'cost', label: 'Cost Efficiency', format: 'percent', higherBetter: true },
    { key: 'reasoning', label: 'Reasoning', format: 'percent', higherBetter: true },
    { key: 'creativity', label: 'Creativity', format: 'percent', higherBetter: true },
    { key: 'safety', label: 'Safety', format: 'percent', higherBetter: true },
    { key: 'latency', label: 'Latency', format: 'ms', higherBetter: false },
    { key: 'costPer1kTokens', label: 'Cost/1K Tokens', format: 'currency', higherBetter: false },
    { key: 'contextWindow', label: 'Context Window', format: 'tokens', higherBetter: true },
];
var ComparisonTable = function (_a) {
    var models = _a.models;
    var rankings = (0, react_1.useMemo)(function () {
        var result = {};
        METRIC_ROWS.forEach(function (metric) {
            var values = models.map(function (model, idx) {
                var value;
                if (metric.key in (models[0].metrics || {})) {
                    value = model.metrics[metric.key];
                }
                else {
                    value = model[metric.key];
                }
                return { idx: idx, value: value };
            });
            values.sort(function (a, b) { return metric.higherBetter ? b.value - a.value : a.value - b.value; });
            result[metric.key] = values.map(function (v) { return v.idx; });
        });
        return result;
    }, [models]);
    var formatValue = function (model, metric) {
        var value;
        if (metric.key in (model.metrics || {})) {
            value = model.metrics[metric.key];
        }
        else {
            value = model[metric.key];
        }
        switch (metric.format) {
            case 'percent':
                return "".concat(value, "%");
            case 'ms':
                return "".concat(value, "ms");
            case 'currency':
                return "$".concat(value.toFixed(4));
            case 'tokens':
                return "".concat((value / 1000).toFixed(0), "K");
            default:
                return value.toString();
        }
    };
    var getCellStyle = function (modelIdx, metricKey) {
        var _a;
        var rank = (_a = rankings[metricKey]) === null || _a === void 0 ? void 0 : _a.indexOf(modelIdx);
        if (rank === 0)
            return 'bg-green-500/10 text-green-600 font-medium';
        if (rank === models.length - 1)
            return 'bg-red-500/10 text-red-500';
        return '';
    };
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle className="text-lg">Detailed Comparison</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="overflow-x-auto">
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow>
                <table_1.TableHead className="w-[200px]">Metric</table_1.TableHead>
                {models.map(function (model) { return (<table_1.TableHead key={model.id} className="text-center min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{model.name}</span>
                      <badge_1.Badge variant="outline" className="text-xs">
                        {model.provider}
                      </badge_1.Badge>
                    </div>
                  </table_1.TableHead>); })}
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {METRIC_ROWS.map(function (metric) { return (<table_1.TableRow key={metric.key}>
                  <table_1.TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {metric.label}
                      {metric.higherBetter ? (<lucide_react_1.TrendingUp className="h-3 w-3 text-muted-foreground"/>) : (<lucide_react_1.TrendingDown className="h-3 w-3 text-muted-foreground"/>)}
                    </div>
                  </table_1.TableCell>
                  {models.map(function (model, idx) { return (<table_1.TableCell key={model.id} className={(0, utils_1.cn)("text-center", getCellStyle(idx, metric.key))}>
                      {formatValue(model, metric)}
                    </table_1.TableCell>); })}
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/20"/>
            <span className="text-muted-foreground">Best in category</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/20"/>
            <span className="text-muted-foreground">Lowest in category</span>
          </div>
          <div className="flex items-center gap-2">
            <lucide_react_1.TrendingUp className="h-3 w-3 text-muted-foreground"/>
            <span className="text-muted-foreground">Higher is better</span>
          </div>
          <div className="flex items-center gap-2">
            <lucide_react_1.TrendingDown className="h-3 w-3 text-muted-foreground"/>
            <span className="text-muted-foreground">Lower is better</span>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
};
exports.ComparisonTable = ComparisonTable;
