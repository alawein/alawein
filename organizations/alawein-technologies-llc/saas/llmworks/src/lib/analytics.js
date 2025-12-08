"use strict";
/**
 * Advanced user analytics and behavior tracking system
 * GDPR compliant with user consent management
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
exports.analyticsManager = void 0;
exports.initAnalytics = initAnalytics;
exports.trackEvent = trackEvent;
exports.trackPageView = trackPageView;
exports.trackLegacyEvent = trackLegacyEvent;
exports.trackError = trackError;
exports.trackPerformance = trackPerformance;
exports.getAnalyticsData = getAnalyticsData;
exports.clearAnalyticsData = clearAnalyticsData;
exports.trackPageLoad = trackPageLoad;
var environment_1 = require("./environment");
var AnalyticsManager = /** @class */ (function () {
    function AnalyticsManager() {
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "eventQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "consentGiven", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "initialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "funnels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "heatmapData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "performanceMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * Initialize analytics system
     */
    Object.defineProperty(AnalyticsManager.prototype, "init", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.initialized)
                                return [2 /*return*/];
                            config = (0, environment_1.getConfig)();
                            if (!config.features.analytics) {
                                console.log('Analytics disabled in configuration');
                                return [2 /*return*/];
                            }
                            // Check for stored consent
                            this.consentGiven = this.getStoredConsent();
                            if (!this.consentGiven) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.initializeTracking()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            this.showConsentBanner();
                            _a.label = 3;
                        case 3:
                            this.setupEventListeners();
                            this.initialized = true;
                            console.log('Analytics system initialized');
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Initialize tracking systems
     */
    Object.defineProperty(AnalyticsManager.prototype, "initializeTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.startSession();
                    this.initializeGoogleAnalytics();
                    this.setupPerformanceTracking();
                    this.setupScrollTracking();
                    this.setupClickTracking();
                    this.setupFormTracking();
                    this.setupErrorTracking();
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Show consent banner
     */
    Object.defineProperty(AnalyticsManager.prototype, "showConsentBanner", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            var _a, _b;
            // Check if banner already exists
            if (document.querySelector('#analytics-consent-banner')) {
                return;
            }
            var banner = document.createElement('div');
            banner.id = 'analytics-consent-banner';
            banner.style.cssText = "\n      position: fixed;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      background: #1a1a1a;\n      color: white;\n      padding: 16px;\n      z-index: 10001;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      font-size: 14px;\n      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);\n    ";
            banner.innerHTML = "\n      <div style=\"flex: 1; margin-right: 16px;\">\n        <strong>Cookie Consent</strong><br>\n        We use analytics cookies to improve your experience and understand how our platform is used.\n      </div>\n      <div style=\"display: flex; gap: 8px;\">\n        <button id=\"accept-analytics\" style=\"background: #4F83F0; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;\">\n          Accept\n        </button>\n        <button id=\"decline-analytics\" style=\"background: transparent; color: white; border: 1px solid #666; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;\">\n          Decline\n        </button>\n      </div>\n    ";
            document.body.appendChild(banner);
            // Handle accept
            (_a = banner.querySelector('#accept-analytics')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.consentGiven = true;
                            this.storeConsent(true);
                            banner.remove();
                            return [4 /*yield*/, this.initializeTracking()];
                        case 1:
                            _a.sent();
                            this.track('consent_given', { category: 'privacy', value: 1 });
                            return [2 /*return*/];
                    }
                });
            }); });
            // Handle decline
            (_b = banner.querySelector('#decline-analytics')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
                _this.consentGiven = false;
                _this.storeConsent(false);
                banner.remove();
                _this.track('consent_declined', { category: 'privacy', value: 0 });
            });
        }
    });
    /**
     * Get stored consent preference
     */
    Object.defineProperty(AnalyticsManager.prototype, "getStoredConsent", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            try {
                return localStorage.getItem('analytics_consent') === 'true';
            }
            catch (_a) {
                return false;
            }
        }
    });
    /**
     * Store consent preference
     */
    Object.defineProperty(AnalyticsManager.prototype, "storeConsent", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (consent) {
            try {
                localStorage.setItem('analytics_consent', consent.toString());
                localStorage.setItem('analytics_consent_date', new Date().toISOString());
            }
            catch (error) {
                console.error('Failed to store consent:', error);
            }
        }
    });
    /**
     * Track custom event
     */
    Object.defineProperty(AnalyticsManager.prototype, "track", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (event, parameters) {
            var _a;
            if (parameters === void 0) { parameters = {}; }
            if (!this.consentGiven)
                return;
            var analyticsEvent = {
                event: event,
                category: parameters.category || 'general',
                label: parameters.label,
                value: parameters.value,
                custom_parameters: __assign({ timestamp: Date.now(), session_id: (_a = this.session) === null || _a === void 0 ? void 0 : _a.session_id, page_path: window.location.pathname, user_agent: navigator.userAgent }, parameters.custom_parameters),
                user_properties: parameters.user_properties,
            };
            this.eventQueue.push(analyticsEvent);
            if (this.session) {
                this.session.events.push(analyticsEvent);
            }
            console.log('Analytics event tracked:', analyticsEvent);
        }
    });
    // Placeholder methods for remaining functionality
    Object.defineProperty(AnalyticsManager.prototype, "startSession", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.session = {
                session_id: crypto.randomUUID(),
                start_time: Date.now(),
                page_views: 1,
                events: [],
                user_agent: navigator.userAgent,
            };
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "initializeGoogleAnalytics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Google Analytics initialization placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupPerformanceTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Performance tracking setup placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupScrollTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Scroll tracking setup placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupClickTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Click tracking setup placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupFormTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Form tracking setup placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupErrorTracking", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Error tracking setup placeholder');
        }
    });
    Object.defineProperty(AnalyticsManager.prototype, "setupEventListeners", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log('Event listeners setup placeholder');
        }
    });
    return AnalyticsManager;
}());
// Global analytics manager
exports.analyticsManager = new AnalyticsManager();
/**
 * Initialize analytics system
 */
function initAnalytics() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, environment_1.isFeatureEnabled)('analytics')) {
                        console.log('Analytics disabled via feature flag');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.analyticsManager.init()];
                case 2:
                    _a.sent();
                    console.log('Analytics system initialized');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Analytics initialization failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Track custom event
 */
function trackEvent(event, parameters) {
    exports.analyticsManager.track(event, parameters);
}
var STORAGE_KEY = "llmworks_analytics_events";
var SESSION_KEY = "llmworks_session_id";
var USER_KEY = "llmworks_user_id";
// Generate session ID
function getSessionId() {
    var sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}
// Get or generate user ID
function getUserId() {
    var userId = localStorage.getItem(USER_KEY);
    if (!userId) {
        userId = "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        localStorage.setItem(USER_KEY, userId);
    }
    return userId;
}
function save(event) {
    try {
        var enrichedEvent = __assign(__assign({}, event), { ts: Date.now(), sessionId: getSessionId(), userId: getUserId(), userAgent: navigator.userAgent });
        var existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        existing.push(enrichedEvent);
        var trimmed = existing.slice(-1000); // Keep last 1000 events
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        // Also send to console for debugging
        console.debug("[analytics]", enrichedEvent);
    }
    catch (error) {
        console.warn("Analytics save failed:", error);
    }
}
function trackPageView(path, title) {
    var evt = {
        type: "page_view",
        path: path,
        title: title || document.title,
        referrer: document.referrer
    };
    save(evt);
}
function trackLegacyEvent(name, payload) {
    var evt = { type: "event", name: name, payload: payload };
    save(evt);
}
function trackError(error, context) {
    var evt = {
        type: "error",
        name: "error_occurred",
        payload: {
            message: error.message,
            stack: error.stack,
            context: context,
            url: window.location.href,
        }
    };
    save(evt);
}
function trackPerformance(name, duration, additionalData) {
    var evt = {
        type: "performance",
        name: name,
        payload: __assign(__assign({ duration: duration }, additionalData), { url: window.location.href })
    };
    save(evt);
}
function getAnalyticsData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }
    catch (_a) {
        return [];
    }
}
function clearAnalyticsData() {
    localStorage.removeItem(STORAGE_KEY);
}
// Track page load performance
function trackPageLoad() {
    if (performance.getEntriesByType) {
        var perfEntries = performance.getEntriesByType("navigation");
        if (perfEntries.length > 0) {
            var entry = perfEntries[0];
            trackPerformance("page_load", entry.loadEventEnd - entry.fetchStart, {
                domContentLoaded: entry.domContentLoadedEventEnd - entry.fetchStart,
                firstPaint: entry.responseEnd - entry.fetchStart,
            });
        }
    }
}
