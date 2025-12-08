# @monorepo/ui

**Version**: 2.0.0  
**Status**: Consolidated & Production Ready  

Unified UI component library for the Alawein Technologies monorepo. This package consolidates components from `ui`, `ui-components`, and `shared-ui` into a single, cohesive library.

---

## 📦 What's Included

### Components
- **Button** - Enterprise-grade button with loading states, icons, and 7 variants
- **Card** - Flexible card component for content containers
- **ErrorBoundary** - React error boundary for graceful error handling

### Utilities
- **cn** - Class name utility for conditional styling
- **utils** - Common utility functions

### Design System
- **tokens** - Design tokens for consistent styling
- **types** - TypeScript type definitions
- **styles** - Global CSS styles

---

## 🚀 Installation

```bash
# Already installed as part of the monorepo
npm install
```

---

## 📖 Usage

### Button Component

```typescript
import { Button } from '@monorepo/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><Icon /></Button>

// With loading state
<Button loading>Processing...</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// As child (composition)
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Card Component

```typescript
import { Card } from '@monorepo/ui';

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

### ErrorBoundary Component

```typescript
import { ErrorBoundary } from '@monorepo/ui';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <YourComponent />
</ErrorBoundary>
```

### Utilities

```typescript
import { cn } from '@monorepo/ui';

// Conditional class names
<div className={cn('base-class', isActive && 'active-class')} />
```

### Design Tokens

```typescript
import { tokens } from '@monorepo/ui/tokens';

// Use design tokens in your components
const primaryColor = tokens.colors.brand.primary;
```

---

## 🎨 Button Props

```typescript
interface ButtonProps {
  // Variant
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline' | 'ghost' | 'link';
  
  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  
  // Loading state
  loading?: boolean;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Layout
  fullWidth?: boolean;
  
  // Composition
  asChild?: boolean;
  
  // Standard button props
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  // ... all other HTML button attributes
}
```

---

## 📚 Documentation

- **Migration Guide**: [docs/BUTTON-MIGRATION-GUIDE.md](../../docs/BUTTON-MIGRATION-GUIDE.md)
- **Component Comparison**: [reports/BUTTON-COMPONENT-COMPARISON.md](../../reports/BUTTON-COMPONENT-COMPARISON.md)
- **Implementation Log**: [reports/UI-CONSOLIDATION-IMPLEMENTATION.md](../../reports/UI-CONSOLIDATION-IMPLEMENTATION.md)

---

## 🔄 Migration from Old Packages

### From @monorepo/ui-components

```typescript
// ❌ Old
import { Button } from '@monorepo/ui-components';

// ✅ New
import { Button } from '@monorepo/ui';
```

### From @monorepo/shared-ui

```typescript
// ❌ Old
import { ErrorBoundary } from '@monorepo/shared-ui';

// ✅ New
import { ErrorBoundary } from '@monorepo/ui';
```

### Variant Name Changes

```typescript
// ❌ Old
<Button variant="default">Click</Button>

// ✅ New
<Button variant="primary">Click</Button>
// or simply
<Button>Click</Button>
```

---

## 🏗️ Package Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── ErrorBoundary/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── tokens/
│   │   ├── tokens.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Features

### Button Component
- ✅ 7 variants (primary, secondary, tertiary, destructive, outline, ghost, link)
- ✅ 5 sizes (sm, md, lg, xl, icon)
- ✅ Loading state with spinner
- ✅ Left and right icon support
- ✅ Full width option
- ✅ Composition with asChild
- ✅ Enterprise-grade accessibility
- ✅ Design token integration
- ✅ Active state animation
- ✅ Comprehensive TypeScript types

### Card Component
- ✅ Flexible content container
- ✅ Consistent styling
- ✅ Responsive design

### ErrorBoundary Component
- ✅ Graceful error handling
- ✅ Custom fallback UI
- ✅ Error logging support

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## 🔧 Development

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📦 Exports

```typescript
// Main exports
import { Button, Card, ErrorBoundary } from '@monorepo/ui';

// Utilities
import { cn } from '@monorepo/ui';

// Tokens
import { tokens } from '@monorepo/ui/tokens';

// Types
import type { ButtonProps } from '@monorepo/ui';
```

---

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Create a pull request

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Consolidated 3 packages into 1
- ✅ Unified Button component (best version selected)
- ✅ Added ErrorBoundary from shared-ui
- ✅ Integrated design tokens
- ✅ Improved TypeScript types
- ✅ Enhanced documentation
- ✅ Breaking changes: variant names updated (default → primary)

### Version 1.x
- Legacy versions (deprecated)

---

## 🚨 Breaking Changes from v1.x

1. **Variant Names**
   - `default` → `primary`
   - All other variants remain the same

2. **Size Names**
   - `default` → `md`
   - All other sizes remain the same

3. **Import Paths**
   - `@monorepo/ui-components` → `@monorepo/ui`
   - `@monorepo/shared-ui` → `@monorepo/ui`

See [Migration Guide](../../docs/BUTTON-MIGRATION-GUIDE.md) for detailed migration instructions.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/alawein-tech/monorepo/issues)
- **Slack**: #ui-components
- **Email**: ui-team@alawein.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Acknowledgments

This package consolidates work from:
- `@monorepo/ui` - Original UI components
- `@monorepo/ui-components` - Design tokens and enhanced components
- `@monorepo/shared-ui` - Shared utilities and ErrorBoundary

Special thanks to all contributors who helped build these components!

---

**Status**: ✅ Production Ready  
**Version**: 2.0.0  
**Last Updated**: 2024  
**Maintained by**: Alawein Technologies UI Team
