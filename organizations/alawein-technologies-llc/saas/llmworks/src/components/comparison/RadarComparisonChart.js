"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarComparisonChart = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var MODEL_COLORS = [
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
];
var METRICS = [
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'speed', label: 'Speed' },
    { key: 'cost', label: 'Cost Efficiency' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'creativity', label: 'Creativity' },
    { key: 'safety', label: 'Safety' },
];
var RadarComparisonChart = function (_a) {
    var models = _a.models;
    var chartData = (0, react_1.useMemo)(function () {
        return METRICS.map(function (metric) {
            var dataPoint = { metric: metric.label };
            models.forEach(function (model) {
                dataPoint[model.id] = model.metrics[metric.key];
            });
            return dataPoint;
        });
    }, [models]);
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle className="text-lg">Performance Radar</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="h-[400px] w-full">
          <recharts_1.ResponsiveContainer width="100%" height="100%">
            <recharts_1.RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <recharts_1.PolarGrid stroke="#374151" strokeOpacity={0.3}/>
              <recharts_1.PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }}/>
              <recharts_1.PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} tickCount={5}/>
              {models.map(function (model, index) { return (<recharts_1.Radar key={model.id} name={model.name} dataKey={model.id} stroke={MODEL_COLORS[index % MODEL_COLORS.length]} fill={MODEL_COLORS[index % MODEL_COLORS.length]} fillOpacity={0.15} strokeWidth={2}/>); })}
              <recharts_1.Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
        }} labelStyle={{ color: 'hsl(var(--foreground))' }}/>
              <recharts_1.Legend wrapperStyle={{ paddingTop: 20 }} formatter={function (value) { return (<span className="text-foreground text-sm">{value}</span>); }}/>
            </recharts_1.RadarChart>
          </recharts_1.ResponsiveContainer>
        </div>

        {/* Metric Descriptions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          {METRICS.map(function (metric) { return (<div key={metric.key} className="text-sm">
              <span className="font-medium text-foreground">{metric.label}</span>
              <div className="flex gap-2 mt-1">
                {models.map(function (model, index) { return (<span key={model.id} className="text-xs px-2 py-0.5 rounded" style={{
                    backgroundColor: "".concat(MODEL_COLORS[index], "20"),
                    color: MODEL_COLORS[index]
                }}>
                    {model.metrics[metric.key]}%
                  </span>); })}
              </div>
            </div>); })}
        </div>
      </card_1.CardContent>
    </card_1.Card>);
};
exports.RadarComparisonChart = RadarComparisonChart;
