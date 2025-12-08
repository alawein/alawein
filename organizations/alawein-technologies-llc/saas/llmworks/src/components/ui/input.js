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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var React = require("react");
var utils_1 = require("@/lib/utils");
var Input = React.forwardRef(function (_a, ref) {
    var className = _a.className, type = _a.type, props = __rest(_a, ["className", "type"]);
    return (<input type={type} className={(0, utils_1.cn)("flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/55 focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,hsl(var(--focus-ring))_35%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger", className)} ref={ref} {...props}/>);
});
exports.Input = Input;
Input.displayName = "Input";
