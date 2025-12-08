# Quick Reference: AlaweinOS Templates

## One-Minute Overview

This is a **templates library** with:

- ✅ 5 complete platform templates (copy-paste ready)
- ✅ Design system templates (glassmorphism)
- ✅ Shared components & utilities
- ✅ 4 different usage methods

## Start a New Project in 3 Steps

### Step 1: Pick a Template

```
SimCore       → Scientific computing
MEZAN         → Enterprise automation
TalAI         → AI research
OptiLibria    → Algorithm optimization
QMLab         → Quantum computing
```

### Step 2: Copy It

```bash
cp -r templates/platforms/simcore ../my-project
cd ../my-project
```

### Step 3: Run It

```bash
npm install
npm run dev
```

Done! You now have a working application.

---

## How to Use Templates

| Method               | Use Case                | Complexity  |
| -------------------- | ----------------------- | ----------- |
| **Copy-Paste**       | New projects            | ⭐ Easy     |
| **Component Import** | Add to existing project | ⭐⭐ Medium |
| **Git Submodule**    | Team/sync setup         | ⭐⭐⭐ Hard |
| **Documentation**    | Learn patterns          | ⭐ Easy     |

See [`USAGE_GUIDE.md`](USAGE_GUIDE.md) for detailed instructions.

---

## Key Files

| File                               | Purpose                 |
| ---------------------------------- | ----------------------- |
| [`README.md`](README.md)           | Main overview           |
| [`USAGE_GUIDE.md`](USAGE_GUIDE.md) | How to use templates    |
| [`REGISTRY.md`](REGISTRY.md)       | Complete template list  |
| [`config.json`](config.json)       | Machine-readable config |
| `platforms/*/`                     | Platform templates      |
| `shared/components/`               | Reusable components     |
| `shared/config/`                   | Shared configurations   |
| `shared/utils/`                    | Utilities & hooks       |

---

## Templates

### Platform Templates

All in `/templates/platforms/`

**SimCore** (Scientific Computing)

- Recharts, Three.js, data visualization
- Use for: simulators, data analysis, research

**MEZAN** (Enterprise Automation)

- Zustand, TanStack Query, workflows
- Use for: automation, processes, workflows

**TalAI** (AI Research)

- Model training, experiment tracking
- Use for: ML platforms, research tools

**OptiLibria** (Algorithm Optimization)

- Performance metrics, benchmarking
- Use for: optimization tools, comparison apps

**QMLab** (Quantum Computing)

- Circuit builder, Three.js visualization
- Use for: quantum education, simulation

### Design Systems

All in `/templates/styles/`

**Glassmorphism**

- Modern frosted glass design
- Pre-built components, color system

---

## Common Commands

```bash
# Copy a template
cp -r templates/platforms/simcore ../my-project

# Add as submodule
git submodule add https://github.com/alawein-testing/quantum-dev-profile.git templates

# Update submodule
git submodule update --remote

# Import component
import { GlassCard } from '@/templates/shared/components'
```

---

## Next Steps

1. **Choose a template** - [`REGISTRY.md`](REGISTRY.md)
2. **Read usage guide** - [`USAGE_GUIDE.md`](USAGE_GUIDE.md)
3. **Copy & customize** - Or import components
4. **Start building** - `npm run dev`

---

**Questions?** Check [`USAGE_GUIDE.md`](USAGE_GUIDE.md) → Scenarios & Troubleshooting

**Last Updated:** 2024-12-05
