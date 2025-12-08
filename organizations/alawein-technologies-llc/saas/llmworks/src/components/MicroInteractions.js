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
exports.SlideInView = exports.StaggeredChildren = exports.ScaleOnHover = exports.GlowOnHover = exports.FloatingElement = exports.ParallaxElement = exports.MagneticHover = exports.RippleEffect = void 0;
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
exports.RippleEffect = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.duration, duration = _b === void 0 ? 600 : _b, _c = _a.color, color = _c === void 0 ? "hsl(var(--primary) / 0.3)" : _c;
    var _d = (0, react_1.useState)([]), ripples = _d[0], setRipples = _d[1];
    var nextRippleId = (0, react_1.useRef)(0);
    var handleClick = function (e) {
        var rect = e.currentTarget.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        var newRipple = {
            id: nextRippleId.current++,
            x: x,
            y: y,
            size: size
        };
        setRipples(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newRipple], false); });
        setTimeout(function () {
            setRipples(function (prev) { return prev.filter(function (ripple) { return ripple.id !== newRipple.id; }); });
        }, duration);
    };
    return (<div className={(0, utils_1.cn)("relative overflow-hidden", className)} onClick={handleClick}>
      {children}
      {ripples.map(function (ripple) { return (<span key={ripple.id} className="absolute rounded-full animate-ping opacity-0" style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: color,
                animation: "ripple ".concat(duration, "ms cubic-bezier(0.4, 0, 0.2, 1)"),
            }}/>); })}
      <style>{"\n        @keyframes ripple {\n          0% {\n            transform: scale(0);\n            opacity: 0.6;\n          }\n          100% {\n            transform: scale(2);\n            opacity: 0;\n          }\n        }\n      "}</style>
    </div>);
});
exports.RippleEffect.displayName = 'RippleEffect';
exports.MagneticHover = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.strength, strength = _b === void 0 ? 0.3 : _b, _c = _a.resetOnLeave, resetOnLeave = _c === void 0 ? true : _c;
    var elementRef = (0, react_1.useRef)(null);
    var handleMouseMove = function (e) {
        if (!elementRef.current)
            return;
        var rect = elementRef.current.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var deltaX = (e.clientX - centerX) * strength;
        var deltaY = (e.clientY - centerY) * strength;
        elementRef.current.style.transform = "translate(".concat(deltaX, "px, ").concat(deltaY, "px)");
    };
    var handleMouseLeave = function () {
        if (!elementRef.current || !resetOnLeave)
            return;
        elementRef.current.style.transform = 'translate(0px, 0px)';
    };
    return (<div ref={elementRef} className={(0, utils_1.cn)("transition-transform duration-200 ease-out", className)} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>);
});
exports.MagneticHover.displayName = 'MagneticHover';
exports.ParallaxElement = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.speed, speed = _b === void 0 ? 0.5 : _b, _c = _a.direction, direction = _c === void 0 ? 'up' : _c;
    var elementRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var handleScroll = function () {
            if (!elementRef.current)
                return;
            var rect = elementRef.current.getBoundingClientRect();
            var scrolled = window.pageYOffset;
            var rate = scrolled * speed;
            var transform = '';
            switch (direction) {
                case 'up':
                    transform = "translateY(-".concat(rate, "px)");
                    break;
                case 'down':
                    transform = "translateY(".concat(rate, "px)");
                    break;
                case 'left':
                    transform = "translateX(-".concat(rate, "px)");
                    break;
                case 'right':
                    transform = "translateX(".concat(rate, "px)");
                    break;
            }
            elementRef.current.style.transform = transform;
        };
        window.addEventListener('scroll', handleScroll);
        return function () { return window.removeEventListener('scroll', handleScroll); };
    }, [speed, direction]);
    return (<div ref={elementRef} className={className}>
      {children}
    </div>);
});
exports.ParallaxElement.displayName = 'ParallaxElement';
exports.FloatingElement = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.intensity, intensity = _b === void 0 ? 'medium' : _b, _c = _a.duration, duration = _c === void 0 ? 3000 : _c;
    var intensityMap = {
        subtle: '2px',
        medium: '4px',
        strong: '8px'
    };
    var floatAnimation = "float-".concat(intensity);
    return (<div className={(0, utils_1.cn)("animate-float", className)} style={{
            animation: "".concat(floatAnimation, " ").concat(duration, "ms ease-in-out infinite"),
            '--float-distance': intensityMap[intensity]
        }}>
      {children}
      <style>{"\n        @keyframes float-subtle {\n          0%, 100% { transform: translateY(0); }\n          50% { transform: translateY(-2px); }\n        }\n        @keyframes float-medium {\n          0%, 100% { transform: translateY(0); }\n          50% { transform: translateY(-4px); }\n        }\n        @keyframes float-strong {\n          0%, 100% { transform: translateY(0); }\n          50% { transform: translateY(-8px); }\n        }\n      "}</style>
    </div>);
});
exports.FloatingElement.displayName = 'FloatingElement';
exports.GlowOnHover = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.glowColor, glowColor = _b === void 0 ? 'hsl(var(--primary))' : _b, _c = _a.glowIntensity, glowIntensity = _c === void 0 ? 'medium' : _c;
    var intensityMap = {
        subtle: '0 0 10px',
        medium: '0 0 20px',
        strong: '0 0 30px'
    };
    return (<div className={(0, utils_1.cn)("transition-all duration-300 hover:scale-[1.02]", className)} style={{
            '--glow-color': glowColor,
            '--glow-intensity': intensityMap[glowIntensity]
        }} onMouseEnter={function (e) {
            e.currentTarget.style.boxShadow = "var(--glow-intensity) var(--glow-color)";
        }} onMouseLeave={function (e) {
            e.currentTarget.style.boxShadow = 'none';
        }}>
      {children}
    </div>);
});
exports.GlowOnHover.displayName = 'GlowOnHover';
exports.ScaleOnHover = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.scale, scale = _b === void 0 ? 1.05 : _b, _c = _a.duration, duration = _c === void 0 ? 200 : _c;
    return (<div className={(0, utils_1.cn)("cursor-pointer", className)} style={{
            transition: "transform ".concat(duration, "ms cubic-bezier(0.4, 0, 0.2, 1)"),
        }} onMouseEnter={function (e) {
            e.currentTarget.style.transform = "scale(".concat(scale, ")");
        }} onMouseLeave={function (e) {
            e.currentTarget.style.transform = 'scale(1)';
        }}>
      {children}
    </div>);
});
exports.ScaleOnHover.displayName = 'ScaleOnHover';
exports.StaggeredChildren = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.staggerDelay, staggerDelay = _b === void 0 ? 100 : _b;
    return (<div className={(0, utils_1.cn)("stagger-children", className)}>
      {react_1.default.Children.map(children, function (child, index) { return (<div style={{ '--stagger-index': index, '--stagger-delay': "".concat(staggerDelay, "ms") }}>
          {child}
        </div>); })}
    </div>);
});
exports.StaggeredChildren.displayName = 'StaggeredChildren';
exports.SlideInView = (0, react_1.memo)(function (_a) {
    var children = _a.children, className = _a.className, _b = _a.direction, direction = _b === void 0 ? 'up' : _b, _c = _a.delay, delay = _c === void 0 ? 0 : _c;
    var _d = (0, react_1.useState)(false), isVisible = _d[0], setIsVisible = _d[1];
    var elementRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            if (entry.isIntersecting) {
                setTimeout(function () { return setIsVisible(true); }, delay);
            }
        }, { threshold: 0.1 });
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return function () { return observer.disconnect(); };
    }, [delay]);
    var directionClasses = {
        up: isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        down: isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0',
        left: isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
        right: isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0',
    };
    return (<div ref={elementRef} className={(0, utils_1.cn)("transition-all duration-700 ease-out", directionClasses[direction], className)}>
      {children}
    </div>);
});
exports.SlideInView.displayName = 'SlideInView';
