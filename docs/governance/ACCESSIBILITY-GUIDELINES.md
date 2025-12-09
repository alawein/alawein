# Accessibility Guidelines

This document outlines accessibility standards and best practices for all platforms in the monorepo.

## WCAG 2.1 AA Compliance Target

All platforms should meet WCAG 2.1 Level AA compliance as a minimum standard.

## Core Principles (POUR)

### 1. Perceivable
- All images have meaningful `alt` text
- Color is not the only means of conveying information
- Text has sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Content can be resized up to 200% without loss of functionality

### 2. Operable
- All functionality is keyboard accessible
- Focus indicators are visible
- No keyboard traps
- Skip links are provided for navigation
- Sufficient time is provided for interactions

### 3. Understandable
- Language is declared in HTML
- Navigation is consistent
- Error messages are clear and helpful
- Labels and instructions are provided for forms

### 4. Robust
- Valid HTML markup
- ARIA attributes are used correctly
- Content works with assistive technologies

## Component Checklist

### Buttons
- [x] Has accessible name (text content or aria-label)
- [x] Disabled state communicated via `disabled` attribute
- [x] Loading state communicated via `aria-busy`
- [x] Focus visible styles

### Forms
- [x] Labels associated with inputs via `htmlFor`/`id`
- [x] Error messages linked via `aria-describedby`
- [x] Required fields indicated
- [x] Invalid state communicated via `aria-invalid`

### Navigation
- [ ] Skip to main content link
- [ ] Current page indicated in navigation
- [ ] Landmark regions defined (`main`, `nav`, `header`, `footer`)

### Modals/Dialogs
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] `aria-modal="true"` and `role="dialog"`

### Images
- [ ] Decorative images have `alt=""`
- [ ] Informative images have descriptive alt text
- [ ] Complex images have extended descriptions

## Testing Tools

### Automated Testing
- **axe-core**: Integrated via `@storybook/addon-a11y`
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Browser extension

### Manual Testing
- Keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver, JAWS)
- Color contrast verification
- Zoom testing (200%)

## Platform-Specific Notes

### SimCore
- Ensure physics simulations have text alternatives
- Provide keyboard controls for interactive visualizations

### QMLab
- Quantum circuit diagrams need text descriptions
- Ensure color-coded elements have additional indicators

### LLMWorks
- Chat interfaces need proper ARIA live regions
- Code blocks should be properly labeled

### Attributa
- Document processing status updates via live regions
- Ensure PDF viewer is accessible

### Portfolio
- Ensure animations respect `prefers-reduced-motion`
- All interactive elements are keyboard accessible

### REPZ
- Workout timers need audio/visual alternatives
- Progress indicators are accessible

### LiveItIconic
- E-commerce checkout is fully keyboard accessible
- Product images have descriptive alt text

## Audit Schedule

- **Monthly**: Automated Lighthouse audits
- **Quarterly**: Manual accessibility review
- **Per Release**: Regression testing for new features

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

