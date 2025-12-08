"use strict";
/**
 * Rate limiting middleware for API protection
 * Implements token bucket algorithm with sliding window
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
exports.clientRateLimiter = exports.RateLimiter = exports.RateLimitPresets = void 0;
exports.createRateLimiter = createRateLimiter;
exports.rateLimit = rateLimit;
exports.initRateLimiting = initRateLimiting;
var environment_1 = require("./environment");
// Default rate limit configurations
exports.RateLimitPresets = {
    // Strict: 10 requests per minute
    strict: {
        windowMs: 60 * 1000,
        maxRequests: 10,
        headers: true,
    },
    // Normal: 60 requests per minute
    normal: {
        windowMs: 60 * 1000,
        maxRequests: 60,
        headers: true,
    },
    // Relaxed: 100 requests per minute
    relaxed: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        headers: true,
    },
    // API endpoints
    api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        headers: true,
    },
    // Authentication endpoints
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: 'Too many authentication attempts, please try again later',
        headers: true,
    },
    // Search endpoints
    search: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 30,
        headers: true,
    },
    // Heavy computation endpoints
    compute: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5,
        message: 'Rate limit exceeded for compute-intensive operations',
        headers: true,
    },
};
/**
 * Token bucket implementation
 */
var TokenBucket = /** @class */ (function () {
    function TokenBucket(capacity, refillRate) {
        Object.defineProperty(this, "tokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastRefill", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "capacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "refillRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = capacity;
        this.lastRefill = Date.now();
    }
    /**
     * Try to consume tokens from the bucket
     */
    Object.defineProperty(TokenBucket.prototype, "tryConsume", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (count) {
            if (count === void 0) { count = 1; }
            this.refill();
            if (this.tokens >= count) {
                this.tokens -= count;
                return true;
            }
            return false;
        }
    });
    /**
     * Get current token count
     */
    Object.defineProperty(TokenBucket.prototype, "getTokens", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.refill();
            return this.tokens;
        }
    });
    /**
     * Get time until next token is available
     */
    Object.defineProperty(TokenBucket.prototype, "getRetryAfter", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.tokens > 0)
                return 0;
            var msPerToken = 1000 / this.refillRate;
            return Math.ceil(msPerToken);
        }
    });
    /**
     * Refill tokens based on elapsed time
     */
    Object.defineProperty(TokenBucket.prototype, "refill", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var now = Date.now();
            var elapsed = now - this.lastRefill;
            var tokensToAdd = (elapsed / 1000) * this.refillRate;
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
            this.lastRefill = now;
        }
    });
    return TokenBucket;
}());
/**
 * Sliding window rate limiter
 */
var SlidingWindowLimiter = /** @class */ (function () {
    function SlidingWindowLimiter(windowMs, maxRequests) {
        var _this = this;
        Object.defineProperty(this, "requests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "windowMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxRequests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
        // Clean up old entries periodically
        setInterval(function () { return _this.cleanup(); }, windowMs);
    }
    /**
     * Check if request is allowed
     */
    Object.defineProperty(SlidingWindowLimiter.prototype, "isAllowed", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (key) {
            var now = Date.now();
            var windowStart = now - this.windowMs;
            // Get or create request history for this key
            var timestamps = this.requests.get(key) || [];
            // Remove old timestamps outside the window
            timestamps = timestamps.filter(function (ts) { return ts > windowStart; });
            // Check if limit exceeded
            if (timestamps.length >= this.maxRequests) {
                this.requests.set(key, timestamps);
                return false;
            }
            // Add current timestamp and allow request
            timestamps.push(now);
            this.requests.set(key, timestamps);
            return true;
        }
    });
    /**
     * Get rate limit info for a key
     */
    Object.defineProperty(SlidingWindowLimiter.prototype, "getInfo", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (key) {
            var now = Date.now();
            var windowStart = now - this.windowMs;
            var timestamps = this.requests.get(key) || [];
            timestamps = timestamps.filter(function (ts) { return ts > windowStart; });
            var used = timestamps.length;
            var remaining = Math.max(0, this.maxRequests - used);
            // Calculate reset time (end of current window)
            var oldestTimestamp = timestamps[0] || now;
            var reset = new Date(oldestTimestamp + this.windowMs);
            // Calculate retry after if limit exceeded
            var retryAfter;
            if (remaining === 0 && timestamps.length > 0) {
                retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);
            }
            return {
                limit: this.maxRequests,
                remaining: remaining,
                reset: reset,
                retryAfter: retryAfter,
            };
        }
    });
    /**
     * Clean up old entries
     */
    Object.defineProperty(SlidingWindowLimiter.prototype, "cleanup", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var now = Date.now();
            var windowStart = now - this.windowMs;
            for (var _i = 0, _a = this.requests.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], timestamps = _b[1];
                var filtered = timestamps.filter(function (ts) { return ts > windowStart; });
                if (filtered.length === 0) {
                    this.requests.delete(key);
                }
                else {
                    this.requests.set(key, filtered);
                }
            }
        }
    });
    return SlidingWindowLimiter;
}());
/**
 * Main rate limiter class
 */
var RateLimiter = /** @class */ (function () {
    function RateLimiter(config) {
        Object.defineProperty(this, "limiter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
        this.limiter = new SlidingWindowLimiter(config.windowMs, config.maxRequests);
    }
    /**
     * Check if request should be rate limited
     */
    Object.defineProperty(RateLimiter.prototype, "checkLimit", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var key, allowed, info;
                return __generator(this, function (_a) {
                    key = this.generateKey(context);
                    allowed = this.limiter.isAllowed(key);
                    info = this.limiter.getInfo(key);
                    return [2 /*return*/, { allowed: allowed, info: info }];
                });
            });
        }
    });
    /**
     * Express/Connect middleware
     */
    Object.defineProperty(RateLimiter.prototype, "middleware", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var _a, allowed, info, message;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.checkLimit(req)];
                        case 1:
                            _a = _b.sent(), allowed = _a.allowed, info = _a.info;
                            // Add rate limit headers if configured
                            if (this.config.headers) {
                                this.setHeaders(res, info);
                            }
                            if (!allowed) {
                                message = this.config.message || 'Too many requests, please try again later';
                                res.status(429).json({
                                    error: message,
                                    retryAfter: info.retryAfter,
                                });
                                return [2 /*return*/];
                            }
                            next();
                            return [2 /*return*/];
                    }
                });
            }); };
        }
    });
    /**
     * Generate unique key for rate limiting
     */
    Object.defineProperty(RateLimiter.prototype, "generateKey", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            var _a, _b, _c, _d;
            if (this.config.keyGenerator) {
                return this.config.keyGenerator(context);
            }
            // Default key generation based on IP address
            if (typeof context === 'object' && context !== null) {
                var req = context;
                // Try to get IP from various headers
                var ip = req.ip ||
                    ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-forwarded-for']) === null || _b === void 0 ? void 0 : _b.split(',')[0]) ||
                    ((_c = req.headers) === null || _c === void 0 ? void 0 : _c['x-real-ip']) ||
                    ((_d = req.connection) === null || _d === void 0 ? void 0 : _d.remoteAddress) ||
                    'unknown';
                return "rate-limit:".concat(ip);
            }
            return 'rate-limit:global';
        }
    });
    /**
     * Set rate limit headers on response
     */
    Object.defineProperty(RateLimiter.prototype, "setHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (res, info) {
            if (this.config.draft_polli_ratelimit_headers) {
                // Draft RFC headers
                res.setHeader('RateLimit-Limit', info.limit);
                res.setHeader('RateLimit-Remaining', info.remaining);
                res.setHeader('RateLimit-Reset', info.reset.toISOString());
            }
            else {
                // Standard headers
                res.setHeader('X-RateLimit-Limit', info.limit);
                res.setHeader('X-RateLimit-Remaining', info.remaining);
                res.setHeader('X-RateLimit-Reset', Math.floor(info.reset.getTime() / 1000));
            }
            if (info.retryAfter !== undefined) {
                res.setHeader('Retry-After', info.retryAfter);
            }
        }
    });
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
/**
 * Create rate limiter with preset configuration
 */
function createRateLimiter(preset, overrides) {
    var config = __assign(__assign({}, exports.RateLimitPresets[preset]), overrides);
    return new RateLimiter(config);
}
/**
 * Global rate limiter for client-side API calls
 */
var ClientRateLimiter = /** @class */ (function () {
    function ClientRateLimiter() {
        Object.defineProperty(this, "limiters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Check if API call is allowed
     */
    Object.defineProperty(ClientRateLimiter.prototype, "checkApiCall", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint_1) {
            return __awaiter(this, arguments, void 0, function (endpoint, weight) {
                var config, limiter, capacity, refillRate;
                if (weight === void 0) { weight = 1; }
                return __generator(this, function (_a) {
                    config = (0, environment_1.getConfig)();
                    if (!config.security.rateLimiting) {
                        return [2 /*return*/, true];
                    }
                    limiter = this.limiters.get(endpoint);
                    if (!limiter) {
                        capacity = this.getCapacityForEndpoint(endpoint);
                        refillRate = capacity / 60;
                        limiter = new TokenBucket(capacity, refillRate);
                        this.limiters.set(endpoint, limiter);
                    }
                    return [2 /*return*/, limiter.tryConsume(weight)];
                });
            });
        }
    });
    /**
     * Get retry after time for an endpoint
     */
    Object.defineProperty(ClientRateLimiter.prototype, "getRetryAfter", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint) {
            var limiter = this.limiters.get(endpoint);
            return limiter ? limiter.getRetryAfter() : 0;
        }
    });
    /**
     * Get capacity based on endpoint type
     */
    Object.defineProperty(ClientRateLimiter.prototype, "getCapacityForEndpoint", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint) {
            if (endpoint.includes('/auth'))
                return 5;
            if (endpoint.includes('/compute'))
                return 10;
            if (endpoint.includes('/search'))
                return 30;
            return 60; // Default
        }
    });
    return ClientRateLimiter;
}());
// Global client rate limiter instance
exports.clientRateLimiter = new ClientRateLimiter();
/**
 * Decorator for rate limiting async functions
 */
function rateLimit(windowMs, maxCalls) {
    if (windowMs === void 0) { windowMs = 60000; }
    if (maxCalls === void 0) { maxCalls = 10; }
    var limiters = new Map();
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var key, limiter, info;
                return __generator(this, function (_a) {
                    key = "".concat(target.constructor.name, ".").concat(propertyKey);
                    limiter = limiters.get(key);
                    if (!limiter) {
                        limiter = new SlidingWindowLimiter(windowMs, maxCalls);
                        limiters.set(key, limiter);
                    }
                    if (!limiter.isAllowed(key)) {
                        info = limiter.getInfo(key);
                        throw new Error("Rate limit exceeded for ".concat(key, ". Retry after ").concat(info.retryAfter, " seconds"));
                    }
                    return [2 /*return*/, originalMethod.apply(this, args)];
                });
            });
        };
        return descriptor;
    };
}
/**
 * Initialize rate limiting system
 */
function initRateLimiting() {
    var config = (0, environment_1.getConfig)();
    if (config.security.rateLimiting) {
        console.log('Rate limiting enabled');
        // Set up global rate limiter for debugging
        if (config.features.debugMode && typeof window !== 'undefined') {
            window.__llm_works_rate_limiter = {
                checkApiCall: function (endpoint) { return exports.clientRateLimiter.checkApiCall(endpoint); },
                getRetryAfter: function (endpoint) { return exports.clientRateLimiter.getRetryAfter(endpoint); },
            };
        }
    }
}
