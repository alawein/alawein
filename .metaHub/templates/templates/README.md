# AlaweinOS Templates Library

Welcome to the **AlaweinOS Templates Library** - a comprehensive collection of reusable platform
templates, design systems, and shared components for building modern web applications with React,
TypeScript, and Tailwind CSS.

## 📚 What's Inside

### Platform Templates

Complete, production-ready implementations of specialized applications:

- **SimCore** - Scientific computing and simulation platform
- **MEZAN** - Enterprise automation and workflow management
- **TalAI** - AI research and experimentation platform
- **OptiLibria** - Algorithm optimization and benchmarking
- **QMLab** - Quantum mechanics laboratory and education

### Design System Templates

Pre-built design systems and component libraries:

- **Glassmorphism** - Modern frosted glass effect design system
- _More coming soon..._

### Shared Resources

Reusable across all projects:

- Common UI components
- Configuration files (Tailwind, TypeScript, ESLint)
- Utility functions and custom hooks
- Type definitions

## 🚀 Quick Start

### Option 1: Copy a Complete Platform Template

Create a new project from an existing template:

```bash
# Copy SimCore template
cp -r templates/platforms/simcore ../my-new-science-project
cd ../my-new-science-project

# Install dependencies and start
npm install
npm run dev
```

### Option 2: Use As a Shared Library (Git Submodule)

Reference templates in your own project:

```bash
# Add this repo as a submodule
git submodule add https://github.com/alaweimm90-testing/quantum-dev-profile.git templates

# Import components in your code
import { GlassCard } from './templates/shared/components'
```

### Option 3: Cherry-Pick Components

Import just the components and utilities you need:

```tsx
// In your project
import { GlassCard } from '@/templates/shared/components/cards';
import { Button } from '@/templates/shared/components/button';
import { useAuthStore } from '@/templates/shared/utils/stores';
```

## 📋 Directory Structure

```
templates/
├── platforms/              # Complete platform implementations
│   ├── simcore/           # Scientific computing
│   ├── mezan/             # Enterprise automation
│   ├── talai/             # AI research
│   ├── optilibria/        # Optimization
│   ├── qmlab/             # Quantum mechanics
│   └── template-metadata.json  # Platform registry
├── styles/                # Design system templates
│   └── glassmorphism/     # Glassmorphism design system
├── shared/                # Shared resources
│   ├── components/        # Reusable UI components
│   ├── config/            # Configuration files
│   └── utils/             # Utilities and hooks
├── REGISTRY.md            # Full template registry
└── README.md              # This file
```

## 🎯 Platform Templates Overview

### SimCore - Scientific Computing

**Use this template if you're building:**

- Scientific computing applications
- Data analysis platforms
- Simulation software
- Research visualization tools

**Key features:**

- Advanced data visualization with Recharts
- 3D visualization with Three.js
- Real-time data updates
- Experiment management

**Tech stack:** React, TypeScript, Tailwind, Recharts, Three.js

---

### MEZAN - Enterprise Automation

**Use this template if you're building:**

- Workflow automation systems
- Business process management tools
- Task management platforms
- Enterprise dashboards

**Key features:**

- Workflow builder interface
- Task and process management
- Real-time monitoring
- Reporting & analytics

**Tech stack:** React, TypeScript, Tailwind, Zustand, TanStack Query

---

### TalAI - AI Research

**Use this template if you're building:**

- AI/ML research platforms
- Model training interfaces
- Experiment tracking systems
- MLOps dashboards

**Key features:**

- Experiment tracking
- Model management
- Results comparison
- Deployment interface

**Tech stack:** React, TypeScript, Tailwind, API Integration

---

### OptiLibria - Algorithm Optimization

**Use this template if you're building:**

- Algorithm testing platforms
- Performance benchmarking tools
- Optimization software
- Comparison and analysis tools

**Key features:**

- Algorithm execution framework
- Performance metrics
- Benchmarking tools
- Result comparison

**Tech stack:** React, TypeScript, Tailwind, Data Visualization

---

### QMLab - Quantum Computing

**Use this template if you're building:**

- Quantum computing education tools
- Quantum circuit simulators
- Physics simulation platforms
- Research tools

**Key features:**

- Quantum circuit builder
- Simulation engine
- 3D visualization
- Educational interface

**Tech stack:** React, TypeScript, Tailwind, Three.js

## 🎨 Design System Templates

### Glassmorphism

A modern design system featuring frosted glass effects and soft shadows.

**Includes:**

- Pre-built component library
- Tailwind configuration
- CSS tokens and variables
- Color system
- Typography system

**Usage:**

```tsx
import { GlassCard, GlassButton } from '@/templates/styles/glassmorphism';

export function MyComponent() {
  return (
    <GlassCard>
      <h1>Glassmorphism Design</h1>
      <GlassButton>Click me</GlassButton>
    </GlassCard>
  );
}
```

## 🔧 Shared Resources

### Components (`/templates/shared/components`)

- Button
- Card (multiple variants)
- Input/Form components
- Navigation components
- Modal/Dialog
- And more...

### Configuration (`/templates/shared/config`)

- `tailwind.config.ts` - Base Tailwind configuration
- `tsconfig.json` - TypeScript base configuration
- `eslint.config.js` - ESLint configuration
- Design tokens

### Utilities (`/templates/shared/utils`)

- Custom React hooks
- Helper functions
- Type definitions
- Store setups (Zustand)
- API utilities

## 📝 Creating a New Project from a Template

### Step 1: Choose Your Template

Look through the platform templates above and pick one that matches your needs.

### Step 2: Copy the Template

```bash
cp -r templates/platforms/[template-name] ../my-new-project
cd ../my-new-project
```

### Step 3: Customize

Edit the files to match your project needs:

- Update `package.json` with your project name and info
- Modify components and pages
- Adjust styling and branding
- Configure API endpoints

### Step 4: Install & Run

```bash
npm install
npm run dev
```

## 🛠️ Extending Templates

### Add a New Platform Template

1. Create folder:

   ```bash
   mkdir -p templates/platforms/my-platform
   ```

2. Create `template.json`:

   ```json
   {
     "id": "my-platform",
     "name": "My Platform",
     "title": "My Platform Title",
     "description": "Description of my platform",
     "category": "platforms",
     "version": "1.0.0",
     "tech": ["React", "TypeScript", "Tailwind CSS"],
     "features": ["Feature 1", "Feature 2"],
     "usage": "copy-paste"
   }
   ```

3. Add files to the template directory

4. Update `templates/platforms/template-metadata.json`

5. Update `REGISTRY.md`

### Add a New Design System

1. Create folder:

   ```bash
   mkdir -p templates/styles/my-style
   ```

2. Create README and components

3. Update `REGISTRY.md`

## 🚢 Sharing & Collaboration

### Using as a Git Submodule

For projects that want to stay in sync with template updates:

```bash
git submodule add https://github.com/alaweimm90-testing/quantum-dev-profile.git templates
git submodule update --remote
```

### Keeping Templates Updated

When you improve a template, update the version in `template.json`:

```json
"version": "1.1.0"  // Semantic versioning
```

## 📚 Documentation

For detailed documentation, see:

- [`REGISTRY.md`](REGISTRY.md) - Complete template registry
- Platform-specific READMEs in each template folder
- Component documentation in `/templates/shared/components`

## 🤝 Contributing

To add new templates or improve existing ones:

1. Create or modify template files
2. Update metadata files
3. Add/update documentation
4. Test the template thoroughly
5. Commit with clear messages

## 📄 License

MIT - Use these templates freely in your projects

---

**Last Updated:** 2024-12-05 **Version:** 1.0.0
