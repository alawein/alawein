"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Navigation_1 = require("@/components/Navigation");
var Footer_1 = require("@/components/Footer");
var ModelComparisonDashboard_1 = require("@/components/comparison/ModelComparisonDashboard");
var Compare = function () {
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    (0, react_1.useEffect)(function () {
        // Handle shared comparison URLs
        var models = searchParams.get('models');
        if (models) {
            // The ModelComparisonDashboard will handle the shared models
            console.log('Shared comparison:', models.split(','));
        }
    }, [searchParams]);
    return (<div className="min-h-screen flex flex-col bg-background">
      <Navigation_1.Navigation />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        <ModelComparisonDashboard_1.ModelComparisonDashboard />
      </main>

      <Footer_1.Footer />
    </div>);
};
exports.default = Compare;
