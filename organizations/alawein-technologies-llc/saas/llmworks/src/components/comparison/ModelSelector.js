"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSelector = void 0;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var command_1 = require("@/components/ui/command");
var popover_1 = require("@/components/ui/popover");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var providerColors = {
    "OpenAI": "text-green-500",
    "Anthropic": "text-orange-500",
    "Google": "text-blue-500",
    "Meta": "text-purple-500",
    "Mistral": "text-red-500",
};
var ModelSelector = function (_a) {
    var models = _a.models, selectedModels = _a.selectedModels, onSelect = _a.onSelect;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var availableModels = models.filter(function (m) { return !selectedModels.includes(m.id); });
    var groupedModels = availableModels.reduce(function (acc, model) {
        if (!acc[model.provider]) {
            acc[model.provider] = [];
        }
        acc[model.provider].push(model);
        return acc;
    }, {});
    return (<popover_1.Popover open={open} onOpenChange={setOpen}>
      <popover_1.PopoverTrigger asChild>
        <button_1.Button variant="outline" size="sm" className="border-dashed">
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Model
        </button_1.Button>
      </popover_1.PopoverTrigger>
      <popover_1.PopoverContent className="w-[300px] p-0" align="start">
        <command_1.Command>
          <command_1.CommandInput placeholder="Search models..."/>
          <command_1.CommandList>
            <command_1.CommandEmpty>No models found.</command_1.CommandEmpty>
            {Object.entries(groupedModels).map(function (_a) {
            var provider = _a[0], providerModels = _a[1];
            return (<command_1.CommandGroup key={provider} heading={provider}>
                {providerModels.map(function (model) { return (<command_1.CommandItem key={model.id} value={model.id} onSelect={function () {
                        onSelect(model.id);
                        setOpen(false);
                    }} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${model.costPer1kTokens.toFixed(3)}/1k tokens
                        </span>
                      </div>
                      <span className={(0, utils_1.cn)("text-xs", providerColors[provider] || "text-muted-foreground")}>
                        {model.contextWindow.toLocaleString()} ctx
                      </span>
                    </div>
                  </command_1.CommandItem>); })}
              </command_1.CommandGroup>);
        })}
          </command_1.CommandList>
        </command_1.Command>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
};
exports.ModelSelector = ModelSelector;
