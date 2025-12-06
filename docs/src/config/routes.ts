// Route Configuration - Centralized route definitions
import { lazy } from 'react';

// Core pages (not lazy loaded)
export { default as Landing } from '@/pages/Landing';
export { default as Portfolio } from '@/pages/Portfolio';
export { default as NotFound } from '@/pages/NotFound';

// Feature-based route groups for organization reference
export const routeGroups = {
  auth: {
    base: '/auth',
    routes: {
      login: '/auth',
      profile: '/profile',
    },
  },
  dashboard: {
    base: '/dashboard',
    routes: {
      admin: '/admin',
      metrics: '/metrics',
      performance: '/performance',
      monitor: '/monitor',
      optimization: '/optimization',
      banking: '/banking',
      ml: '/ml-dashboard',
      pipeline: '/pipeline',
      serverRack: '/server-rack',
      weather: '/weather',
      fitness: '/fitness',
      crypto: '/crypto-terminal',
    },
  },
  templates: {
    base: '/templates',
    routes: {
      gallery: '/templates',
      cyberpunk: '/cyber-dashboard',
      glass: '/glass-music',
      neu: '/neu-settings',
      neuRecipes: '/neu-recipes',
      vaporwave: '/vaporwave',
      pastel: '/pastel-calendar',
      swiss: '/swiss-gallery',
      typo: '/typo-portfolio',
      playground: '/playground',
      designSystem: '/design-system',
    },
  },
  landing: {
    base: '/landing',
    routes: {
      openSource: '/open-source',
      saas: '/saas',
      event: '/event',
      waitlist: '/waitlist',
      jules: '/jules',
    },
  },
  apps: {
    base: '/apps',
    routes: {
      tasks: '/tasks',
      files: '/files',
      calendar: '/calendar',
      email: '/email',
      chat: '/chat',
      notifications: '/notifications',
      survey: '/survey-builder',
      invoice: '/invoice',
      canvas: '/canvas',
      codeEditor: '/code-editor',
      moodBoard: '/mood-board',
      iconStudio: '/icon-studio',
      promptStudio: '/prompt-studio',
      colorPalette: '/color-palette',
      settings: '/settings',
    },
  },
  media: {
    base: '/media',
    routes: {
      music: '/music',
      video: '/video',
      podcast: '/podcast',
      gallery: '/gallery',
      streaming: '/streaming',
    },
  },
  commerce: {
    base: '/commerce',
    routes: {
      checkout: '/checkout',
      pricing: '/pricing',
      nft: '/nft-marketplace',
    },
  },
  content: {
    base: '/content',
    routes: {
      blog: '/blog',
      wiki: '/wiki',
      changelog: '/changelog',
      apiDocs: '/api-docs',
    },
  },
  social: {
    base: '/social',
    routes: {
      feed: '/social',
      recipes: '/recipes',
      travel: '/travel',
      meditation: '/meditation',
    },
  },
  gaming: {
    base: '/gaming',
    routes: {
      arcade: '/arcade',
      launcher: '/game-launcher',
    },
  },
  research: {
    base: '/research',
    routes: {
      quantum: '/quantum-lab',
      paper: '/paper-viewer',
      simulation: '/simulation',
      physics: '/physics',
      three: '/3d',
      dataTable: '/data-table',
      dataStory: '/data-story',
      analytics: '/analytics',
    },
  },
  showcase: {
    base: '/showcase',
    routes: {
      project: '/showcase',
      resume: '/resume',
    },
  },
} as const;

export type RouteGroup = keyof typeof routeGroups;
