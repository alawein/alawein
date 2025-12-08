"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAdvancedSEO = exports.useAdvancedSEO = exports.trackCoreWebVitals = exports.generateRobotsTxt = exports.generateSitemapEntries = exports.generateHowToSchema = exports.generateFAQSchema = exports.generateBreadcrumbSchema = exports.generateSoftwareApplicationSchema = exports.generateOrganizationSchema = exports.generateMetaTags = void 0;
/**
 * Advanced SEO utilities for LLM Works platform
 * Implements comprehensive SEO best practices and structured data
 */
var react_1 = require("react");
/**
 * Generate comprehensive meta tags for SEO
 */
var generateMetaTags = function (config) {
    var tags = [];
    var baseUrl = 'https://llmworks.dev';
    // Basic meta tags
    tags.push("<title>".concat(config.title, "</title>"));
    tags.push("<meta name=\"description\" content=\"".concat(config.description, "\">"));
    if (config.keywords && config.keywords.length > 0) {
        tags.push("<meta name=\"keywords\" content=\"".concat(config.keywords.join(', '), "\">"));
    }
    // Open Graph tags
    tags.push("<meta property=\"og:title\" content=\"".concat(config.title, "\">"));
    tags.push("<meta property=\"og:description\" content=\"".concat(config.description, "\">"));
    tags.push("<meta property=\"og:type\" content=\"".concat(config.type || 'website', "\">"));
    tags.push("<meta property=\"og:url\" content=\"".concat(config.url || baseUrl, "\">"));
    tags.push("<meta property=\"og:site_name\" content=\"LLM Works\">");
    tags.push("<meta property=\"og:locale\" content=\"".concat(config.locale || 'en_US', "\">"));
    if (config.image) {
        tags.push("<meta property=\"og:image\" content=\"".concat(config.image, "\">"));
        tags.push("<meta property=\"og:image:alt\" content=\"".concat(config.title, "\">"));
        tags.push("<meta property=\"og:image:width\" content=\"1200\">");
        tags.push("<meta property=\"og:image:height\" content=\"630\">");
    }
    if (config.publishedTime) {
        tags.push("<meta property=\"article:published_time\" content=\"".concat(config.publishedTime, "\">"));
    }
    if (config.modifiedTime) {
        tags.push("<meta property=\"article:modified_time\" content=\"".concat(config.modifiedTime, "\">"));
    }
    if (config.author) {
        tags.push("<meta property=\"article:author\" content=\"".concat(config.author, "\">"));
    }
    if (config.section) {
        tags.push("<meta property=\"article:section\" content=\"".concat(config.section, "\">"));
    }
    if (config.tags && config.tags.length > 0) {
        config.tags.forEach(function (tag) {
            tags.push("<meta property=\"article:tag\" content=\"".concat(tag, "\">"));
        });
    }
    // Twitter Card tags
    tags.push("<meta name=\"twitter:card\" content=\"summary_large_image\">");
    tags.push("<meta name=\"twitter:title\" content=\"".concat(config.title, "\">"));
    tags.push("<meta name=\"twitter:description\" content=\"".concat(config.description, "\">"));
    tags.push("<meta name=\"twitter:site\" content=\"@llmworks\">");
    tags.push("<meta name=\"twitter:creator\" content=\"@llmworks\">");
    if (config.image) {
        tags.push("<meta name=\"twitter:image\" content=\"".concat(config.image, "\">"));
    }
    // Additional SEO tags
    tags.push("<meta name=\"robots\" content=\"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1\">");
    tags.push("<meta name=\"googlebot\" content=\"index, follow\">");
    tags.push("<meta name=\"bingbot\" content=\"index, follow\">");
    // Canonical URL
    tags.push("<link rel=\"canonical\" href=\"".concat(config.url || baseUrl, "\">"));
    // Alternate locales
    if (config.alternateLocales && config.alternateLocales.length > 0) {
        config.alternateLocales.forEach(function (locale) {
            tags.push("<link rel=\"alternate\" hreflang=\"".concat(locale, "\" href=\"").concat(baseUrl, "/").concat(locale, "\">"));
        });
    }
    return tags;
};
exports.generateMetaTags = generateMetaTags;
/**
 * Generate JSON-LD structured data for organization
 */
var generateOrganizationSchema = function () {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'LLM Works',
        description: 'Open-source platform for evaluating Large Language Models through interactive testing and rigorous benchmarking',
        url: 'https://llmworks.dev',
        logo: 'https://llmworks.dev/logo.png',
        foundingDate: '2024',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-0123',
            contactType: 'customer service',
            availableLanguage: ['English']
        },
        sameAs: [
            'https://github.com/alawein/aegis-ai-evaluator',
            'https://twitter.com/llmworks',
            'https://linkedin.com/company/llmworks'
        ],
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'US'
        }
    };
};
exports.generateOrganizationSchema = generateOrganizationSchema;
/**
 * Generate JSON-LD structured data for software application
 */
var generateSoftwareApplicationSchema = function () {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'LLM Works',
        description: 'Comprehensive platform for LLM evaluation with interactive Arena testing and standardized benchmarks',
        url: 'https://llmworks.dev',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '127',
            bestRating: '5'
        },
        author: {
            '@type': 'Organization',
            name: 'LLM Works Community'
        },
        datePublished: '2024-01-15',
        dateModified: new Date().toISOString(),
        version: '1.0.0',
        downloadUrl: 'https://llmworks.dev',
        screenshot: 'https://llmworks.dev/screenshots/dashboard.png',
        featureList: [
            'Interactive Arena testing between AI models',
            'Standardized benchmark evaluation (MMLU, TruthfulQA, GSM8K)',
            'Real-time performance monitoring',
            'Comprehensive analytics dashboard',
            'Cost tracking and optimization',
            'Accessibility-first design'
        ]
    };
};
exports.generateSoftwareApplicationSchema = generateSoftwareApplicationSchema;
/**
 * Generate JSON-LD structured data for breadcrumbs
 */
var generateBreadcrumbSchema = function (items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(function (item) { return ({
            '@type': 'ListItem',
            position: item.position,
            name: item.name,
            item: item.url
        }); })
    };
};
exports.generateBreadcrumbSchema = generateBreadcrumbSchema;
/**
 * Generate JSON-LD structured data for FAQ
 */
var generateFAQSchema = function (faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (faq) { return ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }); })
    };
};
exports.generateFAQSchema = generateFAQSchema;
/**
 * Generate JSON-LD structured data for how-to guide
 */
var generateHowToSchema = function (title, steps) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        description: "Learn how to ".concat(title.toLowerCase()),
        totalTime: 'PT10M',
        estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: '0'
        },
        supply: [{
                '@type': 'HowToSupply',
                name: 'API Keys from LLM providers'
            }],
        tool: [{
                '@type': 'HowToTool',
                name: 'LLM Works Platform'
            }],
        step: steps.map(function (step, index) { return ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step,
            text: step,
            url: "https://llmworks.dev/guides/".concat(title.toLowerCase().replace(/\s+/g, '-'), "#step-").concat(index + 1)
        }); })
    };
};
exports.generateHowToSchema = generateHowToSchema;
/**
 * Generate sitemap entries
 */
var generateSitemapEntries = function () {
    var baseUrl = 'https://llmworks.dev';
    var currentDate = new Date().toISOString();
    return [
        {
            url: baseUrl,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: 1.0
        },
        {
            url: "".concat(baseUrl, "/arena"),
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: 0.9
        },
        {
            url: "".concat(baseUrl, "/bench"),
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: 0.9
        },
        {
            url: "".concat(baseUrl, "/dashboard"),
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: 0.8
        },
        {
            url: "".concat(baseUrl, "/settings"),
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.6
        },
        {
            url: "".concat(baseUrl, "/privacy"),
            lastmod: currentDate,
            changefreq: 'yearly',
            priority: 0.3
        },
        {
            url: "".concat(baseUrl, "/terms"),
            lastmod: currentDate,
            changefreq: 'yearly',
            priority: 0.3
        },
        // Add guide pages
        {
            url: "".concat(baseUrl, "/guides/getting-started"),
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.7
        },
        {
            url: "".concat(baseUrl, "/guides/arena-evaluation"),
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.7
        },
        {
            url: "".concat(baseUrl, "/guides/benchmark-testing"),
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.7
        }
    ];
};
exports.generateSitemapEntries = generateSitemapEntries;
/**
 * Generate robots.txt content
 */
var generateRobotsTxt = function () {
    return "User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Bingbot  \nAllow: /\nCrawl-delay: 1\n\nUser-agent: Slurp\nAllow: /\nCrawl-delay: 1\n\nDisallow: /api/\nDisallow: /test/\nDisallow: /*.json$\nDisallow: /admin/\n\nSitemap: https://llmworks.dev/sitemap.xml\n";
};
exports.generateRobotsTxt = generateRobotsTxt;
/**
 * Performance monitoring for Core Web Vitals
 */
var trackCoreWebVitals = function (onReport) {
    Promise.resolve().then(function () { return require('web-vitals'); }).then(function (_a) {
        var onCLS = _a.onCLS, onINP = _a.onINP, onFCP = _a.onFCP, onLCP = _a.onLCP, onTTFB = _a.onTTFB;
        onCLS(onReport);
        onINP(onReport);
        onFCP(onReport);
        onLCP(onReport);
        onTTFB(onReport);
    }).catch(function (error) {
        console.warn('Web Vitals not available:', error);
    });
};
exports.trackCoreWebVitals = trackCoreWebVitals;
/**
 * Enhanced SEO setup for React components
 */
var useAdvancedSEO = function (config) {
    react_1.default.useEffect(function () {
        // Update document title
        document.title = config.title;
        // Update meta description
        var metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', config.description);
        // Update canonical URL
        var canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = config.url || window.location.href;
        // Update Open Graph tags
        var ogTags = [
            { property: 'og:title', content: config.title },
            { property: 'og:description', content: config.description },
            { property: 'og:type', content: config.type || 'website' },
            { property: 'og:url', content: config.url || window.location.href },
        ];
        ogTags.forEach(function (tag) {
            var metaTag = document.querySelector("meta[property=\"".concat(tag.property, "\"]"));
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', tag.property);
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', tag.content);
        });
        // Add structured data
        var structuredDataScript = document.getElementById('structured-data');
        if (structuredDataScript) {
            document.head.removeChild(structuredDataScript);
        }
        var newStructuredDataScript = document.createElement('script');
        newStructuredDataScript.id = 'structured-data';
        newStructuredDataScript.type = 'application/ld+json';
        var structuredData = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: config.title,
            description: config.description,
            url: config.url || window.location.href,
            isPartOf: {
                '@type': 'WebSite',
                name: 'LLM Works',
                url: 'https://llmworks.dev'
            },
            datePublished: config.publishedTime || new Date().toISOString(),
            dateModified: config.modifiedTime || new Date().toISOString(),
            author: {
                '@type': 'Organization',
                name: 'LLM Works Community'
            }
        };
        newStructuredDataScript.textContent = JSON.stringify(structuredData);
        document.head.appendChild(newStructuredDataScript);
    }, [config]);
};
exports.useAdvancedSEO = useAdvancedSEO;
/**
 * Initialize comprehensive SEO setup
 */
var initAdvancedSEO = function () {
    // Add organization schema
    var orgSchema = document.createElement('script');
    orgSchema.type = 'application/ld+json';
    orgSchema.textContent = JSON.stringify((0, exports.generateOrganizationSchema)());
    document.head.appendChild(orgSchema);
    // Add software application schema
    var appSchema = document.createElement('script');
    appSchema.type = 'application/ld+json';
    appSchema.textContent = JSON.stringify((0, exports.generateSoftwareApplicationSchema)());
    document.head.appendChild(appSchema);
    // Track Core Web Vitals
    (0, exports.trackCoreWebVitals)(function (metric) {
        // Send to analytics
        if (window.gtag) {
            window.gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                non_interaction: true,
            });
        }
    });
    console.log('🚀 Advanced SEO features initialized');
};
exports.initAdvancedSEO = initAdvancedSEO;
