// Central platforms registry - copied from PROJECT-PLATFORMS-CONFIG.ts
// This is the single source of truth for all platform metadata

export type PlatformStatus = "active" | "backend" | "planned";

export type PlatformTier =
  | "scientific"
  | "ai-ml"
  | "cultural"
  | "business"
  | "lifestyle"
  | "family"
  | "portfolio";

export type PlatformAppType = "spa" | "backend";

export interface PlatformDefinition {
  id: string;
  name: string;
  tier: PlatformTier;
  status: PlatformStatus;
  repoPath?: string;
  appType?: PlatformAppType;
  primaryColorToken?: string;
  hasAuth?: boolean;
  hasAdminArea?: boolean;
  tags?: string[];
  notes?: string;
  domainUrl?: string;
  brandPageUrl?: string;
  githubUrl?: string;
  tagline?: string;
  gradientColors?: [string, string];
  devPort?: number; // Local dev server port
}

export const PLATFORMS: PlatformDefinition[] = [
  // Scientific / Technical
  {
    id: "simcore",
    name: "SimCore",
    tier: "scientific",
    status: "active",
    repoPath: "alawein-technologies-llc/simcore",
    appType: "spa",
    tags: ["scientific", "simulations", "quantum", "materials"],
    notes: "Full Vite + React + Tailwind + shadcn SPA for scientific simulations.",
    domainUrl: "https://simcore.dev",
    brandPageUrl: "/pages/brands/simcore/",
    githubUrl: "https://github.com/AlaweinOS/SimCore",
    tagline: "Interactive Scientific Computing Platform",
    devPort: 5175,
    gradientColors: ["#22c55e", "#15803d"],
  },
  {
    id: "qmlab",
    name: "QMLab",
    tier: "scientific",
    status: "active",
    repoPath: "alawein-technologies-llc/qmlab",
    appType: "spa",
    tags: ["quantum", "lab", "accessibility", "playground"],
    notes: "Quantum mechanics playground SPA with strong accessibility focus.",
    domainUrl: "https://qmlab.online",
    brandPageUrl: "/pages/brands/qmlab/",
    githubUrl: "https://github.com/AlaweinOS/qmlab",
    tagline: "Quantum Mechanics in the Browser",
    devPort: 5180,
    gradientColors: ["#38bdf8", "#0284c7"],
  },
  {
    id: "optilibria",
    name: "OptiLibria",
    tier: "scientific",
    status: "planned",
    repoPath: "alawein-technologies-llc/librex",
    appType: "backend",
    tags: ["optimization", "portfolio", "librex", "libria"],
    notes: "Optimization logic exists inside Librex/Libria; front-end planned.",
    brandPageUrl: "/pages/brands/librex/",
    githubUrl: "https://github.com/AlaweinOS/Librex",
    tagline: "GPU-Accelerated Optimization Framework",
    devPort: 5182,
    gradientColors: ["#a855f7", "#7c3aed"],
  },
  // AI / ML
  {
    id: "talai",
    name: "TalAI",
    tier: "ai-ml",
    status: "backend",
    repoPath: "alawein-technologies-llc/talai",
    appType: "backend",
    tags: ["research", "automation", "workflows", "python"],
    notes: "Large Python research/orchestration system with 50+ modules.",
    domainUrl: "https://talai.dev",
    brandPageUrl: "/pages/brands/talai/",
    githubUrl: "https://github.com/AlaweinOS/TalAI",
    tagline: "Autonomous AI Research Assistant",
    devPort: 5179,
    gradientColors: ["#f97316", "#ea580c"],
  },
  {
    id: "llmworks",
    name: "LLMWorks",
    tier: "ai-ml",
    status: "active",
    repoPath: "alawein-technologies-llc/llmworks",
    appType: "spa",
    tags: ["llm", "evaluation", "benchmarking", "react"],
    notes: "LLM evaluation and benchmarking SPA with Supabase backend.",
    domainUrl: "https://llmworks.dev",
    brandPageUrl: "/pages/brands/llmworks/",
    githubUrl: "https://github.com/alawein-tools/LLMWorks",
    tagline: "Interactive LLM Evaluation & Benchmarking",
    devPort: 5181,
    gradientColors: ["#a855f7", "#7c3aed"],
  },
  // Business / Professional
  {
    id: "attributa",
    name: "Attributa",
    tier: "business",
    status: "active",
    repoPath: "alawein-technologies-llc/attributa",
    appType: "spa",
    hasAuth: true,
    tags: ["attribution", "analytics", "ai-detection", "react"],
    notes: "Attribution / AI detection analytics SPA with rich AI-specific color tokens.",
    domainUrl: "https://attributa.dev",
    brandPageUrl: "/pages/brands/attributa/",
    githubUrl: "https://github.com/alawein-tools/Attributa",
    tagline: "AI-Powered Attribution & Resume Analysis",
    devPort: 5178,
    gradientColors: ["#ec4899", "#be185d"],
  },
  {
    id: "repz",
    name: "REPZ Coach",
    tier: "business",
    status: "active",
    repoPath: "repz-llc/repz",
    appType: "spa",
    hasAuth: true,
    hasAdminArea: true,
    tags: ["fitness", "coaching", "supabase", "stripe", "react"],
    notes: "Fitness coach platform SPA with auth, tiered access, Supabase, and Stripe.",
    domainUrl: "https://getrepz.app",
    brandPageUrl: "/pages/brands/repz/",
    githubUrl: "https://github.com/repz-llc/repz",
    tagline: "AI-Powered Fitness Coaching Platform",
    devPort: 5176,
    gradientColors: ["#22c55e", "#15803d"],
  },
  {
    id: "mezan",
    name: "MEZAN",
    tier: "cultural",
    status: "backend",
    repoPath: "alawein-technologies-llc/mezan",
    appType: "backend",
    tags: ["orchestration", "libria", "optimization", "python"],
    notes: "Meta-Equilibrium Zero-regret Assignment Network — Python orchestration layer.",
    domainUrl: "https://mezan.dev",
    brandPageUrl: "/pages/brands/mezan/",
    githubUrl: "https://github.com/AlaweinOS/MEZAN",
    tagline: "Meta-Solver Orchestrator for Optimization",
    devPort: 5184,
    gradientColors: ["#ec4899", "#be185d"],
  },
  // Lifestyle / E-commerce
  {
    id: "liveiticonic",
    name: "Live It Iconic",
    tier: "lifestyle",
    status: "active",
    repoPath: "live-it-iconic-llc/liveiticonic",
    appType: "spa",
    hasAuth: true,
    hasAdminArea: true,
    tags: ["ecommerce", "lifestyle", "luxury", "react"],
    notes: "Premium lifestyle merchandise SPA with custom design tokens and Stripe.",
    domainUrl: "https://liveiticonic.com",
    brandPageUrl: "/pages/brands/liveiticonic/",
    githubUrl: "https://github.com/live-it-iconic-llc/liveiticonic",
    tagline: "Luxury Automotive Lifestyle Brand",
    devPort: 5177,
    gradientColors: ["#facc15", "#ca8a04"],
  },
  // Portfolio
  {
    id: "portfolio-main",
    name: "Portfolio",
    tier: "portfolio",
    status: "active",
    appType: "spa",
    tags: ["portfolio", "personal"],
    notes: "Cyberpunk portfolio with Jules design system.",
    repoPath: "platforms/portfolio",
    domainUrl: "https://malawein.com",
    brandPageUrl: "/pages/brands/portfolio/",
    githubUrl: "https://github.com/alaweimm90/Portfolio",
    tagline: "Professional Portfolio & Resume Generator",
    devPort: 5174,
    gradientColors: ["#38bdf8", "#0284c7"],
  },
  {
    id: "meatheadphysicist",
    name: "MeatheadPhysicist",
    tier: "portfolio",
    status: "active",
    appType: "spa",
    tags: ["education", "physics", "content"],
    notes: "Physics education persona and content hub.",
    brandPageUrl: "/pages/brands/meatheadphysicist/",
    tagline: "High-Intensity Physics Education",
    gradientColors: ["#f97316", "#ea580c"],
  },
];

// Helpers
export const TIER_LABELS: Record<PlatformTier, string> = {
  scientific: "Scientific / Technical",
  "ai-ml": "AI / Machine Learning",
  cultural: "Cultural / Themed",
  business: "Business / Professional",
  lifestyle: "Lifestyle / E-commerce",
  family: "Family / Personal",
  portfolio: "Portfolio / Education",
};

export const TIER_ORDER: PlatformTier[] = [
  "scientific",
  "ai-ml",
  "business",
  "lifestyle",
  "portfolio",
  "cultural",
  "family",
];

export const getPlatformsByTier = (tier: PlatformTier) =>
  PLATFORMS.filter((p) => p.tier === tier);

export const getActivePlatforms = () =>
  PLATFORMS.filter((p) => p.status === "active");

export const getPlatformById = (id: string) =>
  PLATFORMS.find((p) => p.id === id);

export const getPlatformsGroupedByTier = () => {
  const grouped: Record<PlatformTier, PlatformDefinition[]> = {
    scientific: [],
    "ai-ml": [],
    cultural: [],
    business: [],
    lifestyle: [],
    family: [],
    portfolio: [],
  };
  PLATFORMS.forEach((p) => grouped[p.tier].push(p));
  return grouped;
};
