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
exports.useModelComparison = void 0;
var react_1 = require("react");
// Mock model data - in production this would come from API/database
var MOCK_MODELS = [
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        metrics: { accuracy: 92, speed: 85, cost: 65, reasoning: 94, creativity: 88, safety: 90 },
        latency: 450,
        costPer1kTokens: 0.015,
        contextWindow: 128000,
    },
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        metrics: { accuracy: 90, speed: 88, cost: 70, reasoning: 92, creativity: 91, safety: 95 },
        latency: 380,
        costPer1kTokens: 0.012,
        contextWindow: 200000,
    },
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        metrics: { accuracy: 94, speed: 75, cost: 40, reasoning: 96, creativity: 93, safety: 96 },
        latency: 650,
        costPer1kTokens: 0.075,
        contextWindow: 200000,
    },
    {
        id: 'gemini-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        metrics: { accuracy: 88, speed: 90, cost: 75, reasoning: 87, creativity: 82, safety: 88 },
        latency: 320,
        costPer1kTokens: 0.0035,
        contextWindow: 1000000,
    },
    {
        id: 'gemini-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        metrics: { accuracy: 85, speed: 95, cost: 90, reasoning: 82, creativity: 78, safety: 85 },
        latency: 180,
        costPer1kTokens: 0.001,
        contextWindow: 1000000,
    },
    {
        id: 'llama-3-70b',
        name: 'Llama 3.1 70B',
        provider: 'Meta',
        metrics: { accuracy: 82, speed: 80, cost: 85, reasoning: 80, creativity: 75, safety: 78 },
        latency: 520,
        costPer1kTokens: 0.0008,
        contextWindow: 128000,
    },
    {
        id: 'mistral-large',
        name: 'Mistral Large',
        provider: 'Mistral',
        metrics: { accuracy: 86, speed: 82, cost: 78, reasoning: 85, creativity: 80, safety: 82 },
        latency: 400,
        costPer1kTokens: 0.008,
        contextWindow: 128000,
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        metrics: { accuracy: 91, speed: 82, cost: 55, reasoning: 93, creativity: 86, safety: 89 },
        latency: 520,
        costPer1kTokens: 0.03,
        contextWindow: 128000,
    },
];
var useModelComparison = function () {
    var _a = (0, react_1.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var generateShareUrl = (0, react_1.useCallback)(function (modelIds) { return __awaiter(void 0, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = new URLSearchParams();
            params.set('models', modelIds.join(','));
            return [2 /*return*/, "".concat(window.location.origin, "/compare?").concat(params.toString())];
        });
    }); }, []);
    var exportToPDF = (0, react_1.useCallback)(function (models) { return __awaiter(void 0, void 0, void 0, function () {
        var content, printWindow_1;
        return __generator(this, function (_a) {
            setIsLoading(true);
            try {
                content = generatePDFContent(models);
                printWindow_1 = window.open('', '_blank');
                if (printWindow_1) {
                    printWindow_1.document.write(content);
                    printWindow_1.document.close();
                    printWindow_1.focus();
                    setTimeout(function () {
                        printWindow_1.print();
                        printWindow_1.close();
                    }, 500);
                }
            }
            finally {
                setIsLoading(false);
            }
            return [2 /*return*/];
        });
    }); }, []);
    return {
        models: MOCK_MODELS,
        isLoading: isLoading,
        generateShareUrl: generateShareUrl,
        exportToPDF: exportToPDF,
    };
};
exports.useModelComparison = useModelComparison;
function generatePDFContent(models) {
    var date = new Date().toLocaleDateString();
    var modelRows = models.map(function (m) { return "\n    <tr>\n      <td>".concat(m.name, "</td>\n      <td>").concat(m.provider, "</td>\n      <td>").concat(m.metrics.accuracy, "%</td>\n      <td>").concat(m.metrics.speed, "%</td>\n      <td>").concat(m.metrics.reasoning, "%</td>\n      <td>").concat(m.latency, "ms</td>\n      <td>$").concat(m.costPer1kTokens.toFixed(4), "</td>\n      <td>").concat((m.contextWindow / 1000).toFixed(0), "K</td>\n    </tr>\n  "); }).join('');
    return "<!DOCTYPE html><html><head><title>LLM Comparison Report</title>\n<style>body{font-family:system-ui,-apple-system,sans-serif;padding:40px;max-width:1000px;margin:0 auto}\nh1{color:#1f2937;border-bottom:2px solid #10b981;padding-bottom:10px}\ntable{width:100%;border-collapse:collapse;margin-top:20px}\nth,td{border:1px solid #e5e7eb;padding:12px;text-align:left}\nth{background:#f3f4f6;font-weight:600}\n.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px}</style>\n</head><body>\n<h1>LLM Model Comparison Report</h1>\n<p>Generated: ".concat(date, " | Models: ").concat(models.length, "</p>\n<table><thead><tr><th>Model</th><th>Provider</th><th>Accuracy</th><th>Speed</th><th>Reasoning</th><th>Latency</th><th>Cost/1K</th><th>Context</th></tr></thead>\n<tbody>").concat(modelRows, "</tbody></table>\n<div class=\"footer\">Generated by LLMWorks - llmworks.dev</div>\n</body></html>");
}
