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
exports.NotificationProvider = exports.useNotifications = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var NotificationContext = (0, react_1.createContext)(null);
var useNotifications = function () {
    var context = (0, react_1.useContext)(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
exports.useNotifications = useNotifications;
var NotificationProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), notifications = _b[0], setNotifications = _b[1];
    var addNotification = function (notification) {
        var id = "notification-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        var newNotification = __assign(__assign({}, notification), { id: id, duration: notification.duration || 5000 });
        setNotifications(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newNotification], false); });
        // Auto remove notification
        setTimeout(function () {
            removeNotification(id);
        }, newNotification.duration);
    };
    var removeNotification = function (id) {
        setNotifications(function (prev) { return prev.filter(function (n) { return n.id !== id; }); });
    };
    // Demo notifications for showcase
    (0, react_1.useEffect)(function () {
        var demoInterval = setInterval(function () {
            if (Math.random() > 0.7) {
                var demoNotifications = [
                    {
                        type: 'achievement',
                        title: 'New Achievement Unlocked!',
                        message: 'Strategic Commander - Level 15 reached',
                        icon: lucide_react_1.Trophy,
                        duration: 4000
                    },
                    {
                        type: 'xp',
                        title: '+250 XP Gained!',
                        message: 'Excellent strategic evaluation performance',
                        icon: lucide_react_1.Star,
                        duration: 3000
                    },
                    {
                        type: 'battle',
                        title: 'Battle Victory!',
                        message: 'GPT-4 defeated Claude-3 in creative challenge',
                        icon: lucide_react_1.Target,
                        duration: 3500
                    },
                    {
                        type: 'success',
                        title: 'System Online',
                        message: 'All strategic modules operational',
                        duration: 3000
                    },
                    {
                        type: 'info',
                        title: 'New Model Available',
                        message: 'Gemini Ultra Pro now in evaluation arena',
                        duration: 4000
                    }
                ];
                var randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
                addNotification(randomNotification);
            }
        }, 8000);
        return function () { return clearInterval(demoInterval); };
    }, []);
    return (<NotificationContext.Provider value={{ addNotification: addNotification, removeNotification: removeNotification }}>
      {children}
      <FloatingNotifications notifications={notifications} onRemove={removeNotification}/>
    </NotificationContext.Provider>);
};
exports.NotificationProvider = NotificationProvider;
var FloatingNotificationsComponent = function (_a) {
    var notifications = _a.notifications, onRemove = _a.onRemove;
    var getNotificationStyles = function (type) {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500/10 border-green-500/30',
                    icon: 'text-green-400',
                    accent: 'border-l-green-400'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500/10 border-yellow-500/30',
                    icon: 'text-yellow-400',
                    accent: 'border-l-yellow-400'
                };
            case 'info':
                return {
                    bg: 'bg-blue-500/10 border-blue-500/30',
                    icon: 'text-blue-400',
                    accent: 'border-l-blue-400'
                };
            case 'achievement':
                return {
                    bg: 'bg-purple-500/10 border-purple-500/30',
                    icon: 'text-purple-400',
                    accent: 'border-l-purple-400'
                };
            case 'battle':
                return {
                    bg: 'bg-red-500/10 border-red-500/30',
                    icon: 'text-red-400',
                    accent: 'border-l-red-400'
                };
            case 'xp':
                return {
                    bg: 'bg-orange-500/10 border-orange-500/30',
                    icon: 'text-orange-400',
                    accent: 'border-l-orange-400'
                };
            default:
                return {
                    bg: 'bg-muted/10 border-muted/30',
                    icon: 'text-muted-foreground',
                    accent: 'border-l-muted-foreground'
                };
        }
    };
    var getDefaultIcon = function (type) {
        switch (type) {
            case 'success': return lucide_react_1.CheckCircle;
            case 'warning': return lucide_react_1.AlertTriangle;
            case 'info': return lucide_react_1.Info;
            case 'achievement': return lucide_react_1.Trophy;
            case 'battle': return lucide_react_1.Target;
            case 'xp': return lucide_react_1.Star;
            default: return lucide_react_1.Info;
        }
    };
    return (<div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(function (notification, index) {
            var styles = getNotificationStyles(notification.type);
            var IconComponent = notification.icon || getDefaultIcon(notification.type);
            return (<div key={notification.id} className={"glass-panel ".concat(styles.bg, " ").concat(styles.accent, " border-l-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-out animate-in slide-in-from-right-full")} style={{
                    animationDelay: "".concat(index * 100, "ms"),
                    animationFillMode: 'both'
                }}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={"p-1 rounded-lg ".concat(styles.bg)}>
                <IconComponent className={"h-5 w-5 ".concat(styles.icon)}/>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="heading-refined text-sm font-semibold mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  
                  {/* Close Button */}
                  <button onClick={function () { return onRemove(notification.id); }} className="flex-shrink-0 p-1 rounded-lg hover:bg-muted/20 transition-colors" aria-label="Close notification">
                    <lucide_react_1.X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                  </button>
                </div>

                {/* Action Button */}
                {notification.action && (<button onClick={notification.action.onClick} className="mt-2 text-xs text-primary hover:text-primary/80 font-medium underline decoration-1 underline-offset-2">
                    {notification.action.label}
                  </button>)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20 rounded-b-lg overflow-hidden">
              <div className={"h-full ".concat(styles.accent.replace('border-l-', 'bg-'), " transition-all ease-linear")} style={{
                    width: '100%',
                    animation: "shrink-width ".concat(notification.duration, "ms linear")
                }}/>
            </div>

            {/* Special Effects for Achievements */}
            {notification.type === 'achievement' && (<div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"/>
                <div className="absolute top-0 right-0 w-3 h-3 bg-purple-400 rounded-full animate-pulse"/>
              </div>)}

            {/* XP Glow Effect */}
            {notification.type === 'xp' && (<div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/5 to-transparent animate-pulse rounded-lg"/>)}

            {/* Battle Spark Effect */}
            {notification.type === 'battle' && (<div className="absolute top-2 right-8">
                <lucide_react_1.Zap className="h-4 w-4 text-yellow-400 animate-bounce"/>
              </div>)}
          </div>);
        })}

      <style>{"\n        @keyframes shrink-width {\n          from { width: 100%; }\n          to { width: 0%; }\n        }\n\n        @keyframes slide-in-from-right-full {\n          from {\n            transform: translateX(100%);\n            opacity: 0;\n          }\n          to {\n            transform: translateX(0);\n            opacity: 1;\n          }\n        }\n\n        .animate-in {\n          animation-duration: 0.5s;\n          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);\n        }\n      "}</style>
    </div>);
};
var FloatingNotifications = (0, react_1.memo)(FloatingNotificationsComponent);
