import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ModelData } from "./ModelComparisonDashboard";

interface BarComparisonChartProps {
  models: ModelData[];
}

const MODEL_COLORS = [
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
];

export const BarComparisonChart = ({ models }: BarComparisonChartProps) => {
  const latencyData = useMemo(() => {
    return models.map(model => ({
      name: model.name,
      latency: model.latency,
      fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
    }));
  }, [models]);

  const costData = useMemo(() => {
    return models.map(model => ({
      name: model.name,
      cost: model.costPer1kTokens,
      fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
    }));
  }, [models]);

  const contextData = useMemo(() => {
    return models.map(model => ({
      name: model.name,
      context: model.contextWindow / 1000, // Convert to K
      fill: MODEL_COLORS[models.indexOf(model) % MODEL_COLORS.length]
    }));
  }, [models]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Latency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" unit="ms" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                <Tooltip
                  formatter={(value: number) => [`${value}ms`, 'Latency']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="latency" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average time to first token (lower is better)
          </p>
        </CardContent>
      </Card>

      {/* Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost per 1K Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" unit="$" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(4)}`, 'Cost']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Combined input/output token cost (lower is better)
          </p>
        </CardContent>
      </Card>

      {/* Context Window Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Context Window Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contextData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis unit="K" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value}K tokens`, 'Context']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="context" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum tokens the model can process (higher is better)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

