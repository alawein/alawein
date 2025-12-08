"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var badge_1 = require("@/components/ui/badge");
var FooterComponent = function () {
    var currentYear = new Date().getFullYear();
    return (<footer className="relative glass-panel border-t border-border/10 mt-32 overflow-hidden section-angled" style={{
            background: "\n          radial-gradient(circle at 20% 80%, hsl(var(--color-primary) / 0.02), transparent 60%),\n          radial-gradient(circle at 80% 20%, hsl(var(--color-accent) / 0.01), transparent 60%),\n          var(--color-background)\n        "
        }}>
      {/* Sophisticated Background Effects */}
      <div className="absolute inset-0 subtle-texture opacity-20"></div>
      <div className="absolute top-0 left-1/3 w-px h-16 bg-gradient-to-b from-primary/20 to-transparent"></div>
      <div className="absolute bottom-0 right-1/4 w-px h-12 bg-gradient-to-t from-secondary/15 to-transparent"></div>
      
      <div className="container-elegant py-20 relative z-10">
        <div className="grid-sophisticated max-w-6xl mx-auto stagger-children">
          
          {/* Enhanced Brand Section */}
          <div className="col-span-full md:col-span-2" style={{ '--stagger-index': 0 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="glass-panel p-3 rounded-xl relative group transition-all duration-500 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <lucide_react_1.Swords className="h-8 w-8 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-500" aria-hidden="true"/>
              </div>
              <div>
                <h3 className="heading-refined text-2xl text-primary mb-1">LLM WORKS</h3>
                <p className="text-xs text-primary/60 font-mono tracking-wider">STRATEGIC COMMAND</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="body-elegant text-base leading-relaxed">
                Where AI models engage in sophisticated strategic evaluations. 
                Through tactical assessments, creative challenges, and rigorous benchmarks, 
                we identify the strongest artificial intelligence.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <badge_1.Badge className="glass-minimal border-0 px-4 py-2">
                  <lucide_react_1.Shield className="h-3 w-3 mr-2"/>
                  <span className="text-xs font-medium">Open Source</span>
                </badge_1.Badge>
                <badge_1.Badge className="glass-minimal border-0 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span className="text-xs font-medium">Real-time Evaluations</span>
                </badge_1.Badge>
              </div>
            </div>
          </div>

          {/* Sophisticated Platform Links */}
          <div style={{ '--stagger-index': 1 }}>
            <h3 className="heading-refined text-sm text-foreground mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              Strategic Zones
            </h3>
            <ul className="space-y-4">
              <li>
                <react_router_dom_1.Link to="/arena" className="group flex items-center gap-2 body-elegant text-sm text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">The Arena</span>
                </react_router_dom_1.Link>
              </li>
              <li>
                <react_router_dom_1.Link to="/bench" className="group flex items-center gap-2 body-elegant text-sm text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">The Bench</span>
                </react_router_dom_1.Link>
              </li>
              <li>
                <react_router_dom_1.Link to="/dashboard" className="group flex items-center gap-2 body-elegant text-sm text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Command Center</span>
                </react_router_dom_1.Link>
              </li>
            </ul>
          </div>


          {/* Premium Legal Section */}
          <div style={{ '--stagger-index': 3 }}>
            <h3 className="heading-refined text-sm text-foreground mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-accent to-primary rounded-full"></div>
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <react_router_dom_1.Link to="/privacy" className="group flex items-center gap-2 body-elegant text-xs text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                </react_router_dom_1.Link>
              </li>
              <li>
                <react_router_dom_1.Link to="/terms" className="group flex items-center gap-2 body-elegant text-xs text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                </react_router_dom_1.Link>
              </li>
              <li>
                <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 body-elegant text-xs text-muted-foreground hover:text-primary transition-all duration-300 focus-elegant rounded-lg p-2 -m-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">MIT License</span>
                  <lucide_react_1.ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-all duration-300"/>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sophisticated Bottom Section */}
        <div className="relative mt-16 pt-8" style={{ '--stagger-index': 4 }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <p className="body-elegant text-sm text-muted-foreground">
                © {currentYear} <span className="text-primary font-medium">LLM Works Community</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
                  Strategic AI evaluation
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <badge_1.Badge className="glass-minimal border-0 px-3 py-1 text-xs">
                <span className="font-mono">v2.0</span>
              </badge_1.Badge>
              <badge_1.Badge className="glass-minimal border-0 px-3 py-1 text-xs">
                <span className="text-primary">◦</span>
                <span className="ml-1 font-medium">ACTIVE</span>
              </badge_1.Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>);
};
exports.Footer = (0, react_1.memo)(FooterComponent);
