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
exports.XPProgressionSystem = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var XPProgressionSystemComponent = function () {
    var _a = (0, react_1.useState)({
        level: 12,
        title: 'Strategic Commander',
        xpCurrent: 2847,
        xpRequired: 3200,
        badge: 'gold',
        perks: ['Extended Battle Duration', 'Advanced Analytics', 'Priority Queue Access']
    }), playerLevel = _a[0], setPlayerLevel = _a[1];
    var _b = (0, react_1.useState)(0), recentXpGain = _b[0], setRecentXpGain = _b[1];
    var _c = (0, react_1.useState)(false), showXpAnimation = _c[0], setShowXpAnimation = _c[1];
    var achievements = [
        {
            id: 'first-victory',
            name: 'First Victory',
            description: 'Win your first strategic evaluation',
            icon: lucide_react_1.Trophy,
            unlocked: true,
            rarity: 'common',
            xpReward: 100,
        },
        {
            id: 'model-expert',
            name: 'Model Expert',
            description: 'Test 25 different AI models',
            icon: lucide_react_1.Brain,
            unlocked: true,
            rarity: 'rare',
            xpReward: 250,
        },
        {
            id: 'strategic-mastermind',
            name: 'Strategic Mastermind',
            description: 'Complete 100 strategic evaluations',
            icon: lucide_react_1.Crown,
            unlocked: false,
            rarity: 'epic',
            xpReward: 500,
        },
        {
            id: 'legendary-commander',
            name: 'Legendary Commander',
            description: 'Reach top 10 global leaderboard',
            icon: lucide_react_1.Star,
            unlocked: false,
            rarity: 'legendary',
            xpReward: 1000,
        },
    ];
    var getRarityColor = function (rarity) {
        switch (rarity) {
            case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
            case 'rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
            case 'legendary': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
        }
    };
    var getBadgeColor = function (badge) {
        switch (badge) {
            case 'bronze': return 'rank-bronze';
            case 'silver': return 'rank-silver';
            case 'gold': return 'rank-gold';
            case 'platinum': return 'rank-platinum';
            case 'diamond': return 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30';
            default: return 'performance-standard';
        }
    };
    // Simulate XP gain animation
    (0, react_1.useEffect)(function () {
        var xpGainInterval = setInterval(function () {
            if (Math.random() > 0.7) {
                var gain_1 = Math.floor(Math.random() * 50) + 10;
                setRecentXpGain(gain_1);
                setShowXpAnimation(true);
                setPlayerLevel(function (prev) { return (__assign(__assign({}, prev), { xpCurrent: Math.min(prev.xpCurrent + gain_1, prev.xpRequired) })); });
                setTimeout(function () { return setShowXpAnimation(false); }, 2000);
            }
        }, 8000);
        return function () { return clearInterval(xpGainInterval); };
    }, []);
    var progressPercentage = (playerLevel.xpCurrent / playerLevel.xpRequired) * 100;
    return (<div className="space-y-6">
      {/* Player Level Card */}
      <card_1.Card className="glass-panel border-border/20 overflow-hidden">
        <card_1.CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="glass-subtle p-2 rounded-xl">
                <lucide_react_1.Crown className="h-5 w-5 text-primary"/>
              </div>
              <div>
                <card_1.CardTitle className="heading-refined text-lg">Commander Profile</card_1.CardTitle>
                <p className="text-xs text-muted-foreground">Strategic Operations Division</p>
              </div>
            </div>
            <badge_1.Badge className={"strategic-rank ".concat(getBadgeColor(playerLevel.badge))}>
              LVL {playerLevel.level}
            </badge_1.Badge>
          </div>
        </card_1.CardHeader>

        <card_1.CardContent className="space-y-4">
          {/* Level Title and XP */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading-refined text-sm text-primary">{playerLevel.title}</h3>
              <p className="text-xs text-muted-foreground">
                {playerLevel.xpCurrent.toLocaleString()} / {playerLevel.xpRequired.toLocaleString()} XP
              </p>
            </div>
            {showXpAnimation && (<div className="animate-bounce">
                <badge_1.Badge className="performance-elite strategic-rank">
                  +{recentXpGain} XP
                </badge_1.Badge>
              </div>)}
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <progress_1.Progress value={progressPercentage} className="h-3 bg-muted/30"/>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to Level {playerLevel.level + 1}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          {/* Perks */}
          <div>
            <h4 className="heading-refined text-xs mb-2 flex items-center gap-2">
              <lucide_react_1.Sparkles className="h-3 w-3 text-accent"/>
              Commander Perks
            </h4>
            <div className="flex flex-wrap gap-1">
              {playerLevel.perks.map(function (perk, index) { return (<badge_1.Badge key={index} variant="outline" className="text-xs glass-minimal">
                  {perk}
                </badge_1.Badge>); })}
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Achievements Grid */}
      <card_1.Card className="glass-panel border-border/20">
        <card_1.CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.Award className="h-5 w-5 text-secondary"/>
            </div>
            <div>
              <card_1.CardTitle className="heading-refined text-lg">Strategic Achievements</card_1.CardTitle>
              <p className="text-xs text-muted-foreground">
                {achievements.filter(function (a) { return a.unlocked; }).length} of {achievements.length} unlocked
              </p>
            </div>
          </div>
        </card_1.CardHeader>

        <card_1.CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map(function (achievement) {
            var IconComponent = achievement.icon;
            return (<div key={achievement.id} className={"glass-subtle p-4 rounded-lg transition-all duration-300 border ".concat(achievement.unlocked
                    ? "".concat(getRarityColor(achievement.rarity), " hover:shadow-md")
                    : 'opacity-50 border-muted/30')}>
                  <div className="flex items-start gap-3">
                    <div className={"p-2 rounded-lg ".concat(achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : 'bg-muted/20')}>
                      <IconComponent className="h-4 w-4"/>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="heading-refined text-sm">{achievement.name}</h4>
                        {achievement.unlocked && (<badge_1.Badge className="text-xs performance-superior strategic-rank">
                            +{achievement.xpReward}
                          </badge_1.Badge>)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <badge_1.Badge variant="outline" className={"text-xs capitalize ".concat(getRarityColor(achievement.rarity))}>
                        {achievement.rarity}
                      </badge_1.Badge>
                    </div>
                  </div>
                </div>);
        })}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <card_1.Card className="glass-subtle border-border/20 text-center">
          <card_1.CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center gap-2">
              <lucide_react_1.Target className="h-5 w-5 text-primary"/>
              <div className="heading-display text-lg">247</div>
              <div className="text-xs text-muted-foreground">Battles Won</div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="glass-subtle border-border/20 text-center">
          <card_1.CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center gap-2">
              <lucide_react_1.TrendingUp className="h-5 w-5 text-secondary"/>
              <div className="heading-display text-lg">89%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="glass-subtle border-border/20 text-center">
          <card_1.CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center gap-2">
              <lucide_react_1.Cpu className="h-5 w-5 text-accent"/>
              <div className="heading-display text-lg">47</div>
              <div className="text-xs text-muted-foreground">Models Tested</div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.XPProgressionSystem = (0, react_1.memo)(XPProgressionSystemComponent);
