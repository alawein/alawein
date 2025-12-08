# Alawein Design System

Complete design system powered by Lovable, featuring quantum spectrum colors and scientific
aesthetics.

## What's Included

### 🎨 Design Tokens

- **Colors** - Quantum spectrum (purple, pink, cyan) + status colors
- **Typography** - Font families, scales, weights, tracking, leading
- **Spacing** - 8px base unit with harmonious ratios
- **Effects** - Shadows, glows, blur effects
- **Animation** - Durations, easing functions, orbital speeds

### 🎭 Themes

- **Quantum** - Primary theme with quantum spectrum colors (default)
- **Glassmorphism** - Modern frosted glass aesthetic
- **Dark** - High-contrast dark theme
- **Light** - Clean light theme

### ⚛️ React Integration

- `ThemeProvider` - Context provider for theme management
- `useTheme()` - Hook to access theme and set theme
- `useThemeColors()` - Hook for current theme colors
- `useThemeTypography()` - Hook for current theme typography
- `useThemeSpacing()` - Hook for current theme spacing

## Installation

The design system is available as `@alawein/design-system` in the monorepo.

```typescript
import { allLovableTokens, themes, ThemeProvider, useTheme } from '@alawein/design-system';
```

## Usage

### Basic Setup

```tsx
import { ThemeProvider } from '@alawein/design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="quantum">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using Theme in Components

```tsx
import { useTheme, useThemeColors } from '@alawein/design-system';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <div style={{ background: colors.background, color: colors.text }}>
      Current theme: {theme}
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Accessing Tokens Directly

```tsx
import { allLovableTokens } from '@alawein/design-system';

const { colors, typography, spacing } = allLovableTokens;

// Use in styles
const styles = {
  color: colors.primary.quantumPurple,
  fontSize: typography.scale['2xl'],
  padding: spacing['4'],
};
```

### Theme Objects

Each theme is a complete object with colors, typography, spacing, effects, and gradients:

```tsx
import { themes, defaultTheme } from '@alawein/design-system';

const quantumTheme = themes.quantum;
const glassmorphismTheme = themes.glassmorphism;

// Access theme properties
console.log(quantumTheme.colors.primary);
console.log(quantumTheme.components.button);
```

## Available Themes

### Quantum (Default)

Physics-inspired with quantum spectrum colors. Perfect for scientific and technical applications.

```
Background: #0F0F23 (deep space)
Primary: #A855F7 (quantum purple)
Secondary: #EC4899 (plasma pink)
Tertiary: #4CC9F0 (electron cyan)
```

### Glassmorphism

Modern frosted glass aesthetic with transparency and blur effects.

```
Frosted surfaces with backdrop blur
Semi-transparent cards and buttons
Soft, elegant appearance
```

### Dark

High-contrast dark theme optimized for readability.

```
Background: #000000
Accent: #FF9500
Good for all-day use
```

### Light

Clean light theme with soft aesthetics.

```
Background: #FFFFFF
Primary: #8B5CF6
Perfect for productivity
```

## Token Structure

### Colors

- `primary` - Primary accent colors
- `backgrounds` - Background gradients
- `surfaces` - Glass and card surfaces
- `text` - Text hierarchy
- `status` - Success, warning, error, info
- `gradients` - Pre-defined gradients

### Typography

- `fonts` - Font families (display, body, mono, serif)
- `scale` - Type scale (xs to 6xl)
- `weights` - Font weights (light to bold)
- `tracking` - Letter spacing
- `leading` - Line heights

### Spacing

- Standard 8px base unit
- Harmonious ratios (0-32)
- Border radius from none to full

### Effects

- `shadows` - Elevation shadows + glow effects
- `blur` - Backdrop blur for glassmorphism

### Animation

- `duration` - Animation durations
- `easing` - Easing functions
- `orbital` - Rotation speeds

## Customization

### Create Custom Theme

```typescript
import { defaultTheme } from '@alawein/design-system';

export const customTheme = {
  ...defaultTheme,
  name: 'custom',
  colors: {
    ...defaultTheme.colors,
    primary: '#FF5500',
  },
};
```

### Override Colors in Components

```tsx
const customColors = {
  ...useThemeColors(),
  primary: '#custom-color',
};
```

## localStorage Persistence

The current theme is automatically saved to localStorage as `alawein-theme` and restored on page
reload.

```javascript
// Theme switching persists automatically
setTheme('dark'); // Saved to localStorage
// Page refresh → dark theme is restored
```

## CSS Variables (Optional)

For CSS-in-JS or styled-components integration:

```css
/* data-theme attribute set on root element */
[data-theme='quantum'] {
  --color-primary: #a855f7;
  --color-secondary: #ec4899;
  /* ... etc */
}
```

## Version History

- **v1.0.0** (Dec 2024)
  - Initial release with Lovable design tokens
  - 4 themes: Quantum, Glassmorphism, Dark, Light
  - React context for theme switching
  - TypeScript type definitions

## License

MIT - Part of Alawein Platform
