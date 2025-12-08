"use strict";
/**
 * Performance monitoring and optimization utilities
 * Tracks Core Web Vitals and provides performance insights
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResourceTiming = exports.measure = exports.measureAsync = exports.getPerformanceScore = exports.getPerformanceMetrics = exports.initPerformanceMonitoring = void 0;
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        Object.defineProperty(this, "metrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "observers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "onVisibilityChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (document.visibilityState === 'visible') {
                    _this.startTracking();
                }
            }
        });
        this.config = __assign({ trackCoreWebVitals: true, trackNavigation: true, debug: import.meta.env.DEV }, config);
        this.init();
    }
    Object.defineProperty(PerformanceMonitor.prototype, "init", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.config.trackCoreWebVitals) {
                this.setupCoreWebVitals();
            }
            if (this.config.trackNavigation) {
                this.setupNavigationTiming();
            }
            // Track when page becomes visible
            if (document.visibilityState === 'hidden') {
                document.addEventListener('visibilitychange', this.onVisibilityChange, { once: true });
            }
            else {
                this.startTracking();
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "startTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // Wait for page to be fully loaded
            if (document.readyState === 'complete') {
                this.trackInitialMetrics();
            }
            else {
                window.addEventListener('load', function () { return _this.trackInitialMetrics(); }, { once: true });
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "setupCoreWebVitals", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            // Largest Contentful Paint (LCP)
            if ('PerformanceObserver' in window) {
                try {
                    var lcpObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        var lastEntry = entries[entries.length - 1];
                        _this.metrics.lcp = lastEntry.startTime;
                        _this.log('LCP:', lastEntry.startTime);
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                    this.observers.push(lcpObserver);
                }
                catch (e) {
                    console.warn('[Performance] LCP observer not supported');
                }
                // First Input Delay (FID)
                try {
                    var fidObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        entries.forEach(function (entry) {
                            _this.metrics.fid = entry.processingStart - entry.startTime;
                            _this.log('FID:', _this.metrics.fid);
                        });
                    });
                    fidObserver.observe({ type: 'first-input', buffered: true });
                    this.observers.push(fidObserver);
                }
                catch (e) {
                    console.warn('[Performance] FID observer not supported');
                }
                // Cumulative Layout Shift (CLS)
                try {
                    var clsValue_1 = 0;
                    var clsObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        entries.forEach(function (entry) {
                            if (!entry.hadRecentInput) {
                                clsValue_1 += entry.value;
                            }
                        });
                        _this.metrics.cls = clsValue_1;
                        _this.log('CLS:', clsValue_1);
                    });
                    clsObserver.observe({ type: 'layout-shift', buffered: true });
                    this.observers.push(clsObserver);
                }
                catch (e) {
                    console.warn('[Performance] CLS observer not supported');
                }
                // First Contentful Paint (FCP)
                try {
                    var fcpObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        entries.forEach(function (entry) {
                            if (entry.name === 'first-contentful-paint') {
                                _this.metrics.fcp = entry.startTime;
                                _this.log('FCP:', entry.startTime);
                            }
                        });
                    });
                    fcpObserver.observe({ type: 'paint', buffered: true });
                    this.observers.push(fcpObserver);
                }
                catch (e) {
                    console.warn('[Performance] FCP observer not supported');
                }
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "setupNavigationTiming", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            if ('performance' in window && performance.getEntriesByType) {
                var observer = new PerformanceObserver(function (list) {
                    var entries = list.getEntries();
                    entries.forEach(function (entry) {
                        if (entry.entryType === 'navigation') {
                            _this.metrics.ttfb = entry.responseStart - entry.requestStart;
                            _this.metrics.loadTime = entry.loadEventEnd - entry.navigationStart;
                            _this.metrics.domReady = entry.domContentLoadedEventEnd - entry.navigationStart;
                            _this.log('TTFB:', _this.metrics.ttfb);
                            _this.log('Load Time:', _this.metrics.loadTime);
                            _this.log('DOM Ready:', _this.metrics.domReady);
                        }
                    });
                });
                observer.observe({ type: 'navigation', buffered: true });
                this.observers.push(observer);
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "trackInitialMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            // Fallback navigation timing using performance.timing (deprecated but widely supported)
            if (performance.timing) {
                var timing = performance.timing;
                this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
                this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                this.metrics.ttfb = timing.responseStart - timing.requestStart;
            }
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "log", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (message, value) {
            if (this.config.debug) {
                console.log("[Performance] ".concat(message), value);
            }
        }
    });
    // Get current metrics
    Object.defineProperty(PerformanceMonitor.prototype, "getMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __assign({}, this.metrics);
        }
    });
    // Get performance score (0-100)
    Object.defineProperty(PerformanceMonitor.prototype, "getPerformanceScore", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _a = this.metrics, lcp = _a.lcp, fid = _a.fid, cls = _a.cls;
            var score = 100;
            // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
            if (lcp !== undefined) {
                if (lcp > 4000)
                    score -= 40;
                else if (lcp > 2500)
                    score -= 20;
            }
            // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
            if (fid !== undefined) {
                if (fid > 300)
                    score -= 30;
                else if (fid > 100)
                    score -= 15;
            }
            // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
            if (cls !== undefined) {
                if (cls > 0.25)
                    score -= 30;
                else if (cls > 0.1)
                    score -= 15;
            }
            return Math.max(0, score);
        }
    });
    // Report metrics to endpoint
    Object.defineProperty(PerformanceMonitor.prototype, "reportMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.config.reportingEndpoint)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetch(this.config.reportingEndpoint, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        url: window.location.href,
                                        timestamp: Date.now(),
                                        metrics: this.metrics,
                                        score: this.getPerformanceScore(),
                                        userAgent: navigator.userAgent,
                                    }),
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.warn('[Performance] Failed to report metrics:', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    // Cleanup observers
    Object.defineProperty(PerformanceMonitor.prototype, "disconnect", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.observers.forEach(function (observer) { return observer.disconnect(); });
            this.observers = [];
        }
    });
    return PerformanceMonitor;
}());
// Singleton instance
var performanceMonitor = null;
// Initialize performance monitoring
var initPerformanceMonitoring = function (config) {
    if (!performanceMonitor) {
        performanceMonitor = new PerformanceMonitor(config);
    }
    return performanceMonitor;
};
exports.initPerformanceMonitoring = initPerformanceMonitoring;
// Get current performance metrics
var getPerformanceMetrics = function () {
    return (performanceMonitor === null || performanceMonitor === void 0 ? void 0 : performanceMonitor.getMetrics()) || {};
};
exports.getPerformanceMetrics = getPerformanceMetrics;
// Get performance score
var getPerformanceScore = function () {
    return (performanceMonitor === null || performanceMonitor === void 0 ? void 0 : performanceMonitor.getPerformanceScore()) || 0;
};
exports.getPerformanceScore = getPerformanceScore;
// Measure function execution time
var measureAsync = function (name, fn) { return __awaiter(void 0, void 0, void 0, function () {
    var start, result, duration, error_2, duration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fn()];
            case 2:
                result = _a.sent();
                duration = performance.now() - start;
                console.log("[Performance] ".concat(name, ": ").concat(duration.toFixed(2), "ms"));
                return [2 /*return*/, result];
            case 3:
                error_2 = _a.sent();
                duration = performance.now() - start;
                console.log("[Performance] ".concat(name, " (failed): ").concat(duration.toFixed(2), "ms"));
                throw error_2;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.measureAsync = measureAsync;
// Measure sync function execution time
var measure = function (name, fn) {
    var start = performance.now();
    try {
        var result = fn();
        var duration = performance.now() - start;
        console.log("[Performance] ".concat(name, ": ").concat(duration.toFixed(2), "ms"));
        return result;
    }
    catch (error) {
        var duration = performance.now() - start;
        console.log("[Performance] ".concat(name, " (failed): ").concat(duration.toFixed(2), "ms"));
        throw error;
    }
};
exports.measure = measure;
// Resource timing analysis
var analyzeResourceTiming = function () {
    var resources = performance.getEntriesByType('resource');
    var analysis = {
        totalResources: resources.length,
        totalSize: 0,
        slowestResources: [],
        resourceTypes: {},
    };
    resources.forEach(function (resource) {
        var _a;
        // Calculate load time
        var loadTime = resource.responseEnd - resource.startTime;
        // Track resource types
        var extension = ((_a = resource.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'other';
        analysis.resourceTypes[extension] = (analysis.resourceTypes[extension] || 0) + 1;
        // Track slowest resources
        analysis.slowestResources.push({
            name: resource.name,
            loadTime: loadTime,
            size: resource.transferSize || 0,
        });
    });
    // Sort by load time
    analysis.slowestResources.sort(function (a, b) { return b.loadTime - a.loadTime; });
    analysis.slowestResources = analysis.slowestResources.slice(0, 10);
    console.log('[Performance] Resource Analysis:', analysis);
};
exports.analyzeResourceTiming = analyzeResourceTiming;
