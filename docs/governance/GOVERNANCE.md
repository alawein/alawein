# Monorepo Governance & Standards

## 📋 Overview

This document establishes governance rules, coding standards, and development guidelines for the Alawein Technologies monorepo.

---

## 🏗️ Repository Structure

```
GitHub/
├── platforms/                    # All deployable web applications
│   ├── simcore/                  # Scientific computing platform
│   ├── qmlab/                    # Quantum computing lab
│   ├── llmworks/                 # LLM tools platform
│   ├── attributa/                # AI attribution detection
│   ├── liveiticonic/             # E-commerce platform
│   ├── repz/                     # Fitness tracking
│   ├── portfolio/                # Personal portfolio
│   └── studios-hub/              # Central hub (docs/app)
├── automation/                   # AI automation tools & prompts
├── shared/                       # Shared libraries & components
│   ├── ui/                       # Shared UI components
│   ├── hooks/                    # Shared React hooks
│   └── utils/                    # Shared utilities
├── docs/                         # Documentation site
├── tools/                        # Development tools & scripts
└── .github/                      # GitHub workflows & templates
```

---

## 🎯 Platform Standards (Lovable-Compatible)

### Required Structure for Each Platform

```
platform-name/
├── src/
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/                    # Route pages
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities & helpers
│   ├── styles/                   # CSS/styling
│   ├── types/                    # TypeScript types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── components.json               # shadcn/ui config
├── tailwind.config.ts            # Tailwind config
├── vite.config.ts                # Vite config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── index.html                    # HTML entry
└── README.md                     # Platform documentation
```

### Required Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "tailwindcss": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "typescript": "^5.x"
  }
}
```

### Required Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 📝 Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` or proper types)
- Export types from dedicated `types/` folder
- Use interfaces for objects, types for unions

### React
- Functional components only
- Custom hooks for reusable logic
- Props interfaces defined above components
- Use React.memo() for expensive renders

### Styling
- Tailwind CSS for all styling
- Use `cn()` utility for conditional classes
- No inline styles
- CSS variables for theming

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils: `kebab-case.ts`
- Types: `kebab-case.ts`

---

## 🔄 Git Workflow

### Branch Naming
- `feature/platform-name/description`
- `fix/platform-name/description`
- `refactor/platform-name/description`
- `docs/description`

### Commit Messages
```
type(scope): description

Types: feat, fix, refactor, docs, style, test, chore
Scope: platform name or 'monorepo'
```

### Pull Requests
- Use PR template
- Require 1 approval
- All checks must pass
- Squash merge to main

---

## 🚀 Deployment

### Platform Ports (Development)
| Platform | Port |
|----------|------|
| Studios Hub | 5173 |
| Portfolio | 5174 |
| SimCore | 5175 |
| REPZ | 5176 |
| LiveItIconic | 5177 |
| Attributa | 5179 |
| QMLab | 5180 |
| LLMWorks | 5181 |

### Production Deployment
- All platforms deploy to Netlify
- Use `netlify.toml` for configuration
- Environment variables in Netlify dashboard

---

## 🔐 Security

- No secrets in code
- Use `.env` files (gitignored)
- `.env.example` for documentation
- Dependabot enabled for updates
- CodeQL scanning enabled

---

## 📊 Quality Gates

### Required for Merge
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] No console errors in browser
- [ ] Responsive design verified
- [ ] Accessibility basics checked

---

## 🤖 AI/Lovable Compatibility

### For Lovable.dev Integration
1. Each platform must be self-contained
2. Use standard Vite + React + TypeScript stack
3. Include `components.json` for shadcn/ui
4. No custom build configurations
5. Standard folder structure as defined above

### AI Agent Guidelines
- Follow existing patterns in codebase
- Don't modify shared components without approval
- Create platform-specific components first
- Document complex logic with comments

---

## 📞 Contacts

- **Repository Owner**: Meshal Alawein
- **Email**: meshal@berkeley.edu
- **GitHub**: @alawein
