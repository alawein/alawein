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
exports.DebateMode = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var DebateMode = function () {
    var _a = (0, react_1.useState)(""), topic = _a[0], setTopic = _a[1];
    var _b = (0, react_1.useState)(""), proponentModel = _b[0], setProponentModel = _b[1];
    var _c = (0, react_1.useState)(""), skepticModel = _c[0], setSkepticModel = _c[1];
    var _d = (0, react_1.useState)([]), messages = _d[0], setMessages = _d[1];
    var _e = (0, react_1.useState)(false), isRunning = _e[0], setIsRunning = _e[1];
    var _f = (0, react_1.useState)(0), currentRound = _f[0], setCurrentRound = _f[1];
    var _g = (0, react_1.useState)({ proponent: 0, skeptic: 0 }), scores = _g[0], setScores = _g[1];
    var models = [
        "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3.1 70B"
    ];
    var mockDebateTopics = [
        "Nuclear fusion is the best long-term solution to the energy crisis",
        "AI should be regulated at the international level",
        "Remote work is more beneficial than in-person work for most companies",
        "Universal Basic Income should be implemented globally"
    ];
    var startDebate = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!topic || !proponentModel || !skepticModel)
                return [2 /*return*/];
            setIsRunning(true);
            setCurrentRound(1);
            setMessages([{
                    id: "system-start",
                    role: "system",
                    content: "Debate started: \"".concat(topic, "\"\nProponent (").concat(proponentModel, ") vs Skeptic (").concat(skepticModel, ")\nRound 1 of 3"),
                    timestamp: new Date()
                }]);
            // Mock debate simulation
            setTimeout(function () {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "msg-1",
                        role: "proponent",
                        content: "I strongly believe that ".concat(topic.toLowerCase(), ". Here's my opening argument:\n\nThe evidence clearly supports this position because of three key factors: sustainability, efficiency, and scalability. Recent studies from MIT and Stanford demonstrate that this approach offers unprecedented advantages over traditional alternatives.\n\nThe economic implications alone justify immediate investment and implementation."),
                        timestamp: new Date(),
                        model: proponentModel,
                        citations: ["MIT Energy Initiative 2024", "Stanford Research Paper"]
                    }], false); });
            }, 1500);
            setTimeout(function () {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "msg-2",
                        role: "skeptic",
                        content: "I respectfully disagree with this position. While the proponent raises interesting points, there are significant flaws in this reasoning:\n\nFirst, the studies cited don't account for real-world implementation challenges. Second, the cost-benefit analysis is incomplete. Third, there are viable alternatives that haven't been properly considered.\n\nThe evidence suggests a more nuanced approach is needed.",
                        timestamp: new Date(),
                        model: skepticModel,
                        citations: ["Economic Analysis Quarterly", "Implementation Studies Review"]
                    }], false); });
            }, 3000);
            setTimeout(function () {
                setScores({ proponent: 85, skeptic: 78 });
                setCurrentRound(2);
            }, 4500);
            return [2 /*return*/];
        });
    }); };
    var resetDebate = function () {
        setMessages([]);
        setIsRunning(false);
        setCurrentRound(0);
        setScores({ proponent: 0, skeptic: 0 });
    };
    return (<div className="space-y-6">
      {/* Configuration Panel */}
      <card_1.Card className="p-6 gradient-surface border-trust/20 hover:border-trust/40 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <lucide_react_1.Swords className="h-5 w-5 text-trust"/>
          <h3 className="text-lg font-bold text-foreground">Combat Configuration</h3>
          <badge_1.Badge className="bg-trust/10 text-trust">Arena Mode</badge_1.Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Proponent Model</label>
            <select_1.Select value={proponentModel} onValueChange={setProponentModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select proponent model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Skeptic Model</label>
            <select_1.Select value={skepticModel} onValueChange={setSkepticModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select skeptic model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Debate Topic</label>
          <textarea_1.Textarea placeholder="Enter a debatable topic or select from suggestions below..." value={topic} onChange={function (e) { return setTopic(e.target.value); }} className="min-h-[80px]"/>
          <div className="flex flex-wrap gap-2 mt-2">
            {mockDebateTopics.map(function (suggestion, index) { return (<button_1.Button key={index} variant="outline" size="sm" onClick={function () { return setTopic(suggestion); }} className="text-xs">
                {suggestion}
              </button_1.Button>); })}
          </div>
        </div>

        <div className="flex gap-2">
          <button_1.Button onClick={startDebate} disabled={!topic || !proponentModel || !skepticModel || isRunning} variant="trust" className="hover-scale">
            <lucide_react_1.Play className="h-4 w-4"/>
            Initiate Combat
          </button_1.Button>
          <button_1.Button onClick={resetDebate} variant="outline" className="hover:border-risk hover:text-risk">
            <lucide_react_1.RotateCcw className="h-4 w-4"/>
            Reset Arena
          </button_1.Button>
        </div>
      </card_1.Card>

      {/* Debate Arena */}
      {messages.length > 0 && (<div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2">
            <card_1.Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Live Debate</h3>
                {isRunning && (<div className="flex items-center gap-2">
                    <lucide_react_1.Timer className="h-4 w-4 text-accent animate-pulse"/>
                    <span className="text-sm text-accent">Round {currentRound} of 3</span>
                  </div>)}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.map(function (message) { return (<div key={message.id} className="animate-fade-in">
                    {message.role === "system" ? (<div className="text-center py-2">
                        <badge_1.Badge variant="secondary">{message.content}</badge_1.Badge>
                      </div>) : (<card_1.Card className={"p-4 ".concat(message.role === "proponent"
                        ? "border-l-4 border-l-accent bg-accent/5"
                        : "border-l-4 border-l-primary bg-primary/5")}>
                        <div className="flex items-center gap-2 mb-2">
                          <badge_1.Badge className={message.role === "proponent"
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"}>
                            {message.role === "proponent" ? "Proponent" : "Skeptic"}
                          </badge_1.Badge>
                          <span className="text-sm text-muted-foreground">{message.model}</span>
                        </div>
                        <p className="text-foreground whitespace-pre-line">{message.content}</p>
                        {message.citations && (<div className="mt-2 pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                              <strong>Citations:</strong> {message.citations.join(", ")}
                            </div>
                          </div>)}
                      </card_1.Card>)}
                  </div>); })}
              </div>
            </card_1.Card>
          </div>

          {/* Scoring Panel */}
          <div className="space-y-4">
            <card_1.Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <lucide_react_1.Crown className="h-5 w-5 text-accent"/>
                <h3 className="text-lg font-bold text-foreground">Live Scoring</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Proponent ({proponentModel})</span>
                  <badge_1.Badge className="bg-accent/10 text-accent">{scores.proponent}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: "".concat(scores.proponent, "%") }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Skeptic ({skepticModel})</span>
                  <badge_1.Badge className="bg-primary/10 text-primary">{scores.skeptic}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "".concat(scores.skeptic, "%") }}></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Scoring Criteria</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Logical consistency</div>
                  <div>• Factual accuracy</div>
                  <div>• Citation quality</div>
                  <div>• Persuasiveness</div>
                </div>
              </div>
            </card_1.Card>

            <card_1.Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <lucide_react_1.MessageSquare className="h-5 w-5 text-primary"/>
                <h3 className="text-lg font-bold text-foreground">Arbiter Notes</h3>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Proponent provides strong evidence but lacks counterargument consideration</p>
                <p>• Skeptic raises valid concerns about implementation</p>
                <p>• Both models cite relevant sources</p>
              </div>
            </card_1.Card>
          </div>
        </div>)}
    </div>);
};
exports.DebateMode = DebateMode;
