/**
 * Brand Design Tokens
 * Centralized branding for all LLCs and products
 */

export type BrandId = 
  | 'alawein-technologies' 
  | 'live-it-iconic' 
  | 'repz' 
  | 'talai' 
  | 'librex' 
  | 'qaplibria' 
  | 'mezan' 
  | 'qmlab' 
  | 'llmworks';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  darkBg: string;
  lightBg: string;
}

export interface BrandTypography {
  heading: string;
  body: string;
  mono?: string;
  accent?: string;
}

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  domain?: string;
  llc: 'Alawein Technologies LLC' | 'Live It Iconic LLC' | 'REPZ LLC';
  colors: BrandColors;
  typography: BrandTypography;
  logoPath: string;
}

export const brands: Record<BrandId, Brand> = {
  'alawein-technologies': {
    id: 'alawein-technologies',
    name: 'Alawein Technologies',
    tagline: 'Advancing Science Through Code',
    domain: 'alawein.dev',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#A855F7',
      secondary: '#4CC9F0',
      accent: '#EC4899',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #4CC9F0 100%)',
      darkBg: '#0F0F23',
      lightBg: '#F8FAFC',
    },
    typography: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    logoPath: '/logos/llc/alawein-technologies.svg',
  },

  'live-it-iconic': {
    id: 'live-it-iconic',
    name: 'Live It Iconic',
    tagline: 'Luxury Automotive Lifestyle',
    domain: 'liveiticonic.com',
    llc: 'Live It Iconic LLC',
    colors: {
      primary: '#FACC15',
      secondary: '#CA8A04',
      accent: '#1C1917',
      gradient: 'linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)',
      darkBg: '#0C0A09',
      lightBg: '#FFFBEB',
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Italiana',
    },
    logoPath: '/logos/llc/live-it-iconic.svg',
  },

  'repz': {
    id: 'repz',
    name: 'REPZ',
    tagline: 'Train Smarter. Get Stronger.',
    domain: 'getrepz.app',
    llc: 'REPZ LLC',
    colors: {
      primary: '#22C55E',
      secondary: '#15803D',
      accent: '#F97316',
      gradient: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
      darkBg: '#0A0F0C',
      lightBg: '#F0FDF4',
    },
    typography: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Space Grotesk',
    },
    logoPath: '/logos/llc/repz.svg',
  },

  'talai': {
    id: 'talai',
    name: 'TalAI',
    tagline: 'Autonomous AI Research Assistant',
    domain: 'talai.dev',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#A855F7',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      darkBg: '#0F0F23',
      lightBg: '#FFF7ED',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/talai.svg',
  },

  'librex': {
    id: 'librex',
    name: 'Librex',
    tagline: 'Optimization Redefined',
    domain: 'librex.dev',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      accent: '#06B6D4',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
      darkBg: '#0F172A',
      lightBg: '#EFF6FF',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/librex.svg',
  },

  'qaplibria': {
    id: 'qaplibria',
    name: 'QAPLibria',
    tagline: 'Quadratic Assignment Problem Solver',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
      darkBg: '#0F172A',
      lightBg: '#EDE9FE',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/qaplibria.svg',
  },

  'mezan': {
    id: 'mezan',
    name: 'MEZAN',
    tagline: 'ML/AI DevOps Platform',
    domain: 'mezan.dev',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#10B981',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #10B981 100%)',
      darkBg: '#0F0F23',
      lightBg: '#F5F3FF',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/mezan.svg',
  },

  'qmlab': {
    id: 'qmlab',
    name: 'QMLab',
    tagline: 'Quantum Materials Laboratory',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#A855F7',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      darkBg: '#0F172A',
      lightBg: '#ECFEFF',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/qmlab.svg',
  },

  'llmworks': {
    id: 'llmworks',
    name: 'LLMWorks',
    tagline: 'LLM Evaluation & Benchmarking',
    domain: 'llmworks.dev',
    llc: 'Alawein Technologies LLC',
    colors: {
      primary: '#A855F7',
      secondary: '#7C3AED',
      accent: '#F97316',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
      darkBg: '#0F0F23',
      lightBg: '#FAF5FF',
    },
    typography: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    logoPath: '/logos/products/llmworks.svg',
  },
};

export const getBrand = (id: BrandId): Brand => brands[id];
export const getBrandsByLLC = (llc: Brand['llc']): Brand[] => 
  Object.values(brands).filter(b => b.llc === llc);

