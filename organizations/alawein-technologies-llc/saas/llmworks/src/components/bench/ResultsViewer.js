"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsViewer = void 0;
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var ResultsViewer = function () {
    var results = [
        {
            id: "result-1",
            name: "MMLU Benchmark Run",
            type: "benchmark",
            models: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"],
            timestamp: new Date("2024-01-15T10:30:00"),
            status: "completed",
            accuracy: 87.4
        },
        {
            id: "result-2",
            name: "AI Ethics Debate",
            type: "arena",
            models: ["GPT-4o", "Claude 3.5 Sonnet"],
            timestamp: new Date("2024-01-14T15:45:00"),
            status: "completed",
            winner: "GPT-4o"
        },
        {
            id: "result-3",
            name: "Medical Diagnosis Test",
            type: "custom",
            models: ["Claude 3.5 Sonnet", "Gemini 1.5 Pro"],
            timestamp: new Date("2024-01-13T09:15:00"),
            status: "completed",
            score: 92.1
        },
        {
            id: "result-4",
            name: "Creative Writing Challenge",
            type: "arena",
            models: ["GPT-4o", "Claude 3.5 Sonnet"],
            timestamp: new Date("2024-01-12T14:20:00"),
            status: "completed",
            score: 85.7
        },
        {
            id: "result-5",
            name: "TruthfulQA Benchmark",
            type: "benchmark",
            models: ["All Models"],
            timestamp: new Date("2024-01-11T11:00:00"),
            status: "running"
        }
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case "completed": return "bg-accent/10 text-accent";
            case "running": return "bg-primary/10 text-primary";
            case "failed": return "bg-destructive/10 text-destructive";
            default: return "bg-muted text-muted-foreground";
        }
    };
    var getTypeIcon = function (type) {
        switch (type) {
            case "benchmark": return lucide_react_1.BarChart3;
            case "arena": return lucide_react_1.CheckCircle;
            case "custom": return lucide_react_1.Eye;
            default: return lucide_react_1.BarChart3;
        }
    };
    var exportResult = function (result) {
        var data = {
            id: result.id,
            name: result.name,
            type: result.type,
            models: result.models,
            timestamp: result.timestamp,
            status: result.status,
            exportedAt: new Date().toISOString()
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(result.name.toLowerCase().replace(/\s+/g, '-'), "-result.json");
        a.click();
    };
    return (<div className="space-y-6">
      {/* Filters & Search */}
      <card_1.Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
            <input_1.Input placeholder="Search evaluations..." className="pl-10"/>
          </div>
          
          <div className="flex gap-2">
            <select_1.Select defaultValue="all">
              <select_1.SelectTrigger className="w-32">
                <select_1.SelectValue placeholder="Type"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Types</select_1.SelectItem>
                <select_1.SelectItem value="benchmark">Benchmarks</select_1.SelectItem>
                <select_1.SelectItem value="arena">Arena</select_1.SelectItem>
                <select_1.SelectItem value="custom">Custom</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>

            <select_1.Select defaultValue="recent">
              <select_1.SelectTrigger className="w-32">
                <select_1.SelectValue placeholder="Sort"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="recent">Most Recent</select_1.SelectItem>
                <select_1.SelectItem value="oldest">Oldest First</select_1.SelectItem>
                <select_1.SelectItem value="name">Name</select_1.SelectItem>
                <select_1.SelectItem value="score">Score</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>

            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
              Filters
            </button_1.Button>
          </div>
        </div>
      </card_1.Card>

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map(function (result) {
            var TypeIcon = getTypeIcon(result.type);
            return (<card_1.Card key={result.id} className="p-6 hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TypeIcon className="h-5 w-5 text-accent"/>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{result.name}</h3>
                      <badge_1.Badge variant="outline" className="capitalize">
                        {result.type}
                      </badge_1.Badge>
                      <badge_1.Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </badge_1.Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <lucide_react_1.Calendar className="h-4 w-4"/>
                        {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                      </div>
                      <div>{result.models.join(", ")}</div>
                    </div>

                    {/* Result Summary */}
                    <div className="flex items-center gap-4">
                      {result.accuracy && (<div className="flex items-center gap-1 text-sm">
                          <lucide_react_1.TrendingUp className="h-4 w-4 text-accent"/>
                          <span className="text-foreground font-medium">{result.accuracy}% accuracy</span>
                        </div>)}
                      {result.winner && (<div className="flex items-center gap-1 text-sm">
                          <lucide_react_1.CheckCircle className="h-4 w-4 text-accent"/>
                          <span className="text-foreground font-medium">Winner: {result.winner}</span>
                        </div>)}
                      {result.score && (<div className="flex items-center gap-1 text-sm">
                          <lucide_react_1.BarChart3 className="h-4 w-4 text-primary"/>
                          <span className="text-foreground font-medium">{result.score}/100</span>
                        </div>)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button_1.Button variant="ghost" size="sm">
                    <lucide_react_1.Eye className="h-4 w-4"/>
                  </button_1.Button>
                  <button_1.Button variant="ghost" size="sm" onClick={function () { return exportResult(result); }}>
                    <lucide_react_1.Download className="h-4 w-4"/>
                  </button_1.Button>
                </div>
              </div>
            </card_1.Card>);
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 5 of 47 results
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" size="sm" disabled>
            Previous
          </button_1.Button>
          <button_1.Button variant="outline" size="sm">
            Next
          </button_1.Button>
        </div>
      </div>
    </div>);
};
exports.ResultsViewer = ResultsViewer;
