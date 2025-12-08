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
exports.AIBattleAnimation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AIBattleAnimationComponent = function () {
    var _a = (0, react_1.useState)([
        {
            id: 'gpt-4',
            name: 'GPT-4',
            icon: lucide_react_1.Brain,
            position: { x: 20, y: 50 },
            health: 85,
            charging: false,
            attacking: false,
            color: 'text-blue-500',
        },
        {
            id: 'claude',
            name: 'Claude',
            icon: lucide_react_1.Bot,
            position: { x: 80, y: 50 },
            health: 90,
            charging: false,
            attacking: false,
            color: 'text-orange-500',
        },
    ]), robots = _a[0], setRobots = _a[1];
    var _b = (0, react_1.useState)([]), battleEffects = _b[0], setBattleEffects = _b[1];
    var _c = (0, react_1.useState)('idle'), battlePhase = _c[0], setBattlePhase = _c[1];
    (0, react_1.useEffect)(function () {
        var battleCycle = setInterval(function () {
            setBattlePhase(function (current) {
                switch (current) {
                    case 'idle':
                        return 'charging';
                    case 'charging':
                        return 'attacking';
                    case 'attacking':
                        return Math.random() > 0.7 ? 'victory' : 'idle';
                    case 'victory':
                        return 'idle';
                    default:
                        return 'idle';
                }
            });
        }, 2000);
        return function () { return clearInterval(battleCycle); };
    }, []);
    (0, react_1.useEffect)(function () {
        setRobots(function (prev) { return prev.map(function (robot) { return (__assign(__assign({}, robot), { charging: battlePhase === 'charging', attacking: battlePhase === 'attacking' })); }); });
        // Add battle effects during attacks
        if (battlePhase === 'attacking') {
            var effectId_1 = "effect-".concat(Date.now());
            setBattleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                    id: effectId_1,
                    type: Math.random() > 0.5 ? 'laser' : 'spark',
                    position: { x: 50, y: 45 + Math.random() * 10 },
                    timestamp: Date.now(),
                }], false); });
            // Remove effect after animation
            setTimeout(function () {
                setBattleEffects(function (prev) { return prev.filter(function (effect) { return effect.id !== effectId_1; }); });
            }, 800);
        }
        // Victory particles
        if (battlePhase === 'victory') {
            var _loop_1 = function (i) {
                setTimeout(function () {
                    var particleId = "particle-".concat(Date.now(), "-").concat(i);
                    setBattleEffects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                            id: particleId,
                            type: 'explosion',
                            position: {
                                x: 30 + Math.random() * 40,
                                y: 30 + Math.random() * 40
                            },
                            timestamp: Date.now(),
                        }], false); });
                    setTimeout(function () {
                        setBattleEffects(function (prev) { return prev.filter(function (effect) { return effect.id !== particleId; }); });
                    }, 1000);
                }, i * 100);
            };
            for (var i = 0; i < 6; i++) {
                _loop_1(i);
            }
        }
    }, [battlePhase]);
    return (<div className="relative w-full h-64 glass-panel rounded-xl overflow-hidden">
      {/* Battle Arena Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1)_0%,transparent_70%)]"></div>
      
      {/* Grid Lines for Tactical Feel */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      {/* Battle Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="glass-subtle px-4 py-2 rounded-full border-0">
          <span className="heading-refined text-xs text-primary tracking-wide flex items-center gap-2">
            <lucide_react_1.Zap className="h-3 w-3 animate-pulse"/>
            STRATEGIC AI COMBAT SIMULATION
            <lucide_react_1.Zap className="h-3 w-3 animate-pulse"/>
          </span>
        </div>
      </div>

      {/* AI Robots */}
      {robots.map(function (robot) {
            var IconComponent = robot.icon;
            return (<div key={robot.id} className={"absolute transition-all duration-500 ".concat(robot.charging ? 'animate-pulse' : '', " ").concat(robot.attacking ? 'scale-110' : 'scale-100')} style={{
                    left: "".concat(robot.position.x, "%"),
                    top: "".concat(robot.position.y, "%"),
                    transform: 'translate(-50%, -50%)',
                }}>
            {/* Robot Glow Effect */}
            <div className={"absolute inset-0 ".concat(robot.color, " opacity-30 blur-lg scale-150 ").concat(robot.charging ? 'animate-ping' : '')}>
              <IconComponent className="h-12 w-12"/>
            </div>
            
            {/* Main Robot */}
            <div className={"relative glass-panel p-3 rounded-xl transition-all duration-300 ".concat(robot.attacking ? 'shadow-lg shadow-primary/50' : 'shadow-sm')}>
              <IconComponent className={"h-12 w-12 ".concat(robot.color, " transition-all duration-300 ").concat(robot.attacking ? 'drop-shadow-lg' : '')}/>
              
              {/* Charging Effect */}
              {robot.charging && (<div className="absolute -inset-2 border-2 border-primary/50 rounded-xl animate-pulse">
                  <div className="absolute inset-0 bg-primary/10 rounded-xl animate-ping"></div>
                </div>)}
              
              {/* Attack Effect */}
              {robot.attacking && (<div className="absolute -inset-1">
                  <lucide_react_1.Sparkles className="h-4 w-4 text-yellow-400 absolute -top-2 -right-2 animate-spin"/>
                  <lucide_react_1.Sparkles className="h-3 w-3 text-yellow-400 absolute -bottom-1 -left-1 animate-ping"/>
                </div>)}
            </div>
            
            {/* Robot Info */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="glass-minimal px-2 py-1 rounded text-xs font-mono">
                <div className="text-primary font-semibold">{robot.name}</div>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <div className="w-6 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: "".concat(robot.health, "%") }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{robot.health}%</span>
                </div>
              </div>
            </div>
          </div>);
        })}

      {/* Battle Effects */}
      {battleEffects.map(function (effect) { return (<div key={effect.id} className="absolute pointer-events-none" style={{
                left: "".concat(effect.position.x, "%"),
                top: "".concat(effect.position.y, "%"),
                transform: 'translate(-50%, -50%)',
            }}>
          {effect.type === 'laser' && (<div className="flex items-center">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-80"></div>
              <lucide_react_1.Zap className="h-4 w-4 text-cyan-400 animate-ping ml-2"/>
            </div>)}
          
          {effect.type === 'spark' && (<div className="animate-ping">
              <lucide_react_1.Sparkles className="h-6 w-6 text-yellow-400"/>
            </div>)}
          
          {effect.type === 'explosion' && (<div className="animate-bounce">
              <div className="w-3 h-3 bg-orange-400 rounded-full opacity-80"></div>
            </div>)}
          
          {effect.type === 'shield' && (<lucide_react_1.Shield className="h-8 w-8 text-blue-400 animate-pulse"/>)}
        </div>); })}

      {/* Victory Animation */}
      {battlePhase === 'victory' && (<div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-panel px-6 py-3 rounded-xl border-2 border-primary/50 animate-bounce">
            <div className="flex items-center gap-3">
              <lucide_react_1.Cpu className="h-6 w-6 text-primary animate-spin"/>
              <span className="heading-refined text-primary">STRATEGIC VICTORY!</span>
              <lucide_react_1.Cpu className="h-6 w-6 text-secondary animate-spin"/>
            </div>
          </div>
        </div>)}

      {/* Battle Status Indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="glass-minimal px-3 py-2 rounded-full">
          <span className="text-xs text-muted-foreground capitalize flex items-center gap-2">
            <div className={"w-2 h-2 rounded-full ".concat(battlePhase === 'attacking' ? 'bg-red-500 animate-ping' :
            battlePhase === 'charging' ? 'bg-yellow-500 animate-pulse' :
                battlePhase === 'victory' ? 'bg-green-500' :
                    'bg-blue-500')}></div>
            {battlePhase === 'attacking' ? 'Combat Active' :
            battlePhase === 'charging' ? 'Powering Up' :
                battlePhase === 'victory' ? 'Mission Complete' :
                    'Standby Mode'}
          </span>
        </div>
      </div>
    </div>);
};
exports.AIBattleAnimation = (0, react_1.memo)(AIBattleAnimationComponent);
