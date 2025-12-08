"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitationTracker = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var badge_1 = require("@/components/ui/badge");
var CitationTrackerComponent = function (_a) {
    var argumentList = _a.arguments, onCitationVerified = _a.onCitationVerified, onFactCheckComplete = _a.onFactCheckComplete, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b, _c = _a.realTimeChecking, realTimeChecking = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)([]), citationDatabase = _d[0], setCitationDatabase = _d[1];
    var _e = (0, react_1.useState)([]), factCheckResults = _e[0], setFactCheckResults = _e[1];
    var _f = (0, react_1.useState)([]), verificationQueue = _f[0], setVerificationQueue = _f[1];
    var _g = (0, react_1.useState)(false), isProcessing = _g[0], setIsProcessing = _g[1];
    // Extract citations from argument text (simulated - in real implementation would use NLP)
    var extractCitations = function (argument) {
        var extractedCitations = [];
        var citationPatterns = [
            /\(([^)]+)\s+\d{4}\)/g, // (Author 2024)
            /https?:\/\/[^\s]+/g, // URLs
            /DOI:\s*[^\s]+/g, // DOI references
            /"([^"]+)"\s*-\s*([^,]+)/g, // "Quote" - Source
        ];
        citationPatterns.forEach(function (pattern, index) {
            var match;
            while ((match = pattern.exec(argument.content)) !== null) {
                var citationText = match[0];
                // Simulate citation analysis
                var citation = {
                    id: "citation-".concat(argument.id, "-").concat(index, "-").concat(Date.now()),
                    text: citationText,
                    type: detectCitationType(citationText),
                    credibility: simulateCredibilityCheck(citationText),
                    url: citationText.startsWith('http') ? citationText : undefined,
                };
                extractedCitations.push(citation);
            }
        });
        return extractedCitations;
    };
    var detectCitationType = function (citationText) {
        if (citationText.includes('doi.org') || citationText.includes('arxiv'))
            return 'academic';
        if (citationText.includes('gov'))
            return 'government';
        if (citationText.includes('news') || citationText.includes('reuters') || citationText.includes('bbc'))
            return 'news';
        if (citationText.includes('http'))
            return 'organization';
        if (citationText.includes('ISBN'))
            return 'book';
        if (citationText.includes('dataset'))
            return 'dataset';
        return 'academic';
    };
    var simulateCredibilityCheck = function (citationText) {
        // Simulate credibility assessment based on source patterns
        var highCredibilityPatterns = ['nature', 'science', 'arxiv', '.gov', 'who.int', 'unesco'];
        var mediumCredibilityPatterns = ['reuters', 'bbc', 'nyt', '.edu', 'pubmed'];
        var lowCredibilityPatterns = ['blog', 'opinion', 'social'];
        var text = citationText.toLowerCase();
        if (highCredibilityPatterns.some(function (pattern) { return text.includes(pattern); }))
            return 'high';
        if (mediumCredibilityPatterns.some(function (pattern) { return text.includes(pattern); }))
            return 'medium';
        if (lowCredibilityPatterns.some(function (pattern) { return text.includes(pattern); }))
            return 'low';
        return 'unverified';
    };
    // Simulate fact-checking process
    var performFactCheck = function (argument) {
        var factChecks = [];
        // Extract potential claims (simplified - would use NLP in reality)
        var claimPatterns = [
            /studies show that ([^.]+)/gi,
            /research indicates ([^.]+)/gi,
            /according to ([^,]+), ([^.]+)/gi,
            /(\d+%|\d+\s+percent) of ([^.]+)/gi,
        ];
        claimPatterns.forEach(function (pattern) {
            var match;
            while ((match = pattern.exec(argument.content)) !== null) {
                var claim = match[0];
                var factCheck = {
                    id: "fact-check-".concat(argument.id, "-").concat(Date.now()),
                    claim: claim,
                    status: simulateFactCheckStatus(),
                    confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
                    sources: generateMockSources(),
                    reasoning: generateFactCheckReasoning(),
                    lastUpdated: new Date()
                };
                factChecks.push(factCheck);
            }
        });
        return factChecks;
    };
    var simulateFactCheckStatus = function () {
        var statuses = ['verified', 'disputed', 'partially-true', 'unverified'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };
    var generateMockSources = function () {
        var mockSources = [
            { type: 'academic', credibility: 'high', journalOrSource: 'Nature' },
            { type: 'government', credibility: 'high', journalOrSource: 'CDC' },
            { type: 'news', credibility: 'medium', journalOrSource: 'Reuters' },
            { type: 'organization', credibility: 'medium', journalOrSource: 'WHO' },
        ];
        return mockSources.slice(0, Math.floor(Math.random() * 3) + 1).map(function (source, index) { return ({
            id: "mock-source-".concat(index),
            text: "".concat(source.journalOrSource, " Research"),
            type: source.type,
            credibility: source.credibility,
            journalOrSource: source.journalOrSource
        }); });
    };
    var generateFactCheckReasoning = function () {
        var reasonings = [
            'Claim aligns with peer-reviewed research and official statistics',
            'Statement requires additional context and has conflicting evidence',
            'Data partially correct but lacks nuance in presentation',
            'Claim requires verification from primary sources',
        ];
        return reasonings[Math.floor(Math.random() * reasonings.length)];
    };
    // Process new arguments for citations and fact-checks
    (0, react_1.useEffect)(function () {
        if (!realTimeChecking || argumentList.length === 0)
            return;
        var latestArgument = argumentList[argumentList.length - 1];
        // Extract and verify citations
        var citations = extractCitations(latestArgument);
        setCitationDatabase(function (prev) { return __spreadArray(__spreadArray([], prev, true), citations, true); });
        // Perform fact-checking
        var factChecks = performFactCheck(latestArgument);
        setFactCheckResults(function (prev) { return __spreadArray(__spreadArray([], prev, true), factChecks, true); });
        // Notify parent components
        citations.forEach(function (citation) {
            onCitationVerified(citation, citation.credibility !== 'low');
        });
        factChecks.forEach(function (factCheck) {
            onFactCheckComplete(factCheck);
        });
    }, [argumentList, realTimeChecking, onCitationVerified, onFactCheckComplete]);
    // Calculate citation and fact-check statistics
    var statistics = (0, react_1.useMemo)(function () {
        var totalCitations = citationDatabase.length;
        var highCredibilityCitations = citationDatabase.filter(function (c) { return c.credibility === 'high'; }).length;
        var verifiedFactChecks = factCheckResults.filter(function (f) { return f.status === 'verified'; }).length;
        var disputedFactChecks = factCheckResults.filter(function (f) { return f.status === 'disputed' || f.status === 'false'; }).length;
        return {
            totalCitations: totalCitations,
            highCredibilityCitations: highCredibilityCitations,
            verifiedFactChecks: verifiedFactChecks,
            disputedFactChecks: disputedFactChecks,
            credibilityScore: totalCitations > 0 ? Math.round((highCredibilityCitations / totalCitations) * 100) : 0,
            factualAccuracy: factCheckResults.length > 0 ? Math.round((verifiedFactChecks / factCheckResults.length) * 100) : 0
        };
    }, [citationDatabase, factCheckResults]);
    var getCredibilityIcon = function (credibility) {
        switch (credibility) {
            case 'high': return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'medium': return <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>;
            case 'low': return <lucide_react_1.XCircle className="h-4 w-4 text-red-500"/>;
            default: return <lucide_react_1.Search className="h-4 w-4 text-gray-500"/>;
        }
    };
    var getFactCheckIcon = function (status) {
        switch (status) {
            case 'verified': return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'partially-true': return <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>;
            case 'disputed':
            case 'false': return <lucide_react_1.XCircle className="h-4 w-4 text-red-500"/>;
            default: return <lucide_react_1.Search className="h-4 w-4 text-gray-500"/>;
        }
    };
    if (!academicMode && citationDatabase.length === 0 && factCheckResults.length === 0) {
        return null; // Don't show empty tracker in gaming mode
    }
    return (<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="glass-panel p-4 rounded-xl border-2 border-primary/20 min-w-96">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <lucide_react_1.Shield className="h-5 w-5 text-primary"/>
            <h3 className="heading-refined text-sm">Verification Center</h3>
          </div>
          <div className="flex gap-2">
            <badge_1.Badge variant="secondary" className="text-xs">
              {statistics.credibilityScore}% Sources
            </badge_1.Badge>
            <badge_1.Badge variant="secondary" className="text-xs">
              {statistics.factualAccuracy}% Accuracy
            </badge_1.Badge>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="glass-minimal p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Citations</div>
                <div className="text-2xl font-bold text-primary">{statistics.totalCitations}</div>
              </div>
              <lucide_react_1.BookOpen className="h-6 w-6 text-muted-foreground"/>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {statistics.highCredibilityCitations} high credibility
            </div>
          </div>
          
          <div className="glass-minimal p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Fact Checks</div>
                <div className="text-2xl font-bold text-primary">{factCheckResults.length}</div>
              </div>
              <lucide_react_1.Shield className="h-6 w-6 text-muted-foreground"/>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {statistics.verifiedFactChecks} verified, {statistics.disputedFactChecks} disputed
            </div>
          </div>
        </div>

        {/* Recent Citations */}
        {citationDatabase.length > 0 && (<div className="mb-4">
            <div className="text-sm font-medium mb-2">Recent Citations</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {citationDatabase.slice(-3).map(function (citation) { return (<div key={citation.id} className="glass-subtle p-2 rounded-lg text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCredibilityIcon(citation.credibility)}
                      <span className="font-medium capitalize">{citation.type}</span>
                    </div>
                    <badge_1.Badge variant="outline" className="text-xs">
                      {citation.credibility}
                    </badge_1.Badge>
                  </div>
                  <div className="text-muted-foreground mt-1 truncate">
                    {citation.text}
                  </div>
                  {citation.url && (<div className="flex items-center gap-1 mt-1">
                      <lucide_react_1.ExternalLink className="h-3 w-3"/>
                      <span className="text-primary">Source available</span>
                    </div>)}
                </div>); })}
            </div>
          </div>)}

        {/* Recent Fact Checks */}
        {factCheckResults.length > 0 && (<div>
            <div className="text-sm font-medium mb-2">Fact Check Results</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {factCheckResults.slice(-2).map(function (factCheck) { return (<div key={factCheck.id} className="glass-subtle p-2 rounded-lg text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getFactCheckIcon(factCheck.status)}
                      <span className="font-medium capitalize">{factCheck.status.replace('-', ' ')}</span>
                    </div>
                    <badge_1.Badge variant="outline" className="text-xs">
                      {factCheck.confidence}% confidence
                    </badge_1.Badge>
                  </div>
                  <div className="text-muted-foreground truncate mb-1">
                    {factCheck.claim}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {factCheck.reasoning}
                  </div>
                </div>); })}
            </div>
          </div>)}

        {/* Processing Indicator */}
        {isProcessing && (<div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
            <span>Verifying sources and fact-checking claims...</span>
          </div>)}
      </div>
    </div>);
};
exports.CitationTracker = (0, react_1.memo)(CitationTrackerComponent);
