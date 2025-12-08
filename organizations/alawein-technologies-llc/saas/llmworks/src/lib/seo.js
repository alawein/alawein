"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSEO = setSEO;
exports.injectJsonLd = injectJsonLd;
function setSEO(_a) {
    var title = _a.title, description = _a.description, path = _a.path, keywords = _a.keywords, ogImage = _a.ogImage;
    if (title) {
        document.title = title;
        updateMetaProperty('og:title', title);
        updateMetaProperty('twitter:title', title);
    }
    if (description) {
        updateMetaContent('description', description);
        updateMetaProperty('og:description', description);
        updateMetaProperty('twitter:description', description);
    }
    if (keywords) {
        updateMetaContent('keywords', keywords);
    }
    if (ogImage) {
        updateMetaProperty('og:image', ogImage);
        updateMetaProperty('twitter:image', ogImage);
    }
    // Update canonical URL
    var href = "".concat(window.location.origin).concat(path !== null && path !== void 0 ? path : window.location.pathname);
    updateCanonical(href);
    updateMetaProperty('og:url', href);
    updateMetaProperty('twitter:url', href);
}
function updateMetaContent(name, content) {
    var meta = document.querySelector("meta[name=\"".concat(name, "\"]"));
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}
function updateMetaProperty(property, content) {
    var meta = document.querySelector("meta[property=\"".concat(property, "\"]"));
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}
function updateCanonical(href) {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
}
function injectJsonLd(data, id) {
    var scriptId = id || 'page-structured-data';
    var script = document.getElementById(scriptId);
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = scriptId;
        document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
}
