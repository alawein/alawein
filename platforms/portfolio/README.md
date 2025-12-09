# Portfolio

Personal portfolio website showcasing projects, skills, and professional experience.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# From monorepo root
npm install

# Navigate to portfolio
cd platforms/portfolio

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📦 Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npx playwright test
```

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── layout/     # Layout components (Header, Footer, etc.)
│   ├── sections/   # Page sections (Hero, About, Projects, etc.)
│   ├── shared/     # Shared/reusable components
│   └── ui/         # UI primitives (Button, Card, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
├── services/       # API services
└── types/          # TypeScript type definitions
```

## 🚀 Deployment

This project is configured for Netlify deployment. See `netlify.toml` for configuration.

```bash
# Preview build
npm run preview
```

## 📄 License

This project is part of the Alawein Technologies LLC monorepo.

---
_Part of the alawein enterprise monorepo_

