import { defineAuth } from '@nexus/auth';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        scopes: ['email', 'profile', 'openid'],
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        scopes: ['user:email'],
      },
      // Apple for enterprise plans
      ...(process.env.APPLE_CLIENT_ID && {
        signInWithApple: {
          clientId: process.env.APPLE_CLIENT_ID!,
          keyId: process.env.APPLE_KEY_ID!,
          privateKey: process.env.APPLE_PRIVATE_KEY!,
          teamId: process.env.APPLE_TEAM_ID!,
        },
      }),
    },
  },

  // Multi-factor authentication
  multifactor: {
    mode: 'OPTIONAL', // Can be set to 'REQUIRED' for enterprise
    totp: true,
    sms: true,
    email: true,
  },

  // User attributes
  userAttributes: {
    email: {
      required: true,
      mutable: true,
      autoVerified: true,
    },
    phone_number: {
      required: false,
      mutable: true,
      autoVerified: false,
    },
    given_name: {
      required: false,
      mutable: true,
    },
    family_name: {
      required: false,
      mutable: true,
    },
    // Custom attributes for SaaS
    'custom:role': {
      dataType: 'String',
      mutable: true,
      maxLen: 50,
    },
    'custom:tier': {
      dataType: 'String',
      mutable: true,
      maxLen: 50,
    },
    'custom:organizationId': {
      dataType: 'String',
      mutable: true,
      maxLen: 100,
    },
    'custom:subscriptionStatus': {
      dataType: 'String',
      mutable: true,
      maxLen: 50,
    },
    'custom:joinedAt': {
      dataType: 'String',
      mutable: false,
      maxLen: 50,
    },
  },

  // Password policy
  passwordPolicy: {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    tempPasswordValidity: 7, // days
  },

  // Account recovery
  accountRecovery: 'EMAIL_AND_PHONE',

  // NexusAuth user pool groups for tier-based access
  userPoolGroups: {
    'admin': {
      description: 'System administrators with full access',
      precedence: 1,
    },
    'enterprise': {
      description: 'Enterprise tier users',
      precedence: 10,
    },
    'pro': {
      description: 'Pro tier users',
      precedence: 20,
    },
    'starter': {
      description: 'Starter tier users',
      precedence: 30,
    },
    'free': {
      description: 'Free tier users',
      precedence: 40,
    },
  },

  // NexusAuth OAuth configuration
  oauth: {
    domainPrefix: process.env.AUTH_DOMAIN_PREFIX || 'nexus-auth',
    scopes: ['phone', 'email', 'profile', 'openid'],
    callbackUrls: [
      'http://localhost:3000',
      'http://localhost:3000/auth/callback',
      'https://dev.{{PLATFORM_DOMAIN}}',
      'https://staging.{{PLATFORM_DOMAIN}}',
      'https://app.{{PLATFORM_DOMAIN}}',
    ],
    logoutUrls: [
      'http://localhost:3000',
      'https://dev.{{PLATFORM_DOMAIN}}',
      'https://staging.{{PLATFORM_DOMAIN}}',
      'https://app.{{PLATFORM_DOMAIN}}',
    ],
  },

  // NexusAuth triggers for custom logic
  triggers: {
    preSignUp: {
      handler: 'preSignUpHandler.handler',
      environment: {
        ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS || '',
        AUTO_VERIFY_DOMAINS: process.env.AUTO_VERIFY_DOMAINS || '',
      },
    },
    postConfirmation: {
      handler: 'postConfirmationHandler.handler',
      environment: {
        WELCOME_EMAIL_TEMPLATE: process.env.WELCOME_EMAIL_TEMPLATE || 'WelcomeEmail',
        DEFAULT_TIER: process.env.DEFAULT_TIER || 'free',
        DEFAULT_ROLE: process.env.DEFAULT_ROLE || 'user',
      },
    },
    preTokenGeneration: {
      handler: 'preTokenGenerationHandler.handler',
      environment: {
        CLAIMS_MAPPING: 'role,tier,organizationId,subscriptionStatus',
      },
    },
  },
});
