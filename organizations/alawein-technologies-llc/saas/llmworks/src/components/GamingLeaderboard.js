"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamingLeaderboard = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var VictoryCelebration_1 = require("./VictoryCelebration");
var GamingLeaderboardComponent = function () {
    var _a = (0, react_1.useState)('all'), selectedTier = _a[0], setSelectedTier = _a[1];
    var _b = (0, react_1.useState)(false), showCelebration = _b[0], setShowCelebration = _b[1];
    var _c = (0, react_1.useState)(null), animatingEntry = _c[0], setAnimatingEntry = _c[1];
    var tiers = {
        legendary: {
            name: 'Legendary Commander',
            icon: lucide_react_1.Crown,
            color: 'text-yellow-400',
            minElo: 2400,
            maxElo: 3000,
            gradient: 'from-yellow-400 to-orange-500'
        },
        diamond: {
            name: 'Diamond Strategist',
            icon: lucide_react_1.Star,
            color: 'text-cyan-400',
            minElo: 2000,
            maxElo: 2399,
            gradient: 'from-cyan-400 to-blue-500'
        },
        platinum: {
            name: 'Platinum Tactician',
            icon: lucide_react_1.Award,
            color: 'text-gray-300',
            minElo: 1600,
            maxElo: 1999,
            gradient: 'from-gray-300 to-gray-400'
        },
        gold: {
            name: 'Gold Elite',
            icon: lucide_react_1.Medal,
            color: 'text-yellow-500',
            minElo: 1200,
            maxElo: 1599,
            gradient: 'from-yellow-500 to-yellow-600'
        },
        silver: {
            name: 'Silver Operative',
            icon: lucide_react_1.Shield,
            color: 'text-gray-400',
            minElo: 800,
            maxElo: 1199,
            gradient: 'from-gray-400 to-gray-500'
        },
        bronze: {
            name: 'Bronze Recruit',
            icon: lucide_react_1.Target,
            color: 'text-orange-600',
            minElo: 0,
            maxElo: 799,
            gradient: 'from-orange-600 to-orange-700'
        }
    };
    var leaderboardData = [
        {
            id: '1',
            name: 'QuantumMind_Pro',
            model: 'GPT-4 Turbo',
            elo: 2847,
            tier: 'legendary',
            wins: 247,
            losses: 23,
            streak: 15,
            avatar: '🤖',
            specialTitle: 'Strategic Overlord',
            battleStats: { accuracy: 95, creativity: 92, strategy: 98, speed: 87 }
        },
        {
            id: '2',
            name: 'Dr_Nexus',
            model: 'Claude-3 Opus',
            elo: 2756,
            tier: 'legendary',
            wins: 198,
            losses: 31,
            streak: 8,
            avatar: '🧠',
            isHuman: true,
            specialTitle: 'AI Whisperer',
            battleStats: { accuracy: 91, creativity: 96, strategy: 89, speed: 84 }
        },
        {
            id: '3',
            name: 'TacticalGenius',
            model: 'Gemini Ultra',
            elo: 2634,
            tier: 'legendary',
            wins: 156,
            losses: 28,
            streak: 12,
            avatar: '⚡',
            specialTitle: 'Combat Virtuoso',
            battleStats: { accuracy: 89, creativity: 87, strategy: 94, speed: 91 }
        },
        {
            id: '4',
            name: 'AICommander_X',
            model: 'GPT-3.5 Turbo',
            elo: 2298,
            tier: 'diamond',
            wins: 134,
            losses: 45,
            streak: 5,
            avatar: '💎',
            battleStats: { accuracy: 86, creativity: 82, strategy: 88, speed: 89 }
        },
        {
            id: '5',
            name: 'StrategicMaster',
            model: 'PaLM-2',
            elo: 2156,
            tier: 'diamond',
            wins: 112,
            losses: 39,
            streak: 3,
            avatar: '🎯',
            isHuman: true,
            battleStats: { accuracy: 84, creativity: 88, strategy: 85, speed: 82 }
        },
        {
            id: '6',
            name: 'CyberTactician',
            model: 'LLaMA-2 70B',
            elo: 1987,
            tier: 'platinum',
            wins: 89,
            losses: 34,
            streak: 7,
            avatar: '🛡️',
            battleStats: { accuracy: 81, creativity: 79, strategy: 83, speed: 86 }
        }
    ];
    var getRankIcon = function (position) {
        switch (position) {
            case 1: return <lucide_react_1.Crown className="h-5 w-5 text-yellow-400"/>;
            case 2: return <lucide_react_1.Trophy className="h-5 w-5 text-gray-300"/>;
            case 3: return <lucide_react_1.Medal className="h-5 w-5 text-orange-600"/>;
            default: return <span className="text-sm font-bold text-muted-foreground">#{position}</span>;
        }
    };
    var getTierIcon = function (tier) {
        var TierIcon = tiers[tier].icon;
        return <TierIcon className={"h-4 w-4 ".concat(tiers[tier].color)}/>;
    };
    var filteredData = selectedTier === 'all'
        ? leaderboardData
        : leaderboardData.filter(function (entry) { return entry.tier === selectedTier; });
    // Simulate rank changes
    (0, react_1.useEffect)(function () {
        var rankChangeInterval = setInterval(function () {
            if (Math.random() > 0.8) {
                var randomEntry = leaderboardData[Math.floor(Math.random() * leaderboardData.length)];
                setAnimatingEntry(randomEntry.id);
                if (Math.random() > 0.7) {
                    setShowCelebration(true);
                }
                setTimeout(function () { return setAnimatingEntry(null); }, 2000);
            }
        }, 8000);
        return function () { return clearInterval(rankChangeInterval); };
    }, []);
    return (<>
      <div className="space-y-6">
        {/* Tier Selector */}
        <card_1.Card className="glass-panel border-border/20">
          <card_1.CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="glass-subtle p-2 rounded-xl">
                  <lucide_react_1.Sword className="h-5 w-5 text-primary"/>
                </div>
                <div>
                  <card_1.CardTitle className="heading-refined text-lg">Strategic Command Rankings</card_1.CardTitle>
                  <p className="text-xs text-muted-foreground">Elite commanders by tactical superiority</p>
                </div>
              </div>
              <badge_1.Badge className="performance-elite strategic-rank">
                LIVE RANKINGS
              </badge_1.Badge>
            </div>
          </card_1.CardHeader>

          <card_1.CardContent className="space-y-4">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-2">
              <button_1.Button variant={selectedTier === 'all' ? 'default' : 'outline'} size="sm" onClick={function () { return setSelectedTier('all'); }} className="glass-minimal">
                All Tiers
              </button_1.Button>
              {Object.entries(tiers).map(function (_a) {
            var tierKey = _a[0], tierInfo = _a[1];
            var TierIcon = tierInfo.icon;
            return (<button_1.Button key={tierKey} variant={selectedTier === tierKey ? 'default' : 'outline'} size="sm" onClick={function () { return setSelectedTier(tierKey); }} className="glass-minimal">
                    <TierIcon className={"h-3 w-3 mr-1 ".concat(tierInfo.color)}/>
                    {tierInfo.name.split(' ')[0]}
                  </button_1.Button>);
        })}
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
              {filteredData.map(function (entry, index) {
            var tierInfo = tiers[entry.tier];
            var winRate = Math.round((entry.wins / (entry.wins + entry.losses)) * 100);
            var isAnimating = animatingEntry === entry.id;
            return (<card_1.Card key={entry.id} className={"glass-subtle border-border/20 transition-all duration-500 ".concat(isAnimating ? 'scale-105 shadow-lg border-primary/50' : 'hover:shadow-md')}>
                    <card_1.CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Rank & Avatar */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(index + 1)}
                          </div>
                          <div className="text-2xl">{entry.avatar}</div>
                        </div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="heading-refined text-sm">{entry.name}</h3>
                            {entry.isHuman && (<badge_1.Badge variant="outline" className="text-xs glass-minimal border-green-400/30 text-green-400">
                                HUMAN
                              </badge_1.Badge>)}
                            {entry.specialTitle && (<badge_1.Badge className="text-xs performance-superior strategic-rank">
                                {entry.specialTitle}
                              </badge_1.Badge>)}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{entry.model}</span>
                            <div className="flex items-center gap-1">
                              {getTierIcon(entry.tier)}
                              <span>{tierInfo.name}</span>
                            </div>
                          </div>

                          {/* Battle Stats Mini-Bars */}
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">ACC</div>
                              <div className="w-full bg-muted/20 rounded-full h-1">
                                <div className="h-1 bg-blue-400 rounded-full transition-all" style={{ width: "".concat(entry.battleStats.accuracy, "%") }}/>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">CRE</div>
                              <div className="w-full bg-muted/20 rounded-full h-1">
                                <div className="h-1 bg-purple-400 rounded-full transition-all" style={{ width: "".concat(entry.battleStats.creativity, "%") }}/>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">STR</div>
                              <div className="w-full bg-muted/20 rounded-full h-1">
                                <div className="h-1 bg-red-400 rounded-full transition-all" style={{ width: "".concat(entry.battleStats.strategy, "%") }}/>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">SPD</div>
                              <div className="w-full bg-muted/20 rounded-full h-1">
                                <div className="h-1 bg-green-400 rounded-full transition-all" style={{ width: "".concat(entry.battleStats.speed, "%") }}/>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right space-y-1">
                          <div className="heading-display text-lg text-primary">{entry.elo}</div>
                          <div className="text-xs text-muted-foreground">ELO Rating</div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-400">{entry.wins}W</span>
                            <span className="text-red-400">{entry.losses}L</span>
                            <badge_1.Badge variant="outline" className="text-xs">
                              {winRate}%
                            </badge_1.Badge>
                          </div>

                          {entry.streak > 0 && (<div className="flex items-center gap-1 text-xs">
                              <lucide_react_1.Flame className="h-3 w-3 text-orange-400"/>
                              <span className="text-orange-400">{entry.streak} streak</span>
                            </div>)}

                          {isAnimating && (<div className="animate-bounce">
                              <badge_1.Badge className="text-xs performance-elite strategic-rank">
                                RANK UP!
                              </badge_1.Badge>
                            </div>)}
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>);
        })}
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Tier Distribution Chart */}
        <card_1.Card className="glass-panel border-border/20">
          <card_1.CardHeader className="pb-4">
            <card_1.CardTitle className="heading-refined text-lg flex items-center gap-2">
              <lucide_react_1.TrendingUp className="h-4 w-4 text-secondary"/>
              Tier Distribution
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-3">
              {Object.entries(tiers).reverse().map(function (_a) {
            var tierKey = _a[0], tierInfo = _a[1];
            var TierIcon = tierInfo.icon;
            var count = leaderboardData.filter(function (entry) { return entry.tier === tierKey; }).length;
            var percentage = (count / leaderboardData.length) * 100;
            return (<div key={tierKey} className="flex items-center gap-3">
                    <TierIcon className={"h-4 w-4 ".concat(tierInfo.color)}/>
                    <span className="text-sm min-w-[120px]">{tierInfo.name}</span>
                    <div className="flex-1">
                      <progress_1.Progress value={percentage} className="h-2"/>
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>);
        })}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Victory Celebration */}
      <VictoryCelebration_1.VictoryCelebration show={showCelebration} title="Legendary Achievement!" subtitle="New commander has joined the elite ranks!" onComplete={function () { return setShowCelebration(false); }}/>
    </>);
};
exports.GamingLeaderboard = (0, react_1.memo)(GamingLeaderboardComponent);
