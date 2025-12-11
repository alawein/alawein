/**
 * Nexus Database Migration System
 * Handles database schema migrations and seeding
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import { NexusConfig } from '@nexus/shared';

export interface Migration {
  id: string;
  name: string;
  timestamp: number;
  up: string;
  down: string;
}

export interface SeedData {
  name: string;
  data: any[];
  dependencies?: string[];
}

export class DatabaseMigrator {
  private config: NexusConfig;
  private migrationsPath: string;
  private seedsPath: string;

  constructor(config: NexusConfig, migrationsPath = 'migrations', seedsPath = 'seeds') {
    this.config = config;
    this.migrationsPath = migrationsPath;
    this.seedsPath = seedsPath;
  }

  /**
   * Create a new migration
   */
  async createMigration(name: string): Promise<string> {
    const timestamp = Date.now();
    const migrationId = `${timestamp}_${name}`;
    const migrationPath = join(this.migrationsPath, `${migrationId}.ts`);

    // Ensure migrations directory exists
    await fs.mkdir(this.migrationsPath, { recursive: true });

    const migrationTemplate = `
import { Kysely, sql } from 'kysely';

export interface Database {
  // Define your database schema here
}

export async function up(db: Kysely<Database>): Promise<void> {
  // Add your migration logic here
  await sql\`
    CREATE TABLE example_table (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      name VARCHAR(255) NOT NULL
    );
  \`.execute(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Add your rollback logic here
  await sql\`DROP TABLE IF EXISTS example_table;\`.execute(db);
}
`;

    await fs.writeFile(migrationPath, migrationTemplate);
    console.log(`✓ Created migration: ${migrationId}`);

    return migrationId;
  }

  /**
   * Run pending migrations
   */
  async migrate(target?: string): Promise<void> {
    console.log('🔄 Running database migrations...');

    // Get all migrations
    const migrations = await this.getMigrations();

    // Get executed migrations
    const executed = await this.getExecutedMigrations();

    // Filter pending migrations
    const pending = migrations.filter(m => !executed.includes(m.id));

    if (pending.length === 0) {
      console.log('✓ No pending migrations');
      return;
    }

    // Create migrations table if needed
    await this.ensureMigrationsTable();

    // Execute migrations
    const db = await this.getDatabaseConnection();

    for (const migration of pending) {
      if (target && migration.id > target) break;

      console.log(`  → Running ${migration.id}`);

      try {
        // Import and execute migration
        const migrationModule = await import(join(process.cwd(), migration.path));
        await migrationModule.up(db);

        // Mark as executed
        await this.markMigrationExecuted(migration.id);

        console.log(`  ✓ Completed ${migration.id}`);
      } catch (error) {
        console.error(`  ✗ Failed ${migration.id}:`, error);
        throw error;
      }
    }

    console.log(`✓ Ran ${pending.length} migrations`);
  }

  /**
   * Rollback migrations
   */
  async rollback(steps = 1): Promise<void> {
    console.log(`⏪ Rolling back ${steps} migration(s)...`);

    const executed = await this.getExecutedMigrations();
    const toRollback = executed.slice(-steps);

    if (toRollback.length === 0) {
      console.log('✓ No migrations to rollback');
      return;
    }

    const db = await this.getDatabaseConnection();

    for (const migrationId of toRollback.reverse()) {
      console.log(`  → Rolling back ${migrationId}`);

      try {
        const migration = await this.getMigration(migrationId);
        const migrationModule = await import(join(process.cwd(), migration.path));
        await migrationModule.down(db);

        await this.markMigrationRolledBack(migrationId);
        console.log(`  ✓ Rolled back ${migrationId}`);
      } catch (error) {
        console.error(`  ✗ Failed to rollback ${migrationId}:`, error);
        throw error;
      }
    }

    console.log(`✓ Rolled back ${toRollback.length} migration(s)`);
  }

  /**
   * Reset database
   */
  async reset(): Promise<void> {
    console.log('🔄 Resetting database...');

    const executed = await this.getExecutedMigrations();
    if (executed.length > 0) {
      await this.rollback(executed.length);
    }

    await this.migrate();
    console.log('✓ Database reset complete');
  }

  /**
   * Seed database with initial data
   */
  async seed(names?: string[]): Promise<void> {
    console.log('🌱 Seeding database...');

    const seeds = await this.getSeeds();
    const toRun = names ? seeds.filter(s => names.includes(s.name)) : seeds;

    if (toRun.length === 0) {
      console.log('✓ No seeds to run');
      return;
    }

    const db = await this.getDatabaseConnection();

    for (const seed of toRun) {
      console.log(`  → Seeding ${seed.name}`);

      try {
        const seedModule = await import(join(process.cwd(), seed.path));
        await seedModule.seed(db, seed.data);
        console.log(`  ✓ Seeded ${seed.name}`);
      } catch (error) {
        console.error(`  ✗ Failed to seed ${seed.name}:`, error);
        throw error;
      }
    }

    console.log(`✓ Ran ${toRun.length} seed(s)`);
  }

  /**
   * Create a new seed file
   */
  async createSeed(name: string): Promise<string> {
    const seedPath = join(this.seedsPath, `${name}.ts`);

    // Ensure seeds directory exists
    await fs.mkdir(this.seedsPath, { recursive: true });

    const seedTemplate = `
import { Kysely } from 'kysely';

export interface Database {
  // Define your database schema here
}

export async function seed(db: Kysely<Database>, data: any[]): Promise<void> {
  // Add your seeding logic here
  for (const item of data) {
    await db.insertInto('example_table')
      .values(item)
      .execute();
  }
}

// Sample data
export const sampleData = [
  {
    name: 'Sample Item 1',
  },
  {
    name: 'Sample Item 2',
  },
];
`;

    await fs.writeFile(seedPath, seedTemplate);
    console.log(`✓ Created seed: ${name}`);

    return name;
  }

  /**
   * Get migration status
   */
  async status(): Promise<void> {
    console.log('📊 Migration Status:\n');

    const migrations = await this.getMigrations();
    const executed = await this.getExecutedMigrations();

    console.log('Executed migrations:');
    for (const migrationId of executed) {
      console.log(`  ✓ ${migrationId}`);
    }

    const pending = migrations.filter(m => !executed.includes(m.id));
    if (pending.length > 0) {
      console.log('\nPending migrations:');
      for (const migration of pending) {
        console.log(`  ○ ${migration.id}`);
      }
    }

    console.log(`\nTotal: ${executed.length} executed, ${pending.length} pending`);
  }

  // Private methods
  private async getMigrations(): Promise<Migration[]> {
    const files = await fs.readdir(this.migrationsPath);
    const migrations: Migration[] = [];

    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const fullPath = join(this.migrationsPath, file);
        const stat = await fs.stat(fullPath);
        const id = file.replace(/\.(ts|js)$/, '');
        const name = id.split('_').slice(1).join('_');
        const timestamp = parseInt(id.split('_')[0]);

        migrations.push({
          id,
          name,
          timestamp,
          up: '', // Will be loaded when needed
          down: '', // Will be loaded when needed
          path: fullPath,
        } as any);
      }
    }

    return migrations.sort((a, b) => a.timestamp - b.timestamp);
  }

  private async getMigration(id: string): Promise<Migration> {
    const migrations = await this.getMigrations();
    const migration = migrations.find(m => m.id === id);

    if (!migration) {
      throw new Error(`Migration not found: ${id}`);
    }

    return migration;
  }

  private async getExecutedMigrations(): Promise<string[]> {
    try {
      const db = await this.getDatabaseConnection();
      const result = await sql
        .SELECT('id')
        .FROM('_nexus_migrations')
        .ORDER_BY('executed_at ASC')
        .execute(db);

      return result.map(row => (row as any).id);
    } catch (error) {
      // Migrations table doesn't exist
      return [];
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    const db = await this.getDatabaseConnection();

    await sql\`
      CREATE TABLE IF NOT EXISTS _nexus_migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    \`.execute(db);
  }

  private async markMigrationExecuted(id: string): Promise<void> {
    const db = await this.getDatabaseConnection();
    const name = id.split('_').slice(1).join('_');

    await sql\`
      INSERT INTO _nexus_migrations (id, name)
      VALUES (\${id}, \${name});
    \`.execute(db);
  }

  private async markMigrationRolledBack(id: string): Promise<void> {
    const db = await this.getDatabaseConnection();

    await sql\`
      DELETE FROM _nexus_migrations WHERE id = \${id};
    \`.execute(db);
  }

  private async getSeeds(): Promise<SeedData[]> {
    const files = await fs.readdir(this.seedsPath);
    const seeds: SeedData[] = [];

    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const name = file.replace(/\.(ts|js)$/, '');
        const fullPath = join(this.seedsPath, file);

        // Try to load seed data
        try {
          const seedModule = await import(join(process.cwd(), fullPath));
          seeds.push({
            name,
            data: seedModule.sampleData || [],
            dependencies: seedModule.dependencies || [],
            path: fullPath,
          } as any);
        } catch (error) {
          console.warn(`Warning: Could not load seed ${name}:`, error);
        }
      }
    }

    return seeds;
  }

  private async getDatabaseConnection(): Promise<any> {
    // This would create a database connection based on config
    // For now, return a mock
    const env = this.getCurrentEnvironment();
    const dbConfig = this.config.environments[env]?.database;

    if (!dbConfig) {
      throw new Error(`No database configuration for environment: ${env}`);
    }

    // Example: Create Kysely instance
    // return new Kysely<Database>({
    //   dialect: new PostgresDialect({
    //     pool: new Pool({
    //       connectionString: dbConfig.connection,
    //     }),
    //   }),
    // });

    // Mock implementation
    return {
      sql: sql,
    };
  }

  private getCurrentEnvironment(): string {
    if (process.env.NODE_ENV === 'production') return 'production';
    if (process.env.NODE_ENV === 'staging') return 'staging';
    return 'development';
  }
}

/**
 * Migration CLI command
 */
export async function migrationCommand(action: string, name?: string, options: any = {}) {
  const config = await loadConfig();
  const migrator = new DatabaseMigrator(config);

  switch (action) {
    case 'create':
      if (!name) {
        console.error('Migration name is required');
        process.exit(1);
      }
      await migrator.createMigration(name);
      break;

    case 'up':
      await migrator.migrate(options.target);
      break;

    case 'down':
      await migrator.rollback(options.steps);
      break;

    case 'reset':
      await migrator.reset();
      break;

    case 'seed':
      await migrator.seed(options.seeds);
      break;

    case 'seed:create':
      if (!name) {
        console.error('Seed name is required');
        process.exit(1);
      }
      await migrator.createSeed(name);
      break;

    case 'status':
      await migrator.status();
      break;

    default:
      console.error(`Unknown migration action: ${action}`);
      process.exit(1);
  }
}

async function loadConfig(): Promise<NexusConfig> {
  try {
    const configPath = join(process.cwd(), '.nexus', 'nexus.config.ts');
    const configModule = await import(configPath);
    return configModule.default;
  } catch (error) {
    throw new Error('Could not load nexus.config.ts');
  }
}
