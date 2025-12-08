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
exports.TechnicalSpecsDrawer = void 0;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var progress_1 = require("@/components/ui/progress");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var TechnicalSpecsDrawerComponent = function () {
    var _a = (0, react_1.useState)(false), isExpanded = _a[0], setIsExpanded = _a[1];
    var _b = (0, react_1.useState)('system'), activeSpec = _b[0], setActiveSpec = _b[1];
    var _c = (0, react_1.useState)(['architecture']), expandedSections = _c[0], setExpandedSections = _c[1];
    var toggleSection = function (section) {
        setExpandedSections(function (prev) {
            return prev.includes(section)
                ? prev.filter(function (s) { return s !== section; })
                : __spreadArray(__spreadArray([], prev, true), [section], false);
        });
    };
    var technicalSpecs = [
        {
            category: 'System Architecture',
            specs: [
                { label: 'Platform', value: 'Kubernetes + Docker', description: 'Container orchestration platform', status: 'optimal' },
                { label: 'Load Balancer', value: 'NGINX Ingress', description: 'High-performance reverse proxy', status: 'optimal' },
                { label: 'Service Mesh', value: 'Istio 1.19', description: 'Microservices communication layer', status: 'optimal' },
                { label: 'Message Queue', value: 'Apache Kafka', description: 'Distributed streaming platform', status: 'optimal' },
                { label: 'Cache Layer', value: 'Redis Cluster', description: 'In-memory data structure store', status: 'optimal' },
                { label: 'CDN', value: 'CloudFlare Enterprise', description: 'Global content delivery network', status: 'optimal' },
            ]
        },
        {
            category: 'Compute Resources',
            specs: [
                { label: 'CPU Architecture', value: 'Intel Xeon Platinum 8375C', description: '32 cores, 2.9GHz base frequency' },
                { label: 'Total vCPUs', value: '1,024 cores', description: 'Distributed across 32 nodes' },
                { label: 'RAM', value: '2.5 TB DDR4', description: '64GB per node, ECC memory' },
                { label: 'GPU Acceleration', value: 'NVIDIA A100 80GB', description: '8x A100s for model inference' },
                { label: 'Storage', value: '50 TB NVMe SSD', description: 'High-performance persistent storage' },
                { label: 'Network', value: '100 Gbps Ethernet', description: 'Dedicated fiber optic backbone' },
            ]
        },
        {
            category: 'Database Systems',
            specs: [
                { label: 'Primary Database', value: 'PostgreSQL 15.4', description: 'ACID-compliant relational database' },
                { label: 'Time Series DB', value: 'InfluxDB 2.7', description: 'High-performance metrics storage' },
                { label: 'Document Store', value: 'MongoDB 7.0', description: 'Flexible schema for model metadata' },
                { label: 'Search Engine', value: 'Elasticsearch 8.10', description: 'Full-text search and analytics' },
                { label: 'Graph Database', value: 'Neo4j 5.12', description: 'Relationship mapping and analysis' },
                { label: 'Vector Database', value: 'Pinecone', description: 'Semantic similarity search' },
            ]
        }
    ];
    var apiEndpoints = [
        {
            method: 'POST',
            path: '/api/v2/evaluations',
            description: 'Create new strategic evaluation',
            parameters: ['model_a', 'model_b', 'task_config', 'priority'],
            response: 'evaluation_id, status, estimated_completion'
        },
        {
            method: 'GET',
            path: '/api/v2/evaluations/{id}',
            description: 'Get evaluation status and results',
            parameters: ['include_details', 'format'],
            response: 'evaluation_data, progress, results'
        },
        {
            method: 'GET',
            path: '/api/v2/models',
            description: 'List available models and capabilities',
            parameters: ['category', 'status', 'sort'],
            response: 'models[], metadata, pagination'
        },
        {
            method: 'POST',
            path: '/api/v2/models/register',
            description: 'Register new model for evaluation',
            parameters: ['model_config', 'access_credentials', 'capabilities'],
            response: 'model_id, validation_status, deployment_url'
        },
        {
            method: 'GET',
            path: '/api/v2/metrics/system',
            description: 'Get real-time system metrics',
            parameters: ['time_range', 'granularity', 'metrics'],
            response: 'system_health, performance_data, alerts'
        }
    ];
    var architectureLayers = [
        {
            layer: 'Presentation Layer',
            components: [
                { name: 'React Frontend', technology: 'Vite + TypeScript', status: 'active', load: 23, description: 'Strategic Command Center interface' },
                { name: 'API Gateway', technology: 'Kong Gateway', status: 'active', load: 45, description: 'Rate limiting and authentication' },
                { name: 'WebSocket Service', technology: 'Socket.io', status: 'active', load: 12, description: 'Real-time updates and notifications' }
            ]
        },
        {
            layer: 'Application Layer',
            components: [
                { name: 'Evaluation Engine', technology: 'Node.js + Python', status: 'active', load: 67, description: 'Core strategic evaluation processing' },
                { name: 'Model Registry', technology: 'FastAPI', status: 'active', load: 34, description: 'Model metadata and capability management' },
                { name: 'Result Analyzer', technology: 'Python + NumPy', status: 'maintenance', load: 0, description: 'Statistical analysis and ranking' }
            ]
        },
        {
            layer: 'Data Layer',
            components: [
                { name: 'Primary Database', technology: 'PostgreSQL', status: 'active', load: 56, description: 'Evaluation results and user data' },
                { name: 'Cache Cluster', technology: 'Redis', status: 'active', load: 23, description: 'Session and frequently accessed data' },
                { name: 'Object Storage', technology: 'MinIO S3', status: 'active', load: 15, description: 'Model artifacts and large files' }
            ]
        },
        {
            layer: 'Infrastructure Layer',
            components: [
                { name: 'Container Orchestration', technology: 'Kubernetes', status: 'active', load: 78, description: 'Service deployment and scaling' },
                { name: 'Service Mesh', technology: 'Istio', status: 'active', load: 34, description: 'Inter-service communication' },
                { name: 'Monitoring Stack', technology: 'Prometheus + Grafana', status: 'active', load: 45, description: 'Metrics collection and visualization' }
            ]
        }
    ];
    var securitySpecs = [
        { feature: 'Multi-Factor Authentication', status: 'Enabled', description: 'TOTP + Hardware keys supported' },
        { feature: 'Zero Trust Network', status: 'Active', description: 'Every request verified and encrypted' },
        { feature: 'Data Encryption', status: 'AES-256', description: 'At rest and in transit encryption' },
        { feature: 'API Rate Limiting', status: 'Configured', description: '1000 req/min per API key' },
        { feature: 'Audit Logging', status: 'Comprehensive', description: 'All actions logged and immutable' },
        { feature: 'Vulnerability Scanning', status: 'Automated', description: 'Daily security assessments' },
    ];
    var performanceMetrics = [
        { metric: 'Average Response Time', value: '89ms', target: '<100ms', status: 'optimal' },
        { metric: 'Throughput', value: '1,247 req/min', target: '>1000 req/min', status: 'optimal' },
        { metric: 'Uptime SLA', value: '99.97%', target: '99.9%', status: 'optimal' },
        { metric: 'Error Rate', value: '0.03%', target: '<0.1%', status: 'optimal' },
        { metric: 'P95 Latency', value: '156ms', target: '<200ms', status: 'optimal' },
        { metric: 'Concurrent Users', value: '2,847', target: '>2000', status: 'optimal' },
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case 'active':
            case 'optimal': return 'text-green-500 bg-green-500/10 border-green-500/30';
            case 'inactive': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
            case 'maintenance': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            case 'warning': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
            default: return 'text-muted-foreground bg-muted/10 border-muted/30';
        }
    };
    var getMethodColor = function (method) {
        switch (method) {
            case 'GET': return 'performance-elite strategic-rank';
            case 'POST': return 'performance-superior strategic-rank';
            case 'PUT': return 'rank-gold strategic-rank';
            case 'DELETE': return 'rank-bronze strategic-rank';
            default: return 'performance-standard strategic-rank';
        }
    };
    return (<div className={"glass-panel transition-all duration-500 ".concat(isExpanded ? 'fixed inset-4 z-50' : 'w-full max-w-6xl mx-auto')}>
      <card_1.CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <lucide_react_1.FileText className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <card_1.CardTitle className="heading-refined text-lg">Technical Specifications</card_1.CardTitle>
              <p className="text-xs text-muted-foreground">
                Comprehensive platform architecture and capabilities reference
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button_1.Button variant="ghost" size="sm" className="glass-minimal">
              <lucide_react_1.Download className="h-4 w-4 mr-2"/>
              <span className="text-xs">Export</span>
            </button_1.Button>
            <button_1.Button variant="ghost" size="sm" onClick={function () { return setIsExpanded(!isExpanded); }} className="glass-minimal p-2">
              {isExpanded ? <lucide_react_1.Minimize2 className="h-4 w-4"/> : <lucide_react_1.Maximize2 className="h-4 w-4"/>}
            </button_1.Button>
          </div>
        </div>
      </card_1.CardHeader>

      <card_1.CardContent>
        <tabs_1.Tabs value={activeSpec} onValueChange={setActiveSpec} className="space-y-6">
          <tabs_1.TabsList className="glass-subtle p-1 rounded-xl grid grid-cols-5 w-full max-w-2xl">
            <tabs_1.TabsTrigger value="system" className="text-xs">System</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="api" className="text-xs">API</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="architecture" className="text-xs">Architecture</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="security" className="text-xs">Security</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="performance" className="text-xs">Performance</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="system" className="space-y-6">
            {technicalSpecs.map(function (category, categoryIndex) { return (<div key={category.category}>
                <button_1.Button variant="ghost" onClick={function () { return toggleSection(category.category); }} className="w-full justify-between p-4 h-auto glass-subtle hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    {categoryIndex === 0 && <lucide_react_1.Layers className="h-4 w-4 text-primary"/>}
                    {categoryIndex === 1 && <lucide_react_1.Cpu className="h-4 w-4 text-secondary"/>}
                    {categoryIndex === 2 && <lucide_react_1.Database className="h-4 w-4 text-accent"/>}
                    <span className="heading-refined text-sm">{category.category}</span>
                  </div>
                  {expandedSections.includes(category.category) ?
                <lucide_react_1.ChevronDown className="h-4 w-4"/> :
                <lucide_react_1.ChevronRight className="h-4 w-4"/>}
                </button_1.Button>

                {expandedSections.includes(category.category) && (<div className="mt-3 space-y-3 pl-4">
                    {category.specs.map(function (spec, specIndex) { return (<card_1.Card key={specIndex} className="glass-minimal border-border/20">
                        <card_1.CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{spec.label}</span>
                              {spec.status && (<badge_1.Badge className={"text-xs ".concat(getStatusColor(spec.status))}>
                                  {spec.status.toUpperCase()}
                                </badge_1.Badge>)}
                            </div>
                            <span className="text-sm font-mono text-primary">{spec.value}</span>
                          </div>
                          {spec.description && (<p className="text-xs text-muted-foreground">{spec.description}</p>)}
                        </card_1.CardContent>
                      </card_1.Card>); })}
                  </div>)}
              </div>); })}
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="api" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">REST API Endpoints</h3>
              <badge_1.Badge className="performance-elite strategic-rank">v2.1.4</badge_1.Badge>
            </div>

            <div className="space-y-3">
              {apiEndpoints.map(function (endpoint, index) { return (<card_1.Card key={index} className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300">
                  <card_1.CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <badge_1.Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </badge_1.Badge>
                        <div>
                          <div className="text-sm font-mono font-medium text-primary">{endpoint.path}</div>
                          <div className="text-xs text-muted-foreground">{endpoint.description}</div>
                        </div>
                      </div>
                      <button_1.Button variant="ghost" size="sm" className="glass-minimal p-1">
                        <lucide_react_1.Copy className="h-3 w-3"/>
                      </button_1.Button>
                    </div>

                    {endpoint.parameters && (<div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">Parameters:</div>
                        <div className="flex flex-wrap gap-2">
                          {endpoint.parameters.map(function (param, paramIndex) { return (<badge_1.Badge key={paramIndex} variant="outline" className="text-xs font-mono">
                              {param}
                            </badge_1.Badge>); })}
                        </div>
                      </div>)}

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Response:</div>
                      <div className="text-xs font-mono text-green-400 bg-black/20 p-2 rounded">
                        {endpoint.response}
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="architecture" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">System Architecture Layers</h3>
              <button_1.Button variant="outline" size="sm" className="glass-minimal">
                <lucide_react_1.ExternalLink className="h-4 w-4 mr-2"/>
                View Diagram
              </button_1.Button>
            </div>

            <div className="space-y-4">
              {architectureLayers.map(function (layer, layerIndex) { return (<card_1.Card key={layer.layer} className="glass-subtle border-border/20">
                  <card_1.CardHeader className="pb-3">
                    <card_1.CardTitle className="text-sm flex items-center gap-2">
                      {layerIndex === 0 && <lucide_react_1.Monitor className="h-4 w-4 text-primary"/>}
                      {layerIndex === 1 && <lucide_react_1.Server className="h-4 w-4 text-secondary"/>}
                      {layerIndex === 2 && <lucide_react_1.Database className="h-4 w-4 text-accent"/>}
                      {layerIndex === 3 && <lucide_react_1.Cloud className="h-4 w-4 text-green-500"/>}
                      {layer.layer}
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-3">
                    {layer.components.map(function (component, componentIndex) { return (<div key={componentIndex} className="glass-minimal p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <badge_1.Badge className={getStatusColor(component.status)}>
                              {component.status.toUpperCase()}
                            </badge_1.Badge>
                            <div>
                              <div className="text-sm font-medium">{component.name}</div>
                              <div className="text-xs text-muted-foreground">{component.technology}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Load</div>
                            <div className="text-sm font-bold text-primary">{component.load}%</div>
                          </div>
                        </div>
                        <progress_1.Progress value={component.load} className="h-1 mb-2"/>
                        <div className="text-xs text-muted-foreground">{component.description}</div>
                      </div>); })}
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="security" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Security Framework</h3>
              <badge_1.Badge className="performance-elite strategic-rank">SOC 2 Type II</badge_1.Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {securitySpecs.map(function (spec, index) { return (<card_1.Card key={index} className="glass-subtle border-border/20">
                  <card_1.CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <lucide_react_1.Lock className="h-4 w-4 text-green-500"/>
                        <span className="text-sm font-medium">{spec.feature}</span>
                      </div>
                      <badge_1.Badge className="performance-superior strategic-rank">
                        {spec.status}
                      </badge_1.Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{spec.description}</p>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Performance Metrics</h3>
              <badge_1.Badge className="performance-elite strategic-rank">SLA: 99.9%</badge_1.Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {performanceMetrics.map(function (metric, index) { return (<card_1.Card key={index} className="glass-subtle border-border/20">
                  <card_1.CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <badge_1.Badge className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </badge_1.Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>

            <card_1.Card className="glass-subtle border-border/20">
              <card_1.CardHeader className="pb-3">
                <card_1.CardTitle className="text-sm flex items-center gap-2">
                  <lucide_react_1.Activity className="h-4 w-4 text-primary"/>
                  System Health Score
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-500">98.7%</span>
                  <badge_1.Badge className="performance-elite strategic-rank">EXCELLENT</badge_1.Badge>
                </div>
                <progress_1.Progress value={98.7} className="h-3 mb-2"/>
                <div className="text-xs text-muted-foreground">
                  Based on availability, performance, security, and user satisfaction metrics
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.CardContent>
    </div>);
};
exports.TechnicalSpecsDrawer = (0, react_1.memo)(TechnicalSpecsDrawerComponent);
