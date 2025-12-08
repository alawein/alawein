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
exports.PowerUpLoader = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var defaultPhases = [
    {
        id: 'initialization',
        name: 'System Initialization',
        description: 'Booting strategic command protocols...',
        icon: lucide_react_1.Cpu,
        duration: 1000,
        color: 'text-blue-400',
        progress: 0
    },
    {
        id: 'neural-network',
        name: 'Neural Network Activation',
        description: 'Connecting to AI evaluation matrix...',
        icon: lucide_react_1.Brain,
        duration: 1500,
        color: 'text-purple-400',
        progress: 0
    },
    {
        id: 'security-scan',
        name: 'Security Protocols',
        description: 'Running tactical security verification...',
        icon: lucide_react_1.Shield,
        duration: 800,
        color: 'text-green-400',
        progress: 0
    },
    {
        id: 'targeting',
        name: 'Target Acquisition',
        description: 'Locking onto evaluation parameters...',
        icon: lucide_react_1.Target,
        duration: 1200,
        color: 'text-orange-400',
        progress: 0
    },
    {
        id: 'power-up',
        name: 'Strategic Power-Up',
        description: 'All systems operational. Ready for combat!',
        icon: lucide_react_1.Zap,
        duration: 600,
        color: 'text-yellow-400',
        progress: 0
    }
];
var PowerUpLoaderComponent = function (_a) {
    var show = _a.show, onComplete = _a.onComplete, _b = _a.customPhases, customPhases = _b === void 0 ? defaultPhases : _b;
    var _c = (0, react_1.useState)(0), currentPhaseIndex = _c[0], setCurrentPhaseIndex = _c[1];
    var _d = (0, react_1.useState)(customPhases), phases = _d[0], setPhases = _d[1];
    var _e = (0, react_1.useState)(0), globalProgress = _e[0], setGlobalProgress = _e[1];
    var _f = (0, react_1.useState)([0, 0, 0, 0, 0, 0, 0, 0]), energyBars = _f[0], setEnergyBars = _f[1];
    (0, react_1.useEffect)(function () {
        if (!show) {
            setCurrentPhaseIndex(0);
            setPhases(customPhases.map(function (phase) { return (__assign(__assign({}, phase), { progress: 0 })); }));
            setGlobalProgress(0);
            setEnergyBars([0, 0, 0, 0, 0, 0, 0, 0]);
            return;
        }
        var phaseTimeouts = [];
        var progressIntervals = [];
        var executePhase = function (phaseIndex) {
            if (phaseIndex >= phases.length) {
                if (onComplete)
                    onComplete();
                return;
            }
            setCurrentPhaseIndex(phaseIndex);
            var currentPhase = phases[phaseIndex];
            // Animate energy bars randomly during this phase
            var energyInterval = setInterval(function () {
                setEnergyBars(function (prev) { return prev.map(function () { return Math.random() * 100; }); });
            }, 100);
            // Progress animation for current phase
            var progressInterval = setInterval(function () {
                setPhases(function (prevPhases) {
                    var newPhases = __spreadArray([], prevPhases, true);
                    if (newPhases[phaseIndex].progress < 100) {
                        newPhases[phaseIndex].progress += 100 / (currentPhase.duration / 50);
                    }
                    return newPhases;
                });
            }, 50);
            // Update global progress
            var globalProgressInterval = setInterval(function () {
                var totalProgress = ((phaseIndex + phases[phaseIndex].progress / 100) / phases.length) * 100;
                setGlobalProgress(totalProgress);
            }, 50);
            progressIntervals.push(progressInterval, globalProgressInterval, energyInterval);
            // Move to next phase
            var phaseTimeout = setTimeout(function () {
                clearInterval(progressInterval);
                clearInterval(globalProgressInterval);
                clearInterval(energyInterval);
                setPhases(function (prevPhases) {
                    var newPhases = __spreadArray([], prevPhases, true);
                    newPhases[phaseIndex].progress = 100;
                    return newPhases;
                });
                executePhase(phaseIndex + 1);
            }, currentPhase.duration);
            phaseTimeouts.push(phaseTimeout);
        };
        executePhase(0);
        return function () {
            phaseTimeouts.forEach(clearTimeout);
            progressIntervals.forEach(clearInterval);
        };
    }, [show, phases.length, onComplete]);
    if (!show)
        return null;
    var currentPhase = phases[currentPhaseIndex] || phases[phases.length - 1];
    var IconComponent = currentPhase.icon;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-panel p-8 rounded-2xl border border-primary/30 max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass-subtle p-4 rounded-xl mb-4 inline-block">
            <lucide_react_1.Activity className="h-8 w-8 text-primary animate-pulse mx-auto"/>
          </div>
          <h2 className="heading-display text-2xl text-primary mb-2">Strategic Command Center</h2>
          <p className="text-sm text-muted-foreground">Initializing Combat Systems</p>
        </div>

        {/* Current Phase */}
        <div className="text-center mb-6">
          <div className={"glass-subtle p-6 rounded-xl border border-border/20 ".concat(currentPhase.color.replace('text-', 'border-').replace('-400', '-400/30'))}>
            <div className="relative">
              {/* Animated Icon */}
              <div className="absolute inset-0 animate-ping opacity-30">
                <IconComponent className={"h-12 w-12 mx-auto ".concat(currentPhase.color)}/>
              </div>
              <IconComponent className={"h-12 w-12 mx-auto ".concat(currentPhase.color, " relative z-10")}/>
            </div>
            
            <h3 className="heading-refined text-lg mt-4 mb-2">{currentPhase.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{currentPhase.description}</p>
            
            {/* Phase Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Phase Progress</span>
                <span className={currentPhase.color}>{Math.round(currentPhase.progress)}%</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2 overflow-hidden">
                <div className={"h-full rounded-full transition-all duration-300 ".concat(currentPhase.color.replace('text-', 'bg-'))} style={{ width: "".concat(currentPhase.progress, "%") }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Bars */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-muted-foreground">System Energy Levels</span>
            <span className="text-xs text-primary">{Math.round(globalProgress)}% Complete</span>
          </div>
          <div className="flex gap-1 h-6">
            {energyBars.map(function (level, index) { return (<div key={index} className="flex-1 bg-muted/20 rounded-sm overflow-hidden">
                <div className="w-full bg-gradient-to-t from-primary/60 to-primary transition-all duration-300" style={{ height: "".concat(level, "%") }}/>
              </div>); })}
          </div>
        </div>

        {/* Phase List */}
        <div className="space-y-2">
          {phases.map(function (phase, index) {
            var PhaseIcon = phase.icon;
            var isCompleted = phase.progress === 100;
            var isCurrent = index === currentPhaseIndex;
            var isPending = index > currentPhaseIndex;
            return (<div key={phase.id} className={"flex items-center gap-3 p-2 rounded-lg transition-all ".concat(isCurrent ? 'bg-primary/10 border border-primary/30' :
                    isCompleted ? 'bg-green-500/10 border border-green-500/30' :
                        'bg-muted/10 border border-muted/20')}>
                <PhaseIcon className={"h-4 w-4 ".concat(isCompleted ? 'text-green-400' :
                    isCurrent ? phase.color :
                        'text-muted-foreground')}/>
                
                <span className={"text-sm flex-1 ".concat(isCompleted ? 'text-green-400' :
                    isCurrent ? 'text-primary' :
                        'text-muted-foreground')}>
                  {phase.name}
                </span>

                {isCompleted && (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>)}
                {isCurrent && (<div className="w-2 h-2 rounded-full bg-primary animate-ping"/>)}
                {isPending && (<div className="w-2 h-2 rounded-full bg-muted-foreground/30"/>)}
              </div>);
        })}
        </div>

        {/* Global Progress */}
        <div className="mt-6">
          <div className="w-full bg-muted/20 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: "".concat(globalProgress, "%") }}/>
          </div>
        </div>
      </div>
    </div>);
};
exports.PowerUpLoader = (0, react_1.memo)(PowerUpLoaderComponent);
