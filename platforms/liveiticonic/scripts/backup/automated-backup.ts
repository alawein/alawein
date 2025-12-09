import { performDatabaseBackup } from './database-backup.ts';
import { uploadToS3 } from './cloud-storage.ts';
import fs from 'fs/promises';
import path from 'path';

interface BackupNotification {
  status: 'success' | 'failure' | 'warning';
  timestamp: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

const BACKUP_SCHEDULE = process.env.BACKUP_SCHEDULE || '0 2 * * *'; // Daily at 2 AM UTC
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const ENABLE_S3_UPLOAD = process.env.ENABLE_S3_UPLOAD === 'true';
const ENABLE_NOTIFICATIONS = process.env.ENABLE_NOTIFICATIONS !== 'false';

interface BackupState {
  lastBackupTime?: Date;
  lastBackupStatus?: 'success' | 'failure';
  backupCount: number;
  errorCount: number;
}

const backupState: BackupState = {
  backupCount: 0,
  errorCount: 0,
};

export async function sendBackupNotification(notification: BackupNotification): Promise<void> {
  if (!ENABLE_NOTIFICATIONS) {
    return;
  }

  try {
    // Send to logging service
    console.log(`[BACKUP NOTIFICATION] ${notification.status.toUpperCase()}`);
    console.log(`  Timestamp: ${notification.timestamp}`);

    if (notification.status === 'success') {
      console.log(`  Metadata:`, notification.metadata);
    } else if (notification.status === 'failure') {
      console.error(`  Error: ${notification.error}`);
    }

    // If email notifications are configured
    if (process.env.BACKUP_NOTIFICATION_EMAIL) {
      await sendEmailNotification(notification);
    }

    // If webhook notifications are configured
    if (process.env.BACKUP_WEBHOOK_URL) {
      await sendWebhookNotification(notification);
    }

    // Store notification in audit log
    await storeNotificationLog(notification);
  } catch (error) {
    console.error('Failed to send backup notification:', error);
  }
}

async function sendEmailNotification(notification: BackupNotification): Promise<void> {
  try {
    const emailEndpoint = process.env.BACKUP_NOTIFICATION_EMAIL;
    const response = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/api/email/backup-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        to: emailEndpoint,
        status: notification.status,
        metadata: notification.metadata,
        error: notification.error,
        timestamp: notification.timestamp,
      }),
    });

    if (!response.ok) {
      console.warn(`Email notification failed: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Email notification error:', error);
  }
}

async function sendWebhookNotification(notification: BackupNotification): Promise<void> {
  try {
    const response = await fetch(process.env.BACKUP_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      console.warn(`Webhook notification failed: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Webhook notification error:', error);
  }
}

async function storeNotificationLog(notification: BackupNotification): Promise<void> {
  try {
    const logsDir = path.join(BACKUP_DIR, 'logs');
    await fs.mkdir(logsDir, { recursive: true });

    const logDate = new Date().toISOString().split('T')[0];
    const logPath = path.join(logsDir, `${logDate}.log`);

    const logEntry = `[${notification.timestamp}] ${notification.status.toUpperCase()}: ${
      notification.error || JSON.stringify(notification.metadata)
    }\n`;

    await fs.appendFile(logPath, logEntry);
  } catch (error) {
    console.warn('Failed to store notification log:', error);
  }
}

export async function performBackupCycle(): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Starting automated backup cycle at ${timestamp}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // Perform backup
    const result = await performDatabaseBackup({
      tables: [
        'products',
        'orders',
        'users',
        'inventory',
        'customers',
        'order_items',
        'product_variants',
        'reviews',
        'wishlists',
      ],
      destination: BACKUP_DIR,
      retention: 30, // 30 days local retention
    });

    backupState.lastBackupTime = new Date();
    backupState.lastBackupStatus = 'success';
    backupState.backupCount++;

    // Upload to S3 if enabled
    if (ENABLE_S3_UPLOAD) {
      console.log('\nUploading backup to S3...');
      try {
        await uploadToS3(result.backupDir);
        console.log('✓ S3 upload completed');
      } catch (error) {
        console.error('S3 upload failed:', error);
        throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Send success notification
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    await sendBackupNotification({
      status: 'success',
      timestamp,
      metadata: {
        ...result.metadata,
        durationSeconds: parseFloat(duration),
        s3UploadEnabled: ENABLE_S3_UPLOAD,
      },
    });

    console.log(`\n✓ Backup cycle completed in ${duration}s`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    backupState.lastBackupStatus = 'failure';
    backupState.errorCount++;

    console.error(`\n✗ Backup failed: ${errorMsg}`);

    await sendBackupNotification({
      status: 'failure',
      timestamp,
      error: errorMsg,
    });

    throw error;
  }
}

export function getBackupState(): BackupState {
  return { ...backupState };
}

export async function getBackupStats(): Promise<{
  state: BackupState;
  recentBackups: Array<{
    name: string;
    timestamp: string;
    size: number;
  }>;
  diskUsage: {
    total: number;
    used: number;
    available: number;
  };
}> {
  try {
    const { listBackups } = await import('./database-backup.ts');
    const recentBackups = await listBackups(BACKUP_DIR);

    // Try to get disk usage
    const diskUsage = { total: 0, used: 0, available: 0 };
    try {
      const stats = await fs.stat(BACKUP_DIR);
      diskUsage.used = stats.size;
    } catch (error) {
      console.warn('Could not calculate disk usage');
    }

    return {
      state: getBackupState(),
      recentBackups: recentBackups.map((b) => ({
        name: b.name,
        timestamp: b.timestamp,
        size: b.size,
      })),
      diskUsage,
    };
  } catch (error) {
    console.error('Error getting backup stats:', error);
    return {
      state: getBackupState(),
      recentBackups: [],
      diskUsage: { total: 0, used: 0, available: 0 },
    };
  }
}

// Main execution - run backup on startup if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'once';

  if (mode === 'once') {
    performBackupCycle()
      .then(() => {
        console.log('\n✓ Backup completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n✗ Backup failed:', error);
        process.exit(1);
      });
  } else if (mode === 'daemon') {
    console.log(`Starting backup daemon with schedule: ${BACKUP_SCHEDULE}`);
    console.log('Note: For production, use a proper job scheduler like AWS Lambda, Kubernetes Cron, or systemd timer');

    // Simple interval-based backup (for development)
    // In production, use proper job scheduling services
    setInterval(async () => {
      try {
        await performBackupCycle();
      } catch (error) {
        console.error('Backup cycle error:', error);
      }
    }, 24 * 60 * 60 * 1000); // Daily

    console.log('Backup daemon running. Press Ctrl+C to stop.');
  } else if (mode === 'stats') {
    getBackupStats()
      .then((stats) => {
        console.log(JSON.stringify(stats, null, 2));
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error retrieving stats:', error);
        process.exit(1);
      });
  }
}
