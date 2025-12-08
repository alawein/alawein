"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsPage = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var switch_1 = require("@/components/ui/switch");
var label_1 = require("@/components/ui/label");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var SettingsPage = function () {
    var _a = (0, react_1.useState)({
        evaluationComplete: true,
        modelErrors: true,
        weeklyReports: false,
        systemUpdates: true
    }), notifications = _a[0], setNotifications = _a[1];
    var _b = (0, react_1.useState)({
        theme: "system",
        language: "en",
        timezone: "UTC",
        defaultTimeout: 300,
        maxConcurrentEvals: 3
    }), preferences = _b[0], setPreferences = _b[1];
    var _c = (0, react_1.useState)({
        format: "json",
        includeMetadata: true,
        includeRawOutputs: false,
        compression: true
    }), exportSettings = _c[0], setExportSettings = _c[1];
    var toggleNotification = function (key) {
        setNotifications(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = !prev[key], _a)));
        });
    };
    var exportData = function () {
        var data = {
            evaluations: "mock_evaluation_data",
            models: "mock_model_configs",
            settings: preferences,
            exportedAt: new Date().toISOString()
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "llmworks-export-".concat(Date.now(), ".json");
        a.click();
    };
    var importData = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function (e) {
            var _a;
            var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    try {
                        var data = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                        console.log('Imported data:', data);
                        // Handle import logic here
                    }
                    catch (error) {
                        console.error('Failed to parse import file:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };
    var resetSettings = function () {
        setPreferences({
            theme: "system",
            language: "en",
            timezone: "UTC",
            defaultTimeout: 300,
            maxConcurrentEvals: 3
        });
        setNotifications({
            evaluationComplete: true,
            modelErrors: true,
            weeklyReports: false,
            systemUpdates: true
        });
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Settings
            <badge_1.Badge className="bg-trust/10 text-trust border-trust/20">Control Center</badge_1.Badge>
          </h1>
          <p className="text-muted-foreground">Configure LLM Works evaluation parameters and preferences</p>
        </div>
        <div className="flex gap-2">
          <button_1.Button onClick={function () { return console.log('Settings saved'); }} variant="trust" className="hover-scale">
            <lucide_react_1.Save className="h-4 w-4 mr-2"/>
            Save Configuration
          </button_1.Button>
          <button_1.Button onClick={resetSettings} variant="outline" className="hover:border-risk hover:text-risk">
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Reset to Defaults
          </button_1.Button>
        </div>
      </div>

      <tabs_1.Tabs defaultValue="general" className="w-full">
        <tabs_1.TabsList className="grid w-full grid-cols-5">
          <tabs_1.TabsTrigger value="general">General</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="notifications">Notifications</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="privacy">Privacy</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="data">Data</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="advanced">Advanced</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="general" className="space-y-6">
          <card_1.Card className="p-6 gradient-surface border-trust/20">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.Settings className="h-5 w-5 text-trust"/>
              <h3 className="text-lg font-bold text-foreground">System Configuration</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label_1.Label htmlFor="theme">Theme</label_1.Label>
                  <select_1.Select value={preferences.theme} onValueChange={function (value) { return setPreferences(__assign(__assign({}, preferences), { theme: value })); }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Sun className="h-4 w-4"/>
                          Light
                        </div>
                      </select_1.SelectItem>
                      <select_1.SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Moon className="h-4 w-4"/>
                          Dark
                        </div>
                      </select_1.SelectItem>
                      <select_1.SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Monitor className="h-4 w-4"/>
                          System
                        </div>
                      </select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div>
                  <label_1.Label htmlFor="language">Language</label_1.Label>
                  <select_1.Select value={preferences.language} onValueChange={function (value) { return setPreferences(__assign(__assign({}, preferences), { language: value })); }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="en">English</select_1.SelectItem>
                      <select_1.SelectItem value="es">Spanish</select_1.SelectItem>
                      <select_1.SelectItem value="fr">French</select_1.SelectItem>
                      <select_1.SelectItem value="de">German</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label_1.Label htmlFor="timezone">Timezone</label_1.Label>
                  <select_1.Select value={preferences.timezone} onValueChange={function (value) { return setPreferences(__assign(__assign({}, preferences), { timezone: value })); }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="UTC">UTC</select_1.SelectItem>
                      <select_1.SelectItem value="PST">Pacific (PST)</select_1.SelectItem>
                      <select_1.SelectItem value="EST">Eastern (EST)</select_1.SelectItem>
                      <select_1.SelectItem value="GMT">Greenwich (GMT)</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div>
                  <label_1.Label htmlFor="timeout">Default Timeout (seconds)</label_1.Label>
                  <input_1.Input id="timeout" type="number" value={preferences.defaultTimeout} onChange={function (e) { return setPreferences(__assign(__assign({}, preferences), { defaultTimeout: parseInt(e.target.value) })); }}/>
                </div>
              </div>
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="notifications" className="space-y-6">
          <card_1.Card className="p-6 gradient-surface border-neutral/20">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.Bell className="h-5 w-5 text-neutral"/>
              <h3 className="text-lg font-bold text-foreground">Alert Configuration</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(function (_a) {
            var key = _a[0], value = _a[1];
            return (<div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <div className="font-medium text-foreground">
                      {key === 'evaluationComplete' && 'Evaluation Complete'}
                      {key === 'modelErrors' && 'Model Errors'}
                      {key === 'weeklyReports' && 'Weekly Reports'}
                      {key === 'systemUpdates' && 'System Updates'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'evaluationComplete' && 'Notify when evaluations finish running'}
                      {key === 'modelErrors' && 'Alert when models encounter errors'}
                      {key === 'weeklyReports' && 'Receive weekly performance summaries'}
                      {key === 'systemUpdates' && 'Get notified about platform updates'}
                    </div>
                  </div>
                  <switch_1.Switch checked={value} onCheckedChange={function () { return toggleNotification(key); }}/>
                </div>);
        })}
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="privacy" className="space-y-6">
          <card_1.Card className="p-6 gradient-surface border-trust/20">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.Shield className="h-5 w-5 text-trust"/>
              <h3 className="text-lg font-bold text-foreground">Security Protocols</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium text-foreground">Data Analytics</div>
                  <div className="text-sm text-muted-foreground">Help improve LLM Works by sharing anonymous usage data</div>
                </div>
                <switch_1.Switch defaultChecked/>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium text-foreground">Error Reporting</div>
                  <div className="text-sm text-muted-foreground">Automatically send error reports to help fix issues</div>
                </div>
                <switch_1.Switch defaultChecked/>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium text-foreground">Model Data Retention</div>
                  <div className="text-sm text-muted-foreground">How long to keep evaluation data (30 days recommended)</div>
                </div>
                <select_1.Select defaultValue="30">
                  <select_1.SelectTrigger className="w-32">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="7">7 days</select_1.SelectItem>
                    <select_1.SelectItem value="30">30 days</select_1.SelectItem>
                    <select_1.SelectItem value="90">90 days</select_1.SelectItem>
                    <select_1.SelectItem value="365">1 year</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="data" className="space-y-6">
          <card_1.Card className="p-6 gradient-surface border-neutral/20">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.Download className="h-5 w-5 text-neutral"/>
              <h3 className="text-lg font-bold text-foreground">Data Operations</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Export Data</h4>
                <p className="text-sm text-muted-foreground">Download your evaluation data and settings</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label_1.Label>Include metadata</label_1.Label>
                    <switch_1.Switch checked={exportSettings.includeMetadata} onCheckedChange={function (checked) { return setExportSettings(__assign(__assign({}, exportSettings), { includeMetadata: checked })); }}/>
                  </div>
                  <div className="flex items-center justify-between">
                    <label_1.Label>Include raw outputs</label_1.Label>
                    <switch_1.Switch checked={exportSettings.includeRawOutputs} onCheckedChange={function (checked) { return setExportSettings(__assign(__assign({}, exportSettings), { includeRawOutputs: checked })); }}/>
                  </div>
                </div>

                <button_1.Button onClick={exportData} variant="outline" className="w-full">
                  <lucide_react_1.Download className="h-4 w-4 mr-2"/>
                  Export Data
                </button_1.Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Import Data</h4>
                <p className="text-sm text-muted-foreground">Import previously exported data</p>

                <button_1.Button onClick={importData} variant="outline" className="w-full">
                  <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                  Import Data
                </button_1.Button>

                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <h5 className="font-medium text-destructive mb-1">Danger Zone</h5>
                  <p className="text-sm text-muted-foreground mb-2">Permanently delete all evaluation data</p>
                  <button_1.Button variant="destructive" size="sm">
                    <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                    Delete All Data
                  </button_1.Button>
                </div>
              </div>
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="advanced" className="space-y-6">
          <card_1.Card className="p-6 gradient-surface border-risk/20">
            <div className="flex items-center gap-2 mb-4">
              <lucide_react_1.Globe className="h-5 w-5 text-risk"/>
              <h3 className="text-lg font-bold text-foreground">Advanced Configuration</h3>
              <badge_1.Badge className="bg-risk/10 text-risk">Expert Mode</badge_1.Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label_1.Label htmlFor="concurrent">Max Concurrent Evaluations</label_1.Label>
                <input_1.Input id="concurrent" type="number" value={preferences.maxConcurrentEvals} onChange={function (e) { return setPreferences(__assign(__assign({}, preferences), { maxConcurrentEvals: parseInt(e.target.value) })); }} className="w-32"/>
                <p className="text-sm text-muted-foreground mt-1">Higher values may impact performance</p>
              </div>

              <div>
                <label_1.Label htmlFor="api-endpoint">Custom API Endpoint</label_1.Label>
                <input_1.Input id="api-endpoint" placeholder="https://api.example.com" className="mt-1"/>
                <p className="text-sm text-muted-foreground mt-1">For enterprise deployments</p>
              </div>

              <div>
                <label_1.Label htmlFor="debug-mode">Debug Mode</label_1.Label>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Enable detailed logging and debugging</span>
                  <switch_1.Switch />
                </div>
              </div>
            </div>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
};
exports.SettingsPage = SettingsPage;
