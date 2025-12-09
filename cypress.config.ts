import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'github-repository-ecosystem',

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,

    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },

    env: {
      API_BASE_URL: 'http://localhost:3001/api',
      TEST_ENVIRONMENT: 'development',
      MOCK_EXTERNAL_APIS: true,
    },

    chromeWebSecurity: false,
    retries: { runMode: 2, openMode: 0 },
    experimentalStudio: true,
  },

  component: {
    specPattern: ['cypress/component/**/*.cy.{js,jsx,ts,tsx}', 'src/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/component.ts',
    fixturesFolder: 'cypress/fixtures',
    indexHtmlFile: 'cypress/support/component-index.html',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    env: {
      COMPONENT_TESTING: true,
      MOCK_APIS: true,
    },
  },

  blockHosts: ['*.google-analytics.com'],
  numTestsKeptInMemory: 50,
  trashAssetsBeforeRuns: true,
  watchForFileChanges: false,
  includeShadowDom: true,
  downloadsFolder: 'cypress/downloads',
});
