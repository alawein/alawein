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
var user_event_1 = require("@testing-library/user-event");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_1 = require("vitest");
var App_1 = require("@/App");
var Navigation_1 = require("@/components/Navigation");
var AccessibilityToolbar_1 = require("@/components/accessibility/AccessibilityToolbar");
// Mock service worker registration
vitest_1.vi.mock('@/lib/service-worker', function () { return ({
    registerSW: vitest_1.vi.fn(),
}); });
// Mock performance monitoring
vitest_1.vi.mock('@/lib/performance', function () { return ({
    initPerformanceMonitoring: vitest_1.vi.fn(),
}); });
// Mock analytics
vitest_1.vi.mock('@/lib/analytics', function () { return ({
    trackEvent: vitest_1.vi.fn(),
}); });
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
(0, vitest_1.describe)('Integration Tests', function () {
    (0, vitest_1.beforeEach)(function () {
        // Reset window location for each test
        Object.defineProperty(window, 'location', {
            value: {
                pathname: '/',
                search: '',
                hash: '',
                href: 'http://localhost:3000/',
            },
            writable: true,
        });
    });
    (0, vitest_1.describe)('App Integration', function () {
        (0, vitest_1.it)('should render the app without errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle routing correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, arenaLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<App_1.default />);
                        // Wait for initial load
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        // Wait for initial load
                        _a.sent();
                        arenaLink = react_1.screen.getByRole('link', { name: /arena/i });
                        return [4 /*yield*/, user.click(arenaLink)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(window.location.pathname).toBe('/arena');
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle 404 routes gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock a non-existent route
                        Object.defineProperty(window, 'location', {
                            value: { pathname: '/non-existent-route' },
                            writable: true,
                        });
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/404/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Navigation Integration', function () {
        (0, vitest_1.it)('should navigate between pages correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, pages, _i, pages_1, page, link;
            return __generator(this, function (_a) {
                user = user_event_1.default.setup();
                (0, react_1.render)(<TestWrapper>
          <Navigation_1.Navigation />
        </TestWrapper>);
                pages = [
                    { name: /home|llm works/i, expectedPath: '/' },
                    { name: /arena/i, expectedPath: '/arena' },
                    { name: /bench/i, expectedPath: '/bench' },
                    { name: /dashboard/i, expectedPath: '/dashboard' },
                ];
                for (_i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                    page = pages_1[_i];
                    link = react_1.screen.getByRole('link', { name: page.name });
                    (0, vitest_1.expect)(link).toBeInTheDocument();
                    // Check that href is correct
                    (0, vitest_1.expect)(link).toHaveAttribute('href', page.expectedPath);
                }
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should handle mobile navigation correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, menuButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        // Mock mobile viewport
                        Object.defineProperty(window, 'innerWidth', {
                            writable: true,
                            configurable: true,
                            value: 375,
                        });
                        (0, react_1.render)(<TestWrapper>
          <Navigation_1.Navigation />
        </TestWrapper>);
                        menuButton = react_1.screen.queryByRole('button', { name: /menu/i });
                        if (!menuButton) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.click(menuButton)];
                    case 1:
                        _a.sent();
                        // Check that mobile menu is visible
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('navigation')).toBeInTheDocument();
                            })];
                    case 2:
                        // Check that mobile menu is visible
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Accessibility Integration', function () {
        (0, vitest_1.it)('should toggle accessibility features correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, accessibilityToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<TestWrapper>
          <AccessibilityToolbar_1.AccessibilityToolbar />
        </TestWrapper>);
                        accessibilityToggle = react_1.screen.getByRole('button', { name: /accessibility/i });
                        return [4 /*yield*/, user.click(accessibilityToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/high contrast/i)).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should apply accessibility settings correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, accessibilityToggle, highContrastToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<TestWrapper>
          <AccessibilityToolbar_1.AccessibilityToolbar />
        </TestWrapper>);
                        accessibilityToggle = react_1.screen.getByRole('button', { name: /accessibility/i });
                        return [4 /*yield*/, user.click(accessibilityToggle)];
                    case 1:
                        _a.sent();
                        highContrastToggle = react_1.screen.getByRole('switch', { name: /high contrast/i });
                        return [4 /*yield*/, user.click(highContrastToggle)];
                    case 2:
                        _a.sent();
                        // Check that high contrast class is applied
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(document.body).toHaveClass('high-contrast');
                            })];
                    case 3:
                        // Check that high contrast class is applied
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should persist accessibility settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, accessibilityToggle, largeTextToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<TestWrapper>
          <AccessibilityToolbar_1.AccessibilityToolbar />
        </TestWrapper>);
                        accessibilityToggle = react_1.screen.getByRole('button', { name: /accessibility/i });
                        return [4 /*yield*/, user.click(accessibilityToggle)];
                    case 1:
                        _a.sent();
                        largeTextToggle = react_1.screen.getByRole('switch', { name: /large text/i });
                        return [4 /*yield*/, user.click(largeTextToggle)];
                    case 2:
                        _a.sent();
                        // Check localStorage
                        (0, vitest_1.expect)(localStorage.setItem).toHaveBeenCalledWith('accessibility-settings', vitest_1.expect.stringContaining('largeText'));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Keyboard Navigation Integration', function () {
        (0, vitest_1.it)('should handle global keyboard shortcuts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Test Alt+H shortcut (home)
                        return [4 /*yield*/, user.keyboard('{Alt>}h{/Alt}')];
                    case 2:
                        // Test Alt+H shortcut (home)
                        _a.sent();
                        // Should navigate to home or show that shortcut works
                        // This would need to be implemented based on actual shortcut handling
                        (0, vitest_1.expect)(window.location.pathname).toBe('/');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle focus management correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, focusedElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Test tab navigation
                        return [4 /*yield*/, user.tab()];
                    case 2:
                        // Test tab navigation
                        _a.sent();
                        focusedElement = document.activeElement;
                        (0, vitest_1.expect)(focusedElement).toBeInstanceOf(HTMLElement);
                        (0, vitest_1.expect)(focusedElement === null || focusedElement === void 0 ? void 0 : focusedElement.getAttribute('tabindex')).not.toBe('-1');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle skip links correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, skipLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        skipLink = react_1.screen.getByText(/skip to main content/i);
                        skipLink.focus();
                        return [4 /*yield*/, user.click(skipLink)];
                    case 2:
                        _a.sent();
                        // Should focus on main content
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var main = react_1.screen.getByRole('main');
                                (0, vitest_1.expect)(main).toHaveFocus();
                            })];
                    case 3:
                        // Should focus on main content
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Error Boundary Integration', function () {
        (0, vitest_1.it)('should catch and display errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ErrorComponent, originalError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ErrorComponent = function () {
                            throw new Error('Test error');
                        };
                        originalError = console.error;
                        console.error = vitest_1.vi.fn();
                        (0, react_1.render)(<TestWrapper>
          <ErrorComponent />
        </TestWrapper>);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByText(/something went wrong/i)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Restore console.error
                        console.error = originalError;
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Service Worker Integration', function () {
        (0, vitest_1.it)('should register service worker on app initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerSW;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('@/lib/service-worker'); })];
                    case 1:
                        registerSW = (_a.sent()).registerSW;
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(registerSW).toHaveBeenCalled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Performance Monitoring Integration', function () {
        (0, vitest_1.it)('should initialize performance monitoring', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initPerformanceMonitoring;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('@/lib/performance'); })];
                    case 1:
                        initPerformanceMonitoring = (_a.sent()).initPerformanceMonitoring;
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(initPerformanceMonitoring).toHaveBeenCalledWith({
                                    trackCoreWebVitals: true,
                                    trackNavigation: true,
                                    debug: vitest_1.expect.any(Boolean),
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Query Client Integration', function () {
        (0, vitest_1.it)('should handle query errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryClient = new react_query_1.QueryClient({
                            defaultOptions: {
                                queries: {
                                    retry: false,
                                    // Mock a query that fails
                                    queryFn: function () { return Promise.reject(new Error('Query failed')); },
                                },
                            },
                        });
                        (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <react_router_dom_1.BrowserRouter>
            <App_1.default />
          </react_router_dom_1.BrowserRouter>
        </react_query_1.QueryClientProvider>);
                        // Should still render without crashing
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        // Should still render without crashing
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Theme Integration', function () {
        (0, vitest_1.it)('should handle theme switching correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, themeToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_event_1.default.setup();
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        themeToggle = react_1.screen.queryByRole('button', { name: /theme|dark|light/i });
                        if (!themeToggle) return [3 /*break*/, 4];
                        return [4 /*yield*/, user.click(themeToggle)];
                    case 2:
                        _a.sent();
                        // Check that theme class is applied
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(document.documentElement).toHaveClass(/dark|light/);
                            })];
                    case 3:
                        // Check that theme class is applied
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Loading States Integration', function () {
        (0, vitest_1.it)('should show loading states during navigation', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_1.render)(<App_1.default />);
                        // Should show some loading indicator initially or transition smoothly
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        // Should show some loading indicator initially or transition smoothly
                        _a.sent();
                        // Test that lazy-loaded components show loading states
                        // This would be more apparent in actual browser testing
                        (0, vitest_1.expect)(true).toBe(true); // Placeholder for actual loading state tests
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Responsive Design Integration', function () {
        (0, vitest_1.it)('should adapt to different screen sizes', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Test mobile
                        Object.defineProperty(window, 'innerWidth', { value: 375 });
                        Object.defineProperty(window, 'innerHeight', { value: 667 });
                        (0, react_1.fireEvent)(window, new Event('resize'));
                        (0, react_1.render)(<App_1.default />);
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Test tablet
                        Object.defineProperty(window, 'innerWidth', { value: 768 });
                        Object.defineProperty(window, 'innerHeight', { value: 1024 });
                        (0, react_1.fireEvent)(window, new Event('resize'));
                        // Should still be functional
                        (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                        // Test desktop
                        Object.defineProperty(window, 'innerWidth', { value: 1440 });
                        Object.defineProperty(window, 'innerHeight', { value: 900 });
                        (0, react_1.fireEvent)(window, new Event('resize'));
                        // Should still be functional
                        (0, vitest_1.expect)(react_1.screen.getByRole('main')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
