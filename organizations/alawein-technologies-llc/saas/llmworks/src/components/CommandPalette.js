"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPalette = void 0;
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var analytics_1 = require("@/lib/analytics");
var CommandPaletteComponent = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var _b = (0, react_1.useState)(''), query = _b[0], setQuery = _b[1];
    var _c = (0, react_1.useState)(0), selectedIndex = _c[0], setSelectedIndex = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var inputRef = (0, react_1.useRef)(null);
    var listRef = (0, react_1.useRef)(null);
    var commands = (0, react_1.useMemo)(function () { return [
        {
            id: 'home',
            title: 'Home',
            description: 'Return to the main platform',
            icon: lucide_react_1.Home,
            action: function () { return navigate('/'); },
            category: 'Navigation',
            keywords: ['home', 'main', 'platform', 'overview'],
        },
        {
            id: 'arena',
            title: 'Enter Arena',
            description: 'Start AI battles and competitions',
            icon: lucide_react_1.Zap,
            action: function () { return navigate('/arena'); },
            category: 'Combat',
            keywords: ['arena', 'battle', 'fight', 'combat', 'competition'],
            badge: 'Hot'
        },
        {
            id: 'bench',
            title: 'View Bench',
            description: 'Check leaderboards and rankings',
            icon: lucide_react_1.BarChart3,
            action: function () { return navigate('/bench'); },
            category: 'Analytics',
            keywords: ['bench', 'leaderboard', 'rankings', 'stats', 'performance'],
        },
        {
            id: 'dashboard',
            title: 'Command Center',
            description: 'Access management dashboard',
            icon: lucide_react_1.Settings,
            action: function () { return navigate('/dashboard'); },
            category: 'Management',
            keywords: ['dashboard', 'settings', 'config', 'management', 'control'],
        },
        {
            id: 'github',
            title: 'View Source',
            description: 'Open GitHub repository',
            icon: lucide_react_1.Github,
            action: function () { return window.open('https://github.com/alawein/aegis-ai-evaluator', '_blank'); },
            category: 'External',
            keywords: ['github', 'source', 'code', 'repository', 'open source'],
        },
        {
            id: 'shortcuts',
            title: 'Keyboard Shortcuts',
            description: 'View all available shortcuts',
            icon: lucide_react_1.Keyboard,
            action: function () {
                // This would trigger the keyboard shortcuts modal
                onOpenChange(false);
            },
            category: 'Help',
            keywords: ['shortcuts', 'keyboard', 'help', 'hotkeys', 'commands'],
        },
    ]; }, [navigate, onOpenChange]);
    var filteredCommands = (0, react_1.useMemo)(function () {
        if (!query.trim())
            return commands;
        var normalizedQuery = query.toLowerCase().trim();
        return commands.filter(function (command) {
            return command.title.toLowerCase().includes(normalizedQuery) ||
                command.description.toLowerCase().includes(normalizedQuery) ||
                command.keywords.some(function (keyword) { return keyword.toLowerCase().includes(normalizedQuery); });
        });
    }, [query, commands]);
    var categories = (0, react_1.useMemo)(function () {
        var categoryMap = new Map();
        filteredCommands.forEach(function (command) {
            var category = command.category;
            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category).push(command);
        });
        return Array.from(categoryMap.entries());
    }, [filteredCommands]);
    (0, react_1.useEffect)(function () {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);
    (0, react_1.useEffect)(function () {
        setSelectedIndex(0);
    }, [query]);
    var handleKeyDown = function (e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(function (prev) { return Math.min(prev + 1, filteredCommands.length - 1); });
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(function (prev) { return Math.max(prev - 1, 0); });
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            var selectedCommand = filteredCommands[selectedIndex];
            if (selectedCommand) {
                (0, analytics_1.trackEvent)('command_palette_action', {
                    command: selectedCommand.id,
                    query: query.trim()
                });
                selectedCommand.action();
                onOpenChange(false);
                setQuery('');
            }
        }
        else if (e.key === 'Escape') {
            onOpenChange(false);
            setQuery('');
        }
    };
    var handleCommandClick = function (command) {
        (0, analytics_1.trackEvent)('command_palette_action', {
            command: command.id,
            query: query.trim()
        });
        command.action();
        onOpenChange(false);
        setQuery('');
    };
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogContent className="glass-panel max-w-2xl p-0 gap-0 overflow-hidden border-border/20" style={{
            background: 'hsl(var(--glass-background))',
            backdropFilter: 'var(--glass-backdrop-filter)'
        }}>
        {/* Sophisticated Header */}
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-border/10">
          <div className="glass-panel p-2 rounded-lg">
            <lucide_react_1.Command className="h-5 w-5 text-primary"/>
          </div>
          <div className="flex-1">
            <input_1.Input ref={inputRef} value={query} onChange={function (e) { return setQuery(e.target.value); }} onKeyDown={handleKeyDown} placeholder="Search commands..." className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-0" autoComplete="off"/>
          </div>
          <badge_1.Badge className="glass-panel border-0 text-xs px-3 py-1">
            <span className="font-mono">⌘K</span>
          </badge_1.Badge>
        </div>

        {/* Sophisticated Results */}
        <div ref={listRef} className="max-h-96 overflow-y-auto scrollbar-elegant p-2">
          {categories.length === 0 ? (<div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="glass-panel p-4 rounded-xl mb-4 opacity-60">
                <lucide_react_1.Search className="h-8 w-8 text-muted-foreground"/>
              </div>
              <p className="body-elegant text-muted-foreground mb-2">No commands found</p>
              <p className="text-sm text-muted-foreground/60">
                Try searching for "arena", "bench", or "dashboard"
              </p>
            </div>) : (<div className="space-y-4">
              {categories.map(function (_a) {
                var category = _a[0], categoryCommands = _a[1];
                return (<div key={category}>
                  <div className="flex items-center gap-2 px-3 py-2 mb-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                    <h3 className="heading-refined text-xs text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    {categoryCommands.map(function (command, index) {
                        var globalIndex = filteredCommands.indexOf(command);
                        var isSelected = globalIndex === selectedIndex;
                        var IconComponent = command.icon;
                        return (<button key={command.id} onClick={function () { return handleCommandClick(command); }} className={"\n                            w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group\n                            ".concat(isSelected ? 'glass-panel shadow-md' : 'hover:bg-muted/30', "\n                          ")}>
                          <div className={"\n                            glass-panel p-2 rounded-lg transition-all duration-200\n                            ".concat(isSelected ? 'shadow-md' : 'group-hover:shadow-sm', "\n                          ")}>
                            <IconComponent className="h-4 w-4 text-primary"/>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="heading-refined text-sm text-foreground truncate">
                                {command.title}
                              </span>
                              {command.badge && (<badge_1.Badge className="glass-panel border-0 text-xs px-2 py-0.5">
                                  <lucide_react_1.Star className="h-3 w-3 mr-1"/>
                                  {command.badge}
                                </badge_1.Badge>)}
                            </div>
                            <p className="body-elegant text-xs text-muted-foreground truncate">
                              {command.description}
                            </p>
                          </div>
                          
                          <div className={"\n                            transition-all duration-200\n                            ".concat(isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0', "\n                          ")}>
                            <lucide_react_1.ArrowRight className="h-4 w-4 text-muted-foreground"/>
                          </div>
                        </button>);
                    })}
                  </div>
                </div>);
            })}
              
              {/* Usage Tip */}
              <div className="px-3 py-4 border-t border-border/10 mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <lucide_react_1.Clock className="h-3 w-3"/>
                  <span>Use ↑ ↓ to navigate, ⏎ to select, ⎋ to close</span>
                </div>
              </div>
            </div>)}
        </div>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
};
exports.CommandPalette = (0, react_1.memo)(CommandPaletteComponent);
