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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicLeaderboard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var DynamicLeaderboardComponent = function () {
    var _a = (0, react_1.useState)([]), contenders = _a[0], setContenders = _a[1];
    var _b = (0, react_1.useState)('overall'), displayMode = _b[0], setDisplayMode = _b[1];
    // Simulate dynamic ranking changes
    (0, react_1.useEffect)(function () {
        var initialContenders = [
            {
                id: 'strategic-analyst',
                name: 'Strategic Analyst Alpha',
                category: 'analytical',
                currentRank: 1,
                previousRank: 2,
                winStreak: 7,
                specialization: ['Logic', 'Data Analysis', 'Pattern Recognition'],
                lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
                momentum: 'rising'
            },
            {
                id: 'creative-nexus',
                name: 'Creative Nexus Pro',
                category: 'creative',
                currentRank: 2,
                previousRank: 1,
                winStreak: 5,
                specialization: ['Storytelling', 'Innovation', 'Artistic Vision'],
                lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                momentum: 'falling'
            },
            {
                id: 'reasoning-engine',
                name: 'Reasoning Engine X1',
                category: 'reasoning',
                currentRank: 3,
                previousRank: 4,
                winStreak: 12,
                specialization: ['Problem Solving', 'Logic Chains', 'Deduction'],
                lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                momentum: 'rising'
            },
            {
                id: 'conversation-master',
                name: 'Conversation Master',
                category: 'conversational',
                currentRank: 4,
                previousRank: 3,
                winStreak: 3,
                specialization: ['Dialogue', 'Context Retention', 'Empathy'],
                lastActive: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
                momentum: 'stable'
            },
            {
                id: 'tactical-commander',
                name: 'Tactical Commander',
                category: 'analytical',
                currentRank: 5,
                previousRank: 6,
                winStreak: 9,
                specialization: ['Strategy', 'Risk Assessment', 'Optimization'],
                lastActive: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
                momentum: 'rising'
            },
            {
                id: 'creative-spark',
                name: 'Creative Spark V2',
                category: 'creative',
                currentRank: 6,
                previousRank: 5,
                winStreak: 1,
                specialization: ['Brainstorming', 'Ideation', 'Inspiration'],
                lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                momentum: 'falling'
            }
        ];
        setContenders(initialContenders);
        // Simulate ranking changes every 30 seconds
        var rankingUpdates = setInterval(function () {
            setContenders(function (prevContenders) {
                return prevContenders.map(function (contender) {
                    var shouldUpdate = Math.random() < 0.3; // 30% chance of change
                    if (!shouldUpdate)
                        return contender;
                    // Simulate small ranking fluctuations
                    var rankChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    var newRank = Math.max(1, Math.min(6, contender.currentRank + rankChange));
                    // Update momentum based on rank change
                    var newMomentum = contender.momentum;
                    if (newRank < contender.currentRank)
                        newMomentum = 'rising';
                    else if (newRank > contender.currentRank)
                        newMomentum = 'falling';
                    else
                        newMomentum = 'stable';
                    // Simulate activity
                    var activityChance = Math.random();
                    var lastActive = contender.lastActive;
                    if (activityChance < 0.2) { // 20% chance of recent activity
                        lastActive = new Date();
                    }
                    return __assign(__assign({}, contender), { previousRank: contender.currentRank, currentRank: newRank, momentum: newMomentum, lastActive: lastActive, winStreak: newMomentum === 'rising' ? contender.winStreak + 1 :
                            newMomentum === 'falling' ? Math.max(0, contender.winStreak - 1) :
                                contender.winStreak });
                }).sort(function (a, b) { return a.currentRank - b.currentRank; });
            });
        }, 30000); // Update every 30 seconds
        return function () { return clearInterval(rankingUpdates); };
    }, []);
    var getRankIcon = function (rank) {
        switch (rank) {
            case 1: return <lucide_react_1.Crown className="h-5 w-5 text-yellow-400"/>;
            case 2: return <lucide_react_1.Trophy className="h-5 w-5 text-gray-400"/>;
            case 3: return <lucide_react_1.Star className="h-5 w-5 text-amber-600"/>;
            default: return <lucide_react_1.Shield className="h-4 w-4 text-muted-foreground"/>;
        }
    };
    var getMomentumIcon = function (momentum, currentRank, previousRank) {
        if (currentRank < previousRank)
            return <lucide_react_1.TrendingUp className="h-4 w-4 text-green-400"/>;
        if (currentRank > previousRank)
            return <lucide_react_1.TrendingDown className="h-4 w-4 text-red-400"/>;
        return <lucide_react_1.Minus className="h-4 w-4 text-muted-foreground"/>;
    };
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'reasoning': return <lucide_react_1.Zap className="h-4 w-4"/>;
            case 'creative': return <lucide_react_1.Star className="h-4 w-4"/>;
            case 'analytical': return <lucide_react_1.Shield className="h-4 w-4"/>;
            case 'conversational': return <lucide_react_1.Trophy className="h-4 w-4"/>;
            default: return <lucide_react_1.Shield className="h-4 w-4"/>;
        }
    };
    var getTimeAgo = function (date) {
        var minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return "".concat(minutes, "m ago");
        var hours = Math.floor(minutes / 60);
        return "".concat(hours, "h ago");
    };
    var getRankChangeDescription = function (current, previous) {
        if (current < previous)
            return "\u2191".concat(previous - current);
        if (current > previous)
            return "\u2193".concat(current - previous);
        return '—';
    };
    return (<div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass-subtle p-2 rounded-xl">
            <lucide_react_1.Trophy className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <h3 className="heading-refined text-xl">Strategic Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Live rankings • Updates every 30s</p>
          </div>
        </div>

        {/* Display Mode Toggle */}
        <div className="glass-minimal p-1 rounded-lg">
          <div className="flex gap-1">
            {['overall', 'category', 'recent'].map(function (mode) { return (<button key={mode} onClick={function () { return setDisplayMode(mode); }} className={"px-3 py-1 text-xs rounded transition-colors capitalize ".concat(displayMode === mode
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted/20')}>
                {mode}
              </button>); })}
          </div>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3">
        {contenders.map(function (contender, index) {
            var isTopThree = contender.currentRank <= 3;
            var hasRecentActivity = (Date.now() - contender.lastActive.getTime()) < 1000 * 60 * 30; // 30 minutes
            return (<div key={contender.id} className={"\n                relative overflow-hidden rounded-lg transition-all duration-500\n                ".concat(isTopThree ? 'glass-panel border border-primary/20' : 'glass-minimal', "\n                ").concat(hasRecentActivity ? 'ring-2 ring-green-400/20 shadow-green-400/10' : '', "\n                hover:shadow-lg group\n              ")}>
              {/* Rank Position Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary"/>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  
                  {/* Left: Rank and Info */}
                  <div className="flex items-center gap-4">
                    
                    {/* Rank Display */}
                    <div className="flex items-center gap-2">
                      <div className={"\n                        w-10 h-10 rounded-lg flex items-center justify-center font-bold\n                        ".concat(isTopThree ? 'bg-gradient-to-br from-primary/20 to-secondary/10' : 'bg-muted/10', "\n                      ")}>
                        {getRankIcon(contender.currentRank)}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-mono text-primary">#{contender.currentRank}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {getMomentumIcon(contender.momentum, contender.currentRank, contender.previousRank)}
                          <span className="ml-1">{getRankChangeDescription(contender.currentRank, contender.previousRank)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contender Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="heading-refined font-semibold">{contender.name}</h4>
                        {hasRecentActivity && (<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>)}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(contender.category)}
                          <span className="capitalize">{contender.category}</span>
                        </div>
                        <div>•</div>
                        <div>{contender.winStreak} win streak</div>
                        <div>•</div>
                        <div>{getTimeAgo(contender.lastActive)}</div>
                      </div>

                      {/* Specializations */}
                      <div className="flex gap-2 mt-2">
                        {contender.specialization.slice(0, 3).map(function (spec) { return (<div key={spec} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-mono">
                            {spec}
                          </div>); })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Performance Indicators */}
                  <div className="text-right space-y-2">
                    
                    {/* Momentum Indicator */}
                    <div className={"\n                      px-3 py-1 rounded-full text-xs font-medium\n                      ".concat(contender.momentum === 'rising' ? 'bg-green-500/10 text-green-400' :
                    contender.momentum === 'falling' ? 'bg-red-500/10 text-red-400' :
                        'bg-muted/10 text-muted-foreground', "\n                    ")}>
                      {contender.momentum === 'rising' ? '↗ Rising' :
                    contender.momentum === 'falling' ? '↘ Falling' : '— Stable'}
                    </div>

                    {/* Win Streak Display */}
                    {contender.winStreak > 5 && (<div className="flex items-center gap-1 text-xs text-yellow-400">
                        <lucide_react_1.Star className="h-3 w-3"/>
                        <span>Hot Streak!</span>
                      </div>)}
                  </div>
                </div>
              </div>

              {/* Top 3 Special Effects */}
              {isTopThree && (<div className="absolute inset-0 pointer-events-none">
                  <div className={"\n                    absolute inset-0 rounded-lg opacity-20\n                    ".concat(contender.currentRank === 1 ? 'bg-gradient-to-r from-yellow-400/10 to-amber-500/10' :
                        contender.currentRank === 2 ? 'bg-gradient-to-r from-gray-400/10 to-slate-500/10' :
                            'bg-gradient-to-r from-amber-600/10 to-orange-500/10', "\n                  ")}/>
                </div>)}
            </div>);
        })}
      </div>

      {/* Leaderboard Statistics */}
      <div className="glass-minimal p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-mono text-primary">
              {contenders.filter(function (c) { return c.momentum === 'rising'; }).length}
            </div>
            <div className="text-xs text-muted-foreground">Rising</div>
          </div>
          <div>
            <div className="text-lg font-mono text-secondary">
              {Math.max.apply(Math, contenders.map(function (c) { return c.winStreak; }))}
            </div>
            <div className="text-xs text-muted-foreground">Max Streak</div>
          </div>
          <div>
            <div className="text-lg font-mono text-accent">
              {contenders.filter(function (c) { return (Date.now() - c.lastActive.getTime()) < 1000 * 60 * 30; }).length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </div>
    </div>);
};
exports.DynamicLeaderboard = (0, react_1.memo)(DynamicLeaderboardComponent);
