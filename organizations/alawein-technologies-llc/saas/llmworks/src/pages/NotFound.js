"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var seo_1 = require("@/lib/seo");
var analytics_1 = require("@/lib/analytics");
var NotFound = (0, react_1.memo)(function () {
    var location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(function () {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
        (0, analytics_1.trackEvent)("page_not_found", {
            attempted_path: location.pathname,
            referrer: document.referrer
        });
        (0, seo_1.setSEO)({
            title: "404 Not Found | LLM Works",
            description: "The page you're looking for doesn't exist. Return to the LLM Works home page.",
            path: location.pathname,
        });
    }, [location.pathname]);
    var handleNavigateHome = function () {
        (0, analytics_1.trackEvent)("404_navigate_home", { from_path: location.pathname });
    };
    return (<div className="min-h-screen flex items-center justify-center bg-background p-4">
      <card_1.Card className="max-w-md w-full p-8 text-center shadow-elegant">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-destructive mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <button_1.Button asChild size="lg" className="w-full" onClick={handleNavigateHome}>
            <react_router_dom_1.Link to="/">
              <lucide_react_1.Home className="h-4 w-4 mr-2"/>
              Return Home
            </react_router_dom_1.Link>
          </button_1.Button>
          
          <button_1.Button asChild variant="outline" size="lg" className="w-full">
            <react_router_dom_1.Link to="#" onClick={function () { return window.history.back(); }}>
              <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
              Go Back
            </react_router_dom_1.Link>
          </button_1.Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Attempted path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
        </p>
      </card_1.Card>
    </div>);
});
NotFound.displayName = 'NotFound';
exports.default = NotFound;
