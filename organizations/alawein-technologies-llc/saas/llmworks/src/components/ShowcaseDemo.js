"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowcaseDemo = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var FloatingNotifications_1 = require("@/components/FloatingNotifications");
var KeyboardShortcuts_1 = require("@/components/KeyboardShortcuts");
var ShowcaseDemoComponent = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), isActive = _c[0], setIsActive = _c[1];
    var _d = (0, react_1.useState)(0), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = (0, react_1.useState)(false), isPaused = _e[0], setIsPaused = _e[1];
    var _f = (0, react_1.useState)(true), autoMode = _f[0], setAutoMode = _f[1];
    var _g = (0, react_1.useState)(0), progress = _g[0], setProgress = _g[1];
    var addNotification = (0, FloatingNotifications_1.useNotifications)().addNotification;
    var _h = (0, KeyboardShortcuts_1.useKeyboard)(), addShortcut = _h.addShortcut, removeShortcut = _h.removeShortcut;
    var intervalRef = (0, react_1.useRef)(null);
    var stepTimeoutRef = (0, react_1.useRef)(null);
    var showcaseSteps = [
        {
            id: 'welcome',
            title: 'Strategic Command Center',
            description: 'Welcome to the LLM Works interactive demonstration',
            component: 'Hero Section',
            duration: 3000,
            category: 'visual',
            action: function () {
                addNotification({
                    type: 'info',
                    title: 'Showcase Demo Started',
                    message: 'Demonstrating Strategic Command Center capabilities',
                    duration: 3000
                });
            }
        },
        {
            id: 'battle-animation',
            title: 'AI Battle Simulation',
            description: 'Advanced robot combat animations with realistic battle phases',
            component: 'AIBattleAnimation',
            duration: 4000,
            category: 'gaming',
            action: function () {
                addNotification({
                    type: 'battle',
                    title: 'Battle Initiated!',
                    message: 'Claude-4 vs GPT-5 - Strategic Combat Simulation',
                    icon: lucide_react_1.Target,
                    duration: 4000
                });
            }
        },
        {
            id: 'xp-system',
            title: 'XP Progression System',
            description: 'Gamified progression with achievements, levels, and rewards',
            component: 'XPProgressionSystem',
            duration: 3500,
            category: 'gaming',
            action: function () {
                addNotification({
                    type: 'xp',
                    title: '+500 XP Gained!',
                    message: 'Level 12 → Level 13 - Strategic Commander Rank',
                    icon: lucide_react_1.Star,
                    duration: 3500
                });
            }
        },
        {
            id: 'victory-celebration',
            title: 'Victory Celebration',
            description: 'Spectacular particle effects and celebration animations',
            component: 'VictoryCelebration',
            duration: 4000,
            category: 'gaming',
            action: function () {
                addNotification({
                    type: 'achievement',
                    title: 'Victory Achieved!',
                    message: 'Mission Complete - Outstanding Performance!',
                    icon: lucide_react_1.Trophy,
                    duration: 4000
                });
            }
        },
        {
            id: 'leaderboard',
            title: 'Gaming Leaderboard',
            description: '6-tier ranking system with ELO ratings and metallic badges',
            component: 'GamingLeaderboard',
            duration: 3000,
            category: 'gaming',
            action: function () {
                addNotification({
                    type: 'success',
                    title: 'Leaderboard Updated',
                    message: 'Platinum tier achieved - Top 1% ranking',
                    duration: 3000
                });
            }
        },
        {
            id: 'live-dashboard',
            title: 'Live Intelligence Dashboard',
            description: 'Real-time monitoring with tactical intelligence feeds',
            component: 'LiveIntelligenceDashboard',
            duration: 3500,
            category: 'technical',
            action: function () {
                addNotification({
                    type: 'info',
                    title: 'Intel Systems Online',
                    message: 'All monitoring dashboards operational',
                    duration: 3000
                });
            }
        },
        {
            id: 'command-panel',
            title: 'Strategic Command Panel',
            description: 'Multi-tab control interface with mission parameters',
            component: 'StrategicCommandPanel',
            duration: 3000,
            category: 'technical',
            action: function () {
                addNotification({
                    type: 'success',
                    title: 'Command Center Active',
                    message: 'Strategic operations interface ready',
                    duration: 3000
                });
            }
        },
        {
            id: 'dynamic-background',
            title: 'Dynamic Background Effects',
            description: 'Animated floating elements with mouse-responsive interactions',
            component: 'DynamicBackground',
            duration: 3000,
            category: 'visual',
            action: function () {
                addNotification({
                    type: 'info',
                    title: 'Ambient Systems Active',
                    message: 'Dynamic visual effects synchronized',
                    duration: 3000
                });
            }
        },
        {
            id: 'magnetic-elements',
            title: 'Magnetic Hover Effects',
            description: 'Advanced micro-interactions with magnetic attraction physics',
            component: 'MagneticElements',
            duration: 3000,
            category: 'interactive',
            action: function () {
                addNotification({
                    type: 'info',
                    title: 'Interactive Layer Online',
                    message: 'Magnetic field interactions enabled',
                    duration: 3000
                });
            }
        },
        {
            id: 'keyboard-shortcuts',
            title: 'Keyboard Shortcuts',
            description: 'Comprehensive hotkey system for power users',
            component: 'KeyboardShortcuts',
            duration: 2500,
            category: 'interactive',
            action: function () {
                addNotification({
                    type: 'info',
                    title: 'Hotkey System Ready',
                    message: 'Press ? to view all keyboard shortcuts',
                    duration: 4000
                });
            }
        },
        {
            id: 'complete',
            title: 'Showcase Complete',
            description: 'Strategic Command Center demonstration finished',
            component: 'Summary',
            duration: 2000,
            category: 'visual',
            action: function () {
                addNotification({
                    type: 'achievement',
                    title: 'Demo Complete!',
                    message: 'All Strategic Command Center features demonstrated',
                    icon: lucide_react_1.Trophy,
                    duration: 5000
                });
            }
        }
    ];
    // Add keyboard shortcuts for demo control
    (0, react_1.useEffect)(function () {
        if (isActive) {
            addShortcut({
                key: 'space',
                description: 'Play/Pause showcase demo',
                action: function () { return setIsPaused(function (prev) { return !prev; }); },
                category: 'actions'
            });
            addShortcut({
                key: 'r',
                description: 'Restart showcase demo',
                action: restartDemo,
                category: 'actions'
            });
            addShortcut({
                key: 'Escape',
                description: 'Exit showcase demo',
                action: stopDemo,
                category: 'actions'
            });
        }
        return function () {
            removeShortcut('space');
            removeShortcut('r');
            removeShortcut('Escape');
        };
    }, [isActive, addShortcut, removeShortcut]);
    // Auto-progression logic
    (0, react_1.useEffect)(function () {
        if (!isActive || isPaused || !autoMode)
            return;
        var currentStepData = showcaseSteps[currentStep];
        if (!currentStepData)
            return;
        // Execute step action
        currentStepData.action();
        // Progress bar animation
        var progressStart = 0;
        var progressInterval = 50;
        var progressIncrement = (progressInterval / currentStepData.duration) * 100;
        intervalRef.current = setInterval(function () {
            progressStart += progressIncrement;
            setProgress(Math.min(progressStart, 100));
        }, progressInterval);
        // Move to next step
        stepTimeoutRef.current = setTimeout(function () {
            if (currentStep < showcaseSteps.length - 1) {
                setCurrentStep(function (prev) { return prev + 1; });
                setProgress(0);
            }
            else {
                stopDemo();
            }
        }, currentStepData.duration);
        return function () {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
            if (stepTimeoutRef.current)
                clearTimeout(stepTimeoutRef.current);
        };
    }, [isActive, currentStep, isPaused, autoMode]);
    var startDemo = function () {
        setIsActive(true);
        setCurrentStep(0);
        setProgress(0);
        setIsPaused(false);
    };
    var stopDemo = function () {
        setIsActive(false);
        setCurrentStep(0);
        setProgress(0);
        setIsPaused(false);
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        if (stepTimeoutRef.current)
            clearTimeout(stepTimeoutRef.current);
    };
    var restartDemo = function () {
        stopDemo();
        setTimeout(startDemo, 100);
    };
    var togglePause = function () {
        setIsPaused(function (prev) { return !prev; });
    };
    var nextStep = function () {
        if (currentStep < showcaseSteps.length - 1) {
            setCurrentStep(function (prev) { return prev + 1; });
            setProgress(0);
        }
    };
    var previousStep = function () {
        if (currentStep > 0) {
            setCurrentStep(function (prev) { return prev - 1; });
            setProgress(0);
        }
    };
    var getCurrentStep = function () { return showcaseSteps[currentStep]; };
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'visual': return lucide_react_1.Eye;
            case 'interactive': return lucide_react_1.Zap;
            case 'gaming': return lucide_react_1.Trophy;
            case 'technical': return lucide_react_1.Settings;
            default: return lucide_react_1.Star;
        }
    };
    var getCategoryColor = function (category) {
        switch (category) {
            case 'visual': return 'text-blue-400';
            case 'interactive': return 'text-purple-400';
            case 'gaming': return 'text-orange-400';
            case 'technical': return 'text-green-400';
            default: return 'text-muted-foreground';
        }
    };
    return (<div className={"space-y-4 ".concat(className)}>
      {/* Demo Control Panel */}
      <div className="glass-panel p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.Play className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <h3 className="heading-refined text-lg">Interactive Showcase Demo</h3>
              <p className="text-xs text-muted-foreground">
                Experience all Strategic Command Center features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Mode Toggle */}
            <button_1.Button variant="outline" size="sm" onClick={function () { return setAutoMode(function (prev) { return !prev; }); }} className={"glass-minimal border-primary/30 ".concat(autoMode ? 'bg-primary/10' : '')}>
              {autoMode ? <lucide_react_1.EyeOff className="h-4 w-4"/> : <lucide_react_1.Eye className="h-4 w-4"/>}
              <span className="hidden sm:inline ml-2">
                {autoMode ? 'Auto' : 'Manual'}
              </span>
            </button_1.Button>

            {/* Control Buttons */}
            {!isActive ? (<button_1.Button onClick={startDemo} className="bg-primary hover:bg-primary/90">
                <lucide_react_1.Play className="h-4 w-4 mr-2"/>
                Start Demo
              </button_1.Button>) : (<div className="flex gap-2">
                <button_1.Button variant="outline" size="sm" onClick={togglePause} className="glass-minimal border-primary/30">
                  {isPaused ? <lucide_react_1.Play className="h-4 w-4"/> : <lucide_react_1.Pause className="h-4 w-4"/>}
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" onClick={restartDemo} className="glass-minimal border-primary/30">
                  <lucide_react_1.RotateCcw className="h-4 w-4"/>
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" onClick={stopDemo} className="glass-minimal border-red-500/30 text-red-400 hover:bg-red-500/10">
                  Stop
                </button_1.Button>
              </div>)}
          </div>
        </div>

        {/* Current Step Display */}
        {isActive && (<div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(function () {
                var currentStepData = getCurrentStep();
                var IconComponent = getCategoryIcon(currentStepData.category);
                return (<>
                      <div className="glass-subtle p-2 rounded-lg">
                        <IconComponent className={"h-4 w-4 ".concat(getCategoryColor(currentStepData.category))}/>
                      </div>
                      <div>
                        <h4 className="heading-refined text-sm font-semibold">
                          {currentStepData.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {currentStepData.description}
                        </p>
                      </div>
                    </>);
            })()}
              </div>

              <div className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {showcaseSteps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="glass-minimal h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 ease-linear" style={{ width: "".concat(progress, "%") }}/>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {showcaseSteps.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentStep(index); }} className={"w-2 h-2 rounded-full transition-colors ".concat(index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-muted/30')} disabled={autoMode}/>); })}
                </div>

                {!autoMode && (<div className="flex gap-2">
                    <button_1.Button variant="outline" size="sm" onClick={previousStep} disabled={currentStep === 0} className="glass-minimal border-primary/30">
                      Previous
                    </button_1.Button>
                    <button_1.Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep === showcaseSteps.length - 1} className="glass-minimal border-primary/30">
                      Next
                    </button_1.Button>
                  </div>)}
              </div>
            </div>
          </div>)}

        {/* Feature Summary */}
        {!isActive && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {['visual', 'interactive', 'gaming', 'technical'].map(function (category) {
                var count = showcaseSteps.filter(function (step) { return step.category === category; }).length;
                var IconComponent = getCategoryIcon(category);
                return (<div key={category} className="glass-minimal p-3 rounded-lg text-center">
                  <IconComponent className={"h-5 w-5 mx-auto mb-2 ".concat(getCategoryColor(category))}/>
                  <div className="text-sm font-medium capitalize">{category}</div>
                  <div className="text-xs text-muted-foreground">{count} features</div>
                </div>);
            })}
          </div>)}
      </div>

      {/* Keyboard Shortcuts Hint */}
      {isActive && (<div className="glass-minimal p-3 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <lucide_react_1.Settings className="h-3 w-3"/>
            <span>Keyboard shortcuts:</span>
            <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">Space</kbd>
            <span>to pause,</span>
            <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">R</kbd>
            <span>to restart,</span>
            <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">Esc</kbd>
            <span>to exit</span>
          </div>
        </div>)}
    </div>);
};
exports.ShowcaseDemo = (0, react_1.memo)(ShowcaseDemoComponent);
