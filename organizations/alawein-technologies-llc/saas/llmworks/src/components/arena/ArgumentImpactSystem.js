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
exports.ArgumentImpactSystem = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ArgumentImpactSystemComponent = function (_a) {
    var onImpact = _a.onImpact, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b, _c = _a.soundEnabled, soundEnabled = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)([]), activeImpacts = _d[0], setActiveImpacts = _d[1];
    var _e = (0, react_1.useState)([]), shockwaves = _e[0], setShockwaves = _e[1];
    var _f = (0, react_1.useState)([]), deflectionShields = _f[0], setDeflectionShields = _f[1];
    var canvasRef = (0, react_1.useRef)(null);
    var animationRef = (0, react_1.useRef)();
    // Simulate argument impacts for demonstration
    (0, react_1.useEffect)(function () {
        if (academicMode)
            return;
        var impactInterval = setInterval(function () {
            if (Math.random() < 0.3) { // 30% chance per 2 seconds
                triggerArgumentImpact();
            }
        }, 2000);
        return function () { return clearInterval(impactInterval); };
    }, [academicMode]);
    var triggerArgumentImpact = function () {
        var impactTypes = [
            'direct-hit', 'deflection', 'critical-strike', 'combo-chain', 'devastating-blow'
        ];
        var type = impactTypes[Math.floor(Math.random() * impactTypes.length)];
        var strength = Math.floor(Math.random() * 40) + 60; // 60-100 strength
        var direction = Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
        var impact = {
            id: "impact-".concat(Date.now()),
            type: type,
            strength: strength,
            position: {
                x: direction === 'left-to-right' ? 20 : 80,
                y: 50 + (Math.random() - 0.5) * 30
            },
            direction: direction,
            timestamp: new Date(),
            decayTime: type === 'devastating-blow' ? 4000 : type === 'critical-strike' ? 3000 : 2000
        };
        setActiveImpacts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [impact], false); });
        onImpact(impact);
        // Generate visual effects based on impact type
        switch (type) {
            case 'direct-hit':
                generateDirectHitEffect(impact);
                break;
            case 'deflection':
                generateDeflectionEffect(impact);
                break;
            case 'critical-strike':
                generateCriticalStrikeEffect(impact);
                break;
            case 'combo-chain':
                generateComboChainEffect(impact);
                break;
            case 'devastating-blow':
                generateDevastatingBlowEffect(impact);
                break;
        }
        // Remove impact after decay time
        setTimeout(function () {
            setActiveImpacts(function (prev) { return prev.filter(function (i) { return i.id !== impact.id; }); });
        }, impact.decayTime);
    };
    var generateDirectHitEffect = function (impact) {
        var targetX = impact.direction === 'left-to-right' ? 80 : 20;
        var shockwave = {
            id: "shockwave-".concat(impact.id),
            x: targetX,
            y: impact.position.y,
            intensity: impact.strength
        };
        setShockwaves(function (prev) { return __spreadArray(__spreadArray([], prev, true), [shockwave], false); });
        setTimeout(function () {
            setShockwaves(function (prev) { return prev.filter(function (s) { return s.id !== shockwave.id; }); });
        }, 1500);
    };
    var generateDeflectionEffect = function (impact) {
        var side = impact.direction === 'left-to-right' ? 'right' : 'left';
        var shield = {
            id: "shield-".concat(impact.id),
            side: side,
            strength: impact.strength
        };
        setDeflectionShields(function (prev) { return __spreadArray(__spreadArray([], prev, true), [shield], false); });
        setTimeout(function () {
            setDeflectionShields(function (prev) { return prev.filter(function (s) { return s.id !== shield.id; }); });
        }, 2000);
    };
    var generateCriticalStrikeEffect = function (impact) {
        var _loop_1 = function (i) {
            setTimeout(function () {
                generateDirectHitEffect(__assign(__assign({}, impact), { id: "".concat(impact.id, "-").concat(i) }));
            }, i * 200);
        };
        // Multiple shockwaves for critical strikes
        for (var i = 0; i < 3; i++) {
            _loop_1(i);
        }
    };
    var generateComboChainEffect = function (impact) {
        // Rapid succession of smaller impacts
        var comboCount = Math.floor(impact.strength / 20);
        var _loop_2 = function (i) {
            setTimeout(function () {
                var comboImpact = __assign(__assign({}, impact), { id: "".concat(impact.id, "-combo-").concat(i), position: {
                        x: impact.position.x,
                        y: impact.position.y + (Math.random() - 0.5) * 20
                    }, strength: Math.floor(impact.strength / comboCount) });
                generateDirectHitEffect(comboImpact);
            }, i * 150);
        };
        for (var i = 0; i < comboCount; i++) {
            _loop_2(i);
        }
    };
    var generateDevastatingBlowEffect = function (impact) {
        var _loop_3 = function (i) {
            setTimeout(function () {
                var devastationWave = {
                    id: "devastation-".concat(impact.id, "-").concat(i),
                    x: 50,
                    y: 50,
                    intensity: impact.strength + i * 10
                };
                setShockwaves(function (prev) { return __spreadArray(__spreadArray([], prev, true), [devastationWave], false); });
                setTimeout(function () {
                    setShockwaves(function (prev) { return prev.filter(function (s) { return s.id !== devastationWave.id; }); });
                }, 2000 + i * 300);
            }, i * 100);
        };
        // Screen-wide shockwave effect
        for (var i = 0; i < 5; i++) {
            _loop_3(i);
        }
    };
    var getImpactIcon = function (type) {
        switch (type) {
            case 'direct-hit': return lucide_react_1.Target;
            case 'deflection': return lucide_react_1.Shield;
            case 'critical-strike': return lucide_react_1.Swords;
            case 'combo-chain': return lucide_react_1.Zap;
            case 'devastating-blow': return lucide_react_1.Crown;
        }
    };
    var getImpactColor = function (type) {
        switch (type) {
            case 'direct-hit': return 'text-yellow-400';
            case 'deflection': return 'text-blue-400';
            case 'critical-strike': return 'text-red-400';
            case 'combo-chain': return 'text-purple-400';
            case 'devastating-blow': return 'text-orange-400';
        }
    };
    if (academicMode) {
        return (<div className="absolute inset-0 pointer-events-none">
        {/* Minimal academic indicators */}
        {activeImpacts.map(function (impact) { return (<div key={impact.id} className="absolute w-3 h-3 bg-primary/30 rounded-full animate-pulse" style={{
                    left: "".concat(impact.position.x, "%"),
                    top: "".concat(impact.position.y, "%"),
                    transform: 'translate(-50%, -50%)'
                }}/>); })}
      </div>);
    }
    return (<div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Canvas for GPU-accelerated effects */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}/>

      {/* Active Argument Impacts */}
      {activeImpacts.map(function (impact) {
            var IconComponent = getImpactIcon(impact.type);
            var colorClass = getImpactColor(impact.type);
            return (<div key={impact.id} className="absolute" style={{
                    left: "".concat(impact.position.x, "%"),
                    top: "".concat(impact.position.y, "%"),
                    transform: 'translate(-50%, -50%)',
                    animation: "impact-".concat(impact.type, " ").concat(impact.decayTime, "ms ease-out")
                }}>
            <div className={"".concat(colorClass, " animate-bounce")}>
              <IconComponent className="h-8 w-8 drop-shadow-lg" style={{ filter: "brightness(".concat(impact.strength / 50, ")") }}/>
            </div>
            
            {/* Impact trajectory line */}
            <div className={"absolute top-1/2 h-0.5 bg-gradient-to-r ".concat(impact.direction === 'left-to-right'
                    ? 'from-primary via-accent to-transparent'
                    : 'from-transparent via-accent to-primary')} style={{
                    width: '200px',
                    left: impact.direction === 'left-to-right' ? '0' : '-200px',
                    transform: 'translateY(-50%)',
                    animation: 'trajectory-line 1s ease-out'
                }}/>
          </div>);
        })}

      {/* Shockwave Effects */}
      {shockwaves.map(function (wave) { return (<div key={wave.id} className="absolute" style={{
                left: "".concat(wave.x, "%"),
                top: "".concat(wave.y, "%"),
                transform: 'translate(-50%, -50%)'
            }}>
          {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className={"absolute border-4 rounded-full ".concat(wave.intensity > 80 ? 'border-red-400/40' :
                    wave.intensity > 60 ? 'border-yellow-400/40' : 'border-blue-400/40')} style={{
                    width: "".concat(80 + i * 40, "px"),
                    height: "".concat(80 + i * 40, "px"),
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: "shockwave-expand ".concat(1.5 + i * 0.3, "s ease-out"),
                    animationDelay: "".concat(i * 0.1, "s")
                }}/>); })}
          
          {/* Center flash */}
          <div className={"w-6 h-6 rounded-full animate-pulse shadow-lg ".concat(wave.intensity > 80 ? 'bg-red-400 shadow-red-400/50' :
                wave.intensity > 60 ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-blue-400 shadow-blue-400/50')}/>
        </div>); })}

      {/* Deflection Shields */}
      {deflectionShields.map(function (shield) { return (<div key={shield.id} className="absolute" style={{
                left: shield.side === 'left' ? '15%' : '85%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
          <div className={"\n            w-20 h-32 rounded-lg border-4 border-blue-400/60\n            bg-gradient-to-b from-blue-400/20 to-cyan-400/10\n            animate-pulse shadow-2xl shadow-blue-400/30\n          "}>
            <div className="absolute inset-2 rounded-md bg-gradient-to-b from-white/20 to-transparent"/>
            
            {/* Shield energy ripples */}
            {__spreadArray([], Array(shield.strength > 70 ? 4 : 2), true).map(function (_, i) { return (<div key={i} className="absolute inset-0 border-2 border-blue-400/30 rounded-lg" style={{
                    animation: "shield-ripple ".concat(1 + i * 0.2, "s ease-out infinite"),
                    animationDelay: "".concat(i * 0.1, "s")
                }}/>); })}
          </div>
        </div>); })}

      {/* Custom CSS animations */}
      <style>{"\n        @keyframes impact-direct-hit {\n          0% { \n            transform: translate(-50%, -50%) scale(0.5);\n            opacity: 0;\n          }\n          20% { \n            transform: translate(-50%, -50%) scale(1.5);\n            opacity: 1;\n          }\n          100% { \n            transform: translate(-50%, -50%) scale(1);\n            opacity: 0;\n          }\n        }\n\n        @keyframes impact-critical-strike {\n          0% { \n            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);\n            opacity: 0;\n          }\n          30% { \n            transform: translate(-50%, -50%) scale(2) rotate(180deg);\n            opacity: 1;\n          }\n          100% { \n            transform: translate(-50%, -50%) scale(1.2) rotate(360deg);\n            opacity: 0;\n          }\n        }\n\n        @keyframes impact-devastating-blow {\n          0% { \n            transform: translate(-50%, -50%) scale(0.2);\n            opacity: 0;\n            filter: brightness(2) saturate(2);\n          }\n          50% { \n            transform: translate(-50%, -50%) scale(3);\n            opacity: 1;\n            filter: brightness(3) saturate(1.5);\n          }\n          100% { \n            transform: translate(-50%, -50%) scale(1.5);\n            opacity: 0;\n            filter: brightness(1) saturate(1);\n          }\n        }\n\n        @keyframes shockwave-expand {\n          0% {\n            transform: translate(-50%, -50%) scale(0);\n            opacity: 1;\n          }\n          100% {\n            transform: translate(-50%, -50%) scale(2);\n            opacity: 0;\n          }\n        }\n\n        @keyframes shield-ripple {\n          0% { \n            transform: scale(1);\n            opacity: 0.8;\n          }\n          100% { \n            transform: scale(1.3);\n            opacity: 0;\n          }\n        }\n\n        @keyframes trajectory-line {\n          0% { \n            transform: translateY(-50%) scaleX(0);\n            opacity: 0;\n          }\n          50% { \n            transform: translateY(-50%) scaleX(1);\n            opacity: 1;\n          }\n          100% { \n            transform: translateY(-50%) scaleX(1);\n            opacity: 0;\n          }\n        }\n      "}</style>
    </div>);
};
exports.ArgumentImpactSystem = (0, react_1.memo)(ArgumentImpactSystemComponent);
