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
exports.EmptyState = exports.ErrorState = exports.LoadingState = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var LoadingStateComponent = function (_a) {
    var type = _a.type, message = _a.message, progress = _a.progress;
    var getLoadingContent = function () {
        switch (type) {
            case 'debate-init':
                return {
                    icon: lucide_react_1.Swords,
                    title: 'Initializing Neural Arena',
                    description: message || 'Preparing combatants for intellectual battle...',
                    animation: 'animate-pulse'
                };
            case 'ai-loading':
                return {
                    icon: lucide_react_1.Brain,
                    title: 'Loading AI Personalities',
                    description: message || 'Calibrating neural signatures and energy fields...',
                    animation: 'animate-spin'
                };
            case 'environment-setup':
                return {
                    icon: lucide_react_1.Sparkles,
                    title: 'Setting Up Environment',
                    description: message || 'Generating contextual effects and particle systems...',
                    animation: 'animate-bounce'
                };
            case 'citation-check':
                return {
                    icon: lucide_react_1.Zap,
                    title: 'Verifying Citations',
                    description: message || 'Checking sources and fact-checking claims...',
                    animation: 'animate-ping'
                };
            default:
                return {
                    icon: lucide_react_1.Loader2,
                    title: 'Loading',
                    description: message || 'Preparing your experience...',
                    animation: 'animate-spin'
                };
        }
    };
    var content = getLoadingContent();
    var IconComponent = content.icon;
    return (<div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"/>
        <div className={"relative glass-panel p-8 rounded-full ".concat(content.animation)}>
          <IconComponent className="h-16 w-16 text-primary"/>
        </div>
        
        {/* Orbital particles */}
        <div className="absolute inset-0">
          {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className="absolute w-2 h-2 bg-primary rounded-full" style={{
                animation: "orbit ".concat(3 + i, "s linear infinite"),
                animationDelay: "".concat(i * 0.5, "s"),
                top: '50%',
                left: '50%',
                transform: "translate(-50%, -50%) rotate(".concat(i * 120, "deg) translateX(60px)")
            }}/>); })}
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="heading-refined text-xl">{content.title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {content.description}
        </p>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (<div className="w-64">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: "".concat(progress, "%") }}/>
          </div>
        </div>)}

      {/* Custom CSS for orbit animation */}
      <style jsx>{"\n        @keyframes orbit {\n          from {\n            transform: translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg);\n          }\n          to {\n            transform: translate(-50%, -50%) rotate(360deg) translateX(60px) rotate(-360deg);\n          }\n        }\n      "}</style>
    </div>);
};
exports.LoadingState = (0, react_1.memo)(LoadingStateComponent);
var ErrorStateComponent = function (_a) {
    var type = _a.type, message = _a.message, onRetry = _a.onRetry;
    var getErrorContent = function () {
        switch (type) {
            case 'connection':
                return {
                    title: 'Connection Lost',
                    description: message || 'Unable to connect to the Neural Arena. Please check your connection.',
                    icon: '⚡',
                    color: 'text-yellow-500'
                };
            case 'debate-failed':
                return {
                    title: 'Debate Initialization Failed',
                    description: message || 'The combatants could not be initialized. Please try again.',
                    icon: '⚔️',
                    color: 'text-red-500'
                };
            case 'citation-error':
                return {
                    title: 'Citation Verification Error',
                    description: message || 'Unable to verify sources. Debate will continue without fact-checking.',
                    icon: '📚',
                    color: 'text-orange-500'
                };
            default:
                return {
                    title: 'Something Went Wrong',
                    description: message || 'An unexpected error occurred. Please try again.',
                    icon: '⚠️',
                    color: 'text-red-500'
                };
        }
    };
    var content = getErrorContent();
    return (<div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Error Icon */}
      <div className="relative">
        <div className={"text-6xl ".concat(content.color, " animate-pulse")}>
          {content.icon}
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center space-y-2 max-w-md">
        <h3 className="heading-refined text-xl">{content.title}</h3>
        <p className="text-muted-foreground text-sm">
          {content.description}
        </p>
      </div>

      {/* Retry Button */}
      {onRetry && (<button onClick={onRetry} className="glass-panel px-6 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300 flex items-center gap-2">
          <lucide_react_1.Loader2 className="h-4 w-4"/>
          <span>Try Again</span>
        </button>)}
    </div>);
};
exports.ErrorState = (0, react_1.memo)(ErrorStateComponent);
var EmptyStateComponent = function (_a) {
    var type = _a.type, message = _a.message, actionLabel = _a.actionLabel, onAction = _a.onAction;
    var getEmptyContent = function () {
        switch (type) {
            case 'no-debates':
                return {
                    title: 'No Active Debates',
                    description: message || 'Select a scenario or configure combatants to begin.',
                    icon: lucide_react_1.Swords,
                    defaultAction: 'Start New Debate'
                };
            case 'no-results':
                return {
                    title: 'No Results Yet',
                    description: message || 'Complete a debate to see results and statistics.',
                    icon: lucide_react_1.Brain,
                    defaultAction: 'View Demo'
                };
            case 'no-citations':
                return {
                    title: 'No Citations Found',
                    description: message || 'Arguments will be evaluated without external sources.',
                    icon: lucide_react_1.Sparkles,
                    defaultAction: 'Continue Anyway'
                };
            default:
                return {
                    title: 'Nothing Here Yet',
                    description: message || 'Get started to see content.',
                    icon: lucide_react_1.Zap,
                    defaultAction: 'Get Started'
                };
        }
    };
    var content = getEmptyContent();
    var IconComponent = content.icon;
    return (<div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Empty State Icon */}
      <div className="relative">
        <div className="glass-minimal p-8 rounded-full">
          <IconComponent className="h-16 w-16 text-muted-foreground opacity-50"/>
        </div>
      </div>

      {/* Empty State Message */}
      <div className="text-center space-y-2 max-w-md">
        <h3 className="heading-refined text-xl text-muted-foreground">
          {content.title}
        </h3>
        <p className="text-muted-foreground text-sm opacity-80">
          {content.description}
        </p>
      </div>

      {/* Action Button */}
      {onAction && (<button onClick={onAction} className="glass-panel px-6 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-primary/20">
          {actionLabel || content.defaultAction}
        </button>)}
    </div>);
};
exports.EmptyState = (0, react_1.memo)(EmptyStateComponent);
