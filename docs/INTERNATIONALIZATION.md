---
title: 'Internationalization Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Internationalization Guide

i18n setup, translation workflows, and RTL language support.

## Overview

This guide covers internationalization (i18n) patterns for supporting multiple
languages across platforms.

## Setup

### Install Dependencies

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Configuration

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### Provider Setup

```typescript
// src/main.tsx
import "./i18n/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Translation Files

### Structure

```
src/i18n/
├── config.ts
└── locales/
    ├── en.json
    ├── ar.json
    └── es.json
```

### Format

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Log In",
    "logout": "Log Out",
    "email": "Email",
    "password": "Password"
  },
  "simcore": {
    "title": "SimCore",
    "newSimulation": "New Simulation",
    "runSimulation": "Run Simulation"
  }
}
```

### Namespaces

For larger apps, use namespaces:

```typescript
i18n.init({
  ns: ['common', 'auth', 'simcore', 'repz'],
  defaultNS: 'common',
});
```

```json
// locales/en/simcore.json
{
  "title": "SimCore",
  "newSimulation": "New Simulation"
}
```

## Usage

### Basic Translation

```typescript
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("simcore.title")}</h1>
      <button>{t("common.save")}</button>
    </div>
  );
}
```

### With Interpolation

```json
{
  "greeting": "Hello, {{name}}!",
  "itemCount": "You have {{count}} items"
}
```

```typescript
t('greeting', { name: 'John' }); // "Hello, John!"
t('itemCount', { count: 5 }); // "You have 5 items"
```

### Pluralization

```json
{
  "item": "{{count}} item",
  "item_plural": "{{count}} items",
  "item_zero": "No items"
}
```

```typescript
t('item', { count: 0 }); // "No items"
t('item', { count: 1 }); // "1 item"
t('item', { count: 5 }); // "5 items"
```

### Date/Time Formatting

```typescript
import { format } from 'date-fns';
import { enUS, ar, es } from 'date-fns/locale';

const locales = { en: enUS, ar, es };

function formatDate(date: Date, formatStr: string, lng: string) {
  return format(date, formatStr, { locale: locales[lng] });
}
```

### Number Formatting

```typescript
function formatNumber(value: number, lng: string) {
  return new Intl.NumberFormat(lng).format(value);
}

function formatCurrency(value: number, lng: string, currency: string) {
  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency,
  }).format(value);
}
```

## RTL Support

### Detection

```typescript
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

function isRTL(lng: string) {
  return rtlLanguages.includes(lng);
}
```

### Document Direction

```typescript
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = isRTL(i18n.language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <div>...</div>;
}
```

### CSS for RTL

```css
/* Use logical properties */
.container {
  margin-inline-start: 1rem; /* margin-left in LTR, margin-right in RTL */
  padding-inline-end: 1rem;
}

/* Or use dir attribute */
[dir='rtl'] .icon {
  transform: scaleX(-1);
}
```

### Tailwind RTL

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require('tailwindcss-rtl')],
};
```

```html
<div class="ms-4 me-2">
  <!-- margin-start: 1rem, margin-end: 0.5rem -->
</div>
```

## Language Switcher

```typescript
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "es", name: "Español" },
  ];

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Translation Workflow

### Adding New Strings

1. Add to English file first
2. Run extraction script
3. Send to translators
4. Import translations
5. Test in all languages

### Extraction

```bash
# Using i18next-parser
npx i18next-parser
```

### Validation

```typescript
// scripts/validate-translations.ts
import en from './locales/en.json';
import ar from './locales/ar.json';

function validateTranslations() {
  const enKeys = Object.keys(flattenObject(en));
  const arKeys = Object.keys(flattenObject(ar));

  const missing = enKeys.filter((k) => !arKeys.includes(k));
  const extra = arKeys.filter((k) => !enKeys.includes(k));

  if (missing.length) {
    console.log('Missing in Arabic:', missing);
  }
  if (extra.length) {
    console.log('Extra in Arabic:', extra);
  }
}
```

## Best Practices

1. **Never hardcode strings** - Always use translation keys
2. **Use namespaces** - Organize by feature/page
3. **Include context** - Add comments for translators
4. **Test RTL** - Verify layout in RTL languages
5. **Handle plurals** - Use proper pluralization rules
6. **Format dates/numbers** - Use locale-aware formatting

## Platform-Specific

### REPZ

- Workout terms need sport-specific translations
- Units (kg/lbs) based on locale

### LiveItIconic

- Product descriptions need translation
- Currency formatting per region

### SimCore

- Scientific terms may not translate
- Keep technical terms in English

## Related Documents

- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility guide
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code standards
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component patterns
