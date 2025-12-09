import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModelData } from "./ModelComparisonDashboard";

interface ModelSelectorProps {
  models: ModelData[];
  selectedModels: string[];
  onSelect: (modelId: string) => void;
}

const providerColors: Record<string, string> = {
  "OpenAI": "text-green-500",
  "Anthropic": "text-orange-500",
  "Google": "text-blue-500",
  "Meta": "text-purple-500",
  "Mistral": "text-red-500",
};

export const ModelSelector = ({ models, selectedModels, onSelect }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);

  const availableModels = models.filter(m => !selectedModels.includes(m.id));
  const groupedModels = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelData[]>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <CommandGroup key={provider} heading={provider}>
                {providerModels.map(model => (
                  <CommandItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => {
                      onSelect(model.id);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${model.costPer1kTokens.toFixed(3)}/1k tokens
                        </span>
                      </div>
                      <span className={cn("text-xs", providerColors[provider] || "text-muted-foreground")}>
                        {model.contextWindow.toLocaleString()} ctx
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

