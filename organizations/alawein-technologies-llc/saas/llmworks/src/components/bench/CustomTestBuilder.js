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
exports.CustomTestBuilder = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var lucide_react_1 = require("lucide-react");
var CustomTestBuilder = function () {
    var _a, _b;
    var _c = (0, react_1.useState)(""), testName = _c[0], setTestName = _c[1];
    var _d = (0, react_1.useState)(""), testDescription = _d[0], setTestDescription = _d[1];
    var _e = (0, react_1.useState)([
        { prompt: "", expectedOutput: "", criteria: "" }
    ]), prompts = _e[0], setPrompts = _e[1];
    var _f = (0, react_1.useState)([
        {
            id: "test-1",
            name: "Medical Diagnosis Accuracy",
            description: "Test model's ability to provide accurate medical information",
            prompts: [
                {
                    prompt: "What are the symptoms of Type 2 diabetes?",
                    expectedOutput: "Increased thirst, frequent urination, blurred vision, fatigue",
                    criteria: "Accuracy of medical information, completeness of symptom list"
                }
            ],
            createdAt: new Date("2024-01-15")
        },
        {
            id: "test-2",
            name: "Legal Reasoning Test",
            description: "Evaluate legal analysis and reasoning capabilities",
            prompts: [
                {
                    prompt: "Explain the concept of negligence in tort law",
                    expectedOutput: "Duty of care, breach of duty, causation, damages",
                    criteria: "Legal accuracy, clarity of explanation, completeness"
                }
            ],
            createdAt: new Date("2024-01-10")
        }
    ]), savedTests = _f[0], setSavedTests = _f[1];
    var _g = (0, react_1.useState)(false), isRunning = _g[0], setIsRunning = _g[1];
    var _h = (0, react_1.useState)(""), selectedTest = _h[0], setSelectedTest = _h[1];
    var _j = (0, react_1.useState)([]), selectedModels = _j[0], setSelectedModels = _j[1];
    var models = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3.1 70B"];
    var addPrompt = function () {
        setPrompts(__spreadArray(__spreadArray([], prompts, true), [{ prompt: "", expectedOutput: "", criteria: "" }], false));
    };
    var removePrompt = function (index) {
        if (prompts.length > 1) {
            setPrompts(prompts.filter(function (_, i) { return i !== index; }));
        }
    };
    var updatePrompt = function (index, field, value) {
        var updated = prompts.map(function (prompt, i) {
            var _a;
            return i === index ? __assign(__assign({}, prompt), (_a = {}, _a[field] = value, _a)) : prompt;
        });
        setPrompts(updated);
    };
    var saveTest = function () {
        if (!testName || prompts.some(function (p) { return !p.prompt; }))
            return;
        var newTest = {
            id: "test-".concat(Date.now()),
            name: testName,
            description: testDescription,
            prompts: prompts.filter(function (p) { return p.prompt.trim(); }),
            createdAt: new Date()
        };
        setSavedTests(__spreadArray([newTest], savedTests, true));
        setTestName("");
        setTestDescription("");
        setPrompts([{ prompt: "", expectedOutput: "", criteria: "" }]);
    };
    var runCustomTest = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!selectedTest || selectedModels.length === 0)
                return [2 /*return*/];
            setIsRunning(true);
            // Mock test execution
            setTimeout(function () {
                setIsRunning(false);
                // In a real implementation, this would show results
            }, 3000);
            return [2 /*return*/];
        });
    }); };
    var exportTest = function (test) {
        var data = {
            name: test.name,
            description: test.description,
            prompts: test.prompts,
            exportedAt: new Date().toISOString()
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(test.name.toLowerCase().replace(/\s+/g, '-'), "-test.json");
        a.click();
    };
    return (<div className="space-y-6">
      {/* Test Builder */}
      <card_1.Card className="p-6 gradient-surface border-trust/20 hover:border-trust/40 transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <lucide_react_1.Plus className="h-5 w-5 text-trust"/>
          <h3 className="text-lg font-bold text-foreground">Forge Custom Evaluation</h3>
          <badge_1.Badge className="bg-trust/10 text-trust">Builder Mode</badge_1.Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label_1.Label htmlFor="test-name" className="text-sm font-medium text-foreground">Test Name</label_1.Label>
            <input_1.Input id="test-name" value={testName} onChange={function (e) { return setTestName(e.target.value); }} placeholder="Enter test name..." className="mt-1"/>
          </div>
          <div>
            <label_1.Label htmlFor="test-description" className="text-sm font-medium text-foreground">Description</label_1.Label>
            <input_1.Input id="test-description" value={testDescription} onChange={function (e) { return setTestDescription(e.target.value); }} placeholder="Brief description of the test..." className="mt-1"/>
          </div>
        </div>

        {/* Prompts Builder */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Test Prompts</h4>
            <button_1.Button onClick={addPrompt} variant="outline" size="sm">
              <lucide_react_1.Plus className="h-4 w-4 mr-1"/>
              Add Prompt
            </button_1.Button>
          </div>

          {prompts.map(function (prompt, index) { return (<card_1.Card key={index} className="p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <label_1.Label className="text-sm font-medium text-foreground">Prompt {index + 1}</label_1.Label>
                {prompts.length > 1 && (<button_1.Button onClick={function () { return removePrompt(index); }} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                  </button_1.Button>)}
              </div>

              <div className="space-y-3">
                <div>
                  <label_1.Label className="text-xs text-muted-foreground">Prompt</label_1.Label>
                  <textarea_1.Textarea value={prompt.prompt} onChange={function (e) { return updatePrompt(index, "prompt", e.target.value); }} placeholder="Enter the prompt to test..." className="mt-1"/>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label_1.Label className="text-xs text-muted-foreground">Expected Output (Optional)</label_1.Label>
                    <textarea_1.Textarea value={prompt.expectedOutput} onChange={function (e) { return updatePrompt(index, "expectedOutput", e.target.value); }} placeholder="Expected response or key points..." className="mt-1" rows={3}/>
                  </div>
                  <div>
                    <label_1.Label className="text-xs text-muted-foreground">Evaluation Criteria</label_1.Label>
                    <textarea_1.Textarea value={prompt.criteria} onChange={function (e) { return updatePrompt(index, "criteria", e.target.value); }} placeholder="How should this be evaluated..." className="mt-1" rows={3}/>
                  </div>
                </div>
              </div>
            </card_1.Card>); })}
        </div>

        <button_1.Button onClick={saveTest} disabled={!testName || prompts.some(function (p) { return !p.prompt; })} variant="trust" className="hover-scale">
          <lucide_react_1.CheckCircle className="h-4 w-4 mr-2"/>
          Forge Evaluation
        </button_1.Button>
      </card_1.Card>

      {/* Saved Tests & Runner */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Saved Tests */}
        <card_1.Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <lucide_react_1.FileText className="h-5 w-5 text-accent"/>
            <h3 className="text-lg font-bold text-foreground">Saved Tests</h3>
          </div>

          <div className="space-y-3">
            {savedTests.map(function (test) { return (<card_1.Card key={test.id} className="p-4 border border-border hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{test.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{test.prompts.length} prompts</span>
                      <span>Created {test.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button_1.Button onClick={function () { return exportTest(test); }} variant="ghost" size="sm">
                    <lucide_react_1.Download className="h-4 w-4"/>
                  </button_1.Button>
                </div>
                
                <button_1.Button onClick={function () { return setSelectedTest(test.id); }} variant={selectedTest === test.id ? "default" : "outline"} size="sm" className="w-full mt-2">
                  {selectedTest === test.id ? "Selected" : "Select for Testing"}
                </button_1.Button>
              </card_1.Card>); })}
          </div>
        </card_1.Card>

        {/* Test Runner */}
        <card_1.Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <lucide_react_1.Play className="h-5 w-5 text-primary"/>
            <h3 className="text-lg font-bold text-foreground">Run Custom Test</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label_1.Label className="text-sm font-medium text-foreground mb-2 block">Selected Test</label_1.Label>
              {selectedTest ? (<div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="font-medium text-accent">
                    {(_a = savedTests.find(function (t) { return t.id === selectedTest; })) === null || _a === void 0 ? void 0 : _a.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(_b = savedTests.find(function (t) { return t.id === selectedTest; })) === null || _b === void 0 ? void 0 : _b.prompts.length} prompts
                  </div>
                </div>) : (<div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-sm text-muted-foreground">No test selected</div>
                </div>)}
            </div>

            <div>
              <label_1.Label className="text-sm font-medium text-foreground mb-2 block">Select Models</label_1.Label>
              <div className="space-y-2">
                {models.map(function (model) { return (<label key={model} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={selectedModels.includes(model)} onChange={function (e) {
                if (e.target.checked) {
                    setSelectedModels(__spreadArray(__spreadArray([], selectedModels, true), [model], false));
                }
                else {
                    setSelectedModels(selectedModels.filter(function (m) { return m !== model; }));
                }
            }} className="rounded"/>
                    <span className="text-sm text-foreground">{model}</span>
                  </label>); })}
              </div>
            </div>

            {isRunning && (<div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Running custom test...</span>
                  <span className="text-muted-foreground">Progress</span>
                </div>
                <progress_1.Progress value={65} className="h-2"/>
              </div>)}

            <button_1.Button onClick={runCustomTest} disabled={!selectedTest || selectedModels.length === 0 || isRunning} variant="trust" className="w-full hover-scale">
              {isRunning ? (<>
                  <lucide_react_1.Settings className="h-4 w-4 mr-2 animate-spin"/>
                  Evaluating Performance...
                </>) : (<>
                  <lucide_react_1.Play className="h-4 w-4 mr-2"/>
                  Execute Evaluation
                </>)}
            </button_1.Button>
          </div>
        </card_1.Card>
      </div>
    </div>);
};
exports.CustomTestBuilder = CustomTestBuilder;
