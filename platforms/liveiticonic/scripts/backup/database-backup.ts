import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface BackupConfig {
  tables: string[];
  destination: string;
  retention: number; // days
}

interface BackupResult {
  backupDir: string;
  metadata: {
    timestamp: string;
    tables: string[];
    recordCounts: Record<string, number>;
    totalRecords: number;
    success: boolean;
  };
}

export async function performDatabaseBackup(config: BackupConfig): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(config.destination, timestamp);

  try {
    await fs.mkdir(backupDir, { recursive: true });
    console.log(`Created backup directory: ${backupDir}`);

    const recordCounts: Record<string, number> = {};
    let totalRecords = 0;

    for (const table of config.tables) {
      console.log(`Backing up table: ${table}`);

      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.error(`Error backing up ${table}:`, error);
        throw new Error(`Failed to backup ${table}: ${error.message}`);
      }

      const filename = path.join(backupDir, `${table}.json`);
      await fs.writeFile(filename, JSON.stringify(data, null, 2));

      const recordCount = Array.isArray(data) ? data.length : 0;
      recordCounts[table] = recordCount;
      totalRecords += recordCount;

      console.log(`✓ Backed up ${recordCount} records from ${table}`);
    }

    // Create backup metadata
    const metadata = {
      timestamp,
      tables: config.tables,
      recordCounts,
      totalRecords,
      success: true,
    };

    await fs.writeFile(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Cleanup old backups
    await cleanupOldBackups(config.destination, config.retention);

    console.log(`\n✓ Backup completed successfully`);
    console.log(`  Location: ${backupDir}`);
    console.log(`  Total records: ${totalRecords}`);

    return { backupDir, metadata };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

export async function getRecordCounts(tables: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.warn(`Could not get count for ${table}:`, error.message);
        counts[table] = 0;
      } else {
        counts[table] = count || 0;
      }
    } catch (e) {
      console.warn(`Error counting records in ${table}:`, e);
      counts[table] = 0;
    }
  }

  return counts;
}

export async function cleanupOldBackups(
  destination: string,
  retentionDays: number
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  try {
    const entries = await fs.readdir(destination);
    let deletedCount = 0;

    for (const entry of entries) {
      const entryPath = path.join(destination, entry);
      const stats = await fs.stat(entryPath);

      if (stats.isDirectory() && stats.mtime < cutoffDate) {
        await fs.rm(entryPath, { recursive: true });
        console.log(`Deleted old backup: ${entry}`);
        deletedCount++;
      }
    }

    console.log(`Cleanup complete: Deleted ${deletedCount} old backups`);
    return deletedCount;
  } catch (error) {
    console.warn('Cleanup encountered an error:', error);
    return 0;
  }
}

export async function listBackups(destination: string): Promise<Array<{
  name: string;
  timestamp: string;
  size: number;
  mtime: Date;
}>> {
  try {
    const entries = await fs.readdir(destination);
    const backups = [];

    for (const entry of entries) {
      const entryPath = path.join(destination, entry);
      const stats = await fs.stat(entryPath);

      if (stats.isDirectory()) {
        // Check if it has metadata.json
        try {
          const metadataPath = path.join(entryPath, 'metadata.json');
          await fs.stat(metadataPath);
          backups.push({
            name: entry,
            timestamp: entry,
            size: stats.size,
            mtime: stats.mtime,
          });
        } catch (e) {
          // Not a valid backup directory
        }
      }
    }

    return backups.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const backupDir = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
  const tables = [
    'products',
    'orders',
    'users',
    'inventory',
    'customers',
    'order_items',
    'product_variants',
  ];

  performDatabaseBackup({
    tables,
    destination: backupDir,
    retention: 30, // 30 days
  })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
