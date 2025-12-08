"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsListener;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var analytics_1 = require("@/lib/analytics");
function AnalyticsListener() {
    var location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(function () {
        // Track page view
        (0, analytics_1.trackPageView)(location.pathname, document.title);
        // Track page load performance on initial load
        if (location.pathname === "/" || location.pathname === "") {
            var timer_1 = setTimeout(function () {
                (0, analytics_1.trackPageLoad)();
            }, 100);
            return function () { return clearTimeout(timer_1); };
        }
    }, [location.pathname]);
    (0, react_1.useEffect)(function () {
        // Global error handler
        var handleError = function (event) {
            (0, analytics_1.trackError)(new Error(event.message), "".concat(event.filename, ":").concat(event.lineno));
        };
        var handleUnhandledRejection = function (event) {
            (0, analytics_1.trackError)(new Error(event.reason), "Unhandled Promise Rejection");
        };
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
        return function () {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);
    return null;
}
