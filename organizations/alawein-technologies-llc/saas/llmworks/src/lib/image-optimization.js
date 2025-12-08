"use strict";
/**
 * Image optimization utilities for better performance
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressImage = exports.getOptimalFormat = exports.supportsAVIF = exports.supportsWebP = exports.convertToWebP = exports.generateSrcSet = exports.preloadImages = exports.preloadImage = exports.createLazyImage = void 0;
// Lazy loading image component
var createLazyImage = function (_a) {
    var src = _a.src, alt = _a.alt, _b = _a.placeholder, placeholder = _b === void 0 ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNyAyM0wxNiAyMkwxMyAyNUwxMSAyM0w5IDI1VjI5SDE5VjI1TDE3IDIzWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjEgMTVIMjNWMTdIMjFWMTVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.loading, loading = _d === void 0 ? 'lazy' : _d, onLoad = _a.onLoad, onError = _a.onError;
    var img = document.createElement('img');
    img.alt = alt;
    img.className = className;
    img.loading = loading;
    // Set placeholder initially
    img.src = placeholder;
    // Set up intersection observer for lazy loading
    if (loading === 'lazy' && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = src;
                    if (onLoad)
                        image.addEventListener('load', onLoad, { once: true });
                    if (onError)
                        image.addEventListener('error', onError, { once: true });
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '50px', // Start loading 50px before entering viewport
        });
        observer.observe(img);
    }
    else {
        // Fallback for browsers without IntersectionObserver
        img.src = src;
        if (onLoad)
            img.addEventListener('load', onLoad, { once: true });
        if (onError)
            img.addEventListener('error', onError, { once: true });
    }
    return img;
};
exports.createLazyImage = createLazyImage;
// Preload critical images
var preloadImage = function (src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { return resolve(); };
        img.onerror = function () { return reject(new Error("Failed to preload image: ".concat(src))); };
        img.src = src;
    });
};
exports.preloadImage = preloadImage;
// Preload multiple images
var preloadImages = function (sources) {
    return Promise.all(sources.map(exports.preloadImage));
};
exports.preloadImages = preloadImages;
// Generate responsive image srcset
var generateSrcSet = function (baseSrc, sizes) {
    if (sizes === void 0) { sizes = [480, 768, 1024, 1280, 1920]; }
    return sizes
        .map(function (size) {
        var extension = baseSrc.split('.').pop();
        var nameWithoutExt = baseSrc.replace(".".concat(extension), '');
        return "".concat(nameWithoutExt, "-").concat(size, "w.").concat(extension, " ").concat(size, "w");
    })
        .join(', ');
};
exports.generateSrcSet = generateSrcSet;
// Convert image to WebP format (client-side)
var convertToWebP = function (file, quality) {
    if (quality === void 0) { quality = 0.8; }
    return new Promise(function (resolve, reject) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function () {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function (blob) {
                if (blob) {
                    resolve(blob);
                }
                else {
                    reject(new Error('Failed to convert image'));
                }
            }, 'image/webp', quality);
        };
        img.onerror = function () { return reject(new Error('Failed to load image')); };
        img.src = URL.createObjectURL(file);
    });
};
exports.convertToWebP = convertToWebP;
// Check WebP support
var supportsWebP = function () {
    return new Promise(function (resolve) {
        var webP = new Image();
        webP.onload = webP.onerror = function () {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
};
exports.supportsWebP = supportsWebP;
// Check AVIF support
var supportsAVIF = function () {
    return new Promise(function (resolve) {
        var avif = new Image();
        avif.onload = avif.onerror = function () {
            resolve(avif.height === 2);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
};
exports.supportsAVIF = supportsAVIF;
// Get optimal image format
var getOptimalFormat = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.supportsAVIF)()];
            case 1:
                if (_a.sent())
                    return [2 /*return*/, 'avif'];
                return [4 /*yield*/, (0, exports.supportsWebP)()];
            case 2:
                if (_a.sent())
                    return [2 /*return*/, 'webp'];
                return [2 /*return*/, 'jpg'];
        }
    });
}); };
exports.getOptimalFormat = getOptimalFormat;
// Image compression utility
var compressImage = function (file, maxWidth, maxHeight, quality) {
    if (maxWidth === void 0) { maxWidth = 1920; }
    if (maxHeight === void 0) { maxHeight = 1080; }
    if (quality === void 0) { quality = 0.8; }
    return new Promise(function (resolve, reject) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function () {
            // Calculate new dimensions
            var width = img.width, height = img.height;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            canvas.width = width;
            canvas.height = height;
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(function (blob) {
                if (blob) {
                    resolve(blob);
                }
                else {
                    reject(new Error('Failed to compress image'));
                }
            }, 'image/jpeg', quality);
        };
        img.onerror = function () { return reject(new Error('Failed to load image')); };
        img.src = URL.createObjectURL(file);
    });
};
exports.compressImage = compressImage;
