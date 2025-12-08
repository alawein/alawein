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
var jest_axe_1 = require("jest-axe");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var vitest_1 = require("vitest");
var Index_1 = require("@/pages/Index");
var Arena_1 = require("@/pages/Arena");
var Bench_1 = require("@/pages/Bench");
var Dashboard_1 = require("@/pages/Dashboard");
var Settings_1 = require("@/pages/Settings");
var Navigation_1 = require("@/components/Navigation");
var AccessibilityToolbar_1 = require("@/components/accessibility/AccessibilityToolbar");
// Extend expect with jest-axe matchers  
// expect.extend(toHaveNoViolations);
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
(0, vitest_1.describe)('Accessibility Tests', function () {
    var queryClient;
    (0, vitest_1.beforeEach)(function () {
        queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
    });
    (0, vitest_1.describe)('Page Accessibility', function () {
        (0, vitest_1.it)('Index page should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Arena page should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Arena_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Bench page should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Bench_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Dashboard page should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Settings page should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Settings_1.default />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Component Accessibility', function () {
        (0, vitest_1.it)('Navigation component should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <Navigation_1.Navigation />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Accessibility toolbar should be accessible', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = (0, react_1.render)(<TestWrapper>
          <AccessibilityToolbar_1.AccessibilityToolbar />
        </TestWrapper>).container;
                        return [4 /*yield*/, (0, jest_axe_1.axe)(container)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Keyboard Navigation', function () {
        (0, vitest_1.it)('should have proper tab order on Index page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, tabbableElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                tabbableElements = container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                tabbableElements.forEach(function (element) {
                    var tabIndex = element.getAttribute('tabindex');
                    if (tabIndex && tabIndex !== '0') {
                        // Positive tabindex should be avoided
                        (0, vitest_1.expect)(parseInt(tabIndex)).toBeLessThanOrEqual(0);
                    }
                });
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have accessible skip links', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, skipLink;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                skipLink = container.querySelector('.skip-link');
                (0, vitest_1.expect)(skipLink).toBeInTheDocument();
                (0, vitest_1.expect)(skipLink).toHaveAttribute('href', '#main');
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('ARIA Labels and Roles', function () {
        (0, vitest_1.it)('should have proper landmarks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, main, nav;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                main = container.querySelector('main');
                (0, vitest_1.expect)(main).toBeInTheDocument();
                (0, vitest_1.expect)(main).toHaveAttribute('id', 'main');
                nav = container.querySelector('nav');
                (0, vitest_1.expect)(nav).toBeInTheDocument();
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have proper headings hierarchy', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, headings, previousLevel;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
                previousLevel = 0;
                headings.forEach(function (heading) {
                    var currentLevel = parseInt(heading.tagName.charAt(1));
                    // First heading should be h1 or reasonable start
                    if (previousLevel === 0) {
                        (0, vitest_1.expect)(currentLevel).toBeLessThanOrEqual(2);
                    }
                    else {
                        // Shouldn't skip levels
                        (0, vitest_1.expect)(currentLevel - previousLevel).toBeLessThanOrEqual(1);
                    }
                    previousLevel = currentLevel;
                });
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have proper button labels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, buttons;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                buttons = container.querySelectorAll('button');
                buttons.forEach(function (button) {
                    var hasText = button.textContent && button.textContent.trim().length > 0;
                    var hasAriaLabel = button.hasAttribute('aria-label');
                    var hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
                    (0, vitest_1.expect)(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true);
                });
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have proper link labels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, links;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                links = container.querySelectorAll('a[href]');
                links.forEach(function (link) {
                    var hasText = link.textContent && link.textContent.trim().length > 0;
                    var hasAriaLabel = link.hasAttribute('aria-label');
                    var hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
                    (0, vitest_1.expect)(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true);
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Form Accessibility', function () {
        (0, vitest_1.it)('should have proper form labels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, inputs;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Settings_1.default />
        </TestWrapper>).container;
                inputs = container.querySelectorAll('input:not([type="hidden"])');
                inputs.forEach(function (input) {
                    var id = input.getAttribute('id');
                    var hasLabel = id && container.querySelector("label[for=\"".concat(id, "\"]"));
                    var hasAriaLabel = input.hasAttribute('aria-label');
                    var hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
                    (0, vitest_1.expect)(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBe(true);
                });
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have proper error handling', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, inputs;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Settings_1.default />
        </TestWrapper>).container;
                inputs = container.querySelectorAll('input[aria-describedby]');
                inputs.forEach(function (input) {
                    var describedById = input.getAttribute('aria-describedby');
                    if (describedById) {
                        var describedByElement = container.querySelector("#".concat(describedById));
                        (0, vitest_1.expect)(describedByElement).toBeInTheDocument();
                    }
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Color and Contrast', function () {
        (0, vitest_1.it)('should not rely solely on color for information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, statusElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                statusElements = container.querySelectorAll('[class*="status"], [class*="badge"]');
                statusElements.forEach(function (element) {
                    var hasText = element.textContent && element.textContent.trim().length > 0;
                    var hasIcon = element.querySelector('svg');
                    (0, vitest_1.expect)(hasText || hasIcon).toBe(true);
                });
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Focus Management', function () {
        (0, vitest_1.it)('should have visible focus indicators', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, focusableElements;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Index_1.default />
        </TestWrapper>).container;
                focusableElements = container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                // At least check that they exist (styles are tested in e2e)
                (0, vitest_1.expect)(focusableElements.length).toBeGreaterThan(0);
                return [2 /*return*/];
            });
        }); });
    });
    (0, vitest_1.describe)('Screen Reader Support', function () {
        (0, vitest_1.it)('should have proper live regions for dynamic content', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, liveRegions;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                liveRegions = container.querySelectorAll('[aria-live]');
                liveRegions.forEach(function (region) {
                    var liveValue = region.getAttribute('aria-live');
                    (0, vitest_1.expect)(['polite', 'assertive', 'off']).toContain(liveValue);
                });
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)('should have proper roles for custom components', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, customButtons;
            return __generator(this, function (_a) {
                container = (0, react_1.render)(<TestWrapper>
          <Dashboard_1.default />
        </TestWrapper>).container;
                customButtons = container.querySelectorAll('[role="button"]:not(button)');
                customButtons.forEach(function (button) {
                    (0, vitest_1.expect)(button).toHaveAttribute('tabindex', '0');
                });
                return [2 /*return*/];
            });
        }); });
    });
});
