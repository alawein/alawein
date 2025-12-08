"use strict";
/**
 * Service Worker registration and management
 * Provides offline functionality and performance caching
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
exports.addConnectionListener = exports.isOffline = exports.getSwStatus = exports.skipWaiting = exports.updateSW = exports.unregisterSW = exports.registerSW = exports.isSwSupported = void 0;
// Check if service worker is supported
var isSwSupported = function () {
    return 'serviceWorker' in navigator;
};
exports.isSwSupported = isSwSupported;
// Register service worker
var registerSW = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (config) {
        var registration_1, error_1, swError;
        var _a;
        if (config === void 0) { config = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(0, exports.isSwSupported)()) {
                        console.log('[SW] Service Workers not supported');
                        return [2 /*return*/, null];
                    }
                    // Don't register in development
                    if (import.meta.env.DEV) {
                        console.log('[SW] Skipping registration in development');
                        return [2 /*return*/, null];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.serviceWorker.register('/sw.js', {
                            scope: '/',
                        })];
                case 2:
                    registration_1 = _b.sent();
                    console.log('[SW] Registration successful:', registration_1.scope);
                    // Handle updates
                    registration_1.addEventListener('updatefound', function () {
                        var newWorker = registration_1.installing;
                        if (!newWorker)
                            return;
                        newWorker.addEventListener('statechange', function () {
                            var _a, _b;
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content is available
                                    console.log('[SW] New content available');
                                    (_a = config.onUpdate) === null || _a === void 0 ? void 0 : _a.call(config, registration_1);
                                }
                                else {
                                    // Content is cached for offline use
                                    console.log('[SW] Content cached for offline use');
                                    (_b = config.onSuccess) === null || _b === void 0 ? void 0 : _b.call(config, registration_1);
                                }
                            }
                        });
                    });
                    // Listen for the service worker to take control
                    navigator.serviceWorker.addEventListener('controllerchange', function () {
                        console.log('[SW] New service worker took control');
                        window.location.reload();
                    });
                    return [2 /*return*/, registration_1];
                case 3:
                    error_1 = _b.sent();
                    swError = error_1;
                    console.error('[SW] Registration failed:', swError);
                    (_a = config.onError) === null || _a === void 0 ? void 0 : _a.call(config, swError);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.registerSW = registerSW;
// Unregister service worker
var unregisterSW = function () { return __awaiter(void 0, void 0, void 0, function () {
    var registration, unregistered, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, exports.isSwSupported)()) {
                    return [2 /*return*/, false];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, navigator.serviceWorker.getRegistration()];
            case 2:
                registration = _a.sent();
                if (!registration) return [3 /*break*/, 4];
                return [4 /*yield*/, registration.unregister()];
            case 3:
                unregistered = _a.sent();
                console.log('[SW] Unregistered:', unregistered);
                return [2 /*return*/, unregistered];
            case 4: return [2 /*return*/, true];
            case 5:
                error_2 = _a.sent();
                console.error('[SW] Unregistration failed:', error_2);
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.unregisterSW = unregisterSW;
// Update service worker
var updateSW = function () { return __awaiter(void 0, void 0, void 0, function () {
    var registration, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, exports.isSwSupported)()) {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, navigator.serviceWorker.getRegistration()];
            case 2:
                registration = _a.sent();
                if (!registration) return [3 /*break*/, 4];
                return [4 /*yield*/, registration.update()];
            case 3:
                _a.sent();
                console.log('[SW] Update check completed');
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('[SW] Update failed:', error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateSW = updateSW;
// Skip waiting for new service worker
var skipWaiting = function () { return __awaiter(void 0, void 0, void 0, function () {
    var registration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, exports.isSwSupported)()) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, navigator.serviceWorker.getRegistration()];
            case 1:
                registration = _a.sent();
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.skipWaiting = skipWaiting;
// Get service worker status
var getSwStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var registration, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(0, exports.isSwSupported)()) {
                    return [2 /*return*/, { supported: false, registered: false, active: false, waiting: false }];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, navigator.serviceWorker.getRegistration()];
            case 2:
                registration = _b.sent();
                return [2 /*return*/, {
                        supported: true,
                        registered: !!registration,
                        active: !!(registration === null || registration === void 0 ? void 0 : registration.active),
                        waiting: !!(registration === null || registration === void 0 ? void 0 : registration.waiting),
                    }];
            case 3:
                _a = _b.sent();
                return [2 /*return*/, { supported: true, registered: false, active: false, waiting: false }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSwStatus = getSwStatus;
// Check if app is running offline
var isOffline = function () {
    return !navigator.onLine;
};
exports.isOffline = isOffline;
// Listen for online/offline events
var addConnectionListener = function (onOnline, onOffline) {
    var handleOnline = function () { return onOnline(); };
    var handleOffline = function () { return onOffline(); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Return cleanup function
    return function () {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};
exports.addConnectionListener = addConnectionListener;
