"use strict";
/**
 * Production monitoring utilities for LLM Works platform
 * Implements comprehensive error tracking, performance monitoring, and alerting
 */
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
exports.healthChecker = exports.userBehaviorTracker = exports.performanceMonitor = exports.errorTracker = exports.initMonitoring = void 0;
/**
 * Enhanced error tracking with context
 */
var ErrorTracker = /** @class */ (function () {
    function ErrorTracker() {
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errorQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxQueueSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        this.sessionId = this.generateSessionId();
        this.setupGlobalErrorHandlers();
    }
    Object.defineProperty(ErrorTracker, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!ErrorTracker.instance) {
                ErrorTracker.instance = new ErrorTracker();
            }
            return ErrorTracker.instance;
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "generateSessionId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "setupGlobalErrorHandlers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // JavaScript errors
            window.addEventListener('error', function (event) {
                _this.captureError(new Error(event.message), {
                    sessionId: _this.sessionId,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: Date.now(),
                    metadata: {
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        type: 'javascript'
                    }
                });
            });
            // Promise rejections
            window.addEventListener('unhandledrejection', function (event) {
                var _a;
                _this.captureError(new Error(((_a = event.reason) === null || _a === void 0 ? void 0 : _a.message) || 'Unhandled Promise Rejection'), {
                    sessionId: _this.sessionId,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: Date.now(),
                    metadata: {
                        reason: event.reason,
                        type: 'promise'
                    }
                });
            });
            // Resource loading errors
            window.addEventListener('error', function (event) {
                if (event.target && event.target !== window) {
                    var target = event.target;
                    _this.captureError(new Error("Resource loading failed: ".concat(target.tagName)), {
                        sessionId: _this.sessionId,
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                        timestamp: Date.now(),
                        metadata: {
                            element: target.tagName,
                            source: target.src || target.href,
                            type: 'resource'
                        }
                    });
                }
            }, true);
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "captureError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, context) {
            if (context === void 0) { context = {}; }
            var fullContext = __assign({ sessionId: this.sessionId, userAgent: navigator.userAgent, url: window.location.href, timestamp: Date.now() }, context);
            this.errorQueue.push({ error: error, context: fullContext });
            // Maintain queue size
            if (this.errorQueue.length > this.maxQueueSize) {
                this.errorQueue.shift();
            }
            // Log error
            console.error('[ErrorTracker]', error, fullContext);
            // Send to monitoring service in production
            if (import.meta.env.PROD) {
                this.sendToMonitoringService(error, fullContext);
            }
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "sendToMonitoringService", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, context) {
            return __awaiter(this, void 0, void 0, function () {
                var sendError_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // In a real application, send to services like Sentry, LogRocket, etc.
                            return [4 /*yield*/, fetch('/api/errors', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        message: error.message,
                                        stack: error.stack,
                                        context: context,
                                    }),
                                })];
                        case 1:
                            // In a real application, send to services like Sentry, LogRocket, etc.
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            sendError_1 = _a.sent();
                            console.warn('Failed to send error to monitoring service:', sendError_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "getErrorHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __spreadArray([], this.errorQueue, true);
        }
    });
    Object.defineProperty(ErrorTracker.prototype, "clearErrorHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.errorQueue = [];
        }
    });
    return ErrorTracker;
}());
/**
 * Performance monitoring with Core Web Vitals
 */
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor() {
        Object.defineProperty(this, "metrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "observer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.setupPerformanceObserver();
        this.trackCoreWebVitals();
        this.trackCustomMetrics();
    }
    Object.defineProperty(PerformanceMonitor, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!PerformanceMonitor.instance) {
                PerformanceMonitor.instance = new PerformanceMonitor();
            }
            return PerformanceMonitor.instance;
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "setupPerformanceObserver", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            if ('PerformanceObserver' in window) {
                this.observer = new PerformanceObserver(function (list) {
                    for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                        var entry = _a[_i];
                        _this.recordMetric({
                            name: entry.name,
                            value: entry.duration || entry.value || 0,
                            unit: 'ms',
                            timestamp: Date.now(),
                            tags: {
                                type: entry.entryType,
                                initiatorType: entry.initiatorType || 'unknown'
                            }
                        });
                    }
                });
                try {
                    this.observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift'] });
                }
                catch (e) {
                    console.warn('Some performance entry types not supported:', e);
                }
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "trackCoreWebVitals", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, onCLS, onINP, onFCP, onLCP, onTTFB, error_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return require('web-vitals'); })];
                        case 1:
                            _a = _b.sent(), onCLS = _a.onCLS, onINP = _a.onINP, onFCP = _a.onFCP, onLCP = _a.onLCP, onTTFB = _a.onTTFB;
                            onCLS(function (metric) { return _this.recordWebVital('CLS', metric.value); });
                            onINP(function (metric) { return _this.recordWebVital('INP', metric.value); });
                            onFCP(function (metric) { return _this.recordWebVital('FCP', metric.value); });
                            onLCP(function (metric) { return _this.recordWebVital('LCP', metric.value); });
                            onTTFB(function (metric) { return _this.recordWebVital('TTFB', metric.value); });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            console.warn('Web Vitals not available:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "recordWebVital", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (name, value) {
            this.recordMetric({
                name: "web_vital_".concat(name.toLowerCase()),
                value: value,
                unit: name === 'CLS' ? 'score' : 'ms',
                timestamp: Date.now(),
                tags: { category: 'core_web_vitals' }
            });
            // Send to analytics
            if (window.gtag) {
                window.gtag('event', name, {
                    event_category: 'Web Vitals',
                    value: Math.round(name === 'CLS' ? value * 1000 : value),
                    non_interaction: true,
                });
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "trackCustomMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // Track page load time
            window.addEventListener('load', function () {
                var loadTime = performance.now();
                _this.recordMetric({
                    name: 'page_load_time',
                    value: loadTime,
                    unit: 'ms',
                    timestamp: Date.now(),
                    tags: { page: window.location.pathname }
                });
            });
            // Track route changes
            var previousPath = window.location.pathname;
            var trackRouteChange = function () {
                var currentPath = window.location.pathname;
                if (currentPath !== previousPath) {
                    _this.recordMetric({
                        name: 'route_change',
                        value: performance.now(),
                        unit: 'ms',
                        timestamp: Date.now(),
                        tags: {
                            from: previousPath,
                            to: currentPath
                        }
                    });
                    previousPath = currentPath;
                }
            };
            // Track pushState and replaceState
            var originalPushState = history.pushState;
            var originalReplaceState = history.replaceState;
            history.pushState = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                originalPushState.apply(history, args);
                setTimeout(trackRouteChange, 0);
            };
            history.replaceState = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                originalReplaceState.apply(history, args);
                setTimeout(trackRouteChange, 0);
            };
            window.addEventListener('popstate', trackRouteChange);
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "recordMetric", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (metric) {
            this.metrics.push(metric);
            // Maintain metrics array size
            if (this.metrics.length > 1000) {
                this.metrics.shift();
            }
            // Send to monitoring service
            if (import.meta.env.PROD) {
                this.sendMetric(metric);
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "sendMetric", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (metric) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fetch('/api/metrics', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(metric),
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.warn('Failed to send metric:', error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "getMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (filter) {
            if (!filter)
                return __spreadArray([], this.metrics, true);
            return this.metrics.filter(function (metric) {
                var _a;
                if (filter.name && !metric.name.includes(filter.name))
                    return false;
                if (filter.category && ((_a = metric.tags) === null || _a === void 0 ? void 0 : _a.category) !== filter.category)
                    return false;
                return true;
            });
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "generateReport", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var summary = {};
            var coreWebVitals = {};
            var performance = {};
            this.metrics.forEach(function (metric) {
                var _a;
                if (((_a = metric.tags) === null || _a === void 0 ? void 0 : _a.category) === 'core_web_vitals') {
                    coreWebVitals[metric.name] = metric.value;
                }
                else {
                    performance[metric.name] = metric.value;
                }
                summary[metric.name] = metric.value;
            });
            return { summary: summary, coreWebVitals: coreWebVitals, performance: performance };
        }
    });
    return PerformanceMonitor;
}());
/**
 * User behavior and interaction tracking
 */
var UserBehaviorTracker = /** @class */ (function () {
    function UserBehaviorTracker() {
        Object.defineProperty(this, "interactions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "sessionStart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sessionStart = Date.now();
        this.setupInteractionTracking();
    }
    Object.defineProperty(UserBehaviorTracker, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!UserBehaviorTracker.instance) {
                UserBehaviorTracker.instance = new UserBehaviorTracker();
            }
            return UserBehaviorTracker.instance;
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "setupInteractionTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // Track clicks
            document.addEventListener('click', function (event) {
                var target = event.target;
                _this.recordInteraction('click', _this.getElementSelector(target));
            });
            // Track form submissions
            document.addEventListener('submit', function (event) {
                var target = event.target;
                _this.recordInteraction('submit', _this.getElementSelector(target));
            });
            // Track page visibility changes
            document.addEventListener('visibilitychange', function () {
                _this.recordInteraction(document.visibilityState === 'visible' ? 'page_visible' : 'page_hidden', window.location.pathname);
            });
            // Track scroll depth
            var maxScrollDepth = 0;
            window.addEventListener('scroll', function () {
                var scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
                if (scrollDepth > maxScrollDepth) {
                    maxScrollDepth = scrollDepth;
                    if (maxScrollDepth % 25 === 0) { // Track 25%, 50%, 75%, 100%
                        _this.recordInteraction('scroll_depth', "".concat(maxScrollDepth, "%"));
                    }
                }
            });
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "getElementSelector", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (element) {
            if (element.id)
                return "#".concat(element.id);
            if (element.className)
                return ".".concat(element.className.split(' ')[0]);
            return element.tagName.toLowerCase();
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "recordInteraction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (type, target) {
            this.interactions.push({
                type: type,
                target: target,
                timestamp: Date.now()
            });
            // Maintain array size
            if (this.interactions.length > 500) {
                this.interactions.shift();
            }
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "getSessionDuration", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return Date.now() - this.sessionStart;
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "getInteractionHistory", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __spreadArray([], this.interactions, true);
        }
    });
    Object.defineProperty(UserBehaviorTracker.prototype, "generateUserReport", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var interactionCounts = {};
            this.interactions.forEach(function (interaction) {
                var key = "".concat(interaction.type, ":").concat(interaction.target);
                interactionCounts[key] = (interactionCounts[key] || 0) + 1;
            });
            var topInteractions = Object.entries(interactionCounts)
                .map(function (_a) {
                var key = _a[0], count = _a[1];
                var type = key.split(':')[0];
                return { type: type, count: count };
            })
                .sort(function (a, b) { return b.count - a.count; })
                .slice(0, 10);
            return {
                sessionDuration: this.getSessionDuration(),
                interactions: this.interactions.length,
                topInteractions: topInteractions
            };
        }
    });
    return UserBehaviorTracker;
}());
/**
 * Health check system
 */
var HealthChecker = /** @class */ (function () {
    function HealthChecker() {
        Object.defineProperty(this, "checks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "lastCheckTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "checkInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 60000
        }); // 1 minute
        this.setupDefaultChecks();
        this.startPeriodicChecks();
    }
    Object.defineProperty(HealthChecker, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!HealthChecker.instance) {
                HealthChecker.instance = new HealthChecker();
            }
            return HealthChecker.instance;
        }
    });
    Object.defineProperty(HealthChecker.prototype, "setupDefaultChecks", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // Check local storage availability
            this.addCheck(function () { return __awaiter(_this, void 0, void 0, function () {
                var testKey;
                return __generator(this, function (_a) {
                    try {
                        testKey = 'health_check_test';
                        localStorage.setItem(testKey, 'test');
                        localStorage.removeItem(testKey);
                        return [2 /*return*/, true];
                    }
                    catch (_b) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            }); });
            // Check network connectivity
            this.addCheck(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, navigator.onLine];
                });
            }); });
            // Check service worker status
            this.addCheck(function () { return __awaiter(_this, void 0, void 0, function () {
                var registration, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!('serviceWorker' in navigator)) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, navigator.serviceWorker.ready];
                        case 2:
                            registration = _b.sent();
                            return [2 /*return*/, registration.active !== null];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/, true]; // Not having SW isn't necessarily a failure
                    }
                });
            }); });
        }
    });
    Object.defineProperty(HealthChecker.prototype, "addCheck", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (check) {
            this.checks.push(check);
        }
    });
    Object.defineProperty(HealthChecker.prototype, "startPeriodicChecks", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.runAllChecks()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, this.checkInterval);
        }
    });
    Object.defineProperty(HealthChecker.prototype, "runAllChecks", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var results, healthy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.lastCheckTime = Date.now();
                            return [4 /*yield*/, Promise.all(this.checks.map(function (check) { return check().catch(function () { return false; }); }))];
                        case 1:
                            results = _a.sent();
                            healthy = results.every(function (result) { return result; });
                            if (!healthy) {
                                ErrorTracker.getInstance().captureError(new Error('Health check failed'), {
                                    sessionId: '',
                                    userAgent: navigator.userAgent,
                                    url: window.location.href,
                                    timestamp: Date.now(),
                                    metadata: {
                                        failedChecks: results.map(function (result, index) { return ({ index: index, passed: result }); }),
                                        type: 'health_check'
                                    }
                                });
                            }
                            return [2 /*return*/, { healthy: healthy, results: results }];
                    }
                });
            });
        }
    });
    Object.defineProperty(HealthChecker.prototype, "getHealthStatus", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                healthy: true, // This would be set by the last check
                lastCheck: this.lastCheckTime,
                uptime: performance.now()
            };
        }
    });
    return HealthChecker;
}());
/**
 * Initialize all monitoring systems
 */
var initMonitoring = function () {
    // Initialize all monitoring systems
    ErrorTracker.getInstance();
    PerformanceMonitor.getInstance();
    UserBehaviorTracker.getInstance();
    HealthChecker.getInstance();
    // Add monitoring endpoint
    if (import.meta.env.PROD) {
        // Expose health check endpoint
        window.__health_check = function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorTracker, performanceMonitor, userTracker, healthChecker;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        errorTracker = ErrorTracker.getInstance();
                        performanceMonitor = PerformanceMonitor.getInstance();
                        userTracker = UserBehaviorTracker.getInstance();
                        healthChecker = HealthChecker.getInstance();
                        _a = {
                            errors: errorTracker.getErrorHistory().length,
                            performance: performanceMonitor.generateReport(),
                            user: userTracker.generateUserReport()
                        };
                        return [4 /*yield*/, healthChecker.runAllChecks()];
                    case 1: return [2 /*return*/, (_a.health = _b.sent(),
                            _a.timestamp = Date.now(),
                            _a)];
                }
            });
        }); };
    }
    console.log('📊 Production monitoring initialized');
};
exports.initMonitoring = initMonitoring;
// Export singletons for external use
exports.errorTracker = ErrorTracker.getInstance();
exports.performanceMonitor = PerformanceMonitor.getInstance();
exports.userBehaviorTracker = UserBehaviorTracker.getInstance();
exports.healthChecker = HealthChecker.getInstance();
