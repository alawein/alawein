"use strict";
/**
 * Screen Reader utilities and announcements
 * Provides programmatic control for screen reader interactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenReaderFeatures = exports.manageFocus = exports.announceProgress = exports.announceSelection = exports.announceTableChange = exports.announceModal = exports.announceLoading = exports.announceFormValidation = exports.announceNavigation = exports.announceError = exports.announceStatus = exports.announceToScreenReader = exports.detectScreenReader = void 0;
// Screen reader detection
var detectScreenReader = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    // Check for common screen readers
    if (userAgent.includes('nvda'))
        return 'NVDA';
    if (userAgent.includes('jaws'))
        return 'JAWS';
    if (userAgent.includes('dragon'))
        return 'Dragon';
    if (userAgent.includes('zoomtext'))
        return 'ZoomText';
    if (userAgent.includes('magic'))
        return 'MAGic';
    if (userAgent.includes('supernova'))
        return 'SuperNova';
    if (userAgent.includes('cobra'))
        return 'COBRA';
    if (userAgent.includes('orca'))
        return 'Orca';
    if (userAgent.includes('voiceover'))
        return 'VoiceOver';
    if (userAgent.includes('talkback'))
        return 'TalkBack';
    // Check for reduced motion preference as an indicator
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'Unknown Screen Reader';
    }
    return null;
};
exports.detectScreenReader = detectScreenReader;
// Create announcement element
var createAnnouncementElement = function (priority, atomic) {
    if (priority === void 0) { priority = 'polite'; }
    if (atomic === void 0) { atomic = true; }
    var element = document.createElement('div');
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', atomic.toString());
    element.setAttribute('aria-relevant', 'text');
    element.className = 'sr-only';
    element.style.cssText = "\n    position: absolute !important;\n    left: -10000px !important;\n    width: 1px !important;\n    height: 1px !important;\n    overflow: hidden !important;\n    clip: rect(0, 0, 0, 0) !important;\n    white-space: nowrap !important;\n    border: 0 !important;\n  ";
    document.body.appendChild(element);
    return element;
};
// Announce message to screen readers
var announceToScreenReader = function (message, priority, delay) {
    if (priority === void 0) { priority = 'polite'; }
    if (delay === void 0) { delay = 100; }
    if (!message.trim())
        return;
    // Create announcement element
    var announcer = createAnnouncementElement(priority);
    // Small delay to ensure screen reader picks up the change
    setTimeout(function () {
        announcer.textContent = message;
        // Remove element after announcement
        setTimeout(function () {
            if (announcer.parentNode) {
                announcer.parentNode.removeChild(announcer);
            }
        }, priority === 'assertive' ? 2000 : 1000);
    }, delay);
};
exports.announceToScreenReader = announceToScreenReader;
// Announce status changes
var announceStatus = function (status, context) {
    var message = context ? "".concat(context, ": ").concat(status) : status;
    (0, exports.announceToScreenReader)(message, 'polite');
};
exports.announceStatus = announceStatus;
// Announce errors
var announceError = function (error, field) {
    var message = field ? "Error in ".concat(field, ": ").concat(error) : "Error: ".concat(error);
    (0, exports.announceToScreenReader)(message, 'assertive');
};
exports.announceError = announceError;
// Announce navigation changes
var announceNavigation = function (pageName, breadcrumb) {
    var message = "Navigated to ".concat(pageName);
    if (breadcrumb && breadcrumb.length > 0) {
        message += ". Path: ".concat(breadcrumb.join(' > '));
    }
    (0, exports.announceToScreenReader)(message, 'polite', 500);
};
exports.announceNavigation = announceNavigation;
// Announce form validation
var announceFormValidation = function (isValid, errors) {
    if (errors === void 0) { errors = []; }
    if (isValid) {
        (0, exports.announceToScreenReader)('Form is valid and ready to submit', 'polite');
    }
    else {
        var errorCount = errors.length;
        var message = errorCount === 1
            ? "1 error found: ".concat(errors[0])
            : "".concat(errorCount, " errors found. ").concat(errors.join('. '));
        (0, exports.announceToScreenReader)(message, 'assertive');
    }
};
exports.announceFormValidation = announceFormValidation;
// Announce loading states
var announceLoading = function (isLoading, context) {
    var contextPrefix = context ? "".concat(context, " ") : '';
    var message = isLoading
        ? "".concat(contextPrefix, "Loading...")
        : "".concat(contextPrefix, "Finished loading");
    (0, exports.announceToScreenReader)(message, 'polite');
};
exports.announceLoading = announceLoading;
// Announce modal/dialog states
var announceModal = function (isOpen, title, description) {
    if (isOpen) {
        var message = "".concat(title, " dialog opened");
        if (description) {
            message += ". ".concat(description);
        }
        message += '. Press Escape to close.';
        (0, exports.announceToScreenReader)(message, 'polite', 200);
    }
    else {
        (0, exports.announceToScreenReader)("".concat(title, " dialog closed"), 'polite');
    }
};
exports.announceModal = announceModal;
// Announce data table changes
var announceTableChange = function (action, column, direction, rowCount) {
    var message = '';
    switch (action) {
        case 'sorted':
            message = column
                ? "Table sorted by ".concat(column, " in ").concat(direction, " order")
                : 'Table sorted';
            break;
        case 'filtered':
            message = rowCount !== undefined
                ? "Table filtered. Showing ".concat(rowCount, " results")
                : 'Table filtered';
            break;
        case 'updated':
            message = rowCount !== undefined
                ? "Table updated. ".concat(rowCount, " rows displayed")
                : 'Table updated';
            break;
    }
    (0, exports.announceToScreenReader)(message, 'polite');
};
exports.announceTableChange = announceTableChange;
// Announce selection changes
var announceSelection = function (selectedCount, totalCount, itemType) {
    if (itemType === void 0) { itemType = 'items'; }
    var message = selectedCount === 0
        ? "No ".concat(itemType, " selected")
        : selectedCount === totalCount
            ? "All ".concat(totalCount, " ").concat(itemType, " selected")
            : "".concat(selectedCount, " of ").concat(totalCount, " ").concat(itemType, " selected");
    (0, exports.announceToScreenReader)(message, 'polite');
};
exports.announceSelection = announceSelection;
// Announce progress updates
var announceProgress = function (percentage, activity) {
    if (activity === void 0) { activity = 'Progress'; }
    // Only announce at significant milestones to avoid spam
    if (percentage % 25 === 0 || percentage === 100) {
        var message = "".concat(activity, ": ").concat(percentage, "% complete");
        (0, exports.announceToScreenReader)(message, 'polite');
    }
};
exports.announceProgress = announceProgress;
// Enhanced focus management
exports.manageFocus = {
    // Save current focus to restore later
    save: function () {
        return document.activeElement;
    },
    // Restore previously saved focus
    restore: function (element) {
        if (element && element instanceof HTMLElement && element.focus) {
            element.focus();
        }
    },
    // Focus first focusable element in container
    focusFirst: function (container) {
        var focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var first = focusable[0];
        if (first && first.focus) {
            first.focus();
            return true;
        }
        return false;
    },
    // Focus last focusable element in container
    focusLast: function (container) {
        var focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var last = focusable[focusable.length - 1];
        if (last && last.focus) {
            last.focus();
            return true;
        }
        return false;
    },
    // Trap focus within container
    trapFocus: function (container) {
        var focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var firstFocusable = focusableElements[0];
        var lastFocusable = focusableElements[focusableElements.length - 1];
        var handleTabKey = function (e) {
            if (e.key !== 'Tab')
                return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            }
            else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        container.addEventListener('keydown', handleTabKey);
        // Return cleanup function
        return function () {
            container.removeEventListener('keydown', handleTabKey);
        };
    }
};
// Screen reader feature detection
exports.screenReaderFeatures = {
    // Check if screen reader is likely active
    isActive: function () {
        var _a;
        return !!((0, exports.detectScreenReader)() ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            ((_a = window.speechSynthesis) === null || _a === void 0 ? void 0 : _a.speaking) ||
            navigator.userAgent.includes('AccessibleBrowser'));
    },
    // Check speech synthesis support
    supportsSpeech: function () {
        return 'speechSynthesis' in window;
    },
    // Check if high contrast mode is active
    isHighContrastMode: function () {
        return window.matchMedia('(prefers-contrast: high)').matches;
    },
    // Check if reduced motion is preferred
    prefersReducedMotion: function () {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};
