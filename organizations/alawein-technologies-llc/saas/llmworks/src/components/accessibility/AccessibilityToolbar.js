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
exports.AccessibilityToolbar = void 0;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var separator_1 = require("@/components/ui/separator");
var switch_1 = require("@/components/ui/switch");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
var defaultState = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    focusIndicators: true,
    soundEnabled: true,
    cursorSize: 'normal',
    textSize: 100,
    colorBlindnessFilter: 'none',
};
exports.AccessibilityToolbar = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var _b = (0, react_1.useState)(defaultState), state = _b[0], setState = _b[1];
    // Load saved preferences on mount
    (0, react_1.useEffect)(function () {
        var saved = localStorage.getItem('accessibility-preferences');
        if (saved) {
            try {
                var parsedState = JSON.parse(saved);
                setState(__assign(__assign({}, defaultState), parsedState));
            }
            catch (error) {
                console.warn('[A11y] Failed to parse saved preferences:', error);
            }
        }
    }, []);
    // Save preferences and apply changes
    (0, react_1.useEffect)(function () {
        localStorage.setItem('accessibility-preferences', JSON.stringify(state));
        applyAccessibilitySettings(state);
    }, [state]);
    // Apply accessibility settings to DOM
    var applyAccessibilitySettings = function (settings) {
        var root = document.documentElement;
        var body = document.body;
        // High contrast mode
        if (settings.highContrast) {
            root.classList.add('a11y-high-contrast');
        }
        else {
            root.classList.remove('a11y-high-contrast');
        }
        // Large text
        if (settings.largeText || settings.textSize > 100) {
            var scale = settings.largeText ? 1.2 : (settings.textSize / 100);
            root.style.setProperty('--a11y-text-scale', scale.toString());
            root.classList.add('a11y-large-text');
        }
        else {
            root.style.removeProperty('--a11y-text-scale');
            root.classList.remove('a11y-large-text');
        }
        // Reduced motion
        if (settings.reducedMotion) {
            root.classList.add('a11y-reduced-motion');
        }
        else {
            root.classList.remove('a11y-reduced-motion');
        }
        // Screen reader mode
        if (settings.screenReaderMode) {
            root.classList.add('a11y-screen-reader');
        }
        else {
            root.classList.remove('a11y-screen-reader');
        }
        // Enhanced focus indicators
        if (settings.focusIndicators) {
            root.classList.add('a11y-enhanced-focus');
        }
        else {
            root.classList.remove('a11y-enhanced-focus');
        }
        // Cursor size
        root.classList.remove('a11y-cursor-large', 'a11y-cursor-extra-large');
        if (settings.cursorSize === 'large') {
            root.classList.add('a11y-cursor-large');
        }
        else if (settings.cursorSize === 'extra-large') {
            root.classList.add('a11y-cursor-extra-large');
        }
        // Color blindness filters
        root.classList.remove('a11y-protanopia', 'a11y-deuteranopia', 'a11y-tritanopia');
        if (settings.colorBlindnessFilter !== 'none') {
            root.classList.add("a11y-".concat(settings.colorBlindnessFilter));
        }
        // Announce changes to screen readers
        if (settings.screenReaderMode) {
            announceChange('Accessibility settings updated');
        }
    };
    // Screen reader announcements
    var announceChange = function (message) {
        var announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(function () {
            document.body.removeChild(announcement);
        }, 1000);
    };
    var updateState = function (updates) {
        setState(function (prev) { return (__assign(__assign({}, prev), updates)); });
    };
    var resetToDefaults = function () {
        setState(defaultState);
        announceChange('Accessibility settings reset to defaults');
    };
    var playClickSound = function () {
        if (state.soundEnabled) {
            // Simple click sound using Web Audio API
            try {
                var AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass)
                    return;
                var audioContext = new AudioContextClass();
                var oscillator = audioContext.createOscillator();
                var gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }
            catch (error) {
                // Fallback - no sound
            }
        }
    };
    var handleButtonClick = function (action) {
        playClickSound();
        action();
    };
    return (<div className="fixed bottom-4 right-4 z-50">
      {/* Accessibility Toggle Button */}
      <button_1.Button variant="default" size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200" onClick={function () { return handleButtonClick(function () { return setIsOpen(!isOpen); }); }} aria-label={isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"} aria-expanded={isOpen} aria-controls="accessibility-toolbar">
        <lucide_react_1.Accessibility className="h-6 w-6"/>
      </button_1.Button>

      {/* Accessibility Toolbar Panel */}
      {isOpen && (<card_1.Card id="accessibility-toolbar" className="absolute bottom-16 right-0 w-80 max-w-[calc(100vw-2rem)] p-4 shadow-xl border-2" role="dialog" aria-label="Accessibility Settings">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <lucide_react_1.Accessibility className="h-5 w-5 text-primary"/>
              <h2 className="text-lg font-semibold">Accessibility</h2>
            </div>
            <button_1.Button variant="ghost" size="sm" onClick={function () { return handleButtonClick(function () { return setIsOpen(false); }); }} aria-label="Close accessibility toolbar">
              <lucide_react_1.X className="h-4 w-4"/>
            </button_1.Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Vision Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <lucide_react_1.Eye className="h-4 w-4"/>
                Vision
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="high-contrast" className="text-sm">High Contrast</label_1.Label>
                  <switch_1.Switch id="high-contrast" checked={state.highContrast} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ highContrast: checked }); });
            }} aria-describedby="high-contrast-desc"/>
                </div>
                <p id="high-contrast-desc" className="text-xs text-muted-foreground">
                  Increases contrast for better visibility
                </p>

                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="large-text" className="text-sm">Large Text</label_1.Label>
                  <switch_1.Switch id="large-text" checked={state.largeText} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ largeText: checked }); });
            }}/>
                </div>

                <div className="space-y-2">
                  <label_1.Label className="text-sm">Text Size: {state.textSize}%</label_1.Label>
                  <div className="flex items-center gap-2">
                    <button_1.Button variant="outline" size="sm" onClick={function () { return handleButtonClick(function () {
                return updateState({ textSize: Math.max(75, state.textSize - 25) });
            }); }} disabled={state.textSize <= 75} aria-label="Decrease text size">
                      <lucide_react_1.ZoomOut className="h-3 w-3"/>
                    </button_1.Button>
                    <div className="flex-1 text-center text-sm">
                      {state.textSize}%
                    </div>
                    <button_1.Button variant="outline" size="sm" onClick={function () { return handleButtonClick(function () {
                return updateState({ textSize: Math.min(200, state.textSize + 25) });
            }); }} disabled={state.textSize >= 200} aria-label="Increase text size">
                      <lucide_react_1.ZoomIn className="h-3 w-3"/>
                    </button_1.Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label_1.Label className="text-sm">Color Blindness Filter</label_1.Label>
                  <select value={state.colorBlindnessFilter} onChange={function (e) { return handleButtonClick(function () {
                return updateState({ colorBlindnessFilter: e.target.value });
            }); }} className="w-full p-2 text-sm rounded border border-border bg-background" aria-describedby="colorblind-desc">
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                  <p id="colorblind-desc" className="text-xs text-muted-foreground">
                    Simulates color vision deficiencies
                  </p>
                </div>
              </div>
            </div>

            <separator_1.Separator />

            {/* Motor Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <lucide_react_1.MousePointer className="h-4 w-4"/>
                Motor
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="reduced-motion" className="text-sm">Reduce Motion</label_1.Label>
                  <switch_1.Switch id="reduced-motion" checked={state.reducedMotion} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ reducedMotion: checked }); });
            }}/>
                </div>

                <div className="space-y-2">
                  <label_1.Label className="text-sm">Cursor Size</label_1.Label>
                  <select value={state.cursorSize} onChange={function (e) { return handleButtonClick(function () {
                return updateState({ cursorSize: e.target.value });
            }); }} className="w-full p-2 text-sm rounded border border-border bg-background">
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="focus-indicators" className="text-sm">Enhanced Focus</label_1.Label>
                  <switch_1.Switch id="focus-indicators" checked={state.focusIndicators} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ focusIndicators: checked }); });
            }}/>
                </div>
              </div>
            </div>

            <separator_1.Separator />

            {/* Cognitive Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <lucide_react_1.Settings className="h-4 w-4"/>
                Cognitive
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="screen-reader" className="text-sm">Screen Reader Mode</label_1.Label>
                  <switch_1.Switch id="screen-reader" checked={state.screenReaderMode} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ screenReaderMode: checked }); });
            }}/>
                </div>

                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="sound-enabled" className="text-sm flex items-center gap-2">
                    {state.soundEnabled ? <lucide_react_1.Volume2 className="h-3 w-3"/> : <lucide_react_1.VolumeX className="h-3 w-3"/>}
                    Sound Feedback
                  </label_1.Label>
                  <switch_1.Switch id="sound-enabled" checked={state.soundEnabled} onCheckedChange={function (checked) {
                return handleButtonClick(function () { return updateState({ soundEnabled: checked }); });
            }}/>
                </div>
              </div>
            </div>

            <separator_1.Separator />

            {/* Reset Button */}
            <button_1.Button variant="outline" size="sm" onClick={function () { return handleButtonClick(resetToDefaults); }} className="w-full" aria-describedby="reset-desc">
              <lucide_react_1.RotateCcw className="h-4 w-4 mr-2"/>
              Reset to Defaults
            </button_1.Button>
            <p id="reset-desc" className="text-xs text-muted-foreground">
              Restore all accessibility settings to their default values
            </p>
          </div>
        </card_1.Card>)}
    </div>);
});
exports.AccessibilityToolbar.displayName = 'AccessibilityToolbar';
