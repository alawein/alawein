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
exports.ThemeCustomizer = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var slider_1 = require("@/components/ui/slider");
var switch_1 = require("@/components/ui/switch");
var label_1 = require("@/components/ui/label");
var ThemeCustomizerComponent = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.isOpen, isOpen = _c === void 0 ? false : _c, onToggle = _a.onToggle;
    var _d = (0, react_1.useState)({
        colorScheme: 'tactical',
        intensity: 75,
        glassMorphism: 60,
        animations: true,
        particleEffects: true,
        dynamicBackground: true,
        soundEffects: false,
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            largeText: false
        }
    }), settings = _d[0], setSettings = _d[1];
    var _e = (0, react_1.useState)(null), activePreview = _e[0], setActivePreview = _e[1];
    var colorSchemes = {
        tactical: {
            name: 'Tactical Blue',
            description: 'Strategic intelligence theme with tactical blues and cyan accents',
            colors: {
                primary: '#2563EB',
                secondary: '#0891B2',
                accent: '#B45309',
                background: '#0A0A0B'
            },
            icon: lucide_react_1.Eye
        },
        neural: {
            name: 'Neural Network',
            description: 'AI-inspired theme with purple and pink neural pathways',
            colors: {
                primary: '#8B5CF6',
                secondary: '#EC4899',
                accent: '#10B981',
                background: '#0B0A0F'
            },
            icon: lucide_react_1.Atom
        },
        cyber: {
            name: 'Cyber Matrix',
            description: 'Cyberpunk theme with neon greens and electric blues',
            colors: {
                primary: '#06B6D4',
                secondary: '#84CC16',
                accent: '#F97316',
                background: '#0A0F0B'
            },
            icon: lucide_react_1.Zap
        },
        stealth: {
            name: 'Stealth Mode',
            description: 'Dark operational theme for low-light environments',
            colors: {
                primary: '#6B7280',
                secondary: '#374151',
                accent: '#F59E0B',
                background: '#030303'
            },
            icon: lucide_react_1.Moon
        }
    };
    // Load settings from localStorage
    (0, react_1.useEffect)(function () {
        var savedSettings = localStorage.getItem('themeSettings');
        if (savedSettings) {
            try {
                var parsed = JSON.parse(savedSettings);
                setSettings(__assign(__assign({}, settings), parsed));
            }
            catch (error) {
                console.warn('Failed to load theme settings:', error);
            }
        }
    }, []);
    // Save settings to localStorage
    (0, react_1.useEffect)(function () {
        localStorage.setItem('themeSettings', JSON.stringify(settings));
        applyTheme(settings);
    }, [settings]);
    // Add keyboard and click outside handling
    (0, react_1.useEffect)(function () {
        if (!isOpen)
            return;
        var handleEscape = function (e) {
            if (e.key === 'Escape' && onToggle) {
                onToggle();
            }
        };
        var handleClickOutside = function (e) {
            var sidebar = document.getElementById('theme-customizer-sidebar');
            if (sidebar && !sidebar.contains(e.target) && onToggle) {
                onToggle();
            }
        };
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);
    var applyTheme = function (themeSettings) {
        var root = document.documentElement;
        var scheme = colorSchemes[themeSettings.colorScheme];
        // Apply color scheme
        root.style.setProperty('--color-primary', scheme.colors.primary);
        root.style.setProperty('--color-secondary', scheme.colors.secondary);
        root.style.setProperty('--color-accent', scheme.colors.accent);
        root.style.setProperty('--color-background', scheme.colors.background);
        // Apply intensity (affects opacity and glow effects)
        var intensityFactor = themeSettings.intensity / 100;
        root.style.setProperty('--theme-intensity', intensityFactor.toString());
        // Apply glass morphism level
        var glassFactor = themeSettings.glassMorphism / 100;
        root.style.setProperty('--glass-opacity', (glassFactor * 0.2).toString());
        root.style.setProperty('--glass-blur', "".concat(glassFactor * 20, "px"));
        // Apply accessibility settings
        if (themeSettings.accessibility.reducedMotion) {
            root.style.setProperty('--animation-duration', '0s');
        }
        else {
            root.style.removeProperty('--animation-duration');
        }
        if (themeSettings.accessibility.largeText) {
            root.style.setProperty('--font-scale', '1.2');
        }
        else {
            root.style.removeProperty('--font-scale');
        }
        // Apply feature toggles to body classes
        document.body.classList.toggle('animations-disabled', !themeSettings.animations);
        document.body.classList.toggle('particles-disabled', !themeSettings.particleEffects);
        document.body.classList.toggle('dynamic-bg-disabled', !themeSettings.dynamicBackground);
        document.body.classList.toggle('high-contrast', themeSettings.accessibility.highContrast);
    };
    var updateSetting = function (key, value) {
        setSettings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    };
    var updateAccessibility = function (key, value) {
        setSettings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { accessibility: __assign(__assign({}, prev.accessibility), (_a = {}, _a[key] = value, _a)) }));
        });
    };
    var resetToDefaults = function () {
        var defaultSettings = {
            colorScheme: 'tactical',
            intensity: 75,
            glassMorphism: 60,
            animations: true,
            particleEffects: true,
            dynamicBackground: true,
            soundEffects: false,
            accessibility: {
                reducedMotion: false,
                highContrast: false,
                largeText: false
            }
        };
        setSettings(defaultSettings);
    };
    var previewScheme = function (scheme) {
        setActivePreview(scheme);
        setTimeout(function () { return setActivePreview(null); }, 2000);
    };
    if (!isOpen) {
        return (<button_1.Button onClick={onToggle} variant="outline" size="sm" className="glass-minimal border-primary/30 hover:bg-primary/10 fixed bottom-4 left-4 z-40" aria-label="Open theme customizer">
        <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
        Customize
      </button_1.Button>);
    }
    return (<>
      {/* Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onToggle} aria-hidden="true"/>)}
      
      {/* Sidebar */}
      <div id="theme-customizer-sidebar" className={"fixed inset-y-0 right-0 w-96 bg-background/95 backdrop-blur-xl border-l border-primary/20 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ".concat(isOpen ? 'translate-x-0' : 'translate-x-full', " ").concat(className)} role="dialog" aria-modal="true" aria-labelledby="theme-customizer-title">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.Palette className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <h2 id="theme-customizer-title" className="heading-refined text-lg">Theme Customizer</h2>
              <p className="text-xs text-muted-foreground">
                Personalize your Strategic Command Center
              </p>
            </div>
          </div>
          <button_1.Button onClick={onToggle} variant="outline" size="sm" className="glass-minimal border-primary/30" aria-label="Close theme customizer">
            <span className="text-lg font-bold">×</span>
          </button_1.Button>
        </div>

        {/* Color Schemes */}
        <div className="space-y-4">
          <h3 className="heading-refined text-sm text-primary">Color Scheme</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(colorSchemes).map(function (_a) {
            var key = _a[0], scheme = _a[1];
            var IconComponent = scheme.icon;
            var isActive = settings.colorScheme === key;
            var isPreview = activePreview === key;
            return (<button key={key} onClick={function () {
                    updateSetting('colorScheme', key);
                    previewScheme(key);
                }} className={"glass-minimal p-4 rounded-lg text-left transition-all duration-300 ".concat(isActive ? 'border border-primary/50 bg-primary/5' : 'hover:bg-muted/10', " ").concat(isPreview ? 'animate-pulse' : '')}>
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-5 w-5 text-primary"/>
                    <span className="font-medium">{scheme.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {scheme.description}
                  </p>
                  <div className="flex gap-2">
                    {Object.values(scheme.colors).map(function (color, index) { return (<div key={index} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }}/>); })}
                  </div>
                </button>);
        })}
          </div>
        </div>

        {/* Intensity Control */}
        <div className="space-y-4">
          <h3 className="heading-refined text-sm text-primary">Visual Intensity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label_1.Label className="text-sm">Overall Intensity</label_1.Label>
              <span className="text-xs text-muted-foreground">{settings.intensity}%</span>
            </div>
            <slider_1.Slider value={[settings.intensity]} onValueChange={function (_a) {
        var value = _a[0];
        return updateSetting('intensity', value);
    }} min={0} max={100} step={5} className="w-full"/>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label_1.Label className="text-sm">Glass Morphism</label_1.Label>
              <span className="text-xs text-muted-foreground">{settings.glassMorphism}%</span>
            </div>
            <slider_1.Slider value={[settings.glassMorphism]} onValueChange={function (_a) {
        var value = _a[0];
        return updateSetting('glassMorphism', value);
    }} min={0} max={100} step={5} className="w-full"/>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          <h3 className="heading-refined text-sm text-primary">Visual Features</h3>
          <div className="space-y-4">
            {[
            { key: 'animations', label: 'Animations', description: 'Smooth transitions and hover effects' },
            { key: 'particleEffects', label: 'Particle Effects', description: 'Victory celebrations and notifications' },
            { key: 'dynamicBackground', label: 'Dynamic Background', description: 'Floating elements and ambient effects' },
            { key: 'soundEffects', label: 'Sound Effects', description: 'Audio feedback for actions' }
        ].map(function (_a) {
            var key = _a.key, label = _a.label, description = _a.description;
            return (<div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label_1.Label className="text-sm font-medium">{label}</label_1.Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <switch_1.Switch checked={settings[key]} onCheckedChange={function (checked) { return updateSetting(key, checked); }}/>
              </div>);
        })}
          </div>
        </div>

        {/* Accessibility */}
        <div className="space-y-4">
          <h3 className="heading-refined text-sm text-primary">Accessibility</h3>
          <div className="space-y-4">
            {[
            { key: 'reducedMotion', label: 'Reduce Motion', description: 'Minimize animations for comfort' },
            { key: 'highContrast', label: 'High Contrast', description: 'Increase color contrast ratios' },
            { key: 'largeText', label: 'Large Text', description: 'Increase font sizes for readability' }
        ].map(function (_a) {
            var key = _a.key, label = _a.label, description = _a.description;
            return (<div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label_1.Label className="text-sm font-medium">{label}</label_1.Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <switch_1.Switch checked={settings.accessibility[key]} onCheckedChange={function (checked) { return updateAccessibility(key, checked); }}/>
              </div>);
        })}
          </div>
        </div>

        {/* Preset Actions */}
        <div className="space-y-3">
          <h3 className="heading-refined text-sm text-primary">Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            <button_1.Button onClick={resetToDefaults} variant="outline" size="sm" className="glass-minimal border-primary/30">
              <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
              Reset
            </button_1.Button>
            <button_1.Button onClick={function () {
            updateSetting('intensity', 100);
            updateSetting('glassMorphism', 80);
            updateSetting('animations', true);
            updateSetting('particleEffects', true);
            updateSetting('dynamicBackground', true);
        }} size="sm" className="bg-primary hover:bg-primary/90">
              <lucide_react_1.Sparkles className="h-4 w-4 mr-2"/>
              Maximum
            </button_1.Button>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="glass-minimal p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <lucide_react_1.Monitor className="h-4 w-4 text-primary"/>
            <span className="text-sm font-medium">Current Configuration</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Scheme: {colorSchemes[settings.colorScheme].name}</div>
            <div>Intensity: {settings.intensity}%</div>
            <div>Glass: {settings.glassMorphism}%</div>
            <div>
              Features: {[
            settings.animations && 'Animations',
            settings.particleEffects && 'Particles',
            settings.dynamicBackground && 'Background'
        ].filter(Boolean).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>);
};
exports.ThemeCustomizer = (0, react_1.memo)(ThemeCustomizerComponent);
