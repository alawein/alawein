# Templates Registry

This file documents all available templates in the AlaweinOS Templates Library.

## Platform Templates

These are complete platform implementations you can use as starting points for new projects.

### `/templates/platforms/simcore`

- **Name**: SimCore (Scientific Computing Platform)
- **Description**: Scientific computing and simulation platform with data analysis
- **Tech**: React, TypeScript, Recharts, Three.js
- **Key Components**: Data visualization, experiment runners, result analysis
- **Use Cases**: Copy entire template for new scientific computing projects
- **Status**: Template

### `/templates/platforms/mezan`

- **Name**: MEZAN (Enterprise Automation Platform)
- **Description**: Enterprise workflow automation and business process management
- **Tech**: React, TypeScript, Zustand, TanStack Query
- **Key Components**: Workflow builder, task management, process monitoring
- **Use Cases**: Copy template for enterprise automation projects
- **Status**: Template

### `/templates/platforms/talai`

- **Name**: TalAI (AI Research Platform)
- **Description**: AI model research, experimentation, and deployment platform
- **Tech**: React, TypeScript, API integration
- **Key Components**: Model training UI, experiment tracking, results dashboard
- **Use Cases**: Copy template for AI/ML research projects
- **Status**: Template

### `/templates/platforms/optilibria`

- **Name**: OptiLibria (Optimization Algorithms Platform)
- **Description**: Algorithm optimization and performance testing platform
- **Tech**: React, TypeScript, Data visualization
- **Key Components**: Algorithm runner, performance metrics, comparison tools
- **Use Cases**: Copy template for optimization-focused projects
- **Status**: Template

### `/templates/platforms/qmlab`

- **Name**: QMLab (Quantum Mechanics Laboratory)
- **Description**: Quantum computing education and simulation platform
- **Tech**: React, TypeScript, Three.js
- **Key Components**: Quantum circuit builder, simulation engine, visualization
- **Use Cases**: Copy template for quantum computing projects
- **Status**: Template

## Design System / Style Templates

These are design system implementations with different visual styles and component systems.

### `/templates/styles/glassmorphism`

- **Name**: Glassmorphism Design System
- **Description**: Modern frosted glass effect design with soft shadows
- **Files**: Components, Tailwind config, CSS tokens
- **Use Cases**: Import components into new projects or copy entire style
- **Status**: Shared Library

### `/templates/styles/[other-style]`

- **Add more design system templates as needed**

## Shared Resources

### `/templates/shared/components`

Reusable UI components used across all platforms:

- Card components
- Input components
- Navigation components
- Modal/Dialog components
- etc.

### `/templates/shared/config`

Shared configuration files:

- Tailwind configuration
- TypeScript base config
- ESLint/Prettier config
- etc.

### `/templates/shared/utils`

Utility functions and hooks:

- Custom hooks
- Helper functions
- Type definitions
- etc.

## How to Use Templates

### Method 1: Copy-Paste

Copy the entire platform folder to start a new project:

```bash
cp -r templates/platforms/simcore ../my-new-project
```

### Method 2: Import Components

Import shared components and utilities in your project:

```tsx
import { GlassCard } from '@/templates/shared/components/cards';
import { useAuthStore } from '@/templates/shared/utils/stores';
```

### Method 3: Git Submodule

Reference this repo as a submodule:

```bash
git submodule add https://github.com/alawein-testing/quantum-dev-profile.git templates
```

### Method 4: Documentation Reference

Use templates as reference documentation:

- Check platform implementations for best practices
- Reference design patterns and architecture
- Copy configuration approaches

## Adding New Templates

1. Create folder: `templates/[category]/[template-name]`
2. Add template files and components
3. Create README in the template folder
4. Update this REGISTRY.md with template information
5. Commit changes

## Template Metadata (template.json)

Each template should have a `template.json` file:

```json
{
  "name": "Platform Name",
  "id": "platform-id",
  "description": "Brief description",
  "category": "platforms",
  "version": "1.0.0",
  "tech": ["React", "TypeScript", "Tailwind CSS"],
  "components": ["Dashboard", "Form", "Chart"],
  "usage": "copy-paste",
  "author": "Your Name",
  "created": "2024-12-05"
}
```

---

**Last Updated**: 2024-12-05
