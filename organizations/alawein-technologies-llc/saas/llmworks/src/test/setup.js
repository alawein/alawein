"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
// Extend Jest matchers with custom accessibility matchers
require("jest-axe/extend-expect");
// Clean up after each test
(0, vitest_1.afterEach)(function () {
    (0, react_1.cleanup)();
});
// Mock implementations for browser APIs
(0, vitest_1.beforeAll)(function () {
    // Mock IntersectionObserver
    global.IntersectionObserver = vitest_1.vi.fn(function () { return ({
        observe: vitest_1.vi.fn(),
        unobserve: vitest_1.vi.fn(),
        disconnect: vitest_1.vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: vitest_1.vi.fn(),
    }); });
    // Mock ResizeObserver
    global.ResizeObserver = vitest_1.vi.fn(function () { return ({
        observe: vitest_1.vi.fn(),
        unobserve: vitest_1.vi.fn(),
        disconnect: vitest_1.vi.fn(),
    }); });
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vitest_1.vi.fn().mockImplementation(function (query) { return ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vitest_1.vi.fn(), // deprecated
            removeListener: vitest_1.vi.fn(), // deprecated
            addEventListener: vitest_1.vi.fn(),
            removeEventListener: vitest_1.vi.fn(),
            dispatchEvent: vitest_1.vi.fn(),
        }); }),
    });
    // Mock localStorage
    var localStorageMock = (function () {
        var store = {};
        return {
            getItem: vitest_1.vi.fn(function (key) { return store[key] || null; }),
            setItem: vitest_1.vi.fn(function (key, value) {
                store[key] = value.toString();
            }),
            removeItem: vitest_1.vi.fn(function (key) {
                delete store[key];
            }),
            clear: vitest_1.vi.fn(function () {
                store = {};
            }),
            length: Object.keys(store).length,
            key: vitest_1.vi.fn(function (index) { return Object.keys(store)[index] || null; }),
        };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    // Mock sessionStorage
    var sessionStorageMock = (function () {
        var store = {};
        return {
            getItem: vitest_1.vi.fn(function (key) { return store[key] || null; }),
            setItem: vitest_1.vi.fn(function (key, value) {
                store[key] = value.toString();
            }),
            removeItem: vitest_1.vi.fn(function (key) {
                delete store[key];
            }),
            clear: vitest_1.vi.fn(function () {
                store = {};
            }),
            length: Object.keys(store).length,
            key: vitest_1.vi.fn(function (index) { return Object.keys(store)[index] || null; }),
        };
    })();
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    // Mock Web APIs for accessibility testing
    Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: {
            speak: vitest_1.vi.fn(),
            cancel: vitest_1.vi.fn(),
            pause: vitest_1.vi.fn(),
            resume: vitest_1.vi.fn(),
            getVoices: vitest_1.vi.fn(function () { return []; }),
        },
    });
    // Mock fetch for API calls
    global.fetch = vitest_1.vi.fn();
    // Mock console methods to reduce noise in tests
    var originalError = console.error;
    (0, vitest_1.beforeAll)(function () {
        console.error = vitest_1.vi.fn(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Only suppress React warnings, show actual errors
            if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
                return;
            }
            originalError.apply(void 0, args);
        });
    });
    // Mock performance APIs for performance testing
    Object.defineProperty(window, 'performance', {
        value: {
            mark: vitest_1.vi.fn(),
            measure: vitest_1.vi.fn(),
            getEntriesByName: vitest_1.vi.fn(function () { return []; }),
            getEntriesByType: vitest_1.vi.fn(function () { return []; }),
            now: vitest_1.vi.fn(function () { return Date.now(); }),
            navigation: {
                type: 0,
            },
            timing: {
                navigationStart: Date.now(),
                loadEventEnd: Date.now() + 1000,
            },
        },
    });
    // Mock requestAnimationFrame
    global.requestAnimationFrame = vitest_1.vi.fn(function (cb) { return setTimeout(cb, 16); });
    global.cancelAnimationFrame = vitest_1.vi.fn(function (id) { return clearTimeout(id); });
    // Mock HTMLElement methods for accessibility
    HTMLElement.prototype.focus = vitest_1.vi.fn();
    HTMLElement.prototype.blur = vitest_1.vi.fn();
    HTMLElement.prototype.click = vitest_1.vi.fn();
    // Mock scrollIntoView
    HTMLElement.prototype.scrollIntoView = vitest_1.vi.fn();
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vitest_1.vi.fn(function () { return Promise.resolve(); }),
            readText: vitest_1.vi.fn(function () { return Promise.resolve(''); }),
        },
    });
    // Mock getUserMedia for any media-related tests
    Object.defineProperty(navigator, 'mediaDevices', {
        value: {
            getUserMedia: vitest_1.vi.fn(function () { return Promise.resolve({
                getTracks: function () { return []; },
            }); }),
        },
    });
});
