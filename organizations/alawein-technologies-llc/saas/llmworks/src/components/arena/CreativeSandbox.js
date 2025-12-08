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
exports.CreativeSandbox = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var CreativeSandbox = function () {
    var _a = (0, react_1.useState)(""), task = _a[0], setTask = _a[1];
    var _b = (0, react_1.useState)(""), creatorModel = _b[0], setCreatorModel = _b[1];
    var _c = (0, react_1.useState)(""), refinerModel = _c[0], setRefinerModel = _c[1];
    var _d = (0, react_1.useState)(""), brandVoice = _d[0], setBrandVoice = _d[1];
    var _e = (0, react_1.useState)(""), targetAudience = _e[0], setTargetAudience = _e[1];
    var _f = (0, react_1.useState)([]), outputs = _f[0], setOutputs = _f[1];
    var _g = (0, react_1.useState)(false), isRunning = _g[0], setIsRunning = _g[1];
    var _h = (0, react_1.useState)(0), currentIteration = _h[0], setCurrentIteration = _h[1];
    var _j = (0, react_1.useState)({ creativity: 0, brandAlignment: 0, audienceRelevance: 0 }), finalScore = _j[0], setFinalScore = _j[1];
    var models = [
        "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3.1 70B"
    ];
    var creativeTasks = [
        "Generate a marketing campaign for a sustainable coffee brand",
        "Create a product launch strategy for a new fitness app",
        "Design a brand identity for an eco-friendly fashion startup",
        "Develop a social media campaign for a tech conference"
    ];
    var brandVoices = [
        "Professional & Authoritative",
        "Friendly & Conversational",
        "Bold & Innovative",
        "Warm & Trustworthy",
        "Playful & Creative"
    ];
    var audiences = [
        "Young professionals (25-35)",
        "Tech enthusiasts",
        "Eco-conscious consumers",
        "Small business owners",
        "College students"
    ];
    var startCreativeProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!task || !creatorModel || !refinerModel)
                return [2 /*return*/];
            setIsRunning(true);
            setCurrentIteration(1);
            setOutputs([{
                    id: "system-start",
                    role: "system",
                    content: "Creative collaboration started\nTask: ".concat(task, "\nBrand Voice: ").concat(brandVoice, "\nTarget Audience: ").concat(targetAudience, "\n\nCreator (").concat(creatorModel, ") will generate initial concept..."),
                    timestamp: new Date()
                }]);
            // Mock creative process simulation
            setTimeout(function () {
                setOutputs(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "creation-1",
                        role: "creator",
                        content: "# \"EcoBlend Coffee: Brewing a Better Tomorrow\" Campaign\n\n## Core Concept\nA storytelling-driven campaign that follows coffee beans from sustainable farms to consumer cups, highlighting environmental impact at each step.\n\n## Key Elements:\n- **Tagline**: \"Every Sip Sustains\"\n- **Visual Identity**: Earth-tone palette with hand-drawn illustrations\n- **Campaign Pillars**: \n  1. Farmer partnerships & fair trade\n  2. Carbon-neutral shipping\n  3. Biodegradable packaging\n\n## Content Strategy:\n- Farm-to-cup video series\n- Interactive sustainability calculator\n- Monthly \"Impact Reports\" showing environmental benefits\n- User-generated content with #EverySipSustains\n\n## Launch Plan:\nPhase 1: Teaser campaign with mystery sustainability facts\nPhase 2: Full reveal with founder story\nPhase 3: Community challenge & engagement",
                        timestamp: new Date(),
                        model: creatorModel,
                        iteration: 1
                    }], false); });
            }, 2000);
            setTimeout(function () {
                setOutputs(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "refinement-1",
                        role: "refiner",
                        content: "**Refinement Analysis & Suggestions:**\n\n## Strengths:\n\u2705 Strong environmental narrative\n\u2705 Clear brand differentiation\n\u2705 Authentic storytelling approach\n\n## Areas for Enhancement:\n\n### 1. Brand Voice Alignment\nThe current tone is slightly too corporate for our \"Friendly & Conversational\" brand voice. Suggest:\n- More personal, intimate language\n- Coffee community terminology\n- Warmer, approachable messaging\n\n### 2. Target Audience Specificity\nYoung professionals need:\n- Mobile-first content strategy\n- LinkedIn/Instagram focus over Facebook\n- Career-growth sustainability angle (\"fuel your ambition sustainably\")\n\n### 3. Competitive Differentiation\nAdd unique elements:\n- Coffee subscription with impact tracking\n- AR packaging that shows farm origins\n- Partnership with local co-working spaces\n\n## Refined Tagline Options:\n- \"Good Coffee, Good Conscience\"\n- \"Sustainably Fueled\" \n- \"Coffee That Cares\"\n\nRecommend proceeding with iteration 2 focusing on tone adjustment and audience specificity.",
                        timestamp: new Date(),
                        model: refinerModel,
                        iteration: 1
                    }], false); });
            }, 4000);
            setTimeout(function () {
                setCurrentIteration(2);
                setFinalScore({ creativity: 88, brandAlignment: 92, audienceRelevance: 85 });
            }, 5500);
            return [2 /*return*/];
        });
    }); };
    var resetSandbox = function () {
        setOutputs([]);
        setIsRunning(false);
        setCurrentIteration(0);
        setFinalScore({ creativity: 0, brandAlignment: 0, audienceRelevance: 0 });
    };
    return (<div className="space-y-6">
      {/* Configuration Panel */}
      <card_1.Card className="p-6 gradient-surface">
        <div className="flex items-center gap-2 mb-4">
          <lucide_react_1.Lightbulb className="h-5 w-5 text-primary"/>
          <h3 className="text-lg font-bold text-foreground">Creative Brief Configuration</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Creator Model</label>
            <select_1.Select value={creatorModel} onValueChange={setCreatorModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select creator model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Refiner Model</label>
            <select_1.Select value={refinerModel} onValueChange={setRefinerModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select refiner model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Brand Voice</label>
            <select_1.Select value={brandVoice} onValueChange={setBrandVoice}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select brand voice"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {brandVoices.map(function (voice) { return (<select_1.SelectItem key={voice} value={voice}>{voice}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Target Audience</label>
            <select_1.Select value={targetAudience} onValueChange={setTargetAudience}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select target audience"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {audiences.map(function (audience) { return (<select_1.SelectItem key={audience} value={audience}>{audience}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Creative Task</label>
          <textarea_1.Textarea placeholder="Describe the creative task you want the AI models to collaborate on..." value={task} onChange={function (e) { return setTask(e.target.value); }} className="min-h-[80px]"/>
          <div className="flex flex-wrap gap-2 mt-2">
            {creativeTasks.map(function (suggestion, index) { return (<button_1.Button key={index} variant="outline" size="sm" onClick={function () { return setTask(suggestion); }} className="text-xs">
                {suggestion}
              </button_1.Button>); })}
          </div>
        </div>

        <div className="flex gap-2">
          <button_1.Button onClick={startCreativeProcess} disabled={!task || !creatorModel || !refinerModel || isRunning} variant="gradient">
            <lucide_react_1.Play className="h-4 w-4"/>
            Start Collaboration
          </button_1.Button>
          <button_1.Button onClick={resetSandbox} variant="outline">
            <lucide_react_1.RotateCcw className="h-4 w-4"/>
            Reset
          </button_1.Button>
        </div>
      </card_1.Card>

      {/* Creative Workspace */}
      {outputs.length > 0 && (<div className="grid lg:grid-cols-3 gap-6">
          {/* Collaboration Feed */}
          <div className="lg:col-span-2">
            <card_1.Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Creative Collaboration</h3>
                {isRunning && (<div className="flex items-center gap-2">
                    <lucide_react_1.Sparkles className="h-4 w-4 text-primary animate-pulse"/>
                    <span className="text-sm text-primary">Iteration {currentIteration}</span>
                  </div>)}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {outputs.map(function (output) { return (<div key={output.id} className="animate-fade-in">
                    {output.role === "system" ? (<div className="text-center py-2">
                        <badge_1.Badge variant="secondary">{output.content}</badge_1.Badge>
                      </div>) : (<card_1.Card className={"p-4 ".concat(output.role === "creator"
                        ? "border-l-4 border-l-primary bg-primary/5"
                        : "border-l-4 border-l-accent bg-accent/5")}>
                        <div className="flex items-center gap-2 mb-2">
                          <badge_1.Badge className={output.role === "creator"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"}>
                            {output.role === "creator" ? "Creator" : "Refiner"} 
                          </badge_1.Badge>
                          <span className="text-sm text-muted-foreground">{output.model}</span>
                          {output.iteration && (<badge_1.Badge variant="outline" className="text-xs">
                              v{output.iteration}
                            </badge_1.Badge>)}
                        </div>
                        <div className="text-foreground whitespace-pre-line prose prose-sm max-w-none">
                          {output.content}
                        </div>
                      </card_1.Card>)}
                  </div>); })}
              </div>
            </card_1.Card>
          </div>

          {/* Scoring Panel */}
          <div className="space-y-4">
            <card_1.Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <lucide_react_1.Target className="h-5 w-5 text-primary"/>
                <h3 className="text-lg font-bold text-foreground">Creative Scoring</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Creativity</span>
                  <badge_1.Badge className="bg-primary/10 text-primary">{finalScore.creativity}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "".concat(finalScore.creativity, "%") }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Brand Alignment</span>
                  <badge_1.Badge className="bg-accent/10 text-accent">{finalScore.brandAlignment}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: "".concat(finalScore.brandAlignment, "%") }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Audience Relevance</span>
                  <badge_1.Badge className="bg-primary/10 text-primary">{finalScore.audienceRelevance}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "".concat(finalScore.audienceRelevance, "%") }}></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Evaluation Criteria</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Originality & innovation</div>
                  <div>• Brand voice adherence</div>
                  <div>• Target audience relevance</div>
                  <div>• Collaborative refinement</div>
                </div>
              </div>
            </card_1.Card>

            <card_1.Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <lucide_react_1.Palette className="h-5 w-5 text-accent"/>
                <h3 className="text-lg font-bold text-foreground">Creative Insights</h3>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Strong environmental storytelling approach</p>
                <p>• Effective brand voice alignment after refinement</p>
                <p>• Good audience-specific adaptation</p>
                <p>• Creative use of interactive elements</p>
              </div>
            </card_1.Card>
          </div>
        </div>)}
    </div>);
};
exports.CreativeSandbox = CreativeSandbox;
