import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModelData } from "./ModelComparisonDashboard";

interface ComparisonTableProps {
  models: ModelData[];
}

const METRIC_ROWS = [
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

export const ComparisonTable = ({ models }: ComparisonTableProps) => {
  const rankings = useMemo(() => {
    const result: Record<string, number[]> = {};
    
    METRIC_ROWS.forEach(metric => {
      const values = models.map((model, idx) => {
        let value: number;
        if (metric.key in (models[0].metrics || {})) {
          value = model.metrics[metric.key as keyof typeof model.metrics];
        } else {
          value = model[metric.key as keyof ModelData] as number;
        }
        return { idx, value };
      });
      
      values.sort((a, b) => metric.higherBetter ? b.value - a.value : a.value - b.value);
      result[metric.key] = values.map(v => v.idx);
    });
    
    return result;
  }, [models]);

  const formatValue = (model: ModelData, metric: typeof METRIC_ROWS[0]) => {
    let value: number;
    if (metric.key in (model.metrics || {})) {
      value = model.metrics[metric.key as keyof typeof model.metrics];
    } else {
      value = model[metric.key as keyof ModelData] as number;
    }

    switch (metric.format) {
      case 'percent':
        return `${value}%`;
      case 'ms':
        return `${value}ms`;
      case 'currency':
        return `$${value.toFixed(4)}`;
      case 'tokens':
        return `${(value / 1000).toFixed(0)}K`;
      default:
        return value.toString();
    }
  };

  const getCellStyle = (modelIdx: number, metricKey: string) => {
    const rank = rankings[metricKey]?.indexOf(modelIdx);
    if (rank === 0) return 'bg-green-500/10 text-green-600 font-medium';
    if (rank === models.length - 1) return 'bg-red-500/10 text-red-500';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                {models.map(model => (
                  <TableHead key={model.id} className="text-center min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{model.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {METRIC_ROWS.map(metric => (
                <TableRow key={metric.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {metric.label}
                      {metric.higherBetter ? (
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  {models.map((model, idx) => (
                    <TableCell
                      key={model.id}
                      className={cn("text-center", getCellStyle(idx, metric.key))}
                    >
                      {formatValue(model, metric)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/20" />
            <span className="text-muted-foreground">Best in category</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/20" />
            <span className="text-muted-foreground">Lowest in category</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Higher is better</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Lower is better</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

