import { type ClientSchema, a, defineData } from '@nexus/data';

const schema = a.schema({
  // ═══════════════════════════════════════════════════════════
  // NEXUS DATA MODELS
  // ═══════════════════════════════════════════════════════════

  UserProfile: a
    .model({
      email: a.string().required(),
      displayName: a.string(),
      avatar: a.string().default('https://via.placeholder.com/150'),
      bio: a.string(),
      firstName: a.string(),
      lastName: a.string(),
      phone: a.string(),
      timezone: a.string().default('UTC'),
      language: a.string().default('en'),
      // Subscription info
      tier: a.string().default('free'),
      subscriptionStatus: a.string().default('inactive'),
      subscriptionEndsAt: a.datetime(),
      trialEndsAt: a.datetime(),
      stripeCustomerId: a.string(),
      // Usage tracking
      apiCallsThisMonth: a.integer().default(0),
      storageUsed: a.integer().default(0), // in bytes
      lastActiveAt: a.datetime(),
      // Preferences
      preferences: a.json(),
      // Relationships
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      memberships: a.hasMany('OrganizationMember', 'userId'),
      invitations: a.hasMany('Invitation', 'invitedUserId'),
      activities: a.hasMany('Activity', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // NEXUS AUTHORIZATION
  // ═══════════════════════════════════════════════════════════

  Organization: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      logo: a.string(),
      website: a.string(),
      description: a.string(),
      // Subscription
      plan: a.enum(['FREE', 'STARTER', 'PRO', 'ENTERPRISE']).default('FREE'),
      subscriptionStatus: a.enum(['ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING']).default('TRIALING'),
      stripeCustomerId: a.string(),
      stripeSubscriptionId: a.string(),
      trialEndsAt: a.datetime(),
      // Usage
      memberCount: a.integer().default(1),
      projectCount: a.integer().default(0),
      storageUsed: a.integer().default(0),
      apiCallsThisMonth: a.integer().default(0),
      // Settings
      settings: a.json(),
      // Relationships
      owner: a.belongsTo('UserProfile', 'ownerId'),
      ownerId: a.id().required(),
      members: a.hasMany('OrganizationMember', 'organizationId'),
      projects: a.hasMany('Project', 'organizationId'),
      invitations: a.hasMany('Invitation', 'organizationId'),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn('members'),
      allow.authenticated().to(['read']),
      allow.group('admin'),
    ]),

  OrganizationMember: a
    .model({
      role: a.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']).required(),
      permissions: a.string().array(),
      invitedAt: a.datetime().required(),
      joinedAt: a.datetime(),
      lastActiveAt: a.datetime(),
      // Relationships
      organizationId: a.id().required(),
      organization: a.belongsTo('Organization', 'organizationId'),
      userId: a.id().required(),
      user: a.belongsTo('UserProfile', 'userId'),
      invitedBy: a.belongsTo('UserProfile', 'invitedById'),
      invitedById: a.id(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('organization'),
      allow.group('admin'),
    ]),

  Invitation: a
    .model({
      email: a.string().required(),
      role: a.enum(['ADMIN', 'MEMBER', 'VIEWER']).required(),
      status: a.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED']).default('PENDING'),
      token: a.string().required(),
      expiresAt: a.datetime().required(),
      message: a.string(),
      // Relationships
      organizationId: a.id().required(),
      organization: a.belongsTo('Organization', 'organizationId'),
      invitedBy: a.belongsTo('UserProfile', 'invitedById'),
      invitedById: a.id().required(),
      invitedUser: a.belongsTo('UserProfile', 'invitedUserId'),
      invitedUserId: a.id(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('organization'),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // PROJECT MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  Project: a
    .model({
      name: a.string().required(),
      description: a.string(),
      slug: a.string().required(),
      status: a.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED', 'ON_HOLD']).default('ACTIVE'),
      visibility: a.enum(['PRIVATE', 'INTERNAL', 'PUBLIC']).default('PRIVATE'),
      settings: a.json(),
      // Metadata
      tags: a.string().array(),
      metadata: a.json(),
      // Relationships
      organizationId: a.id().required(),
      organization: a.belongsTo('Organization', 'organizationId'),
      owner: a.belongsTo('UserProfile', 'ownerId'),
      ownerId: a.id().required(),
      members: a.hasMany('ProjectMember', 'projectId'),
      resources: a.hasMany('ProjectResource', 'projectId'),
      activities: a.hasMany('Activity', 'projectId'),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn('organization'),
      allow.authenticated().to(['read']),
    ]),

  ProjectMember: a
    .model({
      role: a.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']).required(),
      permissions: a.string().array(),
      joinedAt: a.datetime().required(),
      lastActiveAt: a.datetime(),
      // Relationships
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      userId: a.id().required(),
      user: a.belongsTo('UserProfile', 'userId'),
      invitedBy: a.belongsTo('UserProfile', 'invitedById'),
      invitedById: a.id(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('project'),
      allow.group('admin'),
    ]),

  ProjectResource: a
    .model({
      name: a.string().required(),
      type: a.enum(['FILE', 'FOLDER', 'API', 'DATABASE', 'NOTE']).required(),
      path: a.string(),
      size: a.integer(),
      mimeType: a.string(),
      metadata: a.json(),
      // Relationships
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      owner: a.belongsTo('UserProfile', 'ownerId'),
      ownerId: a.id().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('project'),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // NEXUS BILLING
  // ═══════════════════════════════════════════════════════════

  Subscription: a
    .model({
      status: a.enum(['ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING', 'UNPAID']).required(),
      tier: a.string().required(),
      price: a.integer().required(), // in cents
      currency: a.string().default('USD'),
      interval: a.enum(['MONTH', 'YEAR']).required(),
      // Stripe integration
      stripeSubscriptionId: a.string().required(),
      stripeCustomerId: a.string().required(),
      currentPeriodStart: a.datetime().required(),
      currentPeriodEnd: a.datetime().required(),
      trialStart: a.datetime(),
      trialEnd: a.datetime(),
      cancelAtPeriodEnd: a.boolean().default(false),
      canceledAt: a.datetime(),
      // Usage tracking
      usage: a.json(),
      // Relationships
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      userId: a.id(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin'),
    ]),

  Invoice: a
    .model({
      number: a.string().required(),
      status: a.enum(['DRAFT', 'OPEN', 'PAID', 'VOID', 'UNCOLLECTIBLE']).required(),
      amount: a.integer().required(), // in cents
      currency: a.string().default('USD'),
      dueDate: a.datetime(),
      paidAt: a.datetime(),
      // Stripe integration
      stripeInvoiceId: a.string(),
      hostedInvoiceUrl: a.string(),
      invoicePdf: a.string(),
      // Line items
      lines: a.json().required(),
      // Relationships
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      userId: a.id(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // NEXUS ACTIVITY TRACKING
  // ═══════════════════════════════════════════════════════════

  Activity: a
    .model({
      type: a.string().required(), // 'user.login', 'project.create', 'subscription.upgrade', etc.
      action: a.string().required(),
      resource: a.string(), // Resource type
      resourceId: a.id(), // Resource ID
      metadata: a.json(),
      ipAddress: a.string(),
      userAgent: a.string(),
      // Relationships
      userId: a.id().required(),
      user: a.belongsTo('UserProfile', 'userId'),
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      projectId: a.id(),
      project: a.belongsTo('Project', 'projectId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('organization'),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // NEXUS INTEGRATIONS
  // ═══════════════════════════════════════════════════════════

  ApiKey: a
    .model({
      name: a.string().required(),
      keyPrefix: a.string().required(),
      keyHash: a.string().required(),
      scopes: a.string().array().required(),
      lastUsedAt: a.datetime(),
      expiresAt: a.datetime(),
      isActive: a.boolean().default(true),
      usageCount: a.integer().default(0),
      // Relationships
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      userId: a.id().required(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('organization'),
      allow.group('admin'),
    ]),

  Webhook: a
    .model({
      name: a.string().required(),
      url: a.string().required(),
      events: a.string().array().required(),
      secret: a.string(),
      isActive: a.boolean().default(true),
      lastTriggeredAt: a.datetime(),
      deliveryCount: a.integer().default(0),
      failureCount: a.integer().default(0),
      // Relationships
      organizationId: a.id(),
      organization: a.belongsTo('Organization', 'organizationId'),
      userId: a.id().required(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('organization'),
      allow.group('admin'),
    ]),

  // ═══════════════════════════════════════════════════════════
  // NEXUS CUSTOM OPERATIONS
  // ═══════════════════════════════════════════════════════════

  // Get organization stats
  getOrganizationStats: a
    .query()
    .arguments({
      organizationId: a.string().required(),
    })
    .returns(
      a.customType({
        memberCount: a.integer(),
        projectCount: a.integer(),
        apiCallsThisMonth: a.integer(),
        storageUsed: a.integer(),
        subscriptionStatus: a.string(),
        trialDaysLeft: a.integer(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('getOrganizationStatsFunction')),

  // Update usage metrics
  updateUsage: a
    .mutation()
    .arguments({
      organizationId: a.string(),
      userId: a.string(),
      apiCalls: a.integer(),
      storageDelta: a.integer(),
    })
    .returns(a.boolean())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('updateUsageFunction')),

  // Check tier limits
  checkLimits: a
    .query()
    .arguments({
      organizationId: a.string().required(),
      resource: a.string().required(), // 'users', 'projects', 'storage', 'api'
    })
    .returns(
      a.customType({
        allowed: a.boolean(),
        current: a.integer(),
        limit: a.integer(),
        remaining: a.integer(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('checkLimitsFunction')),

  // Create API key
  createApiKey: a
    .mutation()
    .arguments({
      name: a.string().required(),
      scopes: a.string().array().required(),
      expiresAt: a.datetime(),
    })
    .returns(
      a.customType({
        id: a.string(),
        name: a.string(),
        apiKey: a.string(),
        scopes: a.string().array(),
        createdAt: a.datetime(),
        expiresAt: a.datetime(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('createApiKeyFunction')),

  // Process webhook
  processWebhook: a
    .mutation()
    .arguments({
      webhookId: a.string().required(),
      event: a.string().required(),
      data: a.json(),
    })
    .returns(
      a.customType({
        success: a.boolean(),
        messageId: a.string(),
        error: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('processWebhookFunction')),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
