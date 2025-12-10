---
title: 'Accessibility Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Accessibility Guide

WCAG compliance and accessibility best practices for Alawein platforms.

## Overview

All platforms should meet WCAG 2.1 Level AA compliance. This guide covers
implementation patterns and testing procedures.

## Principles

### POUR Framework

1. **Perceivable** - Information must be presentable
2. **Operable** - Interface must be operable
3. **Understandable** - Information must be understandable
4. **Robust** - Content must be robust for assistive technologies

## Implementation

### Semantic HTML

Use proper HTML elements:

```tsx
// BAD - div soup
<div onClick={handleClick}>Click me</div>

// GOOD - semantic button
<button onClick={handleClick}>Click me</button>

// BAD - generic container
<div className="nav">...</div>

// GOOD - semantic nav
<nav aria-label="Main navigation">...</nav>
```

### Headings

Maintain proper heading hierarchy:

```tsx
// GOOD - proper hierarchy
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

// BAD - skipped levels
<h1>Page Title</h1>
<h3>Subsection</h3> // Missing h2
```

### Images

Always provide alt text:

```tsx
// Informative image
<img src="/chart.png" alt="Sales increased 25% in Q4 2024" />

// Decorative image
<img src="/decoration.png" alt="" role="presentation" />

// Complex image
<figure>
  <img src="/diagram.png" alt="System architecture diagram" />
  <figcaption>
    Detailed description of the architecture...
  </figcaption>
</figure>
```

### Forms

Label all form controls:

```tsx
// Explicit label
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// With error handling
<label htmlFor="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-error"
  aria-invalid={hasError}
/>
{hasError && (
  <span id="password-error" role="alert">
    Password must be at least 8 characters
  </span>
)}
```

### Focus Management

Ensure visible focus indicators:

```css
/* Custom focus styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Don't remove focus outlines */
/* BAD: :focus { outline: none; } */
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```tsx
// Custom component with keyboard support
function CustomButton({ onClick, children }) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div role='button' tabIndex={0} onClick={onClick} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
```

### ARIA Attributes

Use ARIA when HTML semantics aren't sufficient:

```tsx
// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Modal dialog
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Confirm Action</h2>
  ...
</div>

// Tab interface
<div role="tablist">
  <button role="tab" aria-selected={activeTab === 0}>Tab 1</button>
  <button role="tab" aria-selected={activeTab === 1}>Tab 2</button>
</div>
<div role="tabpanel">Content</div>
```

### Color Contrast

Ensure sufficient contrast ratios:

| Element            | Minimum Ratio |
| ------------------ | ------------- |
| Normal text        | 4.5:1         |
| Large text (18px+) | 3:1           |
| UI components      | 3:1           |

```css
/* Good contrast */
.text {
  color: #1a1a1a; /* Dark text */
  background: #ffffff; /* Light background */
  /* Contrast ratio: 16.1:1 */
}

/* Check with tools like WebAIM Contrast Checker */
```

### Motion and Animation

Respect user preferences:

```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// Check preference in JavaScript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
```

## Testing

### Automated Testing

Use axe-core for automated checks:

```typescript
// In Playwright tests
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

### Manual Testing

Checklist for manual testing:

- [ ] Navigate entire page with keyboard only
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Check color contrast
- [ ] Verify focus indicators visible
- [ ] Test at 200% zoom
- [ ] Verify form error handling

### Screen Reader Testing

Test with:

- **NVDA** (Windows, free)
- **VoiceOver** (macOS, built-in)
- **JAWS** (Windows, commercial)

Common commands:

| Action       | NVDA          | VoiceOver         |
| ------------ | ------------- | ----------------- |
| Read all     | Insert + Down | VO + A            |
| Next heading | H             | VO + Cmd + H      |
| Next link    | K             | VO + Cmd + L      |
| Form mode    | Enter         | VO + Shift + Down |

## Platform-Specific

### SimCore

- Provide text alternatives for visualizations
- Ensure simulations can be paused
- Offer data tables as alternative to charts

### REPZ

- Voice input for workout logging
- High contrast mode for gym use
- Large touch targets for mobile

### QMLab

- Describe quantum states in text
- Keyboard controls for circuit builder
- Audio feedback for state changes

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [axe DevTools](https://www.deque.com/axe/)

## Checklist

### Development

- [ ] Semantic HTML used
- [ ] All images have alt text
- [ ] Forms properly labeled
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient

### Testing

- [ ] axe-core tests pass
- [ ] Screen reader tested
- [ ] Keyboard-only navigation tested
- [ ] Zoom to 200% tested

## Related Documents

- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code standards
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component patterns
- [testing/TESTING-GUIDE.md](./testing/TESTING-GUIDE.md) - Testing guide
