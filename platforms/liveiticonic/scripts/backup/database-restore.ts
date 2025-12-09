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

interface RestoreMetadata {
  timestamp: string;
  tables: string[];
  recordCounts: Record<string, number>;
  totalRecords: number;
}

interface RestoreResult {
  success: boolean;
  metadata: RestoreMetadata;
  restoredCount: Record<string, number>;
  totalRestored: number;
  errors: string[];
}

export async function restoreFromBackup(backupDir: string): Promise<RestoreResult> {
  const errors: string[] = [];
  const restoredCount: Record<string, number> = {};
  let totalRestored = 0;

  try {
    // Load metadata
    const metadataPath = path.join(backupDir, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata: RestoreMetadata = JSON.parse(metadataContent);

    console.log(`\nRestoring backup from ${metadata.timestamp}`);
    console.log(`Tables to restore: ${metadata.tables.join(', ')}`);
    console.log(`Total records in backup: ${metadata.totalRecords}\n`);

    // Confirm before restoring
    if (process.env.SKIP_RESTORE_CONFIRMATION !== 'true') {
      console.warn('⚠️  WARNING: This will DELETE all existing data in these tables:');
      console.warn(`  ${metadata.tables.join(', ')}`);
      console.log('To proceed, ensure you have run a backup first.');
    }

    for (const table of metadata.tables) {
      console.log(`\nRestoring table: ${table}`);

      const filename = path.join(backupDir, `${table}.json`);

      try {
        const fileContent = await fs.readFile(filename, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!Array.isArray(data)) {
          throw new Error(`Invalid backup format for ${table}: expected array`);
        }

        // Delete existing data
        console.log(`  Clearing existing data...`);
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (deleteError && !deleteError.message.includes('no rows')) {
          throw new Error(`Failed to clear ${table}: ${deleteError.message}`);
        }

        console.log(`  Inserting ${data.length} records...`);

        // Insert backup data in batches
        const batchSize = 100;
        let insertedCount = 0;

        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);

          const { error: insertError } = await supabase
            .from(table)
            .insert(batch);

          if (insertError) {
            throw new Error(`Failed to restore batch for ${table}: ${insertError.message}`);
          }

          insertedCount += batch.length;
          process.stdout.write(`\r  Progress: ${insertedCount}/${data.length}`);
        }

        console.log(`\n  ✓ Restored ${data.length} records to ${table}`);
        restoredCount[table] = data.length;
        totalRestored += data.length;
      } catch (error) {
        const errorMsg = `Error restoring ${table}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`  ✗ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`\n✓ Restore completed`);
    console.log(`  Total records restored: ${totalRestored}`);
    if (errors.length > 0) {
      console.log(`  Errors encountered: ${errors.length}`);
    }

    return {
      success: errors.length === 0,
      metadata,
      restoredCount,
      totalRestored,
      errors,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Fatal restore error:', errorMsg);
    throw error;
  }
}

export async function validateBackup(backupDir: string): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check metadata file
    const metadataPath = path.join(backupDir, 'metadata.json');
    let metadata: RestoreMetadata;

    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(content);
    } catch (error) {
      return {
        valid: false,
        issues: ['metadata.json not found or invalid'],
      };
    }

    // Validate each table file
    for (const table of metadata.tables) {
      const tablePath = path.join(backupDir, `${table}.json`);

      try {
        const stats = await fs.stat(tablePath);
        if (stats.size === 0) {
          issues.push(`${table}.json is empty`);
        }

        const content = await fs.readFile(tablePath, 'utf-8');
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
          issues.push(`${table}.json is not valid JSON array`);
        }

        if (data.length !== metadata.recordCounts[table]) {
          issues.push(
            `${table}.json record count mismatch: ` +
              `expected ${metadata.recordCounts[table]}, got ${data.length}`
          );
        }
      } catch (error) {
        issues.push(`Failed to read ${table}.json: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      valid: false,
      issues: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const backupPath = process.argv[2];

  if (!backupPath) {
    console.error('Usage: tsx database-restore.ts <backup-path>');
    console.error('Example: tsx database-restore.ts /backups/2024-01-15T02-00-00-000Z');
    process.exit(1);
  }

  console.log(`Validating backup: ${backupPath}`);
  validateBackup(backupPath)
    .then(async (validation) => {
      if (!validation.valid) {
        console.error('Backup validation failed:');
        validation.issues.forEach((issue) => console.error(`  - ${issue}`));
        process.exit(1);
      }

      console.log('✓ Backup validation passed\n');

      return restoreFromBackup(backupPath);
    })
    .then(() => {
      console.log('\n✓ Database restore completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
