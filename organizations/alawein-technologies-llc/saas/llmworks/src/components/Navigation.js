"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var KeyboardShortcutsModal_1 = require("@/components/accessibility/KeyboardShortcutsModal");
var analytics_1 = require("@/lib/analytics");
var useCommandPalette_1 = require("@/hooks/useCommandPalette");
var NavigationComponent = function () {
    var location = (0, react_router_dom_1.useLocation)();
    var _a = (0, react_1.useState)(false), isMobileMenuOpen = _a[0], setIsMobileMenuOpen = _a[1];
    var _b = (0, react_1.useState)(false), scrolled = _b[0], setScrolled = _b[1];
    var logoRef = (0, react_1.useRef)(null);
    var openPalette = (0, useCommandPalette_1.useCommandPalette)().openPalette;
    var isActive = function (path) { return location.pathname === path; };
    var toggleMobileMenu = function () { return setIsMobileMenuOpen(!isMobileMenuOpen); };
    var closeMobileMenu = function () { return setIsMobileMenuOpen(false); };
    var handleNavClick = function (target) {
        (0, analytics_1.trackEvent)("nav_click", { target: target, from: location.pathname });
        closeMobileMenu();
    };
    // Scroll detection for enhanced nav styling
    (0, react_1.useEffect)(function () {
        var handleScroll = function () {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return function () { return window.removeEventListener('scroll', handleScroll); };
    }, []);
    // Logo magnetic effect
    (0, react_1.useEffect)(function () {
        var handleMouseMove = function (e) {
            if (!logoRef.current)
                return;
            var rect = logoRef.current.getBoundingClientRect();
            var x = (e.clientX - rect.left - rect.width / 2) * 0.1;
            var y = (e.clientY - rect.top - rect.height / 2) * 0.1;
            logoRef.current.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
        };
        var handleMouseLeave = function () {
            if (!logoRef.current)
                return;
            logoRef.current.style.transform = 'translate(0px, 0px)';
        };
        var element = logoRef.current;
        if (element) {
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);
        }
        return function () {
            if (element) {
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);
    return (<nav className={"\n        glass-panel border-0 border-b border-border/10 sticky top-0 z-50 transition-all duration-500\n        ".concat(scrolled ? 'shadow-lg backdrop-blur-xl' : 'backdrop-blur-lg', "\n      ")} role="navigation" aria-label="Main navigation" style={{
            background: scrolled
                ? 'hsl(var(--glass-background))'
                : 'hsl(var(--color-background) / 0.8)'
        }}>
      <div className="container-elegant">
        <div className="flex items-center justify-between h-20">
          {/* Sophisticated Logo */}
          <react_router_dom_1.Link to="/" className="flex items-center gap-4 group focus-elegant transition-all duration-300 rounded-xl p-2 -m-2" aria-label="LLM Works Home" onClick={function () { return handleNavClick("home"); }}>
            <div ref={logoRef} className="glass-panel p-3 rounded-xl group-hover:shadow-lg transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <lucide_react_1.Swords className="h-7 w-7 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-500" aria-hidden="true"/>
            </div>
            <div className="flex flex-col">
              <span className="heading-refined text-2xl text-primary group-hover:text-primary/90 transition-colors">
                LLM WORKS
              </span>
              <span className="text-xs text-primary/60 font-mono tracking-wider -mt-1">
                STRATEGIC COMMAND
              </span>
            </div>
          </react_router_dom_1.Link>

          {/* Sophisticated Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button_1.Button variant={isActive("/") ? "default" : "ghost"} size="sm" asChild className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300" aria-current={isActive("/") ? "page" : undefined}>
              <react_router_dom_1.Link to="/" onClick={function () { return handleNavClick("platform"); }} className="flex items-center gap-2">
                <lucide_react_1.Swords className="h-4 w-4 transition-all duration-300 group-hover:rotate-12"/>
                <span className="font-medium">Platform</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </react_router_dom_1.Link>
            </button_1.Button>

            <button_1.Button variant={isActive("/arena") ? "default" : "ghost"} size="sm" asChild className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300" aria-current={isActive("/arena") ? "page" : undefined}>
              <react_router_dom_1.Link to="/arena" onClick={function () { return handleNavClick("arena"); }} className="flex items-center gap-2">
                <lucide_react_1.Zap className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-400"/>
                <span className="font-medium">Arena</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </react_router_dom_1.Link>
            </button_1.Button>

            <button_1.Button variant={isActive("/bench") ? "default" : "ghost"} size="sm" asChild className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300" aria-current={isActive("/bench") ? "page" : undefined}>
              <react_router_dom_1.Link to="/bench" onClick={function () { return handleNavClick("bench"); }} className="flex items-center gap-2">
                <lucide_react_1.BarChart3 className="h-4 w-4 transition-all duration-300 group-hover:scale-110"/>
                <span className="font-medium">Bench</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </react_router_dom_1.Link>
            </button_1.Button>
            
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent mx-3" aria-hidden="true"/>
            
            <button_1.Button variant="ghost" size="sm" asChild className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300">
              <a href="https://github.com/alawein/aegis-ai-evaluator" target="_blank" rel="noopener noreferrer" onClick={function () { return handleNavClick("github"); }} className="flex items-center gap-2">
                <lucide_react_1.Github className="h-4 w-4 transition-all duration-300 group-hover:scale-110"/>
                <span className="font-medium">GitHub</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-500/20 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
            </button_1.Button>
            
            {/* Command Palette Trigger */}
            <button_1.Button variant="ghost" size="sm" className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300" onClick={function () {
            handleNavClick("command-palette");
            openPalette();
        }}>
              <lucide_react_1.Command className="h-4 w-4 mr-2 transition-all duration-300 group-hover:scale-110"/>
              <span className="font-medium text-xs">⌘K</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button_1.Button>
            
            <KeyboardShortcutsModal_1.KeyboardShortcutsModal trigger={<button_1.Button variant="ghost" size="sm" className="btn-elegant relative group hover:bg-primary/10 transition-all duration-300" onClick={function () { return handleNavClick("shortcuts"); }}>
                  <lucide_react_1.Keyboard className="h-4 w-4 mr-2 transition-all duration-300 group-hover:scale-110"/>
                  <span className="font-medium">Help</span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button_1.Button>}/>
          </div>

          <div className="flex items-center gap-4">
            {/* Security Status Badge */}
            <badge_1.Badge variant="secondary" className="hidden md:inline-flex text-xs bg-success/10 text-success border-success/30">
              ✓ Local Processing
            </badge_1.Badge>
            
            <button_1.Button variant="outline" size="sm" asChild className="hidden sm:inline-flex transition-smooth hover:bg-primary/10 border-primary/30 text-primary min-h-[44px]">
              <react_router_dom_1.Link to="/dashboard" onClick={function () { return handleNavClick("dashboard"); }}>
                Dashboard
              </react_router_dom_1.Link>
            </button_1.Button>

            {/* Mobile Menu Button */}
            <button_1.Button variant="ghost" size="sm" className="md:hidden p-2" onClick={toggleMobileMenu} aria-label="Toggle mobile menu" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? (<lucide_react_1.X className="h-6 w-6"/>) : (<lucide_react_1.Menu className="h-6 w-6"/>)}
            </button_1.Button>
          </div>
        </div>

        {/* Sophisticated Mobile Navigation Menu */}
        {isMobileMenuOpen && (<div className="md:hidden glass-panel border-t border-border/10 shadow-elegant">
            <div className="container-elegant py-6 space-y-3 stagger-children">
              <div style={{ '--stagger-index': 0 }}>
                <button_1.Button variant={isActive("/") ? "default" : "ghost"} size="sm" asChild className="btn-elegant w-full justify-start relative group hover:bg-primary/10" aria-current={isActive("/") ? "page" : undefined}>
                  <react_router_dom_1.Link to="/" onClick={function () { return handleNavClick("platform"); }} className="flex items-center gap-3 p-4">
                    <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                      <lucide_react_1.Swords className="h-4 w-4 transition-all group-hover:rotate-12"/>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Platform</span>
                      <span className="text-xs opacity-60">Overview & Stats</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </react_router_dom_1.Link>
                </button_1.Button>
              </div>

              <div style={{ '--stagger-index': 1 }}>
                <button_1.Button variant={isActive("/arena") ? "default" : "ghost"} size="sm" asChild className="btn-elegant w-full justify-start relative group hover:bg-primary/10" aria-current={isActive("/arena") ? "page" : undefined}>
                  <react_router_dom_1.Link to="/arena" onClick={function () { return handleNavClick("arena"); }} className="flex items-center gap-3 p-4">
                    <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                      <lucide_react_1.Zap className="h-4 w-4 transition-all group-hover:scale-110 group-hover:text-yellow-400"/>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Arena</span>
                      <span className="text-xs opacity-60">Battle Interface</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </react_router_dom_1.Link>
                </button_1.Button>
              </div>

              <div style={{ '--stagger-index': 2 }}>
                <button_1.Button variant={isActive("/bench") ? "default" : "ghost"} size="sm" asChild className="btn-elegant w-full justify-start relative group hover:bg-primary/10" aria-current={isActive("/bench") ? "page" : undefined}>
                  <react_router_dom_1.Link to="/bench" onClick={function () { return handleNavClick("bench"); }} className="flex items-center gap-3 p-4">
                    <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                      <lucide_react_1.BarChart3 className="h-4 w-4 transition-all group-hover:scale-110"/>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Bench</span>
                      <span className="text-xs opacity-60">Benchmarks</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </react_router_dom_1.Link>
                </button_1.Button>
              </div>

              <div style={{ '--stagger-index': 3 }}>
                <button_1.Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm" asChild className="btn-elegant w-full justify-start relative group hover:bg-primary/10" aria-current={isActive("/dashboard") ? "page" : undefined}>
                  <react_router_dom_1.Link to="/dashboard" onClick={function () { return handleNavClick("dashboard"); }} className="flex items-center gap-3 p-4">
                    <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                      <lucide_react_1.Settings className="h-4 w-4 transition-all group-hover:rotate-90"/>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Dashboard</span>
                      <span className="text-xs opacity-60">Management</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </react_router_dom_1.Link>
                </button_1.Button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4" aria-hidden="true"/>

              <div style={{ '--stagger-index': 4 }}>
                <button_1.Button variant="ghost" size="sm" asChild className="btn-elegant w-full justify-start relative group hover:bg-primary/10">
                  <a href="https://github.com/alawein/aegis-ai-evaluator" target="_blank" rel="noopener noreferrer" onClick={function () { return handleNavClick("github"); }} className="flex items-center gap-3 p-4">
                    <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                      <lucide_react_1.Github className="h-4 w-4 transition-all group-hover:scale-110"/>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">GitHub</span>
                      <span className="text-xs opacity-60">Source Code</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-500/20 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </a>
                </button_1.Button>
              </div>
              
              <div style={{ '--stagger-index': 5 }}>
                <KeyboardShortcutsModal_1.KeyboardShortcutsModal trigger={<button_1.Button variant="ghost" size="sm" className="btn-elegant w-full justify-start relative group hover:bg-primary/10" onClick={function () { return handleNavClick("shortcuts"); }}>
                      <div className="flex items-center gap-3 p-4 w-full">
                        <div className="glass-subtle p-2 rounded-lg group-hover:shadow-md transition-all">
                          <lucide_react_1.Keyboard className="h-4 w-4 transition-all group-hover:scale-110"/>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Help</span>
                          <span className="text-xs opacity-60">Shortcuts</span>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>
                    </button_1.Button>}/>
              </div>

              <div className="pt-4" style={{ '--stagger-index': 6 }}>
                <div className="glass-minimal p-3 rounded-lg">
                  <badge_1.Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/30 font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    Local Processing
                  </badge_1.Badge>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </nav>);
};
exports.Navigation = (0, react_1.memo)(NavigationComponent);
