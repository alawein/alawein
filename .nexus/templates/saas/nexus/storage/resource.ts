import { defineStorage } from '@nexus/storage';

export const storage = defineStorage({
  name: 'nexusSaasStorage',
  access: (allow) => ({
    // Public assets bucket - for logos, avatars, etc.
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],

    // User uploads bucket - private by default
    'uploads/{entity_id}/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],

    // Organization files
    'organizations/{organization_id}/*': [
      allow.authenticated.to(['read']),
      allow.ownerDefinedIn('organization').to(['read', 'write', 'delete']),
    ],

    // Project files
    'projects/{project_id}/*': [
      allow.authenticated.to(['read']),
      allow.ownerDefinedIn('project').to(['read', 'write', 'delete']),
    ],

    // User profile images
    'profiles/{user_id}/*': [
      allow.authenticated.to(['read']),
      allow.owner.to(['read', 'write', 'delete']),
    ],

    // Export files (invoices, reports, etc.)
    'exports/{entity_id}/*': [
      allow.owner.to(['read', 'write']),
      allow.ownerDefinedIn('organization').to(['read', 'write']),
    ],

    // Temporary uploads
    'temp/{user_id}/*': [
      allow.owner.to(['read', 'write', 'delete']),
      // Auto-delete after 24 hours
      allow.guest.to(['read']).expiresIn(86400),
    ],
  }),

  // Bucket configurations
  buckets: {
    // Public assets bucket
    publicAssets: {
      name: 'nexus-public-assets',
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
        allowedMethods: ['GET', 'HEAD'],
        maxAge: 3600,
      },
      cdn: {
        enabled: true,
        customDomain: 'assets.{{PLATFORM_DOMAIN}}',
      },
      compression: {
        enabled: true,
        mimeTypes: ['text/*', 'application/javascript', 'application/json', 'image/*'],
      },
    },

    // Private uploads bucket
    privateUploads: {
      name: 'nexus-private-uploads',
      encryption: {
        type: 'NexusStorage',
        algorithm: 'AES256',
      },
      versioning: true,
      lifecycle: {
        rules: [
          {
            id: 'DeleteOldVersions',
            status: 'Enabled',
            noncurrentVersionExpiration: {
              noncurrentDays: 30,
            },
          },
          {
            id: 'AbortIncompleteUploads',
            status: 'Enabled',
            abortIncompleteMultipartUpload: {
              daysAfterInitiation: 7,
            },
          },
        ],
      },
    },

    // Backup bucket
    backups: {
      name: 'nexus-backups',
      encryption: {
        type: 'NexusStorage',
        algorithm: 'AES256',
      },
      accessControl: 'private',
      lifecycle: {
        rules: [
          {
            id: 'RetainBackups',
            status: 'Enabled',
            transitions: [
              {
                storageClass: 'STANDARD_IA',
                transitionInDays: 30,
              },
              {
                storageClass: 'GLACIER',
                transitionInDays: 90,
              },
              {
                storageClass: 'DEEP_ARCHIVE',
                transitionInDays: 365,
              },
            ],
          },
        ],
      },
    },
  },

  // Triggers
  triggers: {
    onUpload: {
      handler: 'onUploadHandler.handler',
      events: ['nexus:ObjectCreated:*'],
      environment: {
        THUMBNAIL_SIZES: '150,300,600',
        IMAGE_QUALITY: '80',
        WEBP_ENABLED: 'true',
      },
    },
    onDelete: {
      handler: 'onDeleteHandler.handler',
      events: ['nexus:ObjectRemoved:*'],
      environment: {
        UPDATE_NEXUSDATA: 'true',
        NOTIFY_OWNER: 'true',
      },
    },
  },

  // Event notifications
  eventNotifications: {
    enabled: true,
    topics: {
      fileUploads: 'nexus-file-uploads',
      fileOperations: 'nexus-file-operations',
    },
  },
});
