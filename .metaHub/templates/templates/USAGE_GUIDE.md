# Templates Usage Guide

This guide explains the different ways to use templates from the AlaweinOS Templates Library.

## Quick Navigation

- [Method 1: Copy-Paste (Easiest)](#method-1-copy-paste)
- [Method 2: Component Import](#method-2-component-import)
- [Method 3: Git Submodule](#method-3-git-submodule)
- [Method 4: Documentation Reference](#method-4-documentation-reference)
- [Choosing the Right Method](#choosing-the-right-method)

---

## Method 1: Copy-Paste

**Best for:** Starting completely new projects, isolated deployments, beginners

**Difficulty:** ⭐ Easy

### Step 1: Choose a Template

First, decide which template matches your use case:

- **Scientific computing?** → Use `SimCore`
- **Workflow automation?** → Use `MEZAN`
- **AI/ML research?** → Use `TalAI`
- **Algorithm optimization?** → Use `OptiLibria`
- **Quantum computing?** → Use `QMLab`

### Step 2: Copy the Template

```bash
# Navigate to where you want to create your project
cd ~/projects

# Copy the template
cp -r /path/to/quantum-dev-profile/templates/platforms/simcore my-science-app

# Navigate to your new project
cd my-science-app
```

### Step 3: Update Project Metadata

Edit `package.json`:

```json
{
  "name": "my-science-app",
  "version": "0.1.0",
  "description": "My custom science application",
  "author": "Your Name"
}
```

### Step 4: Install Dependencies

```bash
npm install
# or if using yarn
yarn install
# or if using bun
bun install
```

### Step 5: Customize

Now you can modify:

- **Components** in `src/components/`
- **Pages** in `src/pages/`
- **Styling** in `src/index.css` and `tailwind.config.ts`
- **API calls** to your backend
- **Configuration** in `src/config/`

### Step 6: Run Your Project

```bash
npm run dev
```

Visit `http://localhost:5173` (or the URL shown in your terminal).

---

## Method 2: Component Import

**Best for:** Adding components to existing projects, sharing a component library, reusing specific
UI patterns

**Difficulty:** ⭐⭐ Intermediate

### Setup: Link Templates Repository

**Option A: NPM Workspace (Recommended)**

```bash
# In your project root
npm install file:/path/to/quantum-dev-profile
```

**Option B: Import via Path**

```tsx
// In your project files
import { GlassCard } from '../quantum-dev-profile/templates/shared/components';
```

**Option C: Configure Module Alias** In `vite.config.ts` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@templates/*": ["../quantum-dev-profile/templates/*"]
    }
  }
}
```

### Example: Using Components

```tsx
// Import shared components
import { GlassCard } from '@templates/shared/components/cards';
import { Button } from '@templates/shared/components/button';
import { useAuthStore } from '@templates/shared/utils/stores';

export function MyDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <GlassCard>
      <h1>Welcome, {user?.name}</h1>
      <Button>Click me</Button>
    </GlassCard>
  );
}
```

### Available Shared Components

#### UI Components

- `Button` - Reusable button component
- `Card` / `GlassCard` - Card containers
- `Input` - Text input fields
- `Select` - Dropdown select
- `Modal` - Modal dialogs
- `Tabs` - Tab navigation
- `Badge` - Badge labels

#### Utilities

- `useAuthStore` - Authentication state
- `useApi` - API request hook
- `useNotification` - Toast notifications
- `useTheme` - Theme management

#### Styles

- Design tokens
- Tailwind CSS extensions
- CSS variables

### Example: Shared Configuration

```tsx
// Import config from templates
import { tailwindConfig } from '@templates/shared/config';
import { typeScriptConfig } from '@templates/shared/config';

// Use in your tailwind.config.ts
export default {
  ...tailwindConfig,
  // Your customizations
};
```

---

## Method 3: Git Submodule

**Best for:** Teams sharing templates, staying in sync with updates, collaborative development

**Difficulty:** ⭐⭐⭐ Advanced

### Step 1: Add Submodule to Your Project

```bash
# In your project root
git submodule add https://github.com/alawein-testing/quantum-dev-profile.git templates
```

This clones the templates repo into a `templates/` folder in your project.

### Step 2: Configure Module Paths

In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@templates/*": ["templates/*"],
      "@shared/*": ["templates/shared/*"]
    }
  }
}
```

### Step 3: Import Components

```tsx
import { GlassCard } from '@templates/shared/components';
import { Button } from '@shared/components/button';
```

### Step 4: Manage Submodule

```bash
# Update submodule to latest version
git submodule update --remote

# Clone a project with submodules
git clone --recurse-submodules https://your-repo.git

# Initialize submodules after cloning
git submodule update --init --recursive
```

### Step 5: Commit Changes

```bash
# Submodule updates are tracked as part of your repo
git add templates
git commit -m "Update templates to latest version"
git push
```

---

## Method 4: Documentation Reference

**Best for:** Learning patterns, understanding architecture, manual implementation

**Difficulty:** ⭐ Easy (but manual work)

### How to Use

1. **Browse the templates** in `/templates/platforms/`
2. **Read the code** to understand patterns and structure
3. **Copy code** you like into your own project
4. **Adapt** it to your specific needs
5. **Reference** the design decisions made in the templates

### Example: Learning from MEZAN

To understand workflow building patterns:

1. Look at `/templates/platforms/mezan/src/pages/Dashboard.tsx`
2. See how it structures workflow components
3. See how it manages state with Zustand
4. Copy and adapt the patterns to your project

---

## Choosing the Right Method

### Use Copy-Paste If:

- ✅ Starting a completely new project
- ✅ Want complete independence
- ✅ Don't expect frequent template updates
- ✅ Building something similar to a template

### Use Component Import If:

- ✅ Have an existing project
- ✅ Want to reuse specific components
- ✅ Multiple projects share components
- ✅ Want a shared component library

### Use Git Submodule If:

- ✅ Working in a team
- ✅ Want to stay synchronized with template updates
- ✅ Multiple projects use the same templates
- ✅ Contributing improvements back

### Use Documentation Reference If:

- ✅ Learning how something works
- ✅ Want full control over implementation
- ✅ Building something different
- ✅ Need to understand architectural decisions

---

## Common Scenarios

### Scenario 1: "I want to build a new science platform"

**Use Method 1 (Copy-Paste)**

```bash
cp -r templates/platforms/simcore ~/projects/my-science-app
cd ~/projects/my-science-app
npm install
npm run dev
# Start customizing!
```

### Scenario 2: "I want to reuse the GlassCard component in my existing app"

**Use Method 2 (Component Import)**

```tsx
import { GlassCard } from '../templates/shared/components';

export function MyComponent() {
  return <GlassCard>Your content</GlassCard>;
}
```

### Scenario 3: "I'm in a team and we share templates across multiple projects"

**Use Method 3 (Git Submodule)**

```bash
git submodule add https://github.com/alawein-testing/quantum-dev-profile.git templates
# Now all team members pull the same templates
```

### Scenario 4: "I want to understand how SimCore is structured"

**Use Method 4 (Documentation Reference)**

- Read `/templates/platforms/simcore/README.md`
- Explore `/templates/platforms/simcore/src/`
- Check component architecture
- Reference in your own code

---

## Troubleshooting

### "I can't find the import path"

Make sure your module paths are configured in `tsconfig.json` or `vite.config.ts`.

### "Updates from templates don't affect my project"

If using copy-paste (Method 1), you need to manually sync changes. Consider using git submodule
(Method 3) instead.

### "Submodule is not updating"

```bash
git submodule update --remote --rebase
```

### "Components have conflicting styles"

Check that you're not duplicating Tailwind config. Use one source of truth for CSS variables and
tokens.

---

## Best Practices

1. **Document Your Choices** - Add comments explaining why you chose a particular template or
   component
2. **Keep Consistent** - If using templates, maintain their structure and patterns
3. **Update Regularly** - Check for template updates (especially for git submodules)
4. **Contribute Back** - If you improve a template, consider submitting a PR
5. **Version Your Template Use** - Keep track of which template version you're using

---

## Need Help?

- Check [`README.md`](README.md) for general information
- Check [`REGISTRY.md`](REGISTRY.md) for available templates
- Read platform-specific READMEs in each template folder
- Explore the actual code in the templates

---

**Last Updated:** 2024-12-05
