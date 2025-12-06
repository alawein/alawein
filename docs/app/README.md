# Alawein Studios

Consolidated React app for platforms, templates, and portfolio.

## Features

- **Platforms Hub**: Browse all 22 platforms across 3 LLCs
- **Templates Hub**: Reusable page templates for new projects
- **Portfolio**: Professional portfolio with skills and experience

## Development

```bash
cd docs/app
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` which can be deployed to any static host.

## Structure

```
docs/app/
├── src/
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # Entry point
│   ├── index.css         # Tailwind imports
│   ├── data/
│   │   └── platforms.ts  # Platform registry
│   └── pages/
│       ├── StudioSelector.tsx
│       ├── PlatformsHub.tsx
│       ├── TemplatesHub.tsx
│       └── Portfolio.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Integration

This app is part of the consolidated `docs/` structure:

- `docs/pages/` - Static HTML brand pages
- `docs/pages/styles/` - Shared CSS design system
- `docs/pages/templates/` - HTML templates
- `docs/app/` - This React app (Studios)

## Deployment

The app is configured with `base: '/app/'` for deployment alongside the static pages.

When deployed to GitHub Pages:
- Static pages: `https://<user>.github.io/<repo>/pages/`
- Studios app: `https://<user>.github.io/<repo>/app/`
