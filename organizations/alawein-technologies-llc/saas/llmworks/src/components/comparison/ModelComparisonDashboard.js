"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelComparisonDashboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var ModelSelector_1 = require("./ModelSelector");
var RadarComparisonChart_1 = require("./RadarComparisonChart");
var BarComparisonChart_1 = require("./BarComparisonChart");
var ComparisonTable_1 = require("./ComparisonTable");
var useModelComparison_1 = require("@/hooks/useModelComparison");
var use_toast_1 = require("@/components/ui/use-toast");
var MAX_MODELS = 4;
var ModelComparisonDashboard = function () {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(['gpt-4o', 'claude-3-sonnet']), selectedModels = _a[0], setSelectedModels = _a[1];
    var _b = (0, react_1.useState)('radar'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, useModelComparison_1.useModelComparison)(), models = _c.models, isLoading = _c.isLoading, generateShareUrl = _c.generateShareUrl, exportToPDF = _c.exportToPDF;
    var selectedModelData = (0, react_1.useMemo)(function () {
        return models.filter(function (m) { return selectedModels.includes(m.id); });
    }, [models, selectedModels]);
    var handleAddModel = (0, react_1.useCallback)(function (modelId) {
        if (selectedModels.length >= MAX_MODELS) {
            toast({
                title: "Maximum models reached",
                description: "You can compare up to ".concat(MAX_MODELS, " models at once."),
                variant: "destructive"
            });
            return;
        }
        if (!selectedModels.includes(modelId)) {
            setSelectedModels(function (prev) { return __spreadArray(__spreadArray([], prev, true), [modelId], false); });
        }
    }, [selectedModels, toast]);
    var handleRemoveModel = (0, react_1.useCallback)(function (modelId) {
        setSelectedModels(function (prev) { return prev.filter(function (id) { return id !== modelId; }); });
    }, []);
    var handleReset = (0, react_1.useCallback)(function () {
        setSelectedModels(['gpt-4o', 'claude-3-sonnet']);
        setActiveTab('radar');
    }, []);
    var handleShare = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateShareUrl(selectedModels)];
                case 1:
                    url = _a.sent();
                    return [4 /*yield*/, navigator.clipboard.writeText(url)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Link copied!",
                        description: "Comparison URL copied to clipboard."
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [selectedModels, generateShareUrl, toast]);
    var handleExport = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exportToPDF(selectedModelData)];
                case 1:
                    _a.sent();
                    toast({
                        title: "PDF exported",
                        description: "Your comparison report has been downloaded."
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [selectedModelData, exportToPDF, toast]);
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Model Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Compare up to {MAX_MODELS} LLM models side-by-side
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" size="sm" onClick={handleReset}>
            <lucide_react_1.RotateCcw className="h-4 w-4 mr-2"/>
            Reset
          </button_1.Button>
          <button_1.Button variant="outline" size="sm" onClick={handleShare}>
            <lucide_react_1.Share2 className="h-4 w-4 mr-2"/>
            Share
          </button_1.Button>
          <button_1.Button size="sm" onClick={handleExport}>
            <lucide_react_1.Download className="h-4 w-4 mr-2"/>
            Export PDF
          </button_1.Button>
        </div>
      </div>

      {/* Model Selection */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Selected Models</card_1.CardTitle>
          <card_1.CardDescription>
            Choose models to compare ({selectedModels.length}/{MAX_MODELS})
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedModelData.map(function (model) { return (<badge_1.Badge key={model.id} variant="secondary" className="px-3 py-2 text-sm">
                {model.name}
                <button onClick={function () { return handleRemoveModel(model.id); }} className="ml-2 hover:text-destructive" aria-label={"Remove ".concat(model.name)}>
                  <lucide_react_1.Trash2 className="h-3 w-3"/>
                </button>
              </badge_1.Badge>); })}
            {selectedModels.length < MAX_MODELS && (<ModelSelector_1.ModelSelector models={models} selectedModels={selectedModels} onSelect={handleAddModel}/>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Comparison Charts */}
      {selectedModelData.length >= 2 ? (<tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
          <tabs_1.TabsList className="grid w-full grid-cols-3">
            <tabs_1.TabsTrigger value="radar">Radar Chart</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="bar">Bar Charts</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="table">Data Table</tabs_1.TabsTrigger>
          </tabs_1.TabsList>
          <tabs_1.TabsContent value="radar" className="mt-4">
            <RadarComparisonChart_1.RadarComparisonChart models={selectedModelData}/>
          </tabs_1.TabsContent>
          <tabs_1.TabsContent value="bar" className="mt-4">
            <BarComparisonChart_1.BarComparisonChart models={selectedModelData}/>
          </tabs_1.TabsContent>
          <tabs_1.TabsContent value="table" className="mt-4">
            <ComparisonTable_1.ComparisonTable models={selectedModelData}/>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>) : (<card_1.Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Select at least 2 models to start comparing.
          </p>
        </card_1.Card>)}
    </div>);
};
exports.ModelComparisonDashboard = ModelComparisonDashboard;
