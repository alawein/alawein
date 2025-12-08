"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommandPalette = void 0;
var react_1 = require("react");
var useCommandPalette = function () {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var openPalette = (0, react_1.useCallback)(function () {
        setIsOpen(true);
    }, []);
    var closePalette = (0, react_1.useCallback)(function () {
        setIsOpen(false);
    }, []);
    var togglePalette = (0, react_1.useCallback)(function () {
        setIsOpen(function (prev) { return !prev; });
    }, []);
    // Global keyboard shortcut
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (e) {
            // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                togglePalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () { return window.removeEventListener('keydown', handleKeyDown); };
    }, [togglePalette]);
    return {
        isOpen: isOpen,
        openPalette: openPalette,
        closePalette: closePalette,
        togglePalette: togglePalette,
        setIsOpen: setIsOpen
    };
};
exports.useCommandPalette = useCommandPalette;
