# Shared Components Library

This directory contains reusable components, hooks, and utilities that can be shared across all portfolio templates.

## Structure

```
_shared/
├── components/
│   ├── effects/          # Visual effects (particles, grids, glitch)
│   ├── ui/               # Base UI components (buttons, cards, inputs)
│   └── layout/           # Layout components (header, footer, nav)
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── styles/               # Shared CSS/Tailwind configs
└── types/                # TypeScript type definitions
```

## Usage

Templates can import shared components using relative paths or by copying them into their own structure.

### Option 1: Copy on Create
When creating a new template, copy the needed components:
```powershell
Copy-Item -Recurse "templates/_shared/components/effects" "templates/my-template/src/components/effects"
```

### Option 2: Symlink (Development Only)
For local development, you can symlink shared components:
```powershell
New-Item -ItemType SymbolicLink -Path "templates/my-template/src/shared" -Target "../../_shared"
```

## Available Components

### Effects
- `InteractiveParticles` - Mouse-reactive particle system
- `MatrixRain` - Matrix-style falling characters
- `CyberGrid` - Perspective grid with scanning effects
- `BootSequence` - Terminal-style boot animation
- `GlitchImage` - Image with glitch effects
- `OrbitalParticles` - Orbiting particle system

### UI
- `CyberButton` - Cyberpunk-styled button
- `LoadingSpinner` - Animated loading indicator
- `Card` - Base card component

### Hooks
- `useLocalStorage` - Persist state to localStorage
- `useMediaQuery` - Responsive breakpoint detection
- `useMousePosition` - Track mouse coordinates

## Adding New Components

1. Create the component in the appropriate subdirectory
2. Export it from the directory's `index.ts`
3. Document it in this README
4. Test it in at least one template

