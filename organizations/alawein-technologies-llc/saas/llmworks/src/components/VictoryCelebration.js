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
exports.VictoryCelebration = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var VictoryCelebrationComponent = function (_a) {
    var show = _a.show, title = _a.title, _b = _a.subtitle, subtitle = _b === void 0 ? "Strategic Victory Achieved!" : _b, onComplete = _a.onComplete;
    var _c = (0, react_1.useState)([]), particles = _c[0], setParticles = _c[1];
    var _d = (0, react_1.useState)(false), showContent = _d[0], setShowContent = _d[1];
    // Generate particles
    (0, react_1.useEffect)(function () {
        if (!show) {
            setParticles([]);
            setShowContent(false);
            return;
        }
        setShowContent(true);
        var colors = [
            'hsl(var(--victory-gold))', // Victory Gold
            'hsl(var(--accent))', // Strategic Accent
            'hsl(var(--danger))', // Alert Red
            'hsl(var(--intel-cyan))', // Intel Cyan
            'hsl(var(--primary))', // Tactical Blue
            'hsl(var(--success))', // Success Green
            'hsl(var(--warning))', // Warning Yellow
            'hsl(var(--secondary))', // Secondary
        ];
        var particleTypes = ['star', 'spark', 'circle'];
        // Create initial burst of particles
        var initialParticles = [];
        for (var i = 0; i < 50; i++) {
            var angle = (Math.PI * 2 * i) / 50;
            var velocity = 3 + Math.random() * 4;
            var life = 60 + Math.random() * 40;
            initialParticles.push({
                id: "particle-".concat(i),
                x: 50, // Center of screen
                y: 50,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: life,
                maxLife: life,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2 + Math.random() * 4,
                type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
            });
        }
        setParticles(initialParticles);
        // Animation loop
        var animationInterval = setInterval(function () {
            setParticles(function (prevParticles) {
                var updatedParticles = prevParticles
                    .map(function (particle) { return (__assign(__assign({}, particle), { x: particle.x + particle.vx, y: particle.y + particle.vy, vy: particle.vy + 0.1, vx: particle.vx * 0.99, life: particle.life - 1 })); })
                    .filter(function (particle) { return particle.life > 0 && particle.y < 100 && particle.x > -10 && particle.x < 110; });
                return updatedParticles;
            });
        }, 16); // ~60fps
        // Add continuous sparkles
        var sparkleInterval = setInterval(function () {
            if (!show)
                return;
            setParticles(function (prev) {
                var newSparkles = [];
                for (var i = 0; i < 3; i++) {
                    newSparkles.push({
                        id: "sparkle-".concat(Date.now(), "-").concat(i),
                        x: 30 + Math.random() * 40,
                        y: 30 + Math.random() * 40,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 2 - 1,
                        life: 30 + Math.random() * 20,
                        maxLife: 50,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: 1 + Math.random() * 2,
                        type: 'star'
                    });
                }
                return __spreadArray(__spreadArray([], prev, true), newSparkles, true).slice(-100); // Limit total particles
            });
        }, 200);
        // Auto-complete after 4 seconds
        var completeTimeout = setTimeout(function () {
            if (onComplete)
                onComplete();
        }, 4000);
        return function () {
            clearInterval(animationInterval);
            clearInterval(sparkleInterval);
            clearTimeout(completeTimeout);
        };
    }, [show, onComplete]);
    if (!show)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Particles Container */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(function (particle) {
            var opacity = particle.life / particle.maxLife;
            var scale = Math.min(1, particle.life / (particle.maxLife * 0.3));
            return (<div key={particle.id} className="absolute pointer-events-none" style={{
                    left: "".concat(particle.x, "%"),
                    top: "".concat(particle.y, "%"),
                    transform: "translate(-50%, -50%) scale(".concat(scale, ")"),
                    opacity: opacity,
                }}>
              {particle.type === 'star' && (<lucide_react_1.Star style={{
                        color: particle.color,
                        width: particle.size * 4,
                        height: particle.size * 4
                    }} fill="currentColor"/>)}
              {particle.type === 'spark' && (<lucide_react_1.Sparkles style={{
                        color: particle.color,
                        width: particle.size * 3,
                        height: particle.size * 3
                    }}/>)}
              {particle.type === 'circle' && (<div style={{
                        width: particle.size * 2,
                        height: particle.size * 2,
                        backgroundColor: particle.color,
                        borderRadius: '50%',
                    }}/>)}
            </div>);
        })}
      </div>

      {/* Victory Content */}
      {showContent && (<div className="relative z-10 text-center animate-bounce">
          <div className="glass-panel p-8 rounded-2xl border-2 border-primary/50 max-w-md mx-4">
            {/* Victory Icon */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 animate-ping">
                <lucide_react_1.Crown className="h-16 w-16 mx-auto text-yellow-400 opacity-75"/>
              </div>
              <lucide_react_1.Crown className="h-16 w-16 mx-auto text-yellow-400 relative z-10"/>
            </div>

            {/* Victory Text */}
            <div className="space-y-4">
              <h2 className="heading-display text-3xl text-primary font-bold">
                {title}
              </h2>
              <p className="body-elegant text-lg text-muted-foreground">
                {subtitle}
              </p>
            </div>

            {/* Animated Trophy */}
            <div className="mt-6 flex justify-center items-center gap-3">
              <lucide_react_1.Trophy className="h-8 w-8 text-yellow-400 animate-pulse"/>
              <span className="heading-refined text-lg text-accent">MISSION COMPLETE</span>
              <lucide_react_1.Trophy className="h-8 w-8 text-yellow-400 animate-pulse"/>
            </div>

            {/* Energy Bars */}
            <div className="mt-6 flex justify-center gap-1">
              {__spreadArray([], Array(5), true).map(function (_, i) { return (<div key={i} className="w-2 h-8 bg-primary/30 rounded-full overflow-hidden">
                  <div className="w-full bg-primary rounded-full animate-pulse" style={{
                    height: "".concat(100 - i * 10, "%"),
                    animationDelay: "".concat(i * 100, "ms")
                }}></div>
                </div>); })}
            </div>
          </div>
        </div>)}

      {/* Lightning Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <lucide_react_1.Zap className="absolute top-1/4 left-1/4 h-12 w-12 text-yellow-400 animate-ping opacity-60"/>
        <lucide_react_1.Zap className="absolute top-3/4 right-1/4 h-8 w-8 text-cyan-400 animate-pulse opacity-60"/>
        <lucide_react_1.Sparkles className="absolute top-1/2 left-1/6 h-10 w-10 text-purple-400 animate-bounce opacity-60"/>
        <lucide_react_1.Sparkles className="absolute bottom-1/4 right-1/6 h-6 w-6 text-green-400 animate-spin opacity-60"/>
      </div>
    </div>);
};
exports.VictoryCelebration = (0, react_1.memo)(VictoryCelebrationComponent);
