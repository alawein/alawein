"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarComparisonChart = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var MODEL_COLORS = [
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
];
var BarComparisonChart = function (_a) {
    var models = _a.models;
    var latencyData = (0, react_1.useMemo)(function () {
        return models.map(function (model) { return ({
            name: model.name,
            latency: model.latency,
            fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
        }); });
    }, [models]);
    var costData = (0, react_1.useMemo)(function () {
        return models.map(function (model) { return ({
            name: model.name,
            cost: model.costPer1kTokens,
            fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
        }); });
    }, [models]);
    var contextData = (0, react_1.useMemo)(function () {
        return models.map(function (model) { return ({
            name: model.name,
            context: model.contextWindow / 1000, // Convert to K
            fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
        }); });
    }, [models]);
    return (<div className="grid gap-6 md:grid-cols-2">
      {/* Latency Chart */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Response Latency</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[250px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.BarChart data={latencyData} layout="vertical" margin={{ left: 80 }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                <recharts_1.XAxis type="number" unit="ms" tick={{ fontSize: 12 }}/>
                <recharts_1.YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75}/>
                <recharts_1.Tooltip formatter={function (value) { return ["".concat(value, "ms"), 'Latency']; }} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
        }}/>
                <recharts_1.Bar dataKey="latency" radius={[0, 4, 4, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average time to first token (lower is better)
          </p>
        </card_1.CardContent>
      </card_1.Card>

      {/* Cost Chart */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Cost per 1K Tokens</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[250px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.BarChart data={costData} layout="vertical" margin={{ left: 80 }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                <recharts_1.XAxis type="number" unit="$" tick={{ fontSize: 12 }}/>
                <recharts_1.YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75}/>
                <recharts_1.Tooltip formatter={function (value) { return ["$".concat(value.toFixed(4)), 'Cost']; }} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
        }}/>
                <recharts_1.Bar dataKey="cost" radius={[0, 4, 4, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Combined input/output token cost (lower is better)
          </p>
        </card_1.CardContent>
      </card_1.Card>

      {/* Context Window Chart */}
      <card_1.Card className="md:col-span-2">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Context Window Size</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[200px]">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.BarChart data={contextData} margin={{ left: 20, right: 20 }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                <recharts_1.XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                <recharts_1.YAxis unit="K" tick={{ fontSize: 12 }}/>
                <recharts_1.Tooltip formatter={function (value) { return ["".concat(value, "K tokens"), 'Context']; }} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
        }}/>
                <recharts_1.Bar dataKey="context" radius={[4, 4, 0, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum tokens the model can process (higher is better)
          </p>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.BarComparisonChart = BarComparisonChart;
