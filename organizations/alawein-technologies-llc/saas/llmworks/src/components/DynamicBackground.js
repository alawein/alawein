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
exports.DynamicBackground = void 0;
var react_1 = require("react");
var DynamicBackgroundComponent = function (_a) {
    var _b = _a.intensity, intensity = _b === void 0 ? 'medium' : _b, _c = _a.theme, theme = _c === void 0 ? 'tactical' : _c;
    var _d = (0, react_1.useState)([]), elements = _d[0], setElements = _d[1];
    var _e = (0, react_1.useState)({ x: 50, y: 50 }), mousePos = _e[0], setMousePos = _e[1];
    var containerRef = (0, react_1.useRef)(null);
    var getElementCount = function () {
        switch (intensity) {
            case 'low': return 8;
            case 'medium': return 15;
            case 'high': return 25;
            default: return 15;
        }
    };
    var getThemeColors = function () {
        switch (theme) {
            case 'tactical':
                return ['#2563EB', '#0891B2', '#B45309', '#059669'];
            case 'neural':
                return ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
            case 'cyber':
                return ['#06B6D4', '#84CC16', '#F97316', '#EF4444'];
            default:
                return ['#2563EB', '#0891B2', '#B45309', '#059669'];
        }
    };
    var generateElements = function () {
        var colors = getThemeColors();
        var types = ['circuit', 'data', 'signal', 'node'];
        return Array.from({ length: getElementCount() }, function (_, i) { return ({
            id: "element-".concat(i),
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: 2 + Math.random() * 4,
            opacity: 0.1 + Math.random() * 0.3,
            type: types[Math.floor(Math.random() * types.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2
        }); });
    };
    (0, react_1.useEffect)(function () {
        setElements(generateElements());
    }, [intensity, theme]);
    // Mouse tracking for interactive effects
    (0, react_1.useEffect)(function () {
        var handleMouseMove = function (e) {
            if (!containerRef.current)
                return;
            var rect = containerRef.current.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePos({ x: x, y: y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return function () { return window.removeEventListener('mousemove', handleMouseMove); };
    }, []);
    // Animation loop
    (0, react_1.useEffect)(function () {
        var animationLoop = setInterval(function () {
            setElements(function (prevElements) {
                return prevElements.map(function (element) { return (__assign(__assign({}, element), { x: (element.x + element.vx + 100) % 100, y: (element.y + element.vy + 100) % 100, rotation: (element.rotation + element.rotationSpeed) % 360, 
                    // Subtle mouse interaction
                    vx: element.vx + (Math.random() - 0.5) * 0.01, vy: element.vy + (Math.random() - 0.5) * 0.01 })); });
            });
        }, 50);
        return function () { return clearInterval(animationLoop); };
    }, []);
    var renderElement = function (element) {
        var distance = Math.sqrt(Math.pow(element.x - mousePos.x, 2) + Math.pow(element.y - mousePos.y, 2));
        var mouseInfluence = Math.max(0, (20 - distance) / 20);
        var adjustedOpacity = element.opacity + (mouseInfluence * 0.3);
        var commonProps = {
            style: {
                left: "".concat(element.x, "%"),
                top: "".concat(element.y, "%"),
                transform: "translate(-50%, -50%) rotate(".concat(element.rotation, "deg) scale(").concat(1 + mouseInfluence * 0.5, ")"),
                opacity: adjustedOpacity,
                color: element.color,
                fontSize: "".concat(element.size, "px"),
                transition: 'all 0.3s ease-out'
            },
            className: "absolute pointer-events-none"
        };
        switch (element.type) {
            case 'circuit':
                return (<div key={element.id} {...commonProps}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h12v12H2V2zm2 2v8h8V4H4zm2 2h4v4H6V6z" opacity="0.6"/>
              <circle cx="4" cy="4" r="1" fill="currentColor"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
          </div>);
            case 'data':
                return (<div key={element.id} {...commonProps}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="10" height="2" opacity="0.8"/>
              <rect x="1" y="4" width="6" height="2" opacity="0.6"/>
              <rect x="1" y="7" width="8" height="2" opacity="0.4"/>
            </svg>
          </div>);
            case 'signal':
                return (<div key={element.id} {...commonProps}>
            <div style={{
                        width: "".concat(element.size * 2, "px"),
                        height: '2px',
                        background: "linear-gradient(90deg, transparent, ".concat(element.color, ", transparent)"),
                        borderRadius: '1px'
                    }}/>
          </div>);
            case 'node':
                return (<div key={element.id} {...commonProps}>
            <div style={{
                        width: "".concat(element.size, "px"),
                        height: "".concat(element.size, "px"),
                        borderRadius: '50%',
                        background: "radial-gradient(circle, ".concat(element.color, "40, transparent)"),
                        border: "1px solid ".concat(element.color, "60"),
                        boxShadow: "0 0 ".concat(element.size * 2, "px ").concat(element.color, "20")
                    }}/>
          </div>);
            default:
                return null;
        }
    };
    return (<div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02]"/>
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.01] via-transparent to-primary/[0.01]"/>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="tactical-grid" width="80" height="80" patternUnits="userSpaceOnUse" className="text-primary/20">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tactical-grid)"/>
        </svg>
      </div>

      {/* Floating Elements */}
      {elements.map(renderElement)}

      {/* Ambient Light Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{
            left: "".concat(mousePos.x - 10, "%"),
            top: "".concat(mousePos.y - 10, "%"),
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
        }}/>
        <div className="absolute w-64 h-64 bg-secondary/3 rounded-full blur-2xl" style={{
            left: "".concat(100 - mousePos.x + 5, "%"),
            top: "".concat(100 - mousePos.y + 5, "%"),
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.4s ease-out'
        }}/>
      </div>

      {/* Scanning Lines */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" style={{
            top: '20%',
            animation: 'scan-vertical 8s linear infinite'
        }}/>
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-secondary/15 to-transparent" style={{
            left: '80%',
            animation: 'scan-horizontal 12s linear infinite'
        }}/>
      </div>

      <style>{"\n        @keyframes scan-vertical {\n          0% { top: -2px; opacity: 0; }\n          10% { opacity: 1; }\n          90% { opacity: 1; }\n          100% { top: 100%; opacity: 0; }\n        }\n        \n        @keyframes scan-horizontal {\n          0% { left: -2px; opacity: 0; }\n          10% { opacity: 1; }\n          90% { opacity: 1; }\n          100% { left: 100%; opacity: 0; }\n        }\n      "}</style>
    </div>);
};
exports.DynamicBackground = (0, react_1.memo)(DynamicBackgroundComponent);
