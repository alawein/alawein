"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonLoader = exports.InlineLoader = exports.PageLoader = exports.LoadingSpinner = void 0;
var utils_1 = require("@/lib/utils");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var BattleLoadingAnimation = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b;
    var _c = (0, react_1.useState)(0), currentIcon = _c[0], setCurrentIcon = _c[1];
    var icons = [lucide_react_1.Swords, lucide_react_1.Zap, lucide_react_1.BarChart3];
    (0, react_1.useEffect)(function () {
        var interval = setInterval(function () {
            setCurrentIcon(function (prev) { return (prev + 1) % icons.length; });
        }, 800);
        return function () { return clearInterval(interval); };
    }, []);
    var sizeClasses = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-16 w-16"
    };
    var CurrentIcon = icons[currentIcon];
    return (<div className="glass-panel p-4 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 animate-pulse"></div>
      <CurrentIcon className={(0, utils_1.cn)("text-primary transition-all duration-500 animate-pulse relative z-10", sizeClasses[size])}/>
    </div>);
};
var PulseLoadingAnimation = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b;
    var sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };
    return (<div className="relative">
      {/* Outer pulse ring */}
      <div className={(0, utils_1.cn)("absolute inset-0 rounded-full border-2 border-primary/30 animate-ping", sizeClasses[size])}/>
      {/* Middle pulse ring */}
      <div className={(0, utils_1.cn)("absolute inset-1 rounded-full border border-primary/50 animate-pulse", size === "lg" ? "inset-2" : size === "md" ? "inset-1" : "inset-0.5")} style={{ animationDelay: "0.2s" }}/>
      {/* Inner core */}
      <div className={(0, utils_1.cn)("rounded-full bg-gradient-to-br from-primary to-secondary animate-spin", sizeClasses[size])}/>
    </div>);
};
var DotsLoadingAnimation = function () {
    return (<div className="flex items-center gap-2">
      {[0, 1, 2].map(function (i) { return (<div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{
                animationDelay: "".concat(i * 0.2, "s"),
                animationDuration: "1s"
            }}/>); })}
    </div>);
};
var LoadingSpinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b, className = _a.className, text = _a.text, _c = _a.variant, variant = _c === void 0 ? "default" : _c;
    var sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };
    var renderLoader = function () {
        switch (variant) {
            case "battle":
                return <BattleLoadingAnimation size={size}/>;
            case "pulse":
                return <PulseLoadingAnimation size={size}/>;
            case "dots":
                return <DotsLoadingAnimation />;
            default:
                return (<div className={(0, utils_1.cn)("animate-spin rounded-full border-2 border-muted/20 border-t-primary shadow-lg", sizeClasses[size])} aria-hidden="true"/>);
        }
    };
    return (<div className={(0, utils_1.cn)("flex flex-col items-center gap-4 stagger-children", className)} role="status" aria-live="polite">
      <div style={{ '--stagger-index': 0 }}>
        {renderLoader()}
      </div>
      {text && (<div style={{ '--stagger-index': 1 }}>
          <span className="body-elegant text-sm text-muted-foreground animate-pulse">
            {text}
          </span>
        </div>)}
      <span className="sr-only">Loading...</span>
    </div>);
};
exports.LoadingSpinner = LoadingSpinner;
var PageLoader = function (_a) {
    var _b = _a.text, text = _b === void 0 ? "Preparing combat systems..." : _b;
    return (<div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
            background: "\n        radial-gradient(circle at 25% 25%, hsl(var(--color-primary) / 0.03), transparent 50%),\n        radial-gradient(circle at 75% 75%, hsl(var(--color-secondary) / 0.02), transparent 50%),\n        var(--color-background)\n      "
        }}>
    {/* Sophisticated Background Effects */}
    <div className="absolute inset-0 subtle-texture opacity-20"></div>
    <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
    <div className="absolute bottom-1/4 right-1/3 w-px h-24 bg-gradient-to-t from-secondary/15 to-transparent"></div>
    
    <div className="relative z-10 text-center">
      <exports.LoadingSpinner size="lg" text={text} variant="battle"/>
    </div>
  </div>);
};
exports.PageLoader = PageLoader;
var InlineLoader = function (_a) {
    var _b = _a.text, text = _b === void 0 ? "Loading..." : _b, _c = _a.size, size = _c === void 0 ? "sm" : _c;
    return (<div className="flex items-center gap-3 glass-panel p-3 rounded-lg">
    <exports.LoadingSpinner size={size} variant="pulse"/>
    <span className="body-elegant text-sm text-muted-foreground">
      {text}
    </span>
  </div>);
};
exports.InlineLoader = InlineLoader;
var SkeletonLoader = function (_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "rectangular" : _b;
    var baseClasses = "animate-pulse bg-gradient-to-r from-muted/50 to-muted/20";
    var variantClasses = {
        rectangular: "rounded-lg",
        circular: "rounded-full aspect-square",
        text: "rounded-md h-4"
    };
    return (<div className={(0, utils_1.cn)(baseClasses, variantClasses[variant], className)} aria-hidden="true"/>);
};
exports.SkeletonLoader = SkeletonLoader;
