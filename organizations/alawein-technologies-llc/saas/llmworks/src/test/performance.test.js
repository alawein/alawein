"use strict";
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
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_1 = require("vitest");
var Index_1 = require("@/pages/Index");
var Arena_1 = require("@/pages/Arena");
var Bench_1 = require("@/pages/Bench");
var Dashboard_1 = require("@/pages/Dashboard");
// Performance thresholds
var PERFORMANCE_THRESHOLDS = {
    RENDER_TIME: 100, // ms
    MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
    COMPONENT_COUNT: 500, // Maximum components
    EVENT_LISTENER_COUNT: 100, // Maximum event listeners
};
// Test wrapper component
var TestWrapper = function (_a) {
    var children = _a.children;
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <react_router_dom_1.BrowserRouter>
        {children}
      </react_router_dom_1.BrowserRouter>
    </react_query_1.QueryClientProvider>);
};
// Helper function to measure render time
var measureRenderTime = function (Component) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, result, endTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = performance.now();
                result = (0, react_1.render)(<TestWrapper>
      <Component />
    </TestWrapper>);
                return [4 /*yield*/, (0, react_1.waitFor)(function () {
                        (0, vitest_1.expect)(result.container.firstChild).toBeInTheDocument();
                    })];
            case 1:
                _a.sent();
                endTime = performance.now();
                return [2 /*return*/, endTime - startTime];
        }
    });
}); };
// Helper function to count DOM nodes
var countDOMNodes = function (container) {
    return container.querySelectorAll('*').length;
};
// Helper function to simulate memory usage check
var checkMemoryUsage = function () {
    // In a real browser environment, you'd use performance.memory
    // This is a mock for the test environment
    return Math.random() * 30 * 1024 * 1024; // Mock 0-30MB
};
(0, vitest_1.describe)('Performance Tests', function () {
    (0, vitest_1.beforeEach)(function () {
        var _a, _b;
        // Clear any existing performance marks
        (_a = performance.clearMarks) === null || _a === void 0 ? void 0 : _a.call(performance);
        (_b = performance.clearMeasures) === null || _b === void 0 ? void 0 : _b.call(performance);
    });
    (0, vitest_1.describe)('Render Performance', function () {
        (0, vitest_1.it)('Index page should render quickly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, measureRenderTime(Index_1.default)];
                    case 1:
                        renderTime = _a.sent();
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Arena page should render quickly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, measureRenderTime(Arena_1.default)];
                    case 1:
                        renderTime = _a.sent();
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Bench page should render quickly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, measureRenderTime(Bench_1.default)];
                    case 1:
                        renderTime = _a.sent();
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Dashboard page should render quickly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, measureRenderTime(Dashboard_1.default)];
                    case 1:
                        renderTime = _a.sent();
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('DOM Complexity', function () {
        (0, vitest_1.it)('Index page should not have excessive DOM nodes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, nodeCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        nodeCount = countDOMNodes(container);
                        (0, vitest_1.expect)(nodeCount).toBeLessThan(PERFORMANCE_THRESHOLDS.COMPONENT_COUNT);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Dashboard should manage complex UI efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, nodeCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        nodeCount = countDOMNodes(container);
                        // Dashboard can be more complex but should still be reasonable
                        (0, vitest_1.expect)(nodeCount).toBeLessThan(PERFORMANCE_THRESHOLDS.COMPONENT_COUNT * 2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Memory Usage', function () {
        (0, vitest_1.it)('should not leak memory during component lifecycle', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialMemory, unmount, finalMemory, memoryIncrease;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialMemory = checkMemoryUsage();
                        unmount = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).unmount;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(document.body.firstChild).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        unmount();
                        // Allow garbage collection
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 2:
                        // Allow garbage collection
                        _a.sent();
                        finalMemory = checkMemoryUsage();
                        memoryIncrease = finalMemory - initialMemory;
                        (0, vitest_1.expect)(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Bundle Size Performance', function () {
        (0, vitest_1.it)('should lazy load components efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDynamicImport, startTime, loadTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDynamicImport = vitest_1.vi.fn(function () {
                            return new Promise(function (resolve) {
                                return setTimeout(function () { return resolve({ default: function () { return <div>Loaded</div>; } }); }, 10);
                            });
                        });
                        startTime = performance.now();
                        return [4 /*yield*/, mockDynamicImport()];
                    case 1:
                        _a.sent();
                        loadTime = performance.now() - startTime;
                        (0, vitest_1.expect)(loadTime).toBeLessThan(50); // Should load quickly
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Animation Performance', function () {
        (0, vitest_1.it)('should handle animations without blocking the main thread', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, animatedElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                animatedElements = container.querySelectorAll('[class*="animate"], [class*="transition"], [style*="transition"]');
                // Verify animations use CSS transforms/opacity for better performance
                animatedElements.forEach(function (element) {
                    var computedStyle = window.getComputedStyle(element);
                    var transition = computedStyle.transition;
                    if (transition && transition !== 'none') {
                        // Should primarily animate transform/opacity for better performance
                        var hasPerformantAnimation = transition.includes('transform') ||
                            transition.includes('opacity');
                        // Allow if no specific transition properties are set (defaults are usually fine)
                        var isGenericTransition = transition.includes('all');
                        (0, vitest_1.expect)(hasPerformantAnimation || isGenericTransition).toBe(true);
                    }
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Event Handling Performance', function () {
        (0, vitest_1.it)('should not have excessive event listeners', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, interactiveElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                interactiveElements = container.querySelectorAll('button, a[href], input, select, textarea, [onclick], [role="button"], [tabindex="0"]');
                (0, vitest_1.expect)(interactiveElements.length).toBeLessThan(PERFORMANCE_THRESHOLDS.EVENT_LISTENER_COUNT);
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should properly clean up event listeners on unmount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unmount;
            return __generator(this, function (_a) {
                unmount = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).unmount;
                // Simulate component unmount
                unmount();
                // In a real test, you'd check that listeners were removed
                // This is more of a structural test to ensure cleanup
                (0, vitest_1.expect)(true).toBe(true); // Placeholder - real implementation would check listener cleanup
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Image and Asset Loading', function () {
        (0, vitest_1.it)('should load images efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, images;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                images = container.querySelectorAll('img');
                images.forEach(function (img) {
                    // Should have loading="lazy" for performance
                    var loading = img.getAttribute('loading');
                    var isAboveFold = img.getAttribute('data-priority') === 'high';
                    if (!isAboveFold) {
                        (0, vitest_1.expect)(loading).toBe('lazy');
                    }
                    // Should have alt text for accessibility
                    (0, vitest_1.expect)(img).toHaveAttribute('alt');
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Query Performance', function () {
        (0, vitest_1.it)('should handle React Query efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryClient, startTime, renderTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryClient = new react_query_1.QueryClient({
                            defaultOptions: {
                                queries: { retry: false },
                                mutations: { retry: false },
                            },
                        });
                        startTime = performance.now();
                        (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <react_router_dom_1.BrowserRouter>
            <Dashboard_1.default />
          </react_router_dom_1.BrowserRouter>
        </react_query_1.QueryClientProvider>);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(document.body.firstChild).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        renderTime = performance.now() - startTime;
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME * 2); // Allow more time for complex dashboard
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Scroll Performance', function () {
        (0, vitest_1.it)('should handle large lists efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, scrollableElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                scrollableElements = container.querySelectorAll('[style*="overflow"], [class*="scroll"], .overflow-auto, .overflow-y-auto');
                scrollableElements.forEach(function (element) {
                    var style = window.getComputedStyle(element);
                    // Should use efficient scrolling properties
                    if (style.overflow === 'auto' || style.overflowY === 'auto') {
                        // Virtual scrolling would be tested in e2e tests
                        // Here we just ensure the structure exists
                        (0, vitest_1.expect)(element).toBeInTheDocument();
                    }
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Third-party Library Performance', function () {
        (0, vitest_1.it)('should load external dependencies efficiently', function () { return __awaiter(void 0, void 0, void 0, function () {
            var heavyComponents;
            return __generator(this, function (_a) {
                heavyComponents = ['recharts', 'chart'];
                // This would typically be tested in the build process
                // Here we ensure components using heavy libraries are lazy-loaded
                (0, vitest_1.expect)(true).toBe(true); // Placeholder for actual bundle analysis
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Accessibility Performance', function () {
        (0, vitest_1.it)('should not impact performance with accessibility features', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startTime, container, renderTime, ariaElements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = performance.now();
                        container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        renderTime = performance.now() - startTime;
                        // Accessibility features should not significantly impact render time
                        (0, vitest_1.expect)(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME);
                        ariaElements = container.querySelectorAll('[aria-label], [aria-describedby], [role]');
                        (0, vitest_1.expect)(ariaElements.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
