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
exports.KeyboardShortcuts = exports.KeyboardProvider = exports.useKeyboard = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var KeyboardContext = (0, react_1.createContext)(null);
var useKeyboard = function () {
    var context = (0, react_1.useContext)(KeyboardContext);
    if (!context) {
        return { addShortcut: function () { }, removeShortcut: function () { }, toggleHelp: function () { } };
    }
    return context;
};
exports.useKeyboard = useKeyboard;
var KeyboardProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), shortcuts = _b[0], setShortcuts = _b[1];
    var _c = (0, react_1.useState)(false), showHelp = _c[0], setShowHelp = _c[1];
    var _d = (0, react_1.useState)([]), lastPressed = _d[0], setLastPressed = _d[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var addShortcut = function (shortcut) {
        setShortcuts(function (prev) { return __spreadArray(__spreadArray([], prev.filter(function (s) { return s.key !== shortcut.key; }), true), [shortcut], false); });
    };
    var removeShortcut = function (key) {
        setShortcuts(function (prev) { return prev.filter(function (s) { return s.key !== key; }); });
    };
    var toggleHelp = function () {
        setShowHelp(function (prev) { return !prev; });
    };
    // Default shortcuts
    (0, react_1.useEffect)(function () {
        var defaultShortcuts = [
            {
                key: '?',
                description: 'Show keyboard shortcuts',
                action: toggleHelp,
                category: 'ui'
            },
            {
                key: 'Escape',
                description: 'Close dialogs/help',
                action: function () { return setShowHelp(false); },
                category: 'ui'
            },
            {
                key: 'h',
                description: 'Go to home',
                action: function () { return navigate('/'); },
                category: 'navigation'
            },
            {
                key: 'a',
                description: 'Go to arena',
                action: function () { return navigate('/arena'); },
                category: 'navigation'
            },
            {
                key: 'b',
                description: 'Go to bench',
                action: function () { return navigate('/bench'); },
                category: 'navigation'
            },
            {
                key: 'r',
                description: 'Refresh page',
                action: function () { return window.location.reload(); },
                category: 'actions'
            }
        ];
        defaultShortcuts.forEach(addShortcut);
    }, [navigate]);
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (e) {
            // Don't trigger shortcuts when typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            var pressedKeys = [
                e.ctrlKey && 'ctrl',
                e.altKey && 'alt',
                e.shiftKey && 'shift',
                e.metaKey && 'meta',
                e.key.toLowerCase()
            ].filter(Boolean);
            setLastPressed(pressedKeys);
            // Find matching shortcut
            var matchingShortcut = shortcuts.find(function (shortcut) {
                var shortcutKeys = __spreadArray(__spreadArray([], (shortcut.modifiers || []), true), [
                    shortcut.key.toLowerCase()
                ], false);
                return shortcutKeys.length === pressedKeys.length &&
                    shortcutKeys.every(function (key) { return pressedKeys.includes(key); });
            });
            if (matchingShortcut) {
                e.preventDefault();
                matchingShortcut.action();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () { return window.removeEventListener('keydown', handleKeyDown); };
    }, [shortcuts]);
    var groupedShortcuts = shortcuts.reduce(function (acc, shortcut) {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {});
    var categoryIcons = {
        navigation: lucide_react_1.ArrowRight,
        ui: lucide_react_1.Command,
        actions: lucide_react_1.CornerDownLeft,
        dev: lucide_react_1.Keyboard
    };
    var categoryNames = {
        navigation: 'Navigation',
        ui: 'Interface',
        actions: 'Actions',
        dev: 'Development'
    };
    return (<KeyboardContext.Provider value={{ addShortcut: addShortcut, removeShortcut: removeShortcut, toggleHelp: toggleHelp }}>
      {children}
      
      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-panel max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="glass-subtle p-2 rounded-xl">
                    <lucide_react_1.Keyboard className="h-5 w-5 text-primary"/>
                  </div>
                  <div>
                    <h2 className="heading-refined text-lg">Keyboard Shortcuts</h2>
                    <p className="text-xs text-muted-foreground">
                      Master the Strategic Command Center with hotkeys
                    </p>
                  </div>
                </div>
                <button onClick={toggleHelp} className="glass-minimal p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <lucide_react_1.X className="h-4 w-4 text-muted-foreground"/>
                </button>
              </div>

              {/* Shortcuts by Category */}
              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(function (_a) {
                var category = _a[0], categoryShortcuts = _a[1];
                var IconComponent = categoryIcons[category];
                var categoryName = categoryNames[category];
                return (<div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <IconComponent className="h-4 w-4 text-primary"/>
                        <h3 className="heading-refined text-sm">{categoryName}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryShortcuts.map(function (shortcut) {
                        var _a;
                        return (<div key={shortcut.key} className="glass-minimal p-3 rounded-lg flex items-center justify-between hover:bg-muted/10 transition-colors">
                            <span className="text-sm">{shortcut.description}</span>
                            <div className="flex gap-1">
                              {(_a = shortcut.modifiers) === null || _a === void 0 ? void 0 : _a.map(function (modifier) { return (<kbd key={modifier} className="px-2 py-1 text-xs bg-muted/30 border border-muted/50 rounded font-mono">
                                  {modifier}
                                </kbd>); })}
                              <kbd className="px-2 py-1 text-xs bg-primary/20 border border-primary/30 rounded font-mono text-primary">
                                {shortcut.key}
                              </kbd>
                            </div>
                          </div>);
                    })}
                      </div>
                    </div>);
            })}
              </div>
            </div>
          </div>
        </div>)}

      {/* Keyboard Hint Toast */}
      <div className="fixed bottom-4 right-4 glass-minimal px-3 py-2 rounded-lg opacity-50 hover:opacity-100 transition-opacity z-40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <lucide_react_1.Keyboard className="h-3 w-3"/>
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-muted/30 rounded text-xs">?</kbd>
          <span>for shortcuts</span>
        </div>
      </div>
    </KeyboardContext.Provider>);
};
exports.KeyboardProvider = KeyboardProvider;
var KeyboardShortcuts = function () {
    // This component is now handled by KeyboardProvider
    return null;
};
exports.KeyboardShortcuts = KeyboardShortcuts;
