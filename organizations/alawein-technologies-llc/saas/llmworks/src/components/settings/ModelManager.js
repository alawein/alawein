"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ModelManager = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var ModelManager = function () {
    var _a = (0, react_1.useState)([
        {
            id: "gpt-4o",
            name: "GPT-4o",
            provider: "OpenAI",
            isActive: true,
            maxTokens: 4096,
            temperature: 0.7,
            description: "Latest GPT-4 optimized model"
        },
        {
            id: "claude-3.5-sonnet",
            name: "Claude 3.5 Sonnet",
            provider: "Anthropic",
            isActive: true,
            maxTokens: 4096,
            temperature: 0.7,
            description: "Anthropic's most capable model"
        },
        {
            id: "gemini-1.5-pro",
            name: "Gemini 1.5 Pro",
            provider: "Google",
            isActive: false,
            maxTokens: 2048,
            temperature: 0.7,
            description: "Google's latest multimodal model"
        }
    ]), models = _a[0], setModels = _a[1];
    var _b = (0, react_1.useState)({
        name: "",
        provider: "",
        maxTokens: 4096,
        temperature: 0.7,
        description: ""
    }), newModel = _b[0], setNewModel = _b[1];
    var _c = (0, react_1.useState)(null), editingModel = _c[0], setEditingModel = _c[1];
    var providers = ["OpenAI", "Anthropic", "Google", "Meta", "Cohere", "Custom"];
    var addModel = function () {
        if (!newModel.name || !newModel.provider)
            return;
        var model = {
            id: "model-".concat(Date.now()),
            name: newModel.name,
            provider: newModel.provider,
            isActive: false,
            maxTokens: newModel.maxTokens || 4096,
            temperature: newModel.temperature || 0.7,
            description: newModel.description || ""
        };
        setModels(__spreadArray(__spreadArray([], models, true), [model], false));
        setNewModel({
            name: "",
            provider: "",
            maxTokens: 4096,
            temperature: 0.7,
            description: ""
        });
    };
    var toggleModel = function (id) {
        setModels(models.map(function (model) {
            return model.id === id ? __assign(__assign({}, model), { isActive: !model.isActive }) : model;
        }));
    };
    var deleteModel = function (id) {
        setModels(models.filter(function (model) { return model.id !== id; }));
    };
    var updateModel = function (id, updates) {
        setModels(models.map(function (model) {
            return model.id === id ? __assign(__assign({}, model), updates) : model;
        }));
    };
    var testConnection = function (modelId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Mock API test
            console.log("Testing connection for model: ".concat(modelId));
            return [2 /*return*/];
        });
    }); };
    return (<div className="space-y-6">
      {/* Add New Model */}
      <card_1.Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <lucide_react_1.Plus className="h-5 w-5 text-primary"/>
          <h3 className="text-lg font-bold text-foreground">Add New Model</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label_1.Label htmlFor="model-name">Model Name</label_1.Label>
            <input_1.Input id="model-name" value={newModel.name || ""} onChange={function (e) { return setNewModel(__assign(__assign({}, newModel), { name: e.target.value })); }} placeholder="e.g., GPT-4 Turbo"/>
          </div>
          <div>
            <label_1.Label htmlFor="provider">Provider</label_1.Label>
            <select_1.Select value={newModel.provider || ""} onValueChange={function (value) { return setNewModel(__assign(__assign({}, newModel), { provider: value })); }}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select provider"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {providers.map(function (provider) { return (<select_1.SelectItem key={provider} value={provider}>{provider}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label_1.Label htmlFor="max-tokens">Max Tokens</label_1.Label>
            <input_1.Input id="max-tokens" type="number" value={newModel.maxTokens || 4096} onChange={function (e) { return setNewModel(__assign(__assign({}, newModel), { maxTokens: parseInt(e.target.value) })); }}/>
          </div>
          <div>
            <label_1.Label htmlFor="temperature">Temperature</label_1.Label>
            <input_1.Input id="temperature" type="number" step="0.1" min="0" max="2" value={newModel.temperature || 0.7} onChange={function (e) { return setNewModel(__assign(__assign({}, newModel), { temperature: parseFloat(e.target.value) })); }}/>
          </div>
        </div>

        <div className="mb-4">
          <label_1.Label htmlFor="description">Description</label_1.Label>
          <textarea_1.Textarea id="description" value={newModel.description || ""} onChange={function (e) { return setNewModel(__assign(__assign({}, newModel), { description: e.target.value })); }} placeholder="Brief description of the model..."/>
        </div>

        <button_1.Button onClick={addModel} variant="gradient">
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Model
        </button_1.Button>
      </card_1.Card>

      {/* Model List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Configured Models</h3>
        
        {models.map(function (model) { return (<card_1.Card key={model.id} className="p-6">
            {editingModel === model.id ? (<div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label_1.Label>Model Name</label_1.Label>
                    <input_1.Input value={model.name} onChange={function (e) { return updateModel(model.id, { name: e.target.value }); }}/>
                  </div>
                  <div>
                    <label_1.Label>Provider</label_1.Label>
                    <select_1.Select value={model.provider} onValueChange={function (value) { return updateModel(model.id, { provider: value }); }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {providers.map(function (provider) { return (<select_1.SelectItem key={provider} value={provider}>{provider}</select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label_1.Label>Max Tokens</label_1.Label>
                    <input_1.Input type="number" value={model.maxTokens} onChange={function (e) { return updateModel(model.id, { maxTokens: parseInt(e.target.value) }); }}/>
                  </div>
                  <div>
                    <label_1.Label>Temperature</label_1.Label>
                    <input_1.Input type="number" step="0.1" value={model.temperature} onChange={function (e) { return updateModel(model.id, { temperature: parseFloat(e.target.value) }); }}/>
                  </div>
                </div>

                <div>
                  <label_1.Label>Description</label_1.Label>
                  <textarea_1.Textarea value={model.description} onChange={function (e) { return updateModel(model.id, { description: e.target.value }); }}/>
                </div>

                <div className="flex gap-2">
                  <button_1.Button onClick={function () { return setEditingModel(null); }} variant="default">
                    Save Changes
                  </button_1.Button>
                  <button_1.Button onClick={function () { return setEditingModel(null); }} variant="outline">
                    Cancel
                  </button_1.Button>
                </div>
              </div>) : (<div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <lucide_react_1.Brain className="h-5 w-5 text-primary"/>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{model.name}</h4>
                      <badge_1.Badge variant="outline">{model.provider}</badge_1.Badge>
                      <badge_1.Badge className={model.isActive ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                        {model.isActive ? "Active" : "Inactive"}
                      </badge_1.Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Max Tokens: {model.maxTokens}</span>
                      <span>Temperature: {model.temperature}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <switch_1.Switch checked={model.isActive} onCheckedChange={function () { return toggleModel(model.id); }}/>
                  <button_1.Button onClick={function () { return testConnection(model.id); }} variant="ghost" size="sm">
                    <lucide_react_1.Zap className="h-4 w-4"/>
                  </button_1.Button>
                  <button_1.Button onClick={function () { return setEditingModel(model.id); }} variant="ghost" size="sm">
                    <lucide_react_1.Edit className="h-4 w-4"/>
                  </button_1.Button>
                  <button_1.Button onClick={function () { return deleteModel(model.id); }} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                  </button_1.Button>
                </div>
              </div>)}
          </card_1.Card>); })}
      </div>

      {/* Connection Status */}
      <card_1.Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <lucide_react_1.Server className="h-5 w-5 text-accent"/>
          <h3 className="text-lg font-bold text-foreground">Connection Status</h3>
        </div>

        <div className="space-y-3">
          {models.filter(function (m) { return m.isActive; }).map(function (model) { return (<div key={model.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <lucide_react_1.CheckCircle className="h-4 w-4 text-accent"/>
                <span className="font-medium text-foreground">{model.name}</span>
              </div>
              <badge_1.Badge className="bg-accent/10 text-accent">Connected</badge_1.Badge>
            </div>); })}
        </div>
      </card_1.Card>
    </div>);
};
exports.ModelManager = ModelManager;
