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
exports.useComponentShortcuts = exports.useKeyboardShortcuts = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var screen_reader_1 = require("@/lib/screen-reader");
// Global keyboard shortcuts for the application
var useKeyboardShortcuts = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    // Navigation shortcuts
    var navigationShortcuts = [
        {
            key: 'h',
            altKey: true,
            action: function () {
                navigate('/');
                (0, screen_reader_1.announceToScreenReader)('Navigated to home page');
            },
            description: 'Go to home page'
        },
        {
            key: 'a',
            altKey: true,
            action: function () {
                navigate('/arena');
                (0, screen_reader_1.announceToScreenReader)('Navigated to Arena evaluation');
            },
            description: 'Open Arena evaluation'
        },
        {
            key: 'b',
            altKey: true,
            action: function () {
                navigate('/bench');
                (0, screen_reader_1.announceToScreenReader)('Navigated to Bench evaluation');
            },
            description: 'Open Bench evaluation'
        },
        {
            key: 'd',
            altKey: true,
            action: function () {
                navigate('/dashboard');
                (0, screen_reader_1.announceToScreenReader)('Navigated to Dashboard');
            },
            description: 'Open Dashboard'
        },
        {
            key: 's',
            altKey: true,
            action: function () {
                navigate('/settings');
                (0, screen_reader_1.announceToScreenReader)('Navigated to Settings');
            },
            description: 'Open Settings'
        },
    ];
    // Accessibility shortcuts
    var accessibilityShortcuts = [
        {
            key: 'c',
            altKey: true,
            action: function () {
                document.documentElement.classList.toggle('a11y-high-contrast');
                var isEnabled = document.documentElement.classList.contains('a11y-high-contrast');
                (0, screen_reader_1.announceToScreenReader)("High contrast mode ".concat(isEnabled ? 'enabled' : 'disabled'));
                // Save preference
                localStorage.setItem('accessibility-high-contrast', isEnabled.toString());
            },
            description: 'Toggle high contrast mode'
        },
        {
            key: 'l',
            altKey: true,
            action: function () {
                document.documentElement.classList.toggle('a11y-large-text');
                var isEnabled = document.documentElement.classList.contains('a11y-large-text');
                (0, screen_reader_1.announceToScreenReader)("Large text mode ".concat(isEnabled ? 'enabled' : 'disabled'));
                // Save preference
                localStorage.setItem('accessibility-large-text', isEnabled.toString());
            },
            description: 'Toggle large text mode'
        },
        {
            key: 'm',
            altKey: true,
            action: function () {
                document.documentElement.classList.toggle('a11y-reduced-motion');
                var isEnabled = document.documentElement.classList.contains('a11y-reduced-motion');
                (0, screen_reader_1.announceToScreenReader)("Reduced motion ".concat(isEnabled ? 'enabled' : 'disabled'));
                // Save preference
                localStorage.setItem('accessibility-reduced-motion', isEnabled.toString());
            },
            description: 'Toggle reduced motion'
        },
        {
            key: 'r',
            altKey: true,
            action: function () {
                document.documentElement.classList.toggle('a11y-screen-reader');
                var isEnabled = document.documentElement.classList.contains('a11y-screen-reader');
                (0, screen_reader_1.announceToScreenReader)("Screen reader mode ".concat(isEnabled ? 'enabled' : 'disabled'));
                // Save preference
                localStorage.setItem('accessibility-screen-reader', isEnabled.toString());
            },
            description: 'Toggle screen reader mode'
        },
        {
            key: 't',
            altKey: true,
            action: function () {
                // This will be handled by the AccessibilityToolbar component
                var toolbar = document.querySelector('[aria-label*="accessibility toolbar"]');
                if (toolbar) {
                    toolbar.click();
                    (0, screen_reader_1.announceToScreenReader)('Accessibility toolbar toggled');
                }
            },
            description: 'Toggle accessibility toolbar'
        },
    ];
    // Utility shortcuts
    var utilityShortcuts = [
        {
            key: 'k',
            altKey: true,
            action: function () {
                // This will be handled by the KeyboardShortcutsModal component
                (0, screen_reader_1.announceToScreenReader)('Keyboard shortcuts dialog opened');
            },
            description: 'Open keyboard shortcuts'
        },
        {
            key: '/',
            action: function () {
                // Focus search if available
                var searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
                if (searchInput) {
                    searchInput.focus();
                    (0, screen_reader_1.announceToScreenReader)('Search field focused');
                }
            },
            description: 'Focus search field',
            preventDefault: true
        },
    ];
    var allShortcuts = __spreadArray(__spreadArray(__spreadArray([], navigationShortcuts, true), accessibilityShortcuts, true), utilityShortcuts, true);
    // Handle keyboard events
    var handleKeyDown = (0, react_1.useCallback)(function (event) {
        // Don't trigger shortcuts when user is typing in input fields
        var activeElement = document.activeElement;
        var isTyping = activeElement && (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.hasAttribute('contenteditable'));
        if (isTyping)
            return;
        // Find matching shortcut
        var matchingShortcut = allShortcuts.find(function (shortcut) {
            return (shortcut.key.toLowerCase() === event.key.toLowerCase() &&
                !!shortcut.altKey === event.altKey &&
                !!shortcut.ctrlKey === event.ctrlKey &&
                !!shortcut.shiftKey === event.shiftKey &&
                !!shortcut.metaKey === event.metaKey);
        });
        if (matchingShortcut) {
            if (matchingShortcut.preventDefault !== false) {
                event.preventDefault();
            }
            matchingShortcut.action();
        }
    }, [allShortcuts]);
    // Skip to main content shortcut (always available)
    var handleSkipToMain = (0, react_1.useCallback)(function (event) {
        // Handle skip link when focused and Enter/Space is pressed
        if (event.target instanceof HTMLAnchorElement &&
            event.target.classList.contains('skip-link') &&
            (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            var mainContent = document.getElementById('main');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                (0, screen_reader_1.announceToScreenReader)('Skipped to main content');
            }
        }
    }, []);
    // Load saved accessibility preferences on mount
    (0, react_1.useEffect)(function () {
        // Restore accessibility settings
        var highContrast = localStorage.getItem('accessibility-high-contrast') === 'true';
        var largeText = localStorage.getItem('accessibility-large-text') === 'true';
        var reducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';
        var screenReader = localStorage.getItem('accessibility-screen-reader') === 'true';
        if (highContrast) {
            document.documentElement.classList.add('a11y-high-contrast');
        }
        if (largeText) {
            document.documentElement.classList.add('a11y-large-text');
        }
        if (reducedMotion) {
            document.documentElement.classList.add('a11y-reduced-motion');
        }
        if (screenReader) {
            document.documentElement.classList.add('a11y-screen-reader');
        }
    }, []);
    // Set up event listeners
    (0, react_1.useEffect)(function () {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleSkipToMain);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keydown', handleSkipToMain);
        };
    }, [handleKeyDown, handleSkipToMain]);
    // Return shortcuts for documentation
    return { shortcuts: allShortcuts };
};
exports.useKeyboardShortcuts = useKeyboardShortcuts;
// Hook for component-specific keyboard shortcuts
var useComponentShortcuts = function (shortcuts, enabled) {
    if (enabled === void 0) { enabled = true; }
    var handleKeyDown = (0, react_1.useCallback)(function (event) {
        if (!enabled)
            return;
        // Don't trigger shortcuts when user is typing in input fields
        var activeElement = document.activeElement;
        var isTyping = activeElement && (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.hasAttribute('contenteditable'));
        if (isTyping)
            return;
        // Find matching shortcut
        var matchingShortcut = shortcuts.find(function (shortcut) {
            return (shortcut.key.toLowerCase() === event.key.toLowerCase() &&
                !!shortcut.altKey === event.altKey &&
                !!shortcut.ctrlKey === event.ctrlKey &&
                !!shortcut.shiftKey === event.shiftKey &&
                !!shortcut.metaKey === event.metaKey);
        });
        if (matchingShortcut) {
            if (matchingShortcut.preventDefault !== false) {
                event.preventDefault();
            }
            matchingShortcut.action();
        }
    }, [shortcuts, enabled]);
    (0, react_1.useEffect)(function () {
        if (enabled) {
            document.addEventListener('keydown', handleKeyDown);
            return function () { return document.removeEventListener('keydown', handleKeyDown); };
        }
    }, [handleKeyDown, enabled]);
};
exports.useComponentShortcuts = useComponentShortcuts;
