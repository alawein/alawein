import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, RotateCcw, Plus, Trash2 } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { RadarComparisonChart } from "./RadarComparisonChart";
import { BarComparisonChart } from "./BarComparisonChart";
import { ComparisonTable } from "./ComparisonTable";
import { useModelComparison } from "@/hooks/useModelComparison";
import { useToast } from "@/components/ui/use-toast";

const MAX_MODELS = 4;

export interface ModelData {
  id: string;
  name: string;
  provider: string;
  metrics: {
    accuracy: number;
    speed: number;
    cost: number;
    reasoning: number;
    creativity: number;
    safety: number;
  };
  latency: number;
  costPer1kTokens: number;
  contextWindow: number;
}

export const ModelComparisonDashboard = () => {
  const { toast } = useToast();
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o', 'claude-3-sonnet']);
  const [activeTab, setActiveTab] = useState('radar');
  
  const { models, isLoading, generateShareUrl, exportToPDF } = useModelComparison();

  const selectedModelData = useMemo(() => {
    return models.filter(m => selectedModels.includes(m.id));
  }, [models, selectedModels]);

  const handleAddModel = useCallback((modelId: string) => {
    if (selectedModels.length >= MAX_MODELS) {
      toast({
        title: "Maximum models reached",
        description: `You can compare up to ${MAX_MODELS} models at once.`,
        variant: "destructive"
      });
      return;
    }
    if (!selectedModels.includes(modelId)) {
      setSelectedModels(prev => [...prev, modelId]);
    }
  }, [selectedModels, toast]);

  const handleRemoveModel = useCallback((modelId: string) => {
    setSelectedModels(prev => prev.filter(id => id !== modelId));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedModels(['gpt-4o', 'claude-3-sonnet']);
    setActiveTab('radar');
  }, []);

  const handleShare = useCallback(async () => {
    const url = await generateShareUrl(selectedModels);
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Comparison URL copied to clipboard."
    });
  }, [selectedModels, generateShareUrl, toast]);

  const handleExport = useCallback(async () => {
    await exportToPDF(selectedModelData);
    toast({
      title: "PDF exported",
      description: "Your comparison report has been downloaded."
    });
  }, [selectedModelData, exportToPDF, toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Model Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Compare up to {MAX_MODELS} LLM models side-by-side
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selected Models</CardTitle>
          <CardDescription>
            Choose models to compare ({selectedModels.length}/{MAX_MODELS})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedModelData.map(model => (
              <Badge key={model.id} variant="secondary" className="px-3 py-2 text-sm">
                {model.name}
                <button
                  onClick={() => handleRemoveModel(model.id)}
                  className="ml-2 hover:text-destructive"
                  aria-label={`Remove ${model.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedModels.length < MAX_MODELS && (
              <ModelSelector
                models={models}
                selectedModels={selectedModels}
                onSelect={handleAddModel}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Charts */}
      {selectedModelData.length >= 2 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Charts</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
          <TabsContent value="radar" className="mt-4">
            <RadarComparisonChart models={selectedModelData} />
          </TabsContent>
          <TabsContent value="bar" className="mt-4">
            <BarComparisonChart models={selectedModelData} />
          </TabsContent>
          <TabsContent value="table" className="mt-4">
            <ComparisonTable models={selectedModelData} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Select at least 2 models to start comparing.
          </p>
        </Card>
      )}
    </div>
  );
};

