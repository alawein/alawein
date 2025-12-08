"use strict";
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
exports.EpicConfrontationMoments = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var EpicConfrontationMomentsComponent = function (_a) {
    var argumentExchanges = _a.argumentExchanges, onEpicMoment = _a.onEpicMoment, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)([]), activeEffects = _c[0], setActiveEffects = _c[1];
    var _d = (0, react_1.useState)([]), epicMoments = _d[0], setEpicMoments = _d[1];
    var _e = (0, react_1.useState)([]), clashZones = _e[0], setClashZones = _e[1];
    var arenaRef = (0, react_1.useRef)(null);
    // Analyze argument patterns for epic moments
    (0, react_1.useEffect)(function () {
        if (argumentExchanges.length < 2)
            return;
        var recent = argumentExchanges.slice(-2);
        var prev = recent[0], current = recent[1];
        // Detect epic moment types
        if (prev.speaker !== current.speaker) {
            var strengthDifference = Math.abs(prev.strength - current.strength);
            if (strengthDifference > 30 && current.strength > 80) {
                // Critical counter-attack
                var epicMoment = {
                    id: "epic-".concat(Date.now()),
                    type: 'critical-hit',
                    participants: [prev.speaker, current.speaker],
                    intensity: current.strength,
                    description: 'Devastating counter-argument landed!'
                };
                triggerEpicMoment(epicMoment);
            }
            else if (prev.strength > 70 && current.strength > 70) {
                // Epic clash
                var epicMoment = {
                    id: "clash-".concat(Date.now()),
                    type: 'clash',
                    participants: [prev.speaker, current.speaker],
                    intensity: Math.max(prev.strength, current.strength),
                    description: 'Intellectual titans clash!'
                };
                triggerClashEffect(epicMoment);
            }
        }
        // Detect combo sequences
        var recentSameSpeaker = argumentExchanges.slice(-3).filter(function (arg) { return arg.speaker === current.speaker; });
        if (recentSameSpeaker.length >= 3 && recentSameSpeaker.every(function (arg) { return arg.strength > 60; })) {
            var comboMoment = {
                id: "combo-".concat(Date.now()),
                type: 'finishing-move',
                participants: [current.speaker, current.speaker === 'left' ? 'right' : 'left'],
                intensity: 95,
                description: 'Unstoppable argument combo!'
            };
            triggerComboEffect(comboMoment);
        }
    }, [argumentExchanges]);
    var triggerEpicMoment = function (moment) {
        if (academicMode) {
            // Subtle professional effects only
            setActiveEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                    id: moment.id,
                    type: 'academic-highlight',
                    position: { x: 50, y: 50 }
                }], false); });
        }
        else {
            // Full gaming effects
            setEpicMoments(function (prev) { return __spreadArray(__spreadArray([], prev, true), [moment], false); });
            onEpicMoment === null || onEpicMoment === void 0 ? void 0 : onEpicMoment(moment);
            // Generate impact effects
            generateImpactEffects(moment);
        }
        // Auto-remove after duration
        setTimeout(function () {
            setActiveEffects(function (prev) { return prev.filter(function (effect) { return effect.id !== moment.id; }); });
            setEpicMoments(function (prev) { return prev.filter(function (m) { return m.id !== moment.id; }); });
        }, 3000);
    };
    var triggerClashEffect = function (moment) {
        var clashX = 50; // Center of arena
        var clashY = 50;
        setClashZones(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                id: moment.id,
                intensity: moment.intensity,
                x: clashX,
                y: clashY
            }], false); });
        triggerEpicMoment(moment);
        setTimeout(function () {
            setClashZones(function (prev) { return prev.filter(function (zone) { return zone.id !== moment.id; }); });
        }, 2000);
    };
    var triggerComboEffect = function (moment) {
        var _loop_1 = function (i) {
            setTimeout(function () {
                setActiveEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "".concat(moment.id, "-").concat(i),
                        type: 'combo-hit',
                        position: {
                            x: moment.participants[0] === 'left' ? 20 + i * 15 : 80 - i * 15,
                            y: 40 + Math.random() * 20
                        }
                    }], false); });
            }, i * 200);
        };
        // Multiple rapid-fire effects
        for (var i = 0; i < 5; i++) {
            _loop_1(i);
        }
        triggerEpicMoment(moment);
    };
    var generateImpactEffects = function (moment) {
        var effectCount = Math.floor(moment.intensity / 20);
        var _loop_2 = function (i) {
            setTimeout(function () {
                setActiveEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                        id: "".concat(moment.id, "-impact-").concat(i),
                        type: moment.type,
                        position: {
                            x: 30 + Math.random() * 40,
                            y: 30 + Math.random() * 40
                        }
                    }], false); });
            }, i * 100);
        };
        for (var i = 0; i < effectCount; i++) {
            _loop_2(i);
        }
    };
    var getEffectIcon = function (effectType) {
        switch (effectType) {
            case 'critical-hit': return lucide_react_1.Crown;
            case 'clash': return lucide_react_1.Swords;
            case 'perfect-counter': return lucide_react_1.Shield;
            case 'combo-breaker': return lucide_react_1.Target;
            case 'finishing-move': return lucide_react_1.Star;
            default: return lucide_react_1.Zap;
        }
    };
    var getEffectColor = function (effectType) {
        switch (effectType) {
            case 'critical-hit': return 'text-red-400';
            case 'clash': return 'text-yellow-400';
            case 'perfect-counter': return 'text-blue-400';
            case 'combo-breaker': return 'text-purple-400';
            case 'finishing-move': return 'text-green-400';
            default: return 'text-primary';
        }
    };
    if (academicMode) {
        return (<div className="absolute inset-0 pointer-events-none">
        {/* Minimal academic highlighting */}
        {activeEffects.map(function (effect) { return (<div key={effect.id} className="absolute w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{
                    left: "".concat(effect.position.x, "%"),
                    top: "".concat(effect.position.y, "%"),
                }}/>); })}
      </div>);
    }
    return (<div ref={arenaRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      
      {/* Clash Zones */}
      {clashZones.map(function (zone) { return (<div key={zone.id} className="absolute" style={{
                left: "".concat(zone.x, "%"),
                top: "".concat(zone.y, "%"),
                transform: 'translate(-50%, -50%)'
            }}>
          {/* Shockwave Effect */}
          <div className="relative">
            {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className="absolute w-32 h-32 border-4 border-yellow-400/50 rounded-full" style={{
                    animation: "shockwave ".concat(1 + i * 0.3, "s ease-out"),
                    animationDelay: "".concat(i * 0.2, "s")
                }}/>); })}
            
            {/* Center Flash */}
            <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"/>
          </div>
        </div>); })}

      {/* Active Effects */}
      {activeEffects.map(function (effect) {
            var IconComponent = getEffectIcon(effect.type);
            var colorClass = getEffectColor(effect.type);
            return (<div key={effect.id} className="absolute" style={{
                    left: "".concat(effect.position.x, "%"),
                    top: "".concat(effect.position.y, "%"),
                    transform: 'translate(-50%, -50%)'
                }}>
            <div className={"".concat(colorClass, " animate-bounce")}>
              <IconComponent className="h-8 w-8 drop-shadow-lg"/>
            </div>
          </div>);
        })}

      {/* Epic Moment Announcements */}
      {epicMoments.map(function (moment) { return (<div key={moment.id} className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="glass-panel px-6 py-3 border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-full animate-pulse">
                {(function () {
                var IconComponent = getEffectIcon(moment.type);
                return <IconComponent className="h-5 w-5 text-yellow-400"/>;
            })()}
              </div>
              <div>
                <div className="font-bold text-yellow-400 uppercase tracking-wide">
                  {moment.type.replace('-', ' ')}
                </div>
                <div className="text-sm text-white">{moment.description}</div>
              </div>
            </div>
          </div>
        </div>); })}

      {/* Argument Impact Visualization */}
      {argumentExchanges.slice(-1).map(function (exchange) { return (<div key={exchange.id} className="absolute" style={{
                left: exchange.speaker === 'left' ? '20%' : '80%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
          {/* Argument Strength Indicator */}
          <div className={"\n            w-16 h-16 rounded-full border-4 transition-all duration-300\n            ".concat(exchange.strength > 80 ? 'border-red-400 bg-red-400/20 animate-pulse' :
                exchange.strength > 60 ? 'border-yellow-400 bg-yellow-400/20' :
                    'border-blue-400 bg-blue-400/20', "\n          ")}>
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {exchange.strength}
            </div>
          </div>

          {/* Impact Waves */}
          {exchange.strength > 70 && (<div className="absolute inset-0">
              {__spreadArray([], Array(2), true).map(function (_, i) { return (<div key={i} className={"\n                    absolute w-20 h-20 border-2 rounded-full\n                    ".concat(exchange.strength > 80 ? 'border-red-400/30' : 'border-yellow-400/30', "\n                  ")} style={{
                        animation: "impact-wave ".concat(1.5 + i * 0.5, "s ease-out"),
                        animationDelay: "".concat(i * 0.3, "s")
                    }}/>); })}
            </div>)}
        </div>); })}

      {/* Custom Animations */}
      <style>{"\n        @keyframes shockwave {\n          0% {\n            transform: scale(0);\n            opacity: 1;\n          }\n          100% {\n            transform: scale(3);\n            opacity: 0;\n          }\n        }\n\n        @keyframes impact-wave {\n          0% {\n            transform: scale(1);\n            opacity: 0.8;\n          }\n          100% {\n            transform: scale(2);\n            opacity: 0;\n          }\n        }\n\n        @keyframes epic-flash {\n          0%, 100% { opacity: 0; }\n          50% { opacity: 1; }\n        }\n      "}</style>
    </div>);
};
exports.EpicConfrontationMoments = (0, react_1.memo)(EpicConfrontationMomentsComponent);
