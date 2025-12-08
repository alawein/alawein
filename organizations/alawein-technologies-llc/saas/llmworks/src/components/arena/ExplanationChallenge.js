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
exports.ExplanationChallenge = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var slider_1 = require("@/components/ui/slider");
var lucide_react_1 = require("lucide-react");
var ExplanationChallenge = function () {
    var _a = (0, react_1.useState)(""), topic = _a[0], setTopic = _a[1];
    var _b = (0, react_1.useState)(""), expertModel = _b[0], setExpertModel = _b[1];
    var _c = (0, react_1.useState)(""), studentModel = _c[0], setStudentModel = _c[1];
    var _d = (0, react_1.useState)([12]), audienceAge = _d[0], setAudienceAge = _d[1];
    var _e = (0, react_1.useState)([5]), complexity = _e[0], setComplexity = _e[1];
    var _f = (0, react_1.useState)([]), messages = _f[0], setMessages = _f[1];
    var _g = (0, react_1.useState)(false), isRunning = _g[0], setIsRunning = _g[1];
    var _h = (0, react_1.useState)(0), currentRound = _h[0], setCurrentRound = _h[1];
    var _j = (0, react_1.useState)({ clarity: 0, empathy: 0, adaptability: 0 }), scores = _j[0], setScores = _j[1];
    var models = [
        "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Llama 3.1 70B"
    ];
    var complexTopics = [
        "How does quantum entanglement work?",
        "Why do we dream and what happens in our brain during sleep?",
        "How does artificial intelligence learn and make decisions?",
        "What is DNA and how does it determine our traits?",
        "How do black holes form and what happens inside them?"
    ];
    var startExplanation = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!topic || !expertModel || !studentModel)
                return [2 /*return*/];
            setIsRunning(true);
            setCurrentRound(1);
            setMessages([{
                    id: "system-start",
                    role: "system",
                    content: "Explanation Challenge started\nTopic: \"".concat(topic, "\"\nTarget Audience: ").concat(audienceAge[0], " years old\nComplexity Level: ").concat(complexity[0], "/10\n\nExpert (").concat(expertModel, ") will provide initial explanation..."),
                    timestamp: new Date()
                }]);
            // Mock explanation simulation
            setTimeout(function () {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "explanation-1",
                        role: "expert",
                        content: "Let me explain ".concat(topic.toLowerCase(), " in a way that makes sense!\n\nImagine you have two special coins that are magically connected. No matter how far apart you put these coins, when you flip one and it lands on heads, the other coin will INSTANTLY land on tails - even if it's on the other side of the universe!\n\nThat's kind of what quantum entanglement is like, but with tiny particles instead of coins. Scientists call these particles \"entangled\" because they're connected in this mysterious way.\n\nIt's like having invisible strings connecting them, but these strings work faster than anything - even faster than light! Einstein called this \"spooky action at a distance\" because it seemed so weird to him.\n\nThink of it like this: if you had a magic pair of gloves, and whenever you put on the left glove here, your friend on Mars would automatically have the right glove appear on their hand. That's similar to how entangled particles work!"),
                        timestamp: new Date(),
                        model: expertModel,
                        clarityScore: 85,
                        empathyScore: 78
                    }], false); });
            }, 2000);
            setTimeout(function () {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "question-1",
                        role: "student",
                        content: "That's really cool! But I have a few questions:\n\n1. How do the particles \"know\" to be opposite? Like, how does the coin on Mars know the Earth coin landed on heads?\n\n2. If it's faster than light, does that mean we could use this to send messages instantly across space?\n\n3. What makes the particles get \"entangled\" in the first place? Can any particles do this?\n\nAlso, I'm still a bit confused about the invisible strings part - are there actually strings we just can't see?",
                        timestamp: new Date(),
                        model: studentModel
                    }], false); });
            }, 4000);
            setTimeout(function () {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "explanation-2",
                        role: "expert",
                        content: "Great questions! Let me clear that up:\n\n1. **\"How do they know?\"** - Here's the really mind-bending part: they don't actually \"know\" or send signals to each other! It's more like they were \"programmed\" from the very beginning to be opposites. Imagine if you had two music boxes that were built to always play different songs - not because they talk to each other, but because that's just how they were made.\n\n2. **Sending messages** - Unfortunately, no! Even though the connection is instant, we can't control what \"heads or tails\" we get when we measure our particle. It's random! So we can't spell out words or send actual information. It's like having a coin that randomly lands on heads or tails - you can't force it to land how you want.\n\n3. **How they get entangled** - Scientists can create entangled particles in special labs using lasers and crystals. Not all particles can do this easily - it's like not all materials can become magnets.\n\n4. **The \"strings\"** - There aren't actual physical strings! I used that as a comparison to help explain it. It's more like an invisible mathematical connection. Think of it like how you and your best friend might think the same thought at the same time - there's a \"connection\" but no physical string between your brains!\n\nDoes this help clarify things?",
                        timestamp: new Date(),
                        model: expertModel,
                        clarityScore: 92,
                        empathyScore: 88
                    }], false); });
            }, 6500);
            setTimeout(function () {
                setScores({ clarity: 89, empathy: 83, adaptability: 91 });
                setCurrentRound(2);
            }, 8000);
            return [2 /*return*/];
        });
    }); };
    var resetChallenge = function () {
        setMessages([]);
        setIsRunning(false);
        setCurrentRound(0);
        setScores({ clarity: 0, empathy: 0, adaptability: 0 });
    };
    return (<div className="space-y-6">
      {/* Configuration Panel */}
      <card_1.Card className="p-6 gradient-surface">
        <div className="flex items-center gap-2 mb-4">
          <lucide_react_1.GraduationCap className="h-5 w-5 text-accent"/>
          <h3 className="text-lg font-bold text-foreground">Explanation Configuration</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Expert Model</label>
            <select_1.Select value={expertModel} onValueChange={setExpertModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select expert model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Student Model</label>
            <select_1.Select value={studentModel} onValueChange={setStudentModel}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select student model"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {models.map(function (model) { return (<select_1.SelectItem key={model} value={model}>{model}</select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Audience Age: {audienceAge[0]} years old
            </label>
            <slider_1.Slider value={audienceAge} onValueChange={setAudienceAge} max={18} min={5} step={1} className="w-full"/>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5 years</span>
              <span>18 years</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Initial Complexity: {complexity[0]}/10
            </label>
            <slider_1.Slider value={complexity} onValueChange={setComplexity} max={10} min={1} step={1} className="w-full"/>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Complex Topic to Explain</label>
          <textarea_1.Textarea placeholder="Enter a complex topic that needs to be explained simply..." value={topic} onChange={function (e) { return setTopic(e.target.value); }} className="min-h-[80px]"/>
          <div className="flex flex-wrap gap-2 mt-2">
            {complexTopics.map(function (suggestion, index) { return (<button_1.Button key={index} variant="outline" size="sm" onClick={function () { return setTopic(suggestion); }} className="text-xs">
                {suggestion}
              </button_1.Button>); })}
          </div>
        </div>

        <div className="flex gap-2">
          <button_1.Button onClick={startExplanation} disabled={!topic || !expertModel || !studentModel || isRunning} variant="gradient">
            <lucide_react_1.Play className="h-4 w-4"/>
            Start Challenge
          </button_1.Button>
          <button_1.Button onClick={resetChallenge} variant="outline">
            <lucide_react_1.RotateCcw className="h-4 w-4"/>
            Reset
          </button_1.Button>
        </div>
      </card_1.Card>

      {/* Explanation Arena */}
      {messages.length > 0 && (<div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2">
            <card_1.Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Explanation Session</h3>
                {isRunning && (<div className="flex items-center gap-2">
                    <lucide_react_1.Brain className="h-4 w-4 text-accent animate-pulse"/>
                    <span className="text-sm text-accent">Round {currentRound}</span>
                  </div>)}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.map(function (message) { return (<div key={message.id} className="animate-fade-in">
                    {message.role === "system" ? (<div className="text-center py-2">
                        <badge_1.Badge variant="secondary">{message.content}</badge_1.Badge>
                      </div>) : (<card_1.Card className={"p-4 ".concat(message.role === "expert"
                        ? "border-l-4 border-l-accent bg-accent/5"
                        : "border-l-4 border-l-primary bg-primary/5")}>
                        <div className="flex items-center gap-2 mb-2">
                          <badge_1.Badge className={message.role === "expert"
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"}>
                            {message.role === "expert" ? (<>
                                <lucide_react_1.GraduationCap className="h-3 w-3 mr-1"/>
                                Expert
                              </>) : (<>
                                <lucide_react_1.HelpCircle className="h-3 w-3 mr-1"/>
                                Student
                              </>)}
                          </badge_1.Badge>
                          <span className="text-sm text-muted-foreground">{message.model}</span>
                          {message.clarityScore && (<badge_1.Badge variant="outline" className="text-xs">
                              Clarity: {message.clarityScore}%
                            </badge_1.Badge>)}
                        </div>
                        <div className="text-foreground whitespace-pre-line prose prose-sm max-w-none">
                          {message.content}
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
                <lucide_react_1.CheckCircle className="h-5 w-5 text-accent"/>
                <h3 className="text-lg font-bold text-foreground">Explanation Quality</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Clarity</span>
                  <badge_1.Badge className="bg-accent/10 text-accent">{scores.clarity}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: "".concat(scores.clarity, "%") }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Empathy</span>
                  <badge_1.Badge className="bg-primary/10 text-primary">{scores.empathy}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "".concat(scores.empathy, "%") }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Adaptability</span>
                  <badge_1.Badge className="bg-accent/10 text-accent">{scores.adaptability}/100</badge_1.Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: "".concat(scores.adaptability, "%") }}></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Evaluation Criteria</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Age-appropriate language</div>
                  <div>• Use of analogies & examples</div>
                  <div>• Response to questions</div>
                  <div>• Engagement & patience</div>
                </div>
              </div>
            </card_1.Card>

            <card_1.Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <lucide_react_1.Brain className="h-5 w-5 text-primary"/>
                <h3 className="text-lg font-bold text-foreground">Pedagogy Notes</h3>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Excellent use of analogies (magic coins, music boxes)</p>
                <p>• Addresses student confusion directly</p>
                <p>• Maintains appropriate complexity level</p>
                <p>• Shows patience with follow-up questions</p>
              </div>
            </card_1.Card>
          </div>
        </div>)}
    </div>);
};
exports.ExplanationChallenge = ExplanationChallenge;
