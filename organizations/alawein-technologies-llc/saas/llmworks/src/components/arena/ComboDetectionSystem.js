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
exports.ComboDetectionSystem = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ComboDetectionSystemComponent = function (_a) {
    var argumentList = _a.arguments, onComboDetected = _a.onComboDetected, onComboComplete = _a.onComboComplete, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)([]), activeCombos = _c[0], setActiveCombos = _c[1];
    var _d = (0, react_1.useState)([]), comboHistory = _d[0], setComboHistory = _d[1];
    var _e = (0, react_1.useState)({ left: 0, right: 0 }), comboCounters = _e[0], setComboCounters = _e[1];
    // Advanced pattern recognition for argument sequences
    var analyzeComboPatterns = (0, react_1.useCallback)(function (recentArgs) {
        if (recentArgs.length < 2)
            return null;
        var speaker = recentArgs[recentArgs.length - 1].speaker;
        var speakerArgs = recentArgs.filter(function (arg) { return arg.speaker === speaker; });
        if (speakerArgs.length < 2)
            return null;
        // Detect different combo types
        var comboType = detectComboType(speakerArgs);
        if (!comboType)
            return null;
        var combo = {
            id: "combo-".concat(Date.now(), "-").concat(speaker),
            type: comboType.type,
            speaker: speaker,
            arguments: speakerArgs.map(function (arg) { return arg.id; }),
            strength: calculateComboStrength(speakerArgs, comboType.type),
            multiplier: comboType.multiplier,
            description: comboType.description,
            startTime: speakerArgs[0].timestamp,
            duration: comboType.expectedDuration
        };
        return combo;
    }, []);
    var detectComboType = function (args) {
        var avgStrength = args.reduce(function (sum, arg) { return sum + arg.strength; }, 0) / args.length;
        var hasStrongProgression = args.every(function (arg, i) { return i === 0 || arg.strength >= args[i - 1].strength - 5; });
        var hasCitations = args.some(function (arg) { return arg.citations && arg.citations.length > 0; });
        var hasLogicalStructure = args.some(function (arg) { return arg.logicalStructure; });
        // Logical Chain: Sequential arguments with increasing strength and logical structure
        if (hasStrongProgression && hasLogicalStructure && args.length >= 3) {
            return {
                type: 'logical-chain',
                multiplier: 1.5,
                description: 'Systematic logical progression building to strong conclusion',
                expectedDuration: 8000
            };
        }
        // Evidence Stack: Multiple arguments with strong citations
        if (hasCitations && avgStrength > 70 && args.length >= 2) {
            return {
                type: 'evidence-stack',
                multiplier: 1.3,
                description: 'Compelling evidence accumulation with strong sources',
                expectedDuration: 6000
            };
        }
        // Counter Cascade: Rapid succession of counter-arguments
        if (args.every(function (arg) { return arg.type === 'counter'; }) && args.length >= 3) {
            return {
                type: 'counter-cascade',
                multiplier: 1.4,
                description: 'Devastating sequence of counter-arguments',
                expectedDuration: 5000
            };
        }
        // Precision Strike: Single extremely strong argument (90+)
        if (args.length === 1 && args[0].strength >= 90) {
            return {
                type: 'precision-strike',
                multiplier: 2.0,
                description: 'Surgical precision argument with devastating impact',
                expectedDuration: 4000
            };
        }
        // Overwhelming Force: Many consecutive strong arguments
        if (args.length >= 4 && avgStrength > 65) {
            return {
                type: 'overwhelming-force',
                multiplier: 1.8,
                description: 'Relentless barrage of powerful arguments',
                expectedDuration: 10000
            };
        }
        return null;
    };
    var calculateComboStrength = function (args, comboType) {
        var baseStrength = args.reduce(function (sum, arg) { return sum + arg.strength; }, 0) / args.length;
        switch (comboType) {
            case 'logical-chain': {
                // Bonus for logical progression
                var progressionBonus = args.every(function (arg, i) { return i === 0 || arg.strength > args[i - 1].strength; }) ? 20 : 0;
                return Math.min(100, baseStrength + progressionBonus);
            }
            case 'evidence-stack': {
                // Bonus for citation density
                var citationCount = args.reduce(function (sum, arg) { var _a; return sum + (((_a = arg.citations) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
                var citationBonus = Math.min(25, citationCount * 5);
                return Math.min(100, baseStrength + citationBonus);
            }
            case 'counter-cascade': {
                // Bonus for rapid succession
                var rapidityBonus = args.length >= 4 ? 15 : args.length >= 3 ? 10 : 5;
                return Math.min(100, baseStrength + rapidityBonus);
            }
            case 'precision-strike': {
                // Already high strength single argument
                return args[0].strength;
            }
            case 'overwhelming-force': {
                // Bonus for sustained pressure
                var sustainedBonus = Math.min(20, (args.length - 3) * 5);
                return Math.min(100, baseStrength + sustainedBonus);
            }
            default:
                return baseStrength;
        }
    };
    // Monitor for combo opportunities
    (0, react_1.useEffect)(function () {
        if (argumentList.length < 2)
            return;
        var recentArgs = argumentList.slice(-6); // Analyze last 6 arguments
        var detectedCombo = analyzeComboPatterns(recentArgs);
        if (detectedCombo) {
            setActiveCombos(function (prev) {
                // Prevent duplicate combos for same speaker
                var existingCombo = prev.find(function (combo) {
                    return combo.speaker === detectedCombo.speaker &&
                        Date.now() - combo.startTime.getTime() < 5000;
                });
                if (existingCombo)
                    return prev;
                return __spreadArray(__spreadArray([], prev, true), [detectedCombo], false);
            });
            setComboCounters(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[detectedCombo.speaker] = prev[detectedCombo.speaker] + 1, _a)));
            });
            onComboDetected(detectedCombo);
            // Auto-complete combo after duration
            setTimeout(function () {
                var finalScore = detectedCombo.strength * detectedCombo.multiplier;
                onComboComplete(detectedCombo, finalScore);
                setActiveCombos(function (prev) { return prev.filter(function (combo) { return combo.id !== detectedCombo.id; }); });
                setComboHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [detectedCombo], false); });
            }, detectedCombo.duration);
        }
    }, [argumentList, analyzeComboPatterns, onComboDetected, onComboComplete]);
    var getComboIcon = function (type) {
        switch (type) {
            case 'logical-chain': return lucide_react_1.Target;
            case 'evidence-stack': return lucide_react_1.Star;
            case 'counter-cascade': return lucide_react_1.Zap;
            case 'precision-strike': return lucide_react_1.Crown;
            case 'overwhelming-force': return lucide_react_1.Flame;
        }
    };
    var getComboColor = function (type) {
        switch (type) {
            case 'logical-chain': return 'from-blue-400 to-cyan-400';
            case 'evidence-stack': return 'from-green-400 to-emerald-400';
            case 'counter-cascade': return 'from-purple-400 to-violet-400';
            case 'precision-strike': return 'from-red-400 to-orange-400';
            case 'overwhelming-force': return 'from-yellow-400 to-amber-400';
        }
    };
    if (academicMode) {
        return (<div className="absolute top-4 left-4 right-4 pointer-events-none">
        {/* Academic combo indicators */}
        {activeCombos.map(function (combo) { return (<div key={combo.id} className="glass-minimal p-2 mb-2 rounded-lg">
            <div className="text-xs font-medium text-primary">
              {combo.description}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Multiplier: {combo.multiplier}x | Strength: {Math.round(combo.strength)}
            </div>
          </div>); })}
      </div>);
    }
    return (<div className="absolute inset-0 pointer-events-none overflow-hidden">
      
      {/* Active Combo Visualizations */}
      {activeCombos.map(function (combo) {
            var IconComponent = getComboIcon(combo.type);
            var gradientColor = getComboColor(combo.type);
            var position = combo.speaker === 'left' ? '25%' : '75%';
            return (<div key={combo.id} className="absolute" style={{
                    left: position,
                    top: '30%',
                    transform: 'translate(-50%, -50%)'
                }}>
            {/* Main combo visual */}
            <div className={"\n              relative w-24 h-24 rounded-full \n              bg-gradient-to-br ".concat(gradientColor, "\n              animate-pulse shadow-2xl\n            ")}>
              <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"/>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-white drop-shadow-lg animate-bounce"/>
              </div>
              
              {/* Combo energy rings */}
              {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className={"absolute border-4 border-white/30 rounded-full"} style={{
                        width: "".concat(120 + i * 30, "%"),
                        height: "".concat(120 + i * 30, "%"),
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: "combo-ring ".concat(2 + i * 0.5, "s ease-out infinite"),
                        animationDelay: "".concat(i * 0.3, "s")
                    }}/>); })}
            </div>
            
            {/* Combo information */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className="glass-panel px-3 py-1 rounded-lg">
                <div className="text-sm font-bold text-white uppercase tracking-wide">
                  {combo.type.replace('-', ' ')}
                </div>
                <div className="text-xs text-white/80">
                  {combo.multiplier}x Multiplier
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-1 bg-black/20 rounded-full overflow-hidden">
                <div className={"h-full bg-gradient-to-r ".concat(gradientColor, " transition-all duration-100")} style={{
                    animation: "combo-progress ".concat(combo.duration, "ms linear")
                }}/>
              </div>
            </div>
          </div>);
        })}

      {/* Combo Counter Display */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
        <div className="glass-minimal px-4 py-2 rounded-lg">
          <div className="text-sm font-bold text-primary">
            Left Combos: {comboCounters.left}
          </div>
        </div>
        <div className="glass-minimal px-4 py-2 rounded-lg">
          <div className="text-sm font-bold text-primary">
            Right Combos: {comboCounters.right}
          </div>
        </div>
      </div>

      {/* Combo History Trail (last 3 combos) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {comboHistory.slice(-3).map(function (combo, index) {
            var IconComponent = getComboIcon(combo.type);
            var gradientColor = getComboColor(combo.type);
            return (<div key={combo.id} className={"\n                  w-8 h-8 rounded-full bg-gradient-to-br ".concat(gradientColor, "\n                  flex items-center justify-center opacity-60\n                  transform transition-all duration-300\n                ")} style={{
                    scale: 1 - index * 0.1,
                    animationDelay: "".concat(index * 100, "ms")
                }}>
                <IconComponent className="h-4 w-4 text-white"/>
              </div>);
        })}
        </div>
      </div>

      {/* Custom animations */}
      <style>{"\n        @keyframes combo-ring {\n          0% {\n            transform: translate(-50%, -50%) scale(0.8);\n            opacity: 0.8;\n          }\n          100% {\n            transform: translate(-50%, -50%) scale(1.5);\n            opacity: 0;\n          }\n        }\n\n        @keyframes combo-progress {\n          0% { width: 0%; }\n          100% { width: 100%; }\n        }\n      "}</style>
    </div>);
};
exports.ComboDetectionSystem = (0, react_1.memo)(ComboDetectionSystemComponent);
