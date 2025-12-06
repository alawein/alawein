// SEO utilities for managing meta tags and structured data

export function setSEO({
  title,
  description,
  path,
  keywords,
  ogImage,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string;
  ogImage?: string;
}) {
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
  const href = `${window.location.origin}${path ?? window.location.pathname}`;
  updateCanonical(href);
  updateMetaProperty('og:url', href);
  updateMetaProperty('twitter:url', href);
}

function updateMetaContent(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonical(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', href);
}

export function injectJsonLd(data: object, id?: string) {
  const scriptId = id || 'page-structured-data';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}
