"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
exports.InteractiveBackground = exports.MicroInteraction = exports.HoverEffects = exports.MagneticIcon = exports.MagneticButton = exports.MagneticCard = exports.MagneticElement = void 0;
var react_1 = require("react");
var MagneticElementComponent = function (_a) {
    var children = _a.children, _b = _a.strength, strength = _b === void 0 ? 0.3 : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.attraction, attraction = _e === void 0 ? 'mouse' : _e, _f = _a.glowEffect, glowEffect = _f === void 0 ? false : _f, _g = _a.rippleEffect, rippleEffect = _g === void 0 ? false : _g;
    var elementRef = (0, react_1.useRef)(null);
    var _h = (0, react_1.useState)(false), isHovering = _h[0], setIsHovering = _h[1];
    var _j = (0, react_1.useState)([]), ripples = _j[0], setRipples = _j[1];
    (0, react_1.useEffect)(function () {
        if (disabled || !elementRef.current)
            return;
        var element = elementRef.current;
        var handleMouseMove = function (e) {
            var rect = element.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var targetX = 0;
            var targetY = 0;
            switch (attraction) {
                case 'mouse': {
                    targetX = (e.clientX - centerX) * strength;
                    targetY = (e.clientY - centerY) * strength;
                    break;
                }
                case 'center': {
                    var distanceFromCenter = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
                    if (distanceFromCenter < rect.width) {
                        targetX = -(e.clientX - centerX) * strength * 0.5;
                        targetY = -(e.clientY - centerY) * strength * 0.5;
                    }
                    break;
                }
                case 'edges': {
                    if (e.clientX < centerX) {
                        targetX = -strength * 20;
                    }
                    else {
                        targetX = strength * 20;
                    }
                    if (e.clientY < centerY) {
                        targetY = -strength * 20;
                    }
                    else {
                        targetY = strength * 20;
                    }
                    break;
                }
            }
            element.style.transform = "translate3d(".concat(targetX, "px, ").concat(targetY, "px, 0) scale(").concat(1 + strength * 0.1, ")");
            if (glowEffect) {
                element.style.filter = "brightness(".concat(1 + strength, ") drop-shadow(0 0 ").concat(strength * 20, "px currentColor)");
            }
        };
        var handleMouseEnter = function () {
            setIsHovering(true);
            element.style.transition = 'none';
        };
        var handleMouseLeave = function () {
            setIsHovering(false);
            element.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.320, 1)';
            element.style.transform = 'translate3d(0, 0, 0) scale(1)';
            if (glowEffect) {
                element.style.filter = 'none';
            }
        };
        var handleClick = function (e) {
            if (!rippleEffect)
                return;
            var rect = element.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            var rippleId = "ripple-".concat(Date.now());
            setRipples(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ id: rippleId, x: x, y: y }], false); });
            setTimeout(function () {
                setRipples(function (prev) { return prev.filter(function (r) { return r.id !== rippleId; }); });
            }, 600);
        };
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('click', handleClick);
        return function () {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('click', handleClick);
        };
    }, [strength, disabled, attraction, glowEffect, rippleEffect]);
    return (<div ref={elementRef} className={"relative cursor-pointer ".concat(className)} style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
        }}>
      {children}
      
      {/* Hover Glow Effect */}
      {glowEffect && isHovering && (<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-inherit animate-pulse pointer-events-none"/>)}

      {/* Ripple Effects */}
      {rippleEffect && ripples.map(function (ripple) { return (<div key={ripple.id} className="absolute pointer-events-none" style={{
                left: "".concat(ripple.x, "%"),
                top: "".concat(ripple.y, "%"),
                transform: 'translate(-50%, -50%)'
            }}>
          <div className="w-0 h-0 bg-primary/30 rounded-full animate-ping" style={{ animation: 'ripple-expand 0.6s ease-out' }}/>
        </div>); })}

      <style>{"\n        @keyframes ripple-expand {\n          0% {\n            width: 0;\n            height: 0;\n            opacity: 1;\n          }\n          100% {\n            width: 100px;\n            height: 100px;\n            opacity: 0;\n          }\n        }\n      "}</style>
    </div>);
};
exports.MagneticElement = (0, react_1.memo)(MagneticElementComponent);
// Preset magnetic components for common use cases
exports.MagneticCard = (0, react_1.memo)(function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["children", "className"]);
    return (<exports.MagneticElement strength={0.2} glowEffect={true} className={"glass-panel hover:shadow-lg transition-shadow duration-300 ".concat(className)} {...props}>
    {children}
  </exports.MagneticElement>);
});
exports.MagneticButton = (0, react_1.memo)(function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["children", "className"]);
    return (<exports.MagneticElement strength={0.4} rippleEffect={true} className={"relative overflow-hidden ".concat(className)} {...props}>
    {children}
  </exports.MagneticElement>);
});
exports.MagneticIcon = (0, react_1.memo)(function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["children", "className"]);
    return (<exports.MagneticElement strength={0.6} attraction="center" className={"inline-block ".concat(className)} {...props}>
    {children}
  </exports.MagneticElement>);
});
exports.HoverEffects = (0, react_1.memo)(function (_a) {
    var children = _a.children, effect = _a.effect, _b = _a.intensity, intensity = _b === void 0 ? 'medium' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var getIntensityValue = function () {
        switch (intensity) {
            case 'low': return 0.5;
            case 'medium': return 1;
            case 'high': return 1.5;
            default: return 1;
        }
    };
    var getEffectClasses = function () {
        var scale = getIntensityValue();
        switch (effect) {
            case 'lift':
                return "hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl";
            case 'tilt':
                return "hover:rotate-1 hover:scale-105 transition-all duration-300";
            case 'glow':
                return "hover:shadow-glow transition-all duration-300 hover:brightness-110";
            case 'shake':
                return "hover:animate-pulse transition-all duration-200";
            case 'pulse':
                return "hover:animate-pulse hover:scale-105 transition-all duration-300";
            case 'rotate':
                return "hover:rotate-12 hover:scale-110 transition-all duration-300";
            case 'elastic':
                return "hover:scale-110 transition-all duration-300 hover:animate-bounce";
            default:
                return '';
        }
    };
    return (<div className={"".concat(getEffectClasses(), " ").concat(className)}>
      {children}
    </div>);
});
exports.MicroInteraction = (0, react_1.memo)(function (_a) {
    var children = _a.children, type = _a.type, _b = _a.className, className = _b === void 0 ? '' : _b;
    var getTypeClasses = function () {
        switch (type) {
            case 'button':
                return 'hover:scale-105 active:scale-95 transition-transform duration-150 hover:shadow-md';
            case 'icon':
                return 'hover:scale-125 hover:rotate-12 transition-all duration-200 hover:text-primary';
            case 'text':
                return 'hover:text-primary transition-colors duration-200 hover:tracking-wide';
            case 'image':
                return 'hover:scale-105 hover:brightness-110 transition-all duration-300 hover:shadow-lg';
            default:
                return '';
        }
    };
    return (<div className={"cursor-pointer ".concat(getTypeClasses(), " ").concat(className)}>
      {children}
    </div>);
});
// Interactive Background Elements
exports.InteractiveBackground = (0, react_1.memo)(function () {
    var _a = (0, react_1.useState)([]), particles = _a[0], setParticles = _a[1];
    (0, react_1.useEffect)(function () {
        var handleClick = function (e) {
            var newParticle = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
                active: true
            };
            setParticles(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newParticle], false); });
            setTimeout(function () {
                setParticles(function (prev) { return prev.filter(function (p) { return p.id !== newParticle.id; }); });
            }, 1000);
        };
        document.addEventListener('click', handleClick);
        return function () { return document.removeEventListener('click', handleClick); };
    }, []);
    return (<div className="fixed inset-0 pointer-events-none z-10">
      {particles.map(function (particle) { return (<div key={particle.id} className="absolute w-4 h-4 bg-primary/30 rounded-full animate-ping" style={{
                left: particle.x - 8,
                top: particle.y - 8,
                animation: 'click-ripple 1s ease-out'
            }}/>); })}
      
      <style>{"\n        @keyframes click-ripple {\n          0% {\n            transform: scale(0);\n            opacity: 1;\n          }\n          100% {\n            transform: scale(4);\n            opacity: 0;\n          }\n        }\n      "}</style>
    </div>);
});
