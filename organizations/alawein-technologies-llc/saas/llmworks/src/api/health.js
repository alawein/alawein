"use strict";
/**
 * Health check endpoint for production monitoring
 */
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
exports.ping = exports.getHealthStatus = void 0;
/**
 * Health check function that can be called by monitoring services
 */
var getHealthStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var healthCheck, monitoringData, error_1, checks, allChecksPass, status_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                healthCheck = window.__health_check;
                monitoringData = null;
                if (!healthCheck) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, healthCheck()];
            case 2:
                monitoringData = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.warn('Failed to get monitoring data:', error_1);
                return [3 /*break*/, 4];
            case 4:
                checks = {
                    database: true, // Would check Supabase connection in real implementation
                    storage: !!window.localStorage,
                    network: navigator.onLine,
                    performance: performance.now() > 0,
                };
                allChecksPass = Object.values(checks).every(function (check) { return check; });
                status_1 = {
                    status: allChecksPass ? 'healthy' : 'degraded',
                    timestamp: Date.now(),
                    version: '1.0.0',
                    uptime: performance.now(),
                    checks: checks,
                    metrics: {
                        errors: (monitoringData === null || monitoringData === void 0 ? void 0 : monitoringData.errors) || 0,
                        performance: (monitoringData === null || monitoringData === void 0 ? void 0 : monitoringData.performance) || {
                            summary: {},
                            coreWebVitals: {},
                        },
                        user: (monitoringData === null || monitoringData === void 0 ? void 0 : monitoringData.user) || {
                            sessionDuration: 0,
                            interactions: 0,
                        },
                    },
                };
                return [2 /*return*/, status_1];
            case 5:
                error_2 = _a.sent();
                console.error('Health check failed:', error_2);
                return [2 /*return*/, {
                        status: 'unhealthy',
                        timestamp: Date.now(),
                        version: '1.0.0',
                        uptime: performance.now(),
                        checks: {
                            database: false,
                            storage: false,
                            network: false,
                            performance: false,
                        },
                        metrics: {
                            errors: 1,
                            performance: {
                                summary: {},
                                coreWebVitals: {},
                            },
                            user: {
                                sessionDuration: 0,
                                interactions: 0,
                            },
                        },
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getHealthStatus = getHealthStatus;
/**
 * Simple ping endpoint for basic availability checks
 */
var ping = function () {
    return Promise.resolve({
        status: 'ok',
        timestamp: Date.now(),
    });
};
exports.ping = ping;
/**
 * Expose health endpoints globally for monitoring services
 */
if (typeof window !== 'undefined') {
    window.__llm_works_health = {
        getHealthStatus: exports.getHealthStatus,
        ping: exports.ping,
    };
}
