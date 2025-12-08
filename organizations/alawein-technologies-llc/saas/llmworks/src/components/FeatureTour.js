"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureTour = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var KeyboardShortcuts_1 = require("@/components/KeyboardShortcuts");
var FeatureTourComponent = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.autoStart, autoStart = _c === void 0 ? false : _c, _d = _a.tourType, tourType = _d === void 0 ? 'comprehensive' : _d;
    var _e = (0, react_1.useState)(false), isActive = _e[0], setIsActive = _e[1];
    var _f = (0, react_1.useState)(0), currentStep = _f[0], setCurrentStep = _f[1];
    var _g = (0, react_1.useState)(false), isCompleted = _g[0], setIsCompleted = _g[1];
    var _h = (0, react_1.useState)([]), tourSteps = _h[0], setTourSteps = _h[1];
    var _j = (0, react_1.useState)({ x: 0, y: 0, width: 0, height: 0 }), highlightPosition = _j[0], setHighlightPosition = _j[1];
    var _k = (0, react_1.useState)({ x: 0, y: 0 }), tooltipPosition = _k[0], setTooltipPosition = _k[1];
    var _l = (0, KeyboardShortcuts_1.useKeyboard)(), addShortcut = _l.addShortcut, removeShortcut = _l.removeShortcut;
    var observerRef = (0, react_1.useRef)(null);
    var allTourSteps = [
        // Basic Navigation
        {
            id: 'welcome',
            title: 'Welcome to Strategic Command Center',
            description: 'This tour will guide you through all the powerful features of the LLM Works platform.',
            target: 'main',
            position: 'center',
            category: 'basic'
        },
        {
            id: 'navigation',
            title: 'Main Navigation',
            description: 'Access different areas: Arena for battles, Bench for benchmarks, and strategic dashboards.',
            target: 'nav',
            position: 'bottom',
            category: 'basic'
        },
        {
            id: 'showcase-demo',
            title: 'Interactive Showcase Demo',
            description: 'Experience all features in an automated demonstration. Perfect for portfolio presentations!',
            target: '[aria-labelledby="showcase-section"]',
            position: 'top',
            category: 'professional'
        },
        {
            id: 'hero-battle',
            title: 'AI Battle Animation',
            description: 'Watch advanced robot combat simulations with realistic battle phases and tactical maneuvers.',
            target: '[data-tour="battle-animation"]',
            position: 'bottom',
            category: 'gaming',
            waitForElement: true
        },
        {
            id: 'live-dashboard',
            title: 'Live Intelligence Dashboard',
            description: 'Monitor real-time strategic evaluations, system performance, and threat intelligence.',
            target: '[aria-labelledby="dashboard-section"]',
            position: 'top',
            category: 'professional'
        },
        {
            id: 'command-panel',
            title: 'Strategic Command Panel',
            description: 'Advanced control interface with module management, session monitoring, and terminal access.',
            target: '[aria-labelledby="command-section"]',
            position: 'top',
            category: 'advanced'
        },
        {
            id: 'xp-progression',
            title: 'XP Progression System',
            description: 'Level up through commander ranks, unlock achievements, and earn XP through evaluations.',
            target: '[aria-labelledby="progression-section"]',
            position: 'top',
            category: 'gaming'
        },
        {
            id: 'leaderboards',
            title: 'Elite Rankings',
            description: 'Compete in tiered rankings from Bronze to Legendary status with ELO ratings.',
            target: '[aria-labelledby="rankings-section"]',
            position: 'top',
            category: 'gaming'
        },
        {
            id: 'technical-specs',
            title: 'Technical Documentation',
            description: 'Comprehensive specs including architecture, APIs, security framework, and performance metrics.',
            target: '[aria-labelledby="specs-section"]',
            position: 'top',
            category: 'professional'
        },
        {
            id: 'floating-notifications',
            title: 'Smart Notifications',
            description: 'Real-time achievements, battle results, and system updates with particle effects.',
            target: '.fixed.top-20.right-4',
            position: 'left',
            category: 'advanced',
            waitForElement: true
        },
        {
            id: 'keyboard-shortcuts',
            title: 'Keyboard Shortcuts',
            description: 'Press ? to view all hotkeys. Navigate efficiently with powerful shortcuts for every feature.',
            target: '.fixed.bottom-4.right-4',
            position: 'left',
            category: 'advanced'
        },
        {
            id: 'dynamic-background',
            title: 'Dynamic Visual Effects',
            description: 'Interactive background elements respond to mouse movement with sophisticated animations.',
            target: 'body',
            position: 'center',
            category: 'advanced'
        },
        {
            id: 'complete',
            title: 'Tour Complete!',
            description: 'You\'ve explored all the Strategic Command Center features. Ready to begin your AI evaluation missions?',
            target: 'main',
            position: 'center',
            category: 'basic'
        }
    ];
    var filterStepsForTourType = function (type) {
        switch (type) {
            case 'quick':
                return allTourSteps.filter(function (step) { return step.category === 'basic'; });
            case 'gaming':
                return allTourSteps.filter(function (step) { return ['basic', 'gaming'].includes(step.category); });
            case 'professional':
                return allTourSteps.filter(function (step) { return ['basic', 'professional', 'advanced'].includes(step.category); });
            case 'comprehensive':
            default:
                return allTourSteps;
        }
    };
    (0, react_1.useEffect)(function () {
        setTourSteps(filterStepsForTourType(tourType));
    }, [tourType]);
    (0, react_1.useEffect)(function () {
        if (autoStart && !isActive && !isCompleted) {
            setTimeout(function () { return startTour(); }, 2000);
        }
    }, [autoStart, isActive, isCompleted]);
    // Add keyboard shortcuts for tour control
    (0, react_1.useEffect)(function () {
        if (isActive) {
            addShortcut({
                key: 'ArrowRight',
                description: 'Next tour step',
                action: nextStep,
                category: 'ui'
            });
            addShortcut({
                key: 'ArrowLeft',
                description: 'Previous tour step',
                action: previousStep,
                category: 'ui'
            });
            addShortcut({
                key: 'Escape',
                description: 'Exit feature tour',
                action: endTour,
                category: 'ui'
            });
        }
        return function () {
            removeShortcut('ArrowRight');
            removeShortcut('ArrowLeft');
            removeShortcut('Escape');
        };
    }, [isActive, addShortcut, removeShortcut]);
    var updateHighlight = function (targetSelector) {
        var target = document.querySelector(targetSelector);
        if (!target) {
            console.warn("Tour target not found: ".concat(targetSelector));
            return;
        }
        var rect = target.getBoundingClientRect();
        var scrollX = window.pageXOffset;
        var scrollY = window.pageYOffset;
        setHighlightPosition({
            x: rect.left + scrollX,
            y: rect.top + scrollY,
            width: rect.width,
            height: rect.height
        });
        // Calculate tooltip position
        var step = tourSteps[currentStep];
        var tooltipX = rect.left + scrollX;
        var tooltipY = rect.top + scrollY;
        switch (step.position) {
            case 'top':
                tooltipX = rect.left + scrollX + rect.width / 2;
                tooltipY = rect.top + scrollY - 20;
                break;
            case 'bottom':
                tooltipX = rect.left + scrollX + rect.width / 2;
                tooltipY = rect.bottom + scrollY + 20;
                break;
            case 'left':
                tooltipX = rect.left + scrollX - 20;
                tooltipY = rect.top + scrollY + rect.height / 2;
                break;
            case 'right':
                tooltipX = rect.right + scrollX + 20;
                tooltipY = rect.top + scrollY + rect.height / 2;
                break;
            case 'center':
                tooltipX = window.innerWidth / 2;
                tooltipY = window.innerHeight / 2;
                break;
        }
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        // Scroll element into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    var waitForElement = function (selector) {
        return new Promise(function (resolve) {
            var element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            observerRef.current = new MutationObserver(function (mutations, observer) {
                var element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observerRef.current.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
    var executeCurrentStep = function () { return __awaiter(void 0, void 0, void 0, function () {
        var step;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    step = tourSteps[currentStep];
                    if (!step)
                        return [2 /*return*/];
                    // Execute step action if any
                    if (step.action) {
                        step.action();
                    }
                    if (!step.waitForElement) return [3 /*break*/, 3];
                    return [4 /*yield*/, waitForElement(step.target)];
                case 1:
                    _a.sent();
                    // Small delay to ensure element is rendered
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 2:
                    // Small delay to ensure element is rendered
                    _a.sent();
                    _a.label = 3;
                case 3:
                    updateHighlight(step.target);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (isActive && tourSteps.length > 0) {
            executeCurrentStep();
        }
    }, [isActive, currentStep, tourSteps]);
    var startTour = function () {
        setIsActive(true);
        setCurrentStep(0);
        setIsCompleted(false);
    };
    var endTour = function () {
        setIsActive(false);
        setIsCompleted(true);
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
    };
    var nextStep = function () {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(function (prev) { return prev + 1; });
        }
        else {
            endTour();
        }
    };
    var previousStep = function () {
        if (currentStep > 0) {
            setCurrentStep(function (prev) { return prev - 1; });
        }
    };
    var skipTour = function () {
        endTour();
    };
    var getCurrentStep = function () { return tourSteps[currentStep]; };
    if (!isActive) {
        return (<div className={"space-y-4 ".concat(className)}>
        {/* Tour Control Panel */}
        <div className="glass-panel p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="glass-subtle p-2 rounded-xl">
                <lucide_react_1.Compass className="h-5 w-5 text-primary"/>
              </div>
              <div>
                <h3 className="heading-refined text-lg">Feature Tour Guide</h3>
                <p className="text-xs text-muted-foreground">
                  Discover all Strategic Command Center capabilities
                </p>
              </div>
            </div>

            <button_1.Button onClick={startTour} className="bg-primary hover:bg-primary/90">
              <lucide_react_1.Play className="h-4 w-4 mr-2"/>
              Start Tour
            </button_1.Button>
          </div>

          {/* Tour Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
                { type: 'quick', label: 'Quick Tour', description: '3 min overview', icon: lucide_react_1.Target },
                { type: 'gaming', label: 'Gaming Features', description: 'XP, battles, rankings', icon: lucide_react_1.Target },
                { type: 'professional', label: 'Professional', description: 'Enterprise features', icon: lucide_react_1.Target },
                { type: 'comprehensive', label: 'Complete Tour', description: 'All features', icon: lucide_react_1.Compass }
            ].map(function (_a) {
                var type = _a.type, label = _a.label, description = _a.description, Icon = _a.icon;
                return (<button key={type} onClick={function () { return setTourSteps(filterStepsForTourType(type)); }} className={"glass-minimal p-4 rounded-lg text-left hover:bg-muted/10 transition-colors ".concat(tourSteps === filterStepsForTourType(type) ? 'border border-primary/30' : '')}>
                <Icon className="h-5 w-5 text-primary mb-2"/>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </button>);
            })}
          </div>
        </div>
      </div>);
    }
    var currentStepData = getCurrentStep();
    if (!currentStepData)
        return null;
    return (<>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"/>

      {/* Highlight Spotlight */}
      <div className="fixed z-50 pointer-events-none transition-all duration-500 ease-out" style={{
            left: highlightPosition.x - 8,
            top: highlightPosition.y - 8,
            width: highlightPosition.width + 16,
            height: highlightPosition.height + 16,
            boxShadow: "\n            0 0 0 4px hsl(var(--primary) / 0.8),\n            0 0 0 8px hsl(var(--primary) / 0.4),\n            0 0 40px hsl(var(--primary) / 0.6),\n            0 0 0 9999px rgba(0, 0, 0, 0.7)\n          ",
            borderRadius: '8px'
        }}/>

      {/* Tour Tooltip */}
      <div className="fixed z-50 transition-all duration-500 ease-out" style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: currentStepData.position === 'center'
                ? 'translate(-50%, -50%)'
                : currentStepData.position === 'top'
                    ? 'translate(-50%, -100%)'
                    : currentStepData.position === 'bottom'
                        ? 'translate(-50%, 0)'
                        : currentStepData.position === 'left'
                            ? 'translate(-100%, -50%)'
                            : 'translate(0, -50%)'
        }}>
        <div className="glass-panel max-w-sm border border-primary/30 shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.MapPin className="h-4 w-4 text-primary"/>
                <div className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {tourSteps.length}
                </div>
              </div>
              <button onClick={endTour} className="glass-minimal p-1 rounded-lg hover:bg-muted/20 transition-colors">
                <lucide_react_1.X className="h-4 w-4 text-muted-foreground"/>
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="heading-refined text-lg mb-2">{currentStepData.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="glass-minimal h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300" style={{ width: "".concat(((currentStep + 1) / tourSteps.length) * 100, "%") }}/>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button_1.Button variant="outline" size="sm" onClick={previousStep} disabled={currentStep === 0} className="glass-minimal border-primary/30">
                <lucide_react_1.ChevronLeft className="h-4 w-4 mr-1"/>
                Previous
              </button_1.Button>

              <div className="flex gap-2">
                <button_1.Button variant="outline" size="sm" onClick={skipTour} className="glass-minimal border-muted/30 text-muted-foreground">
                  <lucide_react_1.SkipForward className="h-4 w-4 mr-1"/>
                  Skip
                </button_1.Button>

                <button_1.Button size="sm" onClick={nextStep} className="bg-primary hover:bg-primary/90">
                  {currentStep === tourSteps.length - 1 ? (<>
                      <lucide_react_1.CheckCircle className="h-4 w-4 mr-1"/>
                      Finish
                    </>) : (<>
                      Next
                      <lucide_react_1.ChevronRight className="h-4 w-4 ml-1"/>
                    </>)}
                </button_1.Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip Arrow */}
        {currentStepData.position !== 'center' && (<div className={"absolute w-3 h-3 bg-background border transform rotate-45 ".concat(currentStepData.position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0'
                : currentStepData.position === 'bottom'
                    ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0'
                    : currentStepData.position === 'left'
                        ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-l-0 border-b-0'
                        : 'right-full top-1/2 translate-x-1/2 -translate-y-1/2 border-r-0 border-t-0')} style={{ borderColor: 'hsl(var(--primary) / 0.3)' }}/>)}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 left-4 glass-minimal px-4 py-2 rounded-lg z-50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">→</kbd>
          <span>to navigate,</span>
          <kbd className="px-1.5 py-0.5 bg-muted/30 border border-muted/50 rounded text-xs">Esc</kbd>
          <span>to exit</span>
        </div>
      </div>
    </>);
};
exports.FeatureTour = (0, react_1.memo)(FeatureTourComponent);
