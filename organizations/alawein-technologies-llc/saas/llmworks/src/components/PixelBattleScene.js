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
exports.PixelBattleScene = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var PixelBattleSceneComponent = function (_a) {
    var contenders = _a.contenders, battlePhase = _a.battlePhase, onPhaseComplete = _a.onPhaseComplete;
    var _b = (0, react_1.useState)('idle'), animationState = _b[0], setAnimationState = _b[1];
    var _c = (0, react_1.useState)([]), energyFlows = _c[0], setEnergyFlows = _c[1];
    // Simulate battle progression
    (0, react_1.useEffect)(function () {
        var phaseTimer = setTimeout(function () {
            switch (battlePhase) {
                case 'preparation':
                    setAnimationState('charging');
                    simulateEnergyBuildup();
                    break;
                case 'engagement':
                    setAnimationState('attacking');
                    simulateTacticalExchanges();
                    break;
                case 'analysis':
                    setAnimationState('defending');
                    simulateAnalysisPhase();
                    break;
                default:
                    setAnimationState('idle');
            }
        }, 1000);
        return function () { return clearTimeout(phaseTimer); };
    }, [battlePhase]);
    var simulateEnergyBuildup = function () {
        var flows = contenders.map(function (contender) { return ({
            id: contender.id,
            intensity: Math.random() * 0.5 + 0.5 // 50-100% intensity
        }); });
        setEnergyFlows(flows);
    };
    var simulateTacticalExchanges = function () {
        var interval = setInterval(function () {
            setEnergyFlows(function (prev) { return prev.map(function (flow) { return (__assign(__assign({}, flow), { intensity: Math.random() * 0.8 + 0.2 // Dynamic fluctuation
             })); }); });
        }, 800);
        setTimeout(function () { return clearInterval(interval); }, 5000);
    };
    var simulateAnalysisPhase = function () {
        // Gradual energy stabilization during analysis
        var stabilizationInterval = setInterval(function () {
            setEnergyFlows(function (prev) { return prev.map(function (flow) { return (__assign(__assign({}, flow), { intensity: flow.intensity * 0.95 + 0.05 // Converge to stable state
             })); }); });
        }, 200);
        setTimeout(function () {
            clearInterval(stabilizationInterval);
            onPhaseComplete === null || onPhaseComplete === void 0 ? void 0 : onPhaseComplete(battlePhase);
        }, 3000);
    };
    var getContenderIcon = function (type) {
        switch (type) {
            case 'reasoning': return lucide_react_1.Cpu;
            case 'creative': return lucide_react_1.Zap;
            case 'analytical': return lucide_react_1.Target;
            case 'conversational': return lucide_react_1.Shield;
            default: return lucide_react_1.Cpu;
        }
    };
    var getBattlePhaseDescription = function () {
        switch (battlePhase) {
            case 'preparation': return 'Systems Initializing...';
            case 'engagement': return 'Tactical Exchange Active';
            case 'analysis': return 'Performance Analysis';
            case 'results': return 'Evaluation Complete';
            default: return 'Standby Mode';
        }
    };
    return (<div className="pixel-battle-arena relative">
      {/* Arena Frame */}
      <div className="arena-frame p-6 rounded-lg bg-gradient-to-br from-background via-muted/10 to-background">
        
        {/* Battle Phase Indicator */}
        <div className="text-center mb-6">
          <div className="glass-minimal px-4 py-2 rounded-full inline-block">
            <div className="flex items-center gap-2 text-sm">
              <div className={"w-2 h-2 rounded-full animate-pulse ".concat(battlePhase === 'engagement' ? 'bg-red-400' :
            battlePhase === 'analysis' ? 'bg-yellow-400' :
                battlePhase === 'results' ? 'bg-green-400' : 'bg-blue-400')}/>
              <span className="font-mono text-primary">{getBattlePhaseDescription()}</span>
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="relative h-48 bg-gradient-to-b from-muted/5 to-muted/20 rounded-lg border border-primary/20 overflow-hidden">
          
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="battle-grid" width="20" height="20" patternUnits="userSpaceOnUse" className="text-primary/30">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#battle-grid)"/>
            </svg>
          </div>

          {/* Energy Flow Visualization */}
          <div className="absolute inset-0">
            {energyFlows.map(function (flow, index) { return (<div key={flow.id} className="absolute w-1 bg-gradient-to-t from-primary to-secondary rounded-full" style={{
                left: "".concat(20 + index * 30, "%"),
                height: "".concat(flow.intensity * 80, "%"),
                bottom: '10%',
                opacity: flow.intensity,
                animation: "energy-pulse ".concat(2 + Math.random(), "s ease-in-out infinite")
            }}/>); })}
          </div>

          {/* Contender Positions */}
          <div className="absolute inset-0 flex items-end justify-around p-4">
            {contenders.map(function (contender, index) {
            var IconComponent = getContenderIcon(contender.type);
            var energyFlow = energyFlows.find(function (f) { return f.id === contender.id; });
            return (<div key={contender.id} className="text-center space-y-2">
                  
                  {/* Contender Avatar */}
                  <div className={"\n                    relative p-4 rounded-lg glass-minimal border transition-all duration-500\n                    ".concat(animationState === 'charging' ? 'animate-pulse shadow-lg shadow-primary/20' :
                    animationState === 'attacking' ? 'animate-bounce shadow-xl shadow-red-500/20' :
                        animationState === 'defending' ? 'animate-pulse shadow-lg shadow-yellow-500/20' : '', "\n                  ")}>
                    <IconComponent className={"h-8 w-8 transition-colors duration-300 ".concat(contender.status === 'engaging' ? 'text-red-400' :
                    contender.status === 'analyzing' ? 'text-yellow-400' :
                        contender.status === 'completed' ? 'text-green-400' : 'text-primary')}/>
                    
                    {/* Energy Level Indicator */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background border border-primary/30 flex items-center justify-center">
                      <div className={"w-2 h-2 rounded-full transition-colors duration-300 ".concat(((energyFlow === null || energyFlow === void 0 ? void 0 : energyFlow.intensity) || 0) > 0.7 ? 'bg-green-400' :
                    ((energyFlow === null || energyFlow === void 0 ? void 0 : energyFlow.intensity) || 0) > 0.4 ? 'bg-yellow-400' : 'bg-red-400')}/>
                    </div>
                  </div>

                  {/* Contender Info */}
                  <div className="text-xs">
                    <div className="font-mono text-primary font-semibold">{contender.name}</div>
                    <div className="text-muted-foreground capitalize">{contender.type}</div>
                    
                    {/* Tactical Advantages */}
                    {contender.tacticalAdvantages.length > 0 && (<div className="mt-1 flex flex-wrap justify-center gap-1">
                        {contender.tacticalAdvantages.slice(0, 2).map(function (advantage) { return (<div key={advantage} className="px-1 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">
                            {advantage}
                          </div>); })}
                      </div>)}
                  </div>
                </div>);
        })}
          </div>

          {/* Tactical Overlay Effects */}
          {animationState === 'attacking' && (<div className="absolute inset-0 pointer-events-none">
              {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping" style={{
                    left: "".concat(20 + i * 30, "%"),
                    top: "".concat(30 + i * 15, "%"),
                    animationDelay: "".concat(i * 0.2, "s")
                }}/>); })}
            </div>)}
        </div>

        {/* Battle Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="glass-minimal p-3 rounded-lg">
            <div className="text-lg font-mono text-primary">
              {battlePhase === 'engagement' ? 'ACTIVE' :
            battlePhase === 'analysis' ? 'EVAL' :
                battlePhase === 'results' ? 'DONE' : 'READY'}
            </div>
            <div className="text-xs text-muted-foreground">Phase</div>
          </div>
          
          <div className="glass-minimal p-3 rounded-lg">
            <div className="text-lg font-mono text-secondary">
              {contenders.length}v{contenders.length > 1 ? contenders.length : 1}
            </div>
            <div className="text-xs text-muted-foreground">Format</div>
          </div>
          
          <div className="glass-minimal p-3 rounded-lg">
            <div className="text-lg font-mono text-accent">
              {energyFlows.reduce(function (sum, flow) { return sum + flow.intensity; }, 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Energy</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Arena Effects */}
      <style>{"\n        .arena-frame {\n          background: \n            linear-gradient(135deg, transparent 15px, hsl(var(--primary) / 0.1) 15px),\n            linear-gradient(-135deg, transparent 15px, hsl(var(--secondary) / 0.05) 15px);\n          border: 2px solid hsl(var(--primary) / 0.3);\n          position: relative;\n        }\n\n        .arena-frame::before {\n          content: \"\";\n          position: absolute;\n          inset: -3px;\n          background: conic-gradient(from 0deg, \n            hsl(var(--primary) / 0.2) 0deg, \n            transparent 90deg, \n            hsl(var(--secondary) / 0.2) 180deg, \n            transparent 270deg);\n          z-index: -1;\n          border-radius: inherit;\n          animation: rotate-border 10s linear infinite;\n        }\n\n        @keyframes energy-pulse {\n          0%, 100% { opacity: 0.6; transform: scaleY(1); }\n          50% { opacity: 1; transform: scaleY(1.2); }\n        }\n\n        @keyframes rotate-border {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n\n        .pixel-battle-arena {\n          image-rendering: -moz-crisp-edges;\n          image-rendering: -webkit-crisp-edges;\n          image-rendering: pixelated;\n          image-rendering: crisp-edges;\n        }\n      "}</style>
    </div>);
};
exports.PixelBattleScene = (0, react_1.memo)(PixelBattleSceneComponent);
