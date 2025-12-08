"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var toaster_1 = require("@/components/ui/toaster");
var sonner_1 = require("@/components/ui/sonner");
var tooltip_1 = require("@/components/ui/tooltip");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var AnalyticsListener_1 = require("@/components/AnalyticsListener");
var SkipLink_1 = require("@/components/SkipLink");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var smooth_scroll_1 = require("@/lib/smooth-scroll");
var service_worker_1 = require("@/lib/service-worker");
var performance_1 = require("@/lib/performance");
var AccessibilityToolbar_1 = require("@/components/accessibility/AccessibilityToolbar");
var ColorBlindnessFilters_1 = require("@/components/accessibility/ColorBlindnessFilters");
var KeyboardShortcuts_1 = require("@/components/KeyboardShortcuts");
var CommandPalette_1 = require("@/components/CommandPalette");
var useCommandPalette_1 = require("@/hooks/useCommandPalette");
var FloatingNotifications_1 = require("@/components/FloatingNotifications");
var KeyboardShortcuts_2 = require("@/components/KeyboardShortcuts");
var DynamicBackground_1 = require("@/components/DynamicBackground");
var MagneticElements_1 = require("@/components/MagneticElements");
var ThemeCustomizer_1 = require("@/components/ThemeCustomizer");
var AchievementSystem_1 = require("@/components/AchievementSystem");
// import { initSecurity } from "@/lib/security";
// import { initAdvancedSEO } from "@/lib/advanced-seo";
// import { initMonitoring } from "@/lib/monitoring";
var Index = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Index"); }); });
var Arena = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Arena"); }); });
var Bench = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Bench"); }); });
var Compare = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Compare"); }); });
var Settings = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Settings"); }); });
var Admin = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Admin"); }); });
var Privacy = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Privacy"); }); });
var Terms = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Terms"); }); });
var NotFound = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/NotFound"); }); });
var DashboardPage = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require("./pages/Dashboard"); }); });
// Optimized QueryClient configuration for better performance
var queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            // Cache queries for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Don't refetch on window focus in production
            refetchOnWindowFocus: import.meta.env.DEV,
            // Don't refetch on reconnect unless in dev
            refetchOnReconnect: import.meta.env.DEV,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});
// Router wrapper component to provide context for hooks
var AppRoutes = function () {
    var _a = (0, useCommandPalette_1.useCommandPalette)(), isOpen = _a.isOpen, setIsOpen = _a.setIsOpen;
    var _b = (0, react_1.useState)(false), themeCustomizerOpen = _b[0], setThemeCustomizerOpen = _b[1];
    return (<>
      <SkipLink_1.SkipLink />
      <AnalyticsListener_1.default />
      <DynamicBackground_1.DynamicBackground intensity="medium" theme="tactical"/>
      <MagneticElements_1.InteractiveBackground />
      <KeyboardShortcuts_1.KeyboardShortcuts />
      <CommandPalette_1.CommandPalette open={isOpen} onOpenChange={setIsOpen}/>
      <ThemeCustomizer_1.ThemeCustomizer isOpen={themeCustomizerOpen} onToggle={function () { return setThemeCustomizerOpen(function (prev) { return !prev; }); }}/>
      <AchievementSystem_1.AchievementSystem />
      <ErrorBoundary_1.ErrorBoundary>
        <react_1.Suspense fallback={<LoadingSpinner_1.PageLoader />}>
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<Index />}/>
            <react_router_dom_1.Route path="/arena" element={<Arena />}/>
            <react_router_dom_1.Route path="/bench" element={<Bench />}/>
            <react_router_dom_1.Route path="/compare" element={<Compare />}/>
            <react_router_dom_1.Route path="/settings" element={<Settings />}/>
            <react_router_dom_1.Route path="/admin" element={<Admin />}/>
            <react_router_dom_1.Route path="/privacy" element={<Privacy />}/>
            <react_router_dom_1.Route path="/terms" element={<Terms />}/>
            <react_router_dom_1.Route path="/dashboard" element={<DashboardPage />}/>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <react_router_dom_1.Route path="*" element={<NotFound />}/>
          </react_router_dom_1.Routes>
        </react_1.Suspense>
        <AccessibilityToolbar_1.AccessibilityToolbar />
        <ColorBlindnessFilters_1.ColorBlindnessFilters />
      </ErrorBoundary_1.ErrorBoundary>
    </>);
};
var App = function () {
    (0, react_1.useEffect)(function () {
        // Initialize production systems
        // initSecurity();
        // initAdvancedSEO();
        // initMonitoring();
        // Initialize smooth scrolling
        (0, smooth_scroll_1.initSmoothScroll)();
        // Initialize performance monitoring
        (0, performance_1.initPerformanceMonitoring)({
            trackCoreWebVitals: true,
            trackNavigation: true,
            debug: import.meta.env.DEV,
        });
        // Register service worker for caching and offline functionality
        (0, service_worker_1.registerSW)({
            onUpdate: function (registration) {
                console.log('New content available! Please refresh.');
                // Could show a toast notification here
            },
            onSuccess: function () {
                console.log('Content cached for offline use.');
            },
            onError: function (error) {
                console.error('Service worker registration failed:', error);
            },
        });
    }, []);
    return (<react_query_1.QueryClientProvider client={queryClient}>
    <tooltip_1.TooltipProvider>
      <toaster_1.Toaster />
      <sonner_1.Toaster />
      <react_router_dom_1.BrowserRouter>
        <FloatingNotifications_1.NotificationProvider>
          <KeyboardShortcuts_2.KeyboardProvider>
            <AppRoutes />
          </KeyboardShortcuts_2.KeyboardProvider>
        </FloatingNotifications_1.NotificationProvider>
      </react_router_dom_1.BrowserRouter>
    </tooltip_1.TooltipProvider>
  </react_query_1.QueryClientProvider>);
};
exports.default = App;
