---
title: 'Button Component Migration Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Button Component Migration Guide

**Version**: 1.0.0  
**Date**: 2024  
**Status**: Active

---

## Overview

As part of the UI package consolidation, we're standardizing on a single,
feature-rich Button component. This guide will help you migrate from the old
Button implementations to the new unified version.

---

## What's Changing?

### Before Consolidation

- 3 different Button implementations across packages
- Inconsistent APIs and features
- Multiple import paths

### After Consolidation

- 1 unified Button component
- Consistent API with more features
- Single import path: `@monorepo/ui`

---

## Quick Migration Checklist

- [ ] Update import paths
- [ ] Update variant names (if using `default`)
- [ ] Update size names (if using `default`)
- [ ] Test your components
- [ ] Explore new features (loading, icons, fullWidth)

---

## Import Path Changes

### ✅ If you were importing from `@monorepo/ui`

**No changes needed!** The Button component location remains the same.

```typescript
// ✅ This still works
import { Button } from '@monorepo/ui';
```

### ⚠️ If you were importing from `@monorepo/ui-components`

**Update required:** Change to the unified package.

```typescript
// ❌ Old (will be removed)
import { Button } from '@monorepo/ui-components';

// ✅ New
import { Button } from '@monorepo/ui';
```

### ⚠️ If you were importing from `@monorepo/shared-ui`

**Update required:** Change to the unified package.

```typescript
// ❌ Old (will be removed)
import { Button } from '@monorepo/shared-ui';

// ✅ New
import { Button } from '@monorepo/ui';
```

---

## API Changes

### Variant Names

If you were using the `default` variant, update to `primary`:

```typescript
// ❌ Old
<Button variant="default">Click me</Button>

// ✅ New
<Button variant="primary">Click me</Button>

// Or omit variant (primary is default)
<Button>Click me</Button>
```

**All Variants**:

- `primary` (default) - Brand primary button
- `secondary` - Secondary button
- `tertiary` - Tertiary button (new!)
- `destructive` - Destructive/delete actions
- `outline` - Outlined button
- `ghost` - Ghost button
- `link` - Link-styled button

### Size Names

If you were using the `default` size, update to `md`:

```typescript
// ❌ Old
<Button size="default">Click me</Button>

// ✅ New
<Button size="md">Click me</Button>

// Or omit size (md is default)
<Button>Click me</Button>
```

**All Sizes**:

- `sm` - Small (h-9)
- `md` (default) - Medium (h-10)
- `lg` - Large (h-11)
- `xl` - Extra large (h-12) (new!)
- `icon` - Icon button (h-10, w-10)

---

## New Features

### 1. Loading State

Show a loading spinner and disable the button:

```typescript
// New feature!
<Button loading>Processing...</Button>

// With state
const [isLoading, setIsLoading] = useState(false);

<Button
  loading={isLoading}
  onClick={async () => {
    setIsLoading(true);
    await saveData();
    setIsLoading(false);
  }}
>
  Save
</Button>
```

### 2. Icon Support

Add icons before or after button text:

```typescript
import { PlusIcon, ArrowRightIcon } from '@icons';

// Left icon
<Button leftIcon={<PlusIcon />}>
  Add Item
</Button>

// Right icon
<Button rightIcon={<ArrowRightIcon />}>
  Next Step
</Button>

// Both icons
<Button
  leftIcon={<PlusIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Add and Continue
</Button>
```

### 3. Full Width

Make button span full width of container:

```typescript
// New feature!
<Button fullWidth>
  Full Width Button
</Button>

// Useful in forms
<form>
  <input type="email" />
  <Button fullWidth type="submit">
    Sign Up
  </Button>
</form>
```

### 4. Composition with asChild

Use Button styling on other elements:

```typescript
import { Link } from 'next/link';

// Button styled as Link
<Button asChild>
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</Button>

// Button styled as anchor
<Button asChild variant="outline">
  <a href="https://example.com" target="_blank">
    External Link
  </a>
</Button>
```

---

## Migration Examples

### Example 1: Basic Button

```typescript
// ❌ Before
import { Button } from '@monorepo/ui-components';

<Button variant="default" size="default">
  Click me
</Button>

// ✅ After
import { Button } from '@monorepo/ui';

<Button variant="primary" size="md">
  Click me
</Button>

// ✅ Even better (use defaults)
<Button>Click me</Button>
```

### Example 2: Form Submit Button

```typescript
// ❌ Before
import { Button } from '@monorepo/ui-components';

<Button variant="default" type="submit">
  Submit Form
</Button>

// ✅ After (with loading state)
import { Button } from '@monorepo/ui';

const [isSubmitting, setIsSubmitting] = useState(false);

<Button
  type="submit"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit Form
</Button>
```

### Example 3: Delete Button

```typescript
// ❌ Before
import { Button } from '@monorepo/ui-components';

<Button variant="destructive">
  Delete
</Button>

// ✅ After (with icon and confirmation)
import { Button } from '@monorepo/ui';
import { TrashIcon } from '@icons';

<Button
  variant="destructive"
  leftIcon={<TrashIcon />}
  onClick={handleDelete}
>
  Delete
</Button>
```

### Example 4: Navigation Button

```typescript
// ❌ Before
import { Button } from '@monorepo/ui-components';
import { useRouter } from 'next/router';

const router = useRouter();

<Button
  variant="outline"
  onClick={() => router.push('/dashboard')}
>
  Go to Dashboard
</Button>

// ✅ After (with asChild for better semantics)
import { Button } from '@monorepo/ui';
import { Link } from 'next/link';

<Button asChild variant="outline">
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</Button>
```

### Example 5: Icon Button

```typescript
// ❌ Before
import { Button } from '@monorepo/ui-components';
import { SettingsIcon } from '@icons';

<Button size="icon">
  <SettingsIcon />
</Button>

// ✅ After (same API!)
import { Button } from '@monorepo/ui';
import { SettingsIcon } from '@icons';

<Button size="icon">
  <SettingsIcon />
</Button>
```

---

## Common Patterns

### Loading Button with Async Action

```typescript
import { Button } from '@monorepo/ui';
import { useState } from 'react';

function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData();
      toast.success('Saved successfully!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button loading={isSaving} onClick={handleSave}>
      Save Changes
    </Button>
  );
}
```

### Button with Icon and Loading

```typescript
import { Button } from '@monorepo/ui';
import { SaveIcon } from '@icons';

<Button
  leftIcon={<SaveIcon />}
  loading={isSaving}
  onClick={handleSave}
>
  {isSaving ? 'Saving...' : 'Save'}
</Button>
```

### Responsive Button Group

```typescript
import { Button } from '@monorepo/ui';

<div className="flex flex-col sm:flex-row gap-2">
  <Button variant="outline" fullWidth>
    Cancel
  </Button>
  <Button fullWidth>
    Confirm
  </Button>
</div>
```

### Button as Link (Next.js)

```typescript
import { Button } from '@monorepo/ui';
import Link from 'next/link';

<Button asChild>
  <Link href="/dashboard">
    Dashboard
  </Link>
</Button>
```

---

## Variant Comparison Table

| Old Name      | New Name      | Description                     |
| ------------- | ------------- | ------------------------------- |
| `default`     | `primary`     | Primary brand button            |
| `secondary`   | `secondary`   | Secondary button (no change)    |
| N/A           | `tertiary`    | New tertiary variant            |
| `destructive` | `destructive` | Destructive actions (no change) |
| `outline`     | `outline`     | Outlined button (no change)     |
| `ghost`       | `ghost`       | Ghost button (no change)        |
| `link`        | `link`        | Link-styled button (no change)  |

---

## Size Comparison Table

| Old Name  | New Name | Height     | Description             |
| --------- | -------- | ---------- | ----------------------- |
| `default` | `md`     | h-10       | Medium size (default)   |
| `sm`      | `sm`     | h-9        | Small size (no change)  |
| `lg`      | `lg`     | h-11       | Large size (no change)  |
| N/A       | `xl`     | h-12       | New extra large size    |
| `icon`    | `icon`   | h-10, w-10 | Icon button (no change) |

---

## TypeScript Types

### ButtonProps Interface

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Render as a different element while preserving button behavior
   * @default false
   */
  asChild?: boolean;
}
```

---

## Testing Your Migration

### 1. Visual Testing

Check that your buttons look correct:

- [ ] Correct colors and styling
- [ ] Proper spacing and sizing
- [ ] Icons display correctly
- [ ] Loading spinner works
- [ ] Hover and focus states work

### 2. Functional Testing

Verify button behavior:

- [ ] Click handlers work
- [ ] Form submission works
- [ ] Navigation works (if using asChild)
- [ ] Disabled state works
- [ ] Loading state prevents clicks

### 3. Accessibility Testing

Ensure accessibility:

- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Screen reader announces correctly
- [ ] aria-busy set when loading
- [ ] Proper contrast ratios

---

## Troubleshooting

### Issue: Button not found after migration

**Solution**: Check your import path

```typescript
// ✅ Correct
import { Button } from '@monorepo/ui';

// ❌ Incorrect
import { Button } from '@monorepo/ui-components';
```

### Issue: TypeScript errors about variant

**Solution**: Update `default` to `primary`

```typescript
// ❌ Old
<Button variant="default">Click</Button>

// ✅ New
<Button variant="primary">Click</Button>
```

### Issue: Button styling looks different

**Solution**: Check if you're using custom className that conflicts

```typescript
// If you have custom styles, they should still work
<Button className="custom-class">Click</Button>

// But design tokens are now used, so some colors may differ
```

### Issue: Loading spinner not showing

**Solution**: Make sure you're using the `loading` prop

```typescript
// ✅ Correct
<Button loading={isLoading}>Save</Button>

// ❌ Won't work
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Save'}
</Button>
```

---

## Timeline

### Deprecation Period: 4 weeks

- **Week 1-2**: Update your code at your convenience
- **Week 3**: Old packages marked as deprecated
- **Week 4**: Final migration deadline
- **After Week 4**: Old packages removed

---

## Support

### Need Help?

- 📚 Check this migration guide
- 💬 Ask in #ui-components Slack channel
- 🐛 Report issues in GitHub
- 📧 Email: ui-team@company.com

### Resources

- [Button Component Documentation](./docs/components/Button.md)
- [Design System Guide](./docs/design-system.md)
- [Storybook Examples](https://storybook.company.com)

---

## Checklist for Teams

### For Developers

- [ ] Read this migration guide
- [ ] Update all Button imports in your codebase
- [ ] Update variant names (default → primary)
- [ ] Update size names (default → md)
- [ ] Test your changes locally
- [ ] Run all tests
- [ ] Create PR with migration changes
- [ ] Get code review
- [ ] Deploy to staging
- [ ] Verify in staging
- [ ] Deploy to production

### For QA

- [ ] Test all buttons in the application
- [ ] Verify visual appearance
- [ ] Test all button interactions
- [ ] Test loading states
- [ ] Test with keyboard navigation
- [ ] Test with screen readers
- [ ] Test on different browsers
- [ ] Test on mobile devices

### For Design

- [ ] Review button variants
- [ ] Verify design token integration
- [ ] Check spacing and sizing
- [ ] Verify color contrast
- [ ] Update design system documentation
- [ ] Update Figma components

---

**Migration Status**: 🟡 In Progress  
**Deadline**: 4 weeks from today  
**Support**: Available via Slack #ui-components

🎉 **Thank you for helping us consolidate and improve our UI components!** 🎉
