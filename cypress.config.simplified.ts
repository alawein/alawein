import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'github-repository-ecosystem',

  // E2E Testing Configuration
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: [
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'tests/e2e/**/*.cy.{js,jsx,ts,tsx}'
    ],
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Recording settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    
    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Setup
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      return config;
    },
    
    // Environment variables
    env: {
      API_BASE_URL: 'http://localhost:3001/api',
      TEST_ENVIRONMENT: 'development',
      MOCK_EXTERNAL_APIS: true
    },
    
    // Browser settings
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 0
    }
  },

  // Component Testing Configuration
  component: {
    specPattern: [
      'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
      'src/**/*.cy.{js,jsx,ts,tsx}'
    ],
    supportFile: 'cypress/support/component.ts',
    fixturesFolder: 'cypress/fixtures',
    indexHtmlFile: 'cypress/support/component-index.html',
    
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        mode: 'development',
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        module: {
          rules: [
            {
              test: /\.(ts|tsx)$/,
              use: 'ts-loader',
              exclude: /node_modules/
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
            }
          ]
        }
      }
    }
  },

  // Global settings
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporter-config.json'
  },
  trashAssetsBeforeRuns: true,
  watchForFileChanges: false,
  numTestsKeptInMemory: 50
});
