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
exports.AchievementSystem = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AchievementPopup = function (_a) {
    var achievement = _a.achievement, onDismiss = _a.onDismiss;
    var _b = (0, react_1.useState)(false), isVisible = _b[0], setIsVisible = _b[1];
    var _c = (0, react_1.useState)('enter'), animationPhase = _c[0], setAnimationPhase = _c[1];
    (0, react_1.useEffect)(function () {
        // Enter animation
        setTimeout(function () { return setIsVisible(true); }, 100);
        setTimeout(function () { return setAnimationPhase('display'); }, 600);
        // Auto dismiss after display time
        var dismissTimer = setTimeout(function () {
            setAnimationPhase('exit');
            setTimeout(onDismiss, 500);
        }, 4000);
        return function () { return clearTimeout(dismissTimer); };
    }, [onDismiss]);
    var getRarityStyles = function () {
        switch (achievement.rarity) {
            case 'legendary':
                return {
                    border: 'border-yellow-400/50',
                    bg: 'bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10',
                    glow: 'shadow-yellow-400/20',
                    particle: 'bg-yellow-400'
                };
            case 'epic':
                return {
                    border: 'border-purple-400/50',
                    bg: 'bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-indigo-500/10',
                    glow: 'shadow-purple-400/20',
                    particle: 'bg-purple-400'
                };
            case 'rare':
                return {
                    border: 'border-blue-400/50',
                    bg: 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-sky-500/10',
                    glow: 'shadow-blue-400/20',
                    particle: 'bg-blue-400'
                };
            default:
                return {
                    border: 'border-primary/30',
                    bg: 'bg-gradient-to-br from-primary/10 to-secondary/5',
                    glow: 'shadow-primary/20',
                    particle: 'bg-primary'
                };
        }
    };
    var styles = getRarityStyles();
    var IconComponent = achievement.icon;
    return (<div className={"\n        fixed top-20 right-4 z-50 transform transition-all duration-500 ease-out\n        ".concat(isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0', "\n        ").concat(animationPhase === 'enter' ? 'scale-95' : 'scale-100', "\n        ").concat(animationPhase === 'exit' ? 'translate-x-full opacity-0' : '', "\n      ")}>
      <div className={"\n        relative glass-panel border-2 ".concat(styles.border, " ").concat(styles.bg, " \n        shadow-2xl ").concat(styles.glow, " p-4 rounded-xl max-w-sm\n        transform transition-transform duration-300 hover:scale-105\n      ")}>
        
        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {__spreadArray([], Array(8), true).map(function (_, i) { return (<div key={i} className={"\n                absolute w-1 h-1 ".concat(styles.particle, " rounded-full\n                animate-bounce opacity-60\n              ")} style={{
                left: "".concat(20 + i * 10, "%"),
                top: "".concat(15 + (i % 3) * 20, "%"),
                animationDelay: "".concat(i * 0.1, "s"),
                animationDuration: "".concat(1.5 + Math.random(), "s")
            }}/>); })}
        </div>

        {/* Achievement Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-3">
            
            {/* Achievement Icon */}
            <div className={"\n              p-3 rounded-xl ".concat(styles.bg, " border ").concat(styles.border, "\n              flex items-center justify-center shadow-lg\n              transform transition-transform duration-300 hover:rotate-12\n            ")}>
              <IconComponent className="h-6 w-6 text-primary"/>
            </div>

            {/* Achievement Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="heading-refined font-semibold text-sm text-primary">
                  Achievement Unlocked!
                </h3>
                <div className={"\n                  px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide\n                  ".concat(achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-primary/20 text-primary', "\n                ")}>
                  {achievement.rarity}
                </div>
              </div>
              
              <h4 className="heading-refined font-bold mb-1">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {achievement.description}
              </p>

              {/* Progress Indicator (if applicable) */}
              {achievement.progress && (<div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress.current}/{achievement.progress.total}</span>
                  </div>
                  <div className="glass-minimal h-1.5 rounded-full overflow-hidden">
                    <div className={"h-full ".concat(styles.particle, " transition-all duration-1000 ease-out")} style={{ width: "".concat((achievement.progress.current / achievement.progress.total) * 100, "%") }}/>
                  </div>
                </div>)}
            </div>

            {/* Dismiss Button */}
            <button onClick={onDismiss} className="glass-minimal p-1 rounded-lg hover:bg-muted/20 transition-colors opacity-50 hover:opacity-100" aria-label="Dismiss achievement">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-0.5 bg-current rotate-45 absolute"/>
                <div className="w-2 h-0.5 bg-current -rotate-45 absolute"/>
              </div>
            </button>
          </div>
        </div>

        {/* Special Legendary Effect */}
        {achievement.rarity === 'legendary' && (<div className="absolute inset-0 rounded-xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse"/>
            <div className="absolute top-2 right-2">
              <lucide_react_1.Crown className="h-4 w-4 text-yellow-400 animate-bounce"/>
            </div>
          </div>)}
      </div>
    </div>);
};
var AchievementSystemComponent = function () {
    var _a = (0, react_1.useState)([]), achievements = _a[0], setAchievements = _a[1];
    var _b = (0, react_1.useState)(null), currentPopup = _b[0], setCurrentPopup = _b[1];
    // Predefined achievements that can be unlocked
    var achievementDatabase = [
        {
            id: 'first-visit',
            title: 'Strategic Reconnaissance',
            description: 'Welcome to the Strategic Command Center! Your evaluation journey begins.',
            category: 'exploration',
            rarity: 'common',
            icon: lucide_react_1.Shield
        },
        {
            id: 'demo-complete',
            title: 'Feature Explorer',
            description: 'Completed the interactive showcase demonstration. You know the terrain!',
            category: 'exploration',
            rarity: 'common',
            icon: lucide_react_1.Target,
            progress: { current: 11, total: 11 }
        },
        {
            id: 'tour-master',
            title: 'Tactical Awareness',
            description: 'Completed the guided feature tour. Strategic knowledge acquired!',
            category: 'mastery',
            rarity: 'rare',
            icon: lucide_react_1.Star
        },
        {
            id: 'theme-customizer',
            title: 'Command Personalization',
            description: 'Customized your command center theme. The environment adapts to you!',
            category: 'mastery',
            rarity: 'rare',
            icon: lucide_react_1.Zap
        },
        {
            id: 'portfolio-viewer',
            title: 'Strategic Intelligence',
            description: 'Accessed portfolio presentation mode. You understand the mission!',
            category: 'milestone',
            rarity: 'epic',
            icon: lucide_react_1.Award
        },
        {
            id: 'keyboard-master',
            title: 'Hotkey Commander',
            description: 'Used keyboard shortcuts extensively. Efficiency is your weapon!',
            category: 'mastery',
            rarity: 'epic',
            icon: lucide_react_1.Zap,
            progress: { current: 5, total: 10 }
        },
        {
            id: 'legendary-explorer',
            title: 'Command Center Mastery',
            description: 'Explored every feature of the Strategic Command Center. True mastery achieved!',
            category: 'legendary',
            rarity: 'legendary',
            icon: lucide_react_1.Crown
        }
    ];
    // Simulate achievement unlocking based on user interactions
    (0, react_1.useEffect)(function () {
        var unlockTimers = [];
        // Welcome achievement after 2 seconds
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('first-visit');
        }, 2000));
        // Simulate various achievements being unlocked over time
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('demo-complete');
        }, 30000)); // 30 seconds
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('tour-master');
        }, 60000)); // 1 minute
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('theme-customizer');
        }, 90000)); // 1.5 minutes
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('portfolio-viewer');
        }, 120000)); // 2 minutes
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('keyboard-master');
        }, 150000)); // 2.5 minutes
        unlockTimers.push(setTimeout(function () {
            unlockAchievement('legendary-explorer');
        }, 180000)); // 3 minutes
        return function () {
            unlockTimers.forEach(function (timer) { return clearTimeout(timer); });
        };
    }, []);
    var unlockAchievement = function (achievementId) {
        var template = achievementDatabase.find(function (a) { return a.id === achievementId; });
        if (!template)
            return;
        // Check if already unlocked
        if (achievements.some(function (a) { return a.id === achievementId; }))
            return;
        var newAchievement = __assign(__assign({}, template), { unlockedAt: new Date() });
        setAchievements(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newAchievement], false); });
        setCurrentPopup(newAchievement);
    };
    var dismissPopup = function () {
        setCurrentPopup(null);
    };
    return (<>
      {/* Achievement Popup */}
      {currentPopup && (<AchievementPopup achievement={currentPopup} onDismiss={dismissPopup}/>)}

      {/* Achievement Counter (bottom right, subtle) */}
      {achievements.length > 0 && (<div className="fixed bottom-20 right-4 glass-minimal px-3 py-2 rounded-full text-xs text-muted-foreground z-40">
          <div className="flex items-center gap-2">
            <lucide_react_1.Trophy className="h-3 w-3"/>
            <span>{achievements.length} achievements</span>
          </div>
        </div>)}
    </>);
};
exports.AchievementSystem = (0, react_1.memo)(AchievementSystemComponent);
