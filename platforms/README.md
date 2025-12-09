# Platforms

This directory contains all production and development platforms across the three LLCs.

## Platform Registry

| Platform | Description | Port | LLC | Status |
|----------|-------------|------|-----|--------|
| **simcore** | Computational Physics Simulation | 5175 | Alawein Technologies | 🟡 Maintenance |
| **qmlab** | Quantum Mechanics Laboratory | 5180 | Alawein Technologies | 🟡 Maintenance |
| **llmworks** | LLM Development & Benchmarking | 5181 | Alawein Technologies | 🟡 Maintenance |
| **attributa** | AI Content Detection Platform | 5179 | Alawein Technologies | 🟡 Maintenance |
| **portfolio** | Developer Portfolio | 5174 | Alawein Technologies | 🟢 Active |
| **liveiticonic** | Fashion E-commerce Platform | 5177 | Live It Iconic | 🟢 Active |
| **repz** | AI Fitness Coaching Platform | 5176 | REPZ | 🟢 Active |

## LLC Ownership

### Alawein Technologies LLC
- SimCore - Physics simulation engine
- QMLab - Quantum computing education
- LLMWorks - LLM comparison and benchmarking
- Attributa - AI-generated content detection
- Portfolio - Personal developer portfolio

### Live It Iconic LLC
- LiveItIconic - Fashion e-commerce and wellness platform

### REPZ LLC
- REPZ - AI-powered fitness coaching and rep counting

## Quick Start

```bash
# Install all dependencies
npm install

# Build all platforms
npx turbo run build

# Run specific platform
cd platforms/repz && npm run dev
cd platforms/qmlab && npm run dev
cd platforms/llmworks && npm run dev
```

## Development

Each platform follows the same structure:
- `src/` - Source code
- `public/` - Static assets
- `dist/` - Build output
- `tests/` - Test files
- `docs/` - Platform-specific documentation

## Build Commands

```bash
# Build all platforms
npx turbo run build

# Build specific platform
npx turbo run build --filter=repz
npx turbo run build --filter=qmlab

# Type check all
npx turbo run type-check
```

