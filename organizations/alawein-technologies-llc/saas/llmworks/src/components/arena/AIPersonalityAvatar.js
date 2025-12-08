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
exports.AIPersonalityAvatar = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AIPersonalityAvatarComponent = function (_a) {
    var personality = _a.personality, battleState = _a.battleState, energy = _a.energy, name = _a.name, isActive = _a.isActive, onStateChange = _a.onStateChange, _b = _a.position, position = _b === void 0 ? 'left' : _b;
    var _c = (0, react_1.useState)([]), particleEffects = _c[0], setParticleEffects = _c[1];
    var _d = (0, react_1.useState)(0), pulseIntensity = _d[0], setPulseIntensity = _d[1];
    var avatarRef = (0, react_1.useRef)(null);
    // Personality-specific visual configurations
    var getPersonalityConfig = function () {
        switch (personality) {
            case 'analytical':
                return {
                    icon: lucide_react_1.Brain,
                    primaryColor: 'from-blue-500 to-cyan-500',
                    secondaryColor: 'from-blue-400/20 to-cyan-400/20',
                    particleColor: 'bg-blue-400',
                    shape: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Pentagon
                    description: 'Logic-driven, methodical approach'
                };
            case 'creative':
                return {
                    icon: lucide_react_1.Sparkles,
                    primaryColor: 'from-purple-500 to-pink-500',
                    secondaryColor: 'from-purple-400/20 to-pink-400/20',
                    particleColor: 'bg-purple-400',
                    shape: 'ellipse(40% 50% at 50% 50%)', // Organic
                    description: 'Innovative, artistic thinking'
                };
            case 'speed':
                return {
                    icon: lucide_react_1.Zap,
                    primaryColor: 'from-yellow-500 to-orange-500',
                    secondaryColor: 'from-yellow-400/20 to-orange-400/20',
                    particleColor: 'bg-yellow-400',
                    shape: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star
                    description: 'Lightning-fast responses'
                };
            case 'conversational':
                return {
                    icon: lucide_react_1.MessageSquare,
                    primaryColor: 'from-green-500 to-emerald-500',
                    secondaryColor: 'from-green-400/20 to-emerald-400/20',
                    particleColor: 'bg-green-400',
                    shape: 'circle(45%)', // Rounded
                    description: 'Empathetic dialogue'
                };
            case 'strategic':
                return {
                    icon: lucide_react_1.Target,
                    primaryColor: 'from-red-500 to-rose-500',
                    secondaryColor: 'from-red-400/20 to-rose-400/20',
                    particleColor: 'bg-red-400',
                    shape: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
                    description: 'Tactical precision'
                };
        }
    };
    var config = getPersonalityConfig();
    var IconComponent = config.icon;
    // Battle state animations
    (0, react_1.useEffect)(function () {
        var animationInterval;
        switch (battleState) {
            case 'thinking':
                setPulseIntensity(0.3);
                animationInterval = setInterval(function () {
                    generateThinkingParticles();
                }, 500);
                break;
            case 'arguing':
                setPulseIntensity(0.7);
                animationInterval = setInterval(function () {
                    generateAttackParticles();
                }, 200);
                break;
            case 'defending':
                setPulseIntensity(0.5);
                generateShieldEffect();
                break;
            case 'counter-attacking':
                setPulseIntensity(1);
                animationInterval = setInterval(function () {
                    generateCounterParticles();
                }, 150);
                break;
            case 'victory':
                setPulseIntensity(1);
                generateVictoryParticles();
                break;
            case 'defeat':
                setPulseIntensity(0.1);
                break;
            default:
                setPulseIntensity(0.2);
        }
        return function () {
            if (animationInterval)
                clearInterval(animationInterval);
        };
    }, [battleState]);
    var generateThinkingParticles = function () {
        var newParticles = Array.from({ length: 3 }, function () { return ({
            id: "think-".concat(Date.now(), "-").concat(Math.random()),
            x: Math.random() * 100 - 50,
            y: -20
        }); });
        setParticleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), newParticles, true); });
        setTimeout(function () {
            setParticleEffects(function (prev) { return prev.filter(function (p) { return !newParticles.find(function (np) { return np.id === p.id; }); }); });
        }, 2000);
    };
    var generateAttackParticles = function () {
        var newParticles = Array.from({ length: 5 }, function () { return ({
            id: "attack-".concat(Date.now(), "-").concat(Math.random()),
            x: position === 'left' ? 100 : -100,
            y: Math.random() * 50 - 25
        }); });
        setParticleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), newParticles, true); });
        setTimeout(function () {
            setParticleEffects(function (prev) { return prev.filter(function (p) { return !newParticles.find(function (np) { return np.id === p.id; }); }); });
        }, 1000);
    };
    var generateShieldEffect = function () {
        // Shield visualization handled by CSS animation
    };
    var generateCounterParticles = function () {
        var newParticles = Array.from({ length: 8 }, function () { return ({
            id: "counter-".concat(Date.now(), "-").concat(Math.random()),
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100
        }); });
        setParticleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), newParticles, true); });
        setTimeout(function () {
            setParticleEffects(function (prev) { return prev.filter(function (p) { return !newParticles.find(function (np) { return np.id === p.id; }); }); });
        }, 1500);
    };
    var generateVictoryParticles = function () {
        var newParticles = Array.from({ length: 20 }, function () { return ({
            id: "victory-".concat(Date.now(), "-").concat(Math.random()),
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150
        }); });
        setParticleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), newParticles, true); });
        setTimeout(function () {
            setParticleEffects(function (prev) { return prev.filter(function (p) { return !newParticles.find(function (np) { return np.id === p.id; }); }); });
        }, 3000);
    };
    var getBattleStateIcon = function () {
        switch (battleState) {
            case 'arguing': return <lucide_react_1.Swords className="h-4 w-4"/>;
            case 'defending': return <lucide_react_1.Shield className="h-4 w-4"/>;
            case 'counter-attacking': return <lucide_react_1.Target className="h-4 w-4"/>;
            default: return null;
        }
    };
    return (<div ref={avatarRef} className={"relative ".concat(position === 'right' ? 'scale-x-[-1]' : '')}>
      {/* Main Avatar Container */}
      <div className={"\n        relative w-32 h-32 transition-all duration-300\n        ".concat(isActive ? 'scale-110' : 'scale-100', "\n        ").concat(battleState === 'defeat' ? 'opacity-50 grayscale' : '', "\n      ")}>
        
        {/* Energy Shield (for defending state) */}
        {battleState === 'defending' && (<div className={"\n            absolute inset-[-20px] rounded-full\n            bg-gradient-to-r ".concat(config.secondaryColor, "\n            animate-pulse border-2 border-current\n          ")}/>)}

        {/* Main Avatar Shape */}
        <div className={"\n            absolute inset-0 bg-gradient-to-br ".concat(config.primaryColor, "\n            shadow-2xl transition-all duration-300\n            ").concat(isActive ? 'shadow-current/50' : 'shadow-current/20', "\n          ")} style={{
            clipPath: config.shape,
            filter: "brightness(".concat(1 + pulseIntensity * 0.5, ")"),
            transform: "scale(".concat(1 + pulseIntensity * 0.1, ")")
        }}>
          {/* Inner Glow */}
          <div className={"\n            absolute inset-2 bg-gradient-to-br ".concat(config.secondaryColor, "\n            animate-pulse\n          ")} style={{
            clipPath: config.shape,
            animationDuration: "".concat(2 - pulseIntensity, "s")
        }}/>
        </div>

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={"\n            p-3 rounded-full glass-panel\n            ".concat(battleState === 'victory' ? 'animate-bounce' : '', "\n            ").concat(battleState === 'thinking' ? 'animate-pulse' : '', "\n          ")}>
            <IconComponent className={"\n              h-8 w-8 text-white\n              ".concat(battleState === 'arguing' ? 'animate-pulse' : '', "\n            ")}/>
          </div>
        </div>

        {/* Energy Level Bar */}
        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={"h-full bg-gradient-to-r ".concat(config.primaryColor, " transition-all duration-300")} style={{ width: "".concat(energy, "%") }}/>
        </div>

        {/* Battle State Indicator */}
        {getBattleStateIcon() && (<div className="absolute top-0 right-0 p-1 bg-background rounded-full border-2 border-current">
            {getBattleStateIcon()}
          </div>)}

        {/* Particle Effects */}
        {particleEffects.map(function (particle) { return (<div key={particle.id} className={"absolute w-2 h-2 ".concat(config.particleColor, " rounded-full")} style={{
                left: '50%',
                top: '50%',
                transform: "translate(".concat(particle.x, "px, ").concat(particle.y, "px)"),
                animation: battleState === 'arguing'
                    ? 'particle-attack 1s ease-out forwards'
                    : battleState === 'victory'
                        ? 'particle-explode 3s ease-out forwards'
                        : 'particle-float 2s ease-out forwards'
            }}/>); })}
      </div>

      {/* Name and Status */}
      <div className={"text-center mt-4 ".concat(position === 'right' ? 'scale-x-[-1]' : '')}>
        <div className="font-bold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground capitalize">{battleState}</div>
        <div className="text-xs text-muted-foreground mt-1">{config.description}</div>
      </div>

      {/* Custom animations */}
      <style>{"\n        @keyframes particle-float {\n          0% {\n            opacity: 1;\n            transform: translate(0, 0) scale(1);\n          }\n          100% {\n            opacity: 0;\n            transform: translate(var(--end-x, 0), -50px) scale(0.5);\n          }\n        }\n\n        @keyframes particle-attack {\n          0% {\n            opacity: 1;\n            transform: translate(0, 0) scale(1);\n          }\n          100% {\n            opacity: 0;\n            transform: translate(".concat(position === 'left' ? '200px' : '-200px', ", 0) scale(2);\n          }\n        }\n\n        @keyframes particle-explode {\n          0% {\n            opacity: 1;\n            transform: translate(0, 0) scale(1);\n          }\n          50% {\n            opacity: 1;\n            transform: translate(var(--end-x, 0), var(--end-y, 0)) scale(1.5);\n          }\n          100% {\n            opacity: 0;\n            transform: translate(calc(var(--end-x, 0) * 2), calc(var(--end-y, 0) * 2)) scale(0);\n          }\n        }\n      ")}</style>
    </div>);
};
exports.AIPersonalityAvatar = (0, react_1.memo)(AIPersonalityAvatarComponent);
