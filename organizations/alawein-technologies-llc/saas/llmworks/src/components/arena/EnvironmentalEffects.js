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
exports.EnvironmentalEffects = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var EnvironmentalEffectsComponent = function (_a) {
    var topic = _a.topic, debatePhase = _a.debatePhase, argumentIntensity = _a.argumentIntensity, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)([]), activeEffects = _c[0], setActiveEffects = _c[1];
    var _d = (0, react_1.useState)([]), backgroundParticles = _d[0], setBackgroundParticles = _d[1];
    // Category-specific visual configurations
    var categoryConfig = (0, react_1.useMemo)(function () {
        switch (topic.category) {
            case 'technology':
                return {
                    primaryColor: 'from-blue-500 to-cyan-500',
                    secondaryColor: 'from-blue-400/20 to-cyan-400/20',
                    particleColor: 'bg-blue-400',
                    ambientColor: 'rgba(37, 99, 235, 0.1)',
                    icon: lucide_react_1.Cpu,
                    particles: ['binary', 'circuit', 'data-flow']
                };
            case 'environment':
                return {
                    primaryColor: 'from-green-500 to-emerald-500',
                    secondaryColor: 'from-green-400/20 to-emerald-400/20',
                    particleColor: 'bg-green-400',
                    ambientColor: 'rgba(34, 197, 94, 0.1)',
                    icon: lucide_react_1.Leaf,
                    particles: ['leaf', 'water-drop', 'wind']
                };
            case 'philosophy':
                return {
                    primaryColor: 'from-purple-500 to-violet-500',
                    secondaryColor: 'from-purple-400/20 to-violet-400/20',
                    particleColor: 'bg-purple-400',
                    ambientColor: 'rgba(147, 51, 234, 0.1)',
                    icon: lucide_react_1.Brain,
                    particles: ['thought-bubble', 'abstract-symbol', 'infinity']
                };
            case 'politics':
                return {
                    primaryColor: 'from-red-500 to-rose-500',
                    secondaryColor: 'from-red-400/20 to-rose-400/20',
                    particleColor: 'bg-red-400',
                    ambientColor: 'rgba(239, 68, 68, 0.1)',
                    icon: lucide_react_1.Shield,
                    particles: ['flag', 'balance', 'vote']
                };
            case 'science':
                return {
                    primaryColor: 'from-indigo-500 to-blue-600',
                    secondaryColor: 'from-indigo-400/20 to-blue-400/20',
                    particleColor: 'bg-indigo-400',
                    ambientColor: 'rgba(99, 102, 241, 0.1)',
                    icon: lucide_react_1.Zap,
                    particles: ['atom', 'molecule', 'formula']
                };
            case 'ethics':
                return {
                    primaryColor: 'from-amber-500 to-yellow-500',
                    secondaryColor: 'from-amber-400/20 to-yellow-400/20',
                    particleColor: 'bg-amber-400',
                    ambientColor: 'rgba(245, 158, 11, 0.1)',
                    icon: lucide_react_1.Heart,
                    particles: ['balance-scale', 'heart', 'light-ray']
                };
            case 'economics':
                return {
                    primaryColor: 'from-emerald-600 to-green-600',
                    secondaryColor: 'from-emerald-400/20 to-green-400/20',
                    particleColor: 'bg-emerald-400',
                    ambientColor: 'rgba(16, 185, 129, 0.1)',
                    icon: lucide_react_1.Globe,
                    particles: ['coin', 'chart', 'trend-line']
                };
            case 'health':
                return {
                    primaryColor: 'from-pink-500 to-rose-500',
                    secondaryColor: 'from-pink-400/20 to-rose-400/20',
                    particleColor: 'bg-pink-400',
                    ambientColor: 'rgba(236, 72, 153, 0.1)',
                    icon: lucide_react_1.Heart,
                    particles: ['pulse', 'DNA', 'cell']
                };
            default:
                return {
                    primaryColor: 'from-gray-500 to-slate-500',
                    secondaryColor: 'from-gray-400/20 to-slate-400/20',
                    particleColor: 'bg-gray-400',
                    ambientColor: 'rgba(107, 114, 128, 0.1)',
                    icon: lucide_react_1.Brain,
                    particles: ['dot', 'line', 'circle']
                };
        }
    }, [topic.category]);
    // Generate contextual particles based on topic and debate intensity
    (0, react_1.useEffect)(function () {
        if (academicMode)
            return;
        var generateParticles = function () {
            var particleCount = Math.floor(argumentIntensity / 20) + 2; // 2-7 particles
            var newParticles = Array.from({ length: particleCount }, function () { return ({
                id: "particle-".concat(Date.now(), "-").concat(Math.random()),
                x: Math.random() * 100,
                y: Math.random() * 100,
                type: categoryConfig.particles[Math.floor(Math.random() * categoryConfig.particles.length)]
            }); });
            setBackgroundParticles(function (prev) { return __spreadArray(__spreadArray([], prev, true), newParticles, true); });
            // Remove particles after animation
            setTimeout(function () {
                setBackgroundParticles(function (prev) {
                    return prev.filter(function (p) { return !newParticles.find(function (np) { return np.id === p.id; }); });
                });
            }, 8000);
        };
        // Generate particles based on debate phase intensity
        var phaseMultiplier = {
            'setup': 0.2,
            'opening': 0.5,
            'exchange': 1.0,
            'closing': 0.8,
            'judgment': 0.3,
            'complete': 0.1
        }[debatePhase];
        var shouldGenerate = Math.random() < (argumentIntensity / 100) * phaseMultiplier;
        if (shouldGenerate) {
            generateParticles();
        }
    }, [argumentIntensity, debatePhase, academicMode, categoryConfig.particles]);
    // Create dynamic environmental effects based on topic intensity
    var getIntensityModifier = function () {
        var baseIntensity = {
            'calm': 0.3,
            'moderate': 0.6,
            'heated': 0.8,
            'explosive': 1.0
        }[topic.intensity];
        var phaseIntensity = {
            'setup': 0.2,
            'opening': 0.4,
            'exchange': 1.0,
            'closing': 0.7,
            'judgment': 0.5,
            'complete': 0.2
        }[debatePhase];
        return baseIntensity * phaseIntensity * (argumentIntensity / 100);
    };
    var renderCategorySpecificElements = function () {
        var IconComponent = categoryConfig.icon;
        var intensity = getIntensityModifier();
        switch (topic.category) {
            case 'technology':
                return (<>
            {/* Digital grid overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "\n                  linear-gradient(rgba(37, 99, 235, ".concat(intensity * 0.3, ") 1px, transparent 1px),\n                  linear-gradient(90deg, rgba(37, 99, 235, ").concat(intensity * 0.3, ") 1px, transparent 1px)\n                "),
                        backgroundSize: '40px 40px',
                        animation: 'grid-pulse 4s ease-in-out infinite'
                    }}/>
            {/* Circuit trace lines */}
            {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className={"absolute h-px bg-gradient-to-r ".concat(categoryConfig.primaryColor, " opacity-30")} style={{
                            width: '200px',
                            top: "".concat(30 + i * 20, "%"),
                            left: "-100px",
                            animation: "circuit-flow ".concat(3 + i, "s linear infinite")
                        }}/>); })}
          </>);
            case 'environment':
                return (<>
            {/* Organic flowing patterns */}
            <div className="absolute inset-0">
              {__spreadArray([], Array(5), true).map(function (_, i) { return (<div key={i} className={"absolute w-2 h-2 rounded-full ".concat(categoryConfig.particleColor, " opacity-20")} style={{
                            left: "".concat(10 + i * 20, "%"),
                            top: "".concat(20 + Math.sin(i) * 30, "%"),
                            animation: "organic-float ".concat(8 + i * 2, "s ease-in-out infinite ").concat(i * 0.5, "s")
                        }}/>); })}
            </div>
            {/* Wind effect lines */}
            {intensity > 0.5 && (<div className="absolute inset-0">
                {__spreadArray([], Array(4), true).map(function (_, i) { return (<div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" style={{
                                width: '150px',
                                top: "".concat(20 + i * 15, "%"),
                                right: '-150px',
                                animation: "wind-sweep ".concat(2 + i * 0.3, "s ease-out infinite ").concat(i * 0.2, "s")
                            }}/>); })}
              </div>)}
          </>);
            case 'philosophy':
                return (<>
            {/* Abstract geometric patterns */}
            <div className="absolute inset-0">
              {__spreadArray([], Array(6), true).map(function (_, i) { return (<div key={i} className={"absolute border border-purple-400/20 rotate-45"} style={{
                            width: "".concat(20 + i * 10, "px"),
                            height: "".concat(20 + i * 10, "px"),
                            left: "".concat(30 + Math.cos(i) * 40, "%"),
                            top: "".concat(40 + Math.sin(i) * 30, "%"),
                            animation: "philosophical-spin ".concat(10 + i * 2, "s linear infinite"),
                            transformOrigin: 'center'
                        }}/>); })}
            </div>
          </>);
            case 'science':
                return (<>
            {/* Atomic orbital patterns */}
            <div className="absolute inset-0">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className="absolute border-2 border-indigo-400/20 rounded-full" style={{
                            width: "".concat(100 + i * 50, "px"),
                            height: "".concat(100 + i * 50, "px"),
                            left: '50%',
                            top: '50%',
                            transform: "translate(-50%, -50%) rotate(".concat(i * 60, "deg)"),
                            animation: "orbital-rotation ".concat(15 + i * 5, "s linear infinite")
                        }}/>); })}
                {/* Nucleus */}
                <div className={"absolute w-4 h-4 rounded-full ".concat(categoryConfig.particleColor, " left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse")}/>
              </div>
            </div>
          </>);
            default:
                return null;
        }
    };
    if (academicMode) {
        return (<div className="absolute inset-0 pointer-events-none">
        {/* Minimal category indicator */}
        <div className="absolute top-4 right-4">
          <div className="glass-minimal p-2 rounded-lg flex items-center gap-2">
            <categoryConfig.icon className="h-4 w-4 text-muted-foreground"/>
            <span className="text-xs text-muted-foreground capitalize">{topic.category}</span>
          </div>
        </div>
      </div>);
    }
    return (<div className="absolute inset-0 pointer-events-none overflow-hidden">
      
      {/* Dynamic background ambient glow */}
      <div className="absolute inset-0 transition-all duration-2000" style={{
            background: "radial-gradient(ellipse at center, ".concat(categoryConfig.ambientColor, " 0%, transparent 70%)"),
            opacity: getIntensityModifier() * 0.5
        }}/>

      {/* Category-specific environmental elements */}
      {renderCategorySpecificElements()}

      {/* Floating contextual particles */}
      {backgroundParticles.map(function (particle) { return (<div key={particle.id} className={"absolute w-1 h-1 ".concat(categoryConfig.particleColor, " rounded-full")} style={{
                left: "".concat(particle.x, "%"),
                top: "".concat(particle.y, "%"),
                animation: 'particle-drift 8s linear forwards',
                opacity: 0.6
            }}/>); })}

      {/* Debate phase indicator */}
      <div className="absolute bottom-4 left-4">
        <div className="glass-minimal px-3 py-1 rounded-lg flex items-center gap-2">
          <div className={"w-2 h-2 rounded-full ".concat(categoryConfig.particleColor, " animate-pulse")} style={{ animationDuration: "".concat(2 - getIntensityModifier(), "s") }}/>
          <span className="text-xs text-muted-foreground capitalize">
            {debatePhase} | {topic.intensity}
          </span>
        </div>
      </div>

      {/* Topic category badge */}
      <div className="absolute top-4 left-4">
        <div className={"glass-panel px-4 py-2 rounded-lg bg-gradient-to-r ".concat(categoryConfig.secondaryColor)}>
          <div className="flex items-center gap-2">
            <categoryConfig.icon className={"h-5 w-5 text-current"}/>
            <div>
              <div className="text-sm font-bold capitalize">{topic.category}</div>
              <div className="text-xs opacity-80">Environmental Effects Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{"\n        @keyframes grid-pulse {\n          0%, 100% { opacity: 0.1; }\n          50% { opacity: 0.3; }\n        }\n\n        @keyframes circuit-flow {\n          0% { \n            transform: translateX(0);\n            opacity: 0;\n          }\n          20% { \n            opacity: 0.8;\n          }\n          80% { \n            opacity: 0.8;\n          }\n          100% { \n            transform: translateX(300px);\n            opacity: 0;\n          }\n        }\n\n        @keyframes organic-float {\n          0%, 100% { \n            transform: translateY(0) scale(1);\n          }\n          50% { \n            transform: translateY(-20px) scale(1.1);\n          }\n        }\n\n        @keyframes wind-sweep {\n          0% { \n            transform: translateX(0);\n            opacity: 0;\n          }\n          20% { \n            opacity: 0.6;\n          }\n          80% { \n            opacity: 0.6;\n          }\n          100% { \n            transform: translateX(-300px);\n            opacity: 0;\n          }\n        }\n\n        @keyframes philosophical-spin {\n          0% { \n            transform: rotate(45deg) scale(1);\n            opacity: 0.2;\n          }\n          50% { \n            transform: rotate(225deg) scale(1.1);\n            opacity: 0.4;\n          }\n          100% { \n            transform: rotate(405deg) scale(1);\n            opacity: 0.2;\n          }\n        }\n\n        @keyframes orbital-rotation {\n          0% { \n            transform: translate(-50%, -50%) rotate(0deg);\n          }\n          100% { \n            transform: translate(-50%, -50%) rotate(360deg);\n          }\n        }\n\n        @keyframes particle-drift {\n          0% { \n            transform: translateY(0) translateX(0) rotate(0deg);\n            opacity: 0.6;\n          }\n          50% { \n            transform: translateY(-100px) translateX(50px) rotate(180deg);\n            opacity: 0.8;\n          }\n          100% { \n            transform: translateY(-200px) translateX(-30px) rotate(360deg);\n            opacity: 0;\n          }\n        }\n      "}</style>
    </div>);
};
exports.EnvironmentalEffects = (0, react_1.memo)(EnvironmentalEffectsComponent);
