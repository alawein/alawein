"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
var react_1 = require("react");
var tabs_1 = require("@/components/ui/tabs");
var Navigation_1 = require("@/components/Navigation");
var SettingsPage_1 = require("@/components/settings/SettingsPage");
var ModelManager_1 = require("@/components/settings/ModelManager");
var SystemMonitor_1 = require("@/components/settings/SystemMonitor");
var seo_1 = require("@/lib/seo");
function Settings() {
    (0, react_1.useEffect)(function () {
        (0, seo_1.setSEO)({
            title: "Settings | LLM Works",
            description: "Configure platform preferences, manage models, and monitor system performance.",
            path: "/settings",
        });
    }, []);
    return (<div className="min-h-screen bg-background">
      <Navigation_1.Navigation />
      
      <div id="main" className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Settings</h1>
        <tabs_1.Tabs defaultValue="general" className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-3 mb-8">
            <tabs_1.TabsTrigger value="general">Settings</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="models">Models</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="monitor">Monitor</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="general">
            <SettingsPage_1.SettingsPage />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="models">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Model Management</h2>
                <p className="text-muted-foreground">Configure and manage AI models for evaluation tasks</p>
              </div>
              <ModelManager_1.ModelManager />
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="monitor">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">System Monitor</h2>
                <p className="text-muted-foreground">Real-time system status and performance metrics</p>
              </div>
              <SystemMonitor_1.SystemMonitor />
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
}
