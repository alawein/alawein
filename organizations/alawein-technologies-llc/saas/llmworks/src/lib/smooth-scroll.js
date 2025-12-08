"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToElement = exports.initSmoothScroll = void 0;
/**
 * Smooth scroll utility for anchor links
 */
var initSmoothScroll = function () {
    // Add smooth scrolling behavior to anchor links
    document.addEventListener('click', function (e) {
        var target = e.target;
        var link = target.closest('a[href^="#"]');
        if (!link)
            return;
        var targetId = link.getAttribute('href');
        if (!targetId || targetId === '#')
            return;
        var targetElement = document.querySelector(targetId);
        if (!targetElement)
            return;
        e.preventDefault();
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Update URL without triggering navigation
        if (history.pushState) {
            history.pushState(null, '', targetId);
        }
        // Focus the target element for accessibility
        var focusableElement = targetElement;
        if (focusableElement.focus) {
            focusableElement.focus();
        }
    });
};
exports.initSmoothScroll = initSmoothScroll;
/**
 * Scroll to element with smooth animation
 */
var scrollToElement = function (elementId, offset) {
    if (offset === void 0) { offset = 0; }
    var element = document.getElementById(elementId);
    if (!element)
        return;
    var elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
};
exports.scrollToElement = scrollToElement;
