import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import type { ModelData } from "./ModelComparisonDashboard";

interface RadarComparisonChartProps {
  models: ModelData[];
}

const MODEL_COLORS = [
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
];

const METRICS = [
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'speed', label: 'Speed' },
  { key: 'cost', label: 'Cost Efficiency' },
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'safety', label: 'Safety' },
];

export const RadarComparisonChart = ({ models }: RadarComparisonChartProps) => {
  const chartData = useMemo(() => {
    return METRICS.map(metric => {
      const dataPoint: Record<string, string | number> = { metric: metric.label };
      models.forEach(model => {
        dataPoint[model.id] = model.metrics[metric.key as keyof typeof model.metrics];
      });
      return dataPoint;
    });
  }, [models]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#374151" strokeOpacity={0.3} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickCount={5}
              />
              {models.map((model, index) => (
                <Radar
                  key={model.id}
                  name={model.name}
                  dataKey={model.id}
                  stroke={MODEL_COLORS[index % MODEL_COLORS.length]}
                  fill={MODEL_COLORS[index % MODEL_COLORS.length]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-foreground text-sm">{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Descriptions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          {METRICS.map(metric => (
            <div key={metric.key} className="text-sm">
              <span className="font-medium text-foreground">{metric.label}</span>
              <div className="flex gap-2 mt-1">
                {models.map((model, index) => (
                  <span
                    key={model.id}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${MODEL_COLORS[index]}20`,
                      color: MODEL_COLORS[index]
                    }}
                  >
                    {model.metrics[metric.key as keyof typeof model.metrics]}%
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

