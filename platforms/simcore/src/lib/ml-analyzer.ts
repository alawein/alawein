// Machine Learning utilities for physics simulation analysis
import { toast } from "@/hooks/use-toast";

export interface DataPoint {
  timestamp: number;
  parameters: Record<string, number>;
  results: Record<string, number>;
}

export interface AnalysisResult {
  patterns: Pattern[];
  predictions: Prediction[];
  insights: Insight[];
  recommendations: Recommendation[];
}

export interface Pattern {
  id: string;
  type: 'correlation' | 'trend' | 'anomaly' | 'oscillation';
  description: string;
  confidence: number;
  parameters: string[];
  timeRange: [number, number];
}

export interface Prediction {
  id: string;
  parameter: string;
  predictedValue: number;
  confidence: number;
  timeHorizon: number;
  method: string;
}

export interface Insight {
  id: string;
  type: 'optimization' | 'warning' | 'discovery' | 'efficiency';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  parameters: Record<string, number>;
  expectedImprovement: number;
  priority: 'low' | 'medium' | 'high';
}

class MLAnalyzer {
  private dataHistory: DataPoint[] = [];
  private readonly maxDataPoints = 1000;
  
  // Add data point to analysis history
  addDataPoint(parameters: Record<string, number>, results: Record<string, number>): void {
    const dataPoint: DataPoint = {
      timestamp: Date.now(),
      parameters: { ...parameters },
      results: { ...results }
    };
    
    this.dataHistory.push(dataPoint);
    
    // Keep only recent data points
    if (this.dataHistory.length > this.maxDataPoints) {
      this.dataHistory = this.dataHistory.slice(-this.maxDataPoints);
    }
  }
  
  // Perform comprehensive analysis
  async analyzeData(): Promise<AnalysisResult> {
    if (this.dataHistory.length < 10) {
      return {
        patterns: [],
        predictions: [],
        insights: [{
          id: 'insufficient-data',
          type: 'warning',
          title: 'Insufficient Data',
          description: 'Need more simulation runs for meaningful analysis',
          impact: 'medium',
          actionable: true
        }],
        recommendations: []
      };
    }
    
    const patterns = this.detectPatterns();
    const predictions = this.generatePredictions();
    const insights = this.generateInsights(patterns);
    const recommendations = this.generateRecommendations(patterns, insights);
    
    return { patterns, predictions, insights, recommendations };
  }
  
  // Detect patterns in simulation data
  private detectPatterns(): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Correlation analysis
    patterns.push(...this.detectCorrelations());
    
    // Trend analysis
    patterns.push(...this.detectTrends());
    
    // Anomaly detection
    patterns.push(...this.detectAnomalies());
    
    // Oscillation detection
    patterns.push(...this.detectOscillations());
    
    return patterns;
  }
  
  private detectCorrelations(): Pattern[] {
    const patterns: Pattern[] = [];
    const parameterKeys = Object.keys(this.dataHistory[0]?.parameters || {});
    const resultKeys = Object.keys(this.dataHistory[0]?.results || {});
    
    // Analyze correlations between parameters and results
    for (const param of parameterKeys) {
      for (const result of resultKeys) {
        const correlation = this.calculateCorrelation(param, result);
        
        if (Math.abs(correlation) > 0.7) {
          patterns.push({
            id: `correlation-${param}-${result}`,
            type: 'correlation',
            description: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation between ${param} and ${result}`,
            confidence: Math.abs(correlation),
            parameters: [param, result],
            timeRange: [this.dataHistory[0].timestamp, this.dataHistory[this.dataHistory.length - 1].timestamp]
          });
        }
      }
    }
    
    return patterns;
  }
  
  private detectTrends(): Pattern[] {
    const patterns: Pattern[] = [];
    const resultKeys = Object.keys(this.dataHistory[0]?.results || {});
    
    for (const key of resultKeys) {
      const values = this.dataHistory.map(d => d.results[key]).filter(v => v !== undefined);
      const trend = this.calculateTrend(values);
      
      if (Math.abs(trend) > 0.1) {
        patterns.push({
          id: `trend-${key}`,
          type: 'trend',
          description: `${trend > 0 ? 'Increasing' : 'Decreasing'} trend in ${key}`,
          confidence: Math.min(Math.abs(trend), 1),
          parameters: [key],
          timeRange: [this.dataHistory[0].timestamp, this.dataHistory[this.dataHistory.length - 1].timestamp]
        });
      }
    }
    
    return patterns;
  }
  
  private detectAnomalies(): Pattern[] {
    const patterns: Pattern[] = [];
    const resultKeys = Object.keys(this.dataHistory[0]?.results || {});
    
    for (const key of resultKeys) {
      const values = this.dataHistory.map(d => d.results[key]).filter(v => v !== undefined);
      const anomalies = this.findAnomalies(values);
      
      if (anomalies.length > 0) {
        patterns.push({
          id: `anomaly-${key}`,
          type: 'anomaly',
          description: `Detected ${anomalies.length} anomalous values in ${key}`,
          confidence: anomalies.length / values.length,
          parameters: [key],
          timeRange: [this.dataHistory[0].timestamp, this.dataHistory[this.dataHistory.length - 1].timestamp]
        });
      }
    }
    
    return patterns;
  }
  
  private detectOscillations(): Pattern[] {
    const patterns: Pattern[] = [];
    const resultKeys = Object.keys(this.dataHistory[0]?.results || {});
    
    for (const key of resultKeys) {
      const values = this.dataHistory.map(d => d.results[key]).filter(v => v !== undefined);
      const oscillation = this.detectOscillation(values);
      
      if (oscillation.confidence > 0.6) {
        patterns.push({
          id: `oscillation-${key}`,
          type: 'oscillation',
          description: `Oscillatory behavior detected in ${key} with period ~${oscillation.period.toFixed(1)}`,
          confidence: oscillation.confidence,
          parameters: [key],
          timeRange: [this.dataHistory[0].timestamp, this.dataHistory[this.dataHistory.length - 1].timestamp]
        });
      }
    }
    
    return patterns;
  }
  
  // Generate predictions using simple linear regression
  private generatePredictions(): Prediction[] {
    const predictions: Prediction[] = [];
    const resultKeys = Object.keys(this.dataHistory[0]?.results || {});
    
    for (const key of resultKeys) {
      const values = this.dataHistory.map(d => d.results[key]).filter(v => v !== undefined);
      
      if (values.length > 5) {
        const prediction = this.linearPredict(values);
        predictions.push({
          id: `prediction-${key}`,
          parameter: key,
          predictedValue: prediction.value,
          confidence: prediction.confidence,
          timeHorizon: 10, // Next 10 time steps
          method: 'linear_regression'
        });
      }
    }
    
    return predictions;
  }
  
  private generateInsights(patterns: Pattern[]): Insight[] {
    const insights: Insight[] = [];
    
    // Efficiency insights
    const efficiencyPattern = patterns.find(p => 
      p.type === 'correlation' && p.parameters.some(param => 
        param.includes('transmission') || param.includes('efficiency')
      )
    );
    
    if (efficiencyPattern) {
      insights.push({
        id: 'efficiency-insight',
        type: 'efficiency',
        title: 'Efficiency Optimization Opportunity',
        description: 'Strong correlation found between parameters and efficiency metrics',
        impact: 'high',
        actionable: true
      });
    }
    
    // Stability insights
    const anomalyPatterns = patterns.filter(p => p.type === 'anomaly');
    if (anomalyPatterns.length > 2) {
      insights.push({
        id: 'stability-warning',
        type: 'warning',
        title: 'System Stability Concern',
        description: 'Multiple anomalies detected across different parameters',
        impact: 'medium',
        actionable: true
      });
    }
    
    // Discovery insights
    const strongCorrelations = patterns.filter(p => p.type === 'correlation' && p.confidence > 0.85);
    if (strongCorrelations.length > 0) {
      insights.push({
        id: 'discovery-insight',
        type: 'discovery',
        title: 'Strong Parameter Relationships',
        description: 'Discovered unexpected strong correlations between parameters',
        impact: 'high',
        actionable: true
      });
    }
    
    return insights;
  }
  
  private generateRecommendations(patterns: Pattern[], insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Parameter optimization recommendations
    const correlationPatterns = patterns.filter(p => p.type === 'correlation');
    
    for (const pattern of correlationPatterns) {
      if (pattern.confidence > 0.8 && pattern.parameters.length === 2) {
        recommendations.push({
          id: `optimize-${pattern.id}`,
          title: `Optimize ${pattern.parameters[0]}`,
          description: `Adjust ${pattern.parameters[0]} to improve ${pattern.parameters[1]}`,
          parameters: { [pattern.parameters[0]]: this.calculateOptimalValue(pattern) },
          expectedImprovement: pattern.confidence * 0.2,
          priority: pattern.confidence > 0.9 ? 'high' : 'medium'
        });
      }
    }
    
    // Stability recommendations
    const stabilityInsights = insights.filter(i => i.type === 'warning');
    if (stabilityInsights.length > 0) {
      recommendations.push({
        id: 'improve-stability',
        title: 'Improve System Stability',
        description: 'Reduce parameter variations to minimize anomalies',
        parameters: { timeStep: 0.0005, damping: 0.05 },
        expectedImprovement: 0.15,
        priority: 'high'
      });
    }
    
    return recommendations;
  }
  
  // Utility methods for statistical calculations
  private calculateCorrelation(paramKey: string, resultKey: string): number {
    const paramValues = this.dataHistory.map(d => d.parameters[paramKey]).filter(v => v !== undefined);
    const resultValues = this.dataHistory.map(d => d.results[resultKey]).filter(v => v !== undefined);
    
    if (paramValues.length !== resultValues.length || paramValues.length < 2) return 0;
    
    const paramMean = paramValues.reduce((a, b) => a + b, 0) / paramValues.length;
    const resultMean = resultValues.reduce((a, b) => a + b, 0) / resultValues.length;
    
    let numerator = 0;
    let paramDenominator = 0;
    let resultDenominator = 0;
    
    for (let i = 0; i < paramValues.length; i++) {
      const paramDiff = paramValues[i] - paramMean;
      const resultDiff = resultValues[i] - resultMean;
      
      numerator += paramDiff * resultDiff;
      paramDenominator += paramDiff * paramDiff;
      resultDenominator += resultDiff * resultDiff;
    }
    
    const denominator = Math.sqrt(paramDenominator * resultDenominator);
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      numerator += xDiff * (values[i] - yMean);
      denominator += xDiff * xDiff;
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  private findAnomalies(values: number[]): number[] {
    if (values.length < 5) return [];
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const threshold = 2 * stdDev;
    
    return values.filter(v => Math.abs(v - mean) > threshold);
  }
  
  private detectOscillation(values: number[]): { confidence: number; period: number } {
    if (values.length < 10) return { confidence: 0, period: 0 };
    
    // Simple autocorrelation-based period detection
    let maxCorrelation = 0;
    let bestPeriod = 0;
    
    for (let period = 2; period <= Math.floor(values.length / 3); period++) {
      let correlation = 0;
      let count = 0;
      
      for (let i = 0; i < values.length - period; i++) {
        correlation += values[i] * values[i + period];
        count++;
      }
      
      correlation /= count;
      
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    return {
      confidence: Math.min(maxCorrelation / 100, 1), // Normalize
      period: bestPeriod
    };
  }
  
  private linearPredict(values: number[]): { value: number; confidence: number } {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - xMean) * (y[i] - yMean);
      denominator += (x[i] - xMean) ** 2;
    }
    
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    const predictedValue = slope * n + intercept; // Next value
    
    // Calculate R-squared for confidence
    let totalSumSquares = 0;
    let residualSumSquares = 0;
    
    for (let i = 0; i < n; i++) {
      const predicted = slope * x[i] + intercept;
      totalSumSquares += (y[i] - yMean) ** 2;
      residualSumSquares += (y[i] - predicted) ** 2;
    }
    
    const rSquared = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares);
    
    return {
      value: predictedValue,
      confidence: Math.max(0, rSquared)
    };
  }
  
  private calculateOptimalValue(pattern: Pattern): number {
    // Simple optimization: return value that maximizes positive correlation
    const recentData = this.dataHistory.slice(-10);
    const paramKey = pattern.parameters[0];
    const values = recentData.map(d => d.parameters[paramKey]).filter(v => v !== undefined);
    
    if (values.length === 0) return 0;
    
    // Return value 10% higher than current average for positive correlations
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return average * (pattern.description.includes('positive') ? 1.1 : 0.9);
  }
  
  // Get summary statistics
  getDataSummary(): Record<string, any> {
    if (this.dataHistory.length === 0) return {};
    
    const summary: Record<string, any> = {
      totalDataPoints: this.dataHistory.length,
      timeSpan: this.dataHistory[this.dataHistory.length - 1].timestamp - this.dataHistory[0].timestamp,
      parameters: {},
      results: {}
    };
    
    // Calculate statistics for parameters
    const paramKeys = Object.keys(this.dataHistory[0].parameters);
    for (const key of paramKeys) {
      const values = this.dataHistory.map(d => d.parameters[key]).filter(v => v !== undefined);
      summary.parameters[key] = this.calculateStats(values);
    }
    
    // Calculate statistics for results
    const resultKeys = Object.keys(this.dataHistory[0].results);
    for (const key of resultKeys) {
      const values = this.dataHistory.map(d => d.results[key]).filter(v => v !== undefined);
      summary.results[key] = this.calculateStats(values);
    }
    
    return summary;
  }
  
  private calculateStats(values: number[]): Record<string, number> {
    if (values.length === 0) return {};
    
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    
    return {
      count: values.length,
      mean,
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      std: Math.sqrt(variance),
      range: sorted[sorted.length - 1] - sorted[0]
    };
  }
  
  // Clear all data
  clearData(): void {
    this.dataHistory = [];
    toast({
      title: "Data Cleared",
      description: "Analysis history has been reset",
    });
  }
}

export const mlAnalyzer = new MLAnalyzer();
