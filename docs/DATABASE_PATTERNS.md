---
title: 'Database Patterns Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Database Patterns Guide

PostgreSQL best practices, indexing strategies, and query optimization.

## Overview

All platforms use PostgreSQL via Supabase. This guide covers database design
patterns and optimization strategies.

## Schema Design

### Naming Conventions

| Type         | Convention              | Example                       |
| ------------ | ----------------------- | ----------------------------- |
| Tables       | snake_case, plural      | `simulations`, `workout_logs` |
| Columns      | snake_case              | `created_at`, `user_id`       |
| Primary Keys | `id`                    | `id UUID`                     |
| Foreign Keys | `{table}_id`            | `user_id`, `simulation_id`    |
| Indexes      | `idx_{table}_{columns}` | `idx_simulations_user_id`     |

### Platform Prefixes

Each platform has dedicated tables with prefixes:

```sql
-- SimCore
simcore_simulations
simcore_results

-- REPZ
repz_workouts
repz_exercises
repz_progress

-- Shared
profiles
projects
```

### Common Columns

All tables should include:

```sql
CREATE TABLE example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- other columns
);

-- Auto-update updated_at
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON example
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Data Types

### Recommended Types

| Use Case    | Type          | Example                   |
| ----------- | ------------- | ------------------------- |
| Primary Key | UUID          | `gen_random_uuid()`       |
| Timestamps  | TIMESTAMPTZ   | `created_at`              |
| JSON data   | JSONB         | `config JSONB`            |
| Enums       | TEXT + CHECK  | `status TEXT CHECK (...)` |
| Money       | NUMERIC(10,2) | `price NUMERIC(10,2)`     |
| Arrays      | ARRAY         | `tags TEXT[]`             |

### JSONB Usage

```sql
-- Store flexible config
CREATE TABLE simulations (
  id UUID PRIMARY KEY,
  config JSONB NOT NULL DEFAULT '{}',
  results JSONB
);

-- Query JSONB
SELECT * FROM simulations
WHERE config->>'type' = 'fluid';

-- Index JSONB
CREATE INDEX idx_simulations_config_type
ON simulations ((config->>'type'));
```

## Indexing

### When to Index

- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Foreign keys

### Index Types

```sql
-- B-tree (default, most common)
CREATE INDEX idx_simulations_user_id
ON simulations (user_id);

-- Composite index
CREATE INDEX idx_simulations_user_status
ON simulations (user_id, status);

-- Partial index
CREATE INDEX idx_simulations_active
ON simulations (user_id)
WHERE status = 'active';

-- GIN for JSONB
CREATE INDEX idx_simulations_config
ON simulations USING GIN (config);

-- GIN for arrays
CREATE INDEX idx_posts_tags
ON posts USING GIN (tags);
```

### Index Analysis

```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
  indexrelname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

## Query Optimization

### EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM simulations
WHERE user_id = 'uuid'
AND status = 'completed';
```

### Common Optimizations

```sql
-- Use specific columns instead of *
SELECT id, name, status FROM simulations;

-- Use LIMIT for pagination
SELECT * FROM simulations
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- Use EXISTS instead of IN for subqueries
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM simulations s
  WHERE s.user_id = u.id
);

-- Use JOIN instead of subquery when possible
SELECT u.*, COUNT(s.id) as simulation_count
FROM users u
LEFT JOIN simulations s ON s.user_id = u.id
GROUP BY u.id;
```

### Avoiding N+1 Queries

```typescript
// Bad: N+1 queries
const users = await supabase.from('users').select('*');
for (const user of users) {
  const sims = await supabase
    .from('simulations')
    .select('*')
    .eq('user_id', user.id);
}

// Good: Single query with join
const { data } = await supabase.from('users').select(`
    *,
    simulations (*)
  `);
```

## Row Level Security

### Enable RLS

```sql
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
```

### Common Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own simulations"
ON simulations FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can create simulations"
ON simulations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own simulations"
ON simulations FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete own simulations"
ON simulations FOR DELETE
USING (auth.uid() = user_id);
```

### Admin Access

```sql
-- Admins can see all data
CREATE POLICY "Admins can view all"
ON simulations FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## Migrations

### Creating Migrations

```bash
# Create new migration
npx supabase migration new add_simulation_metadata

# Edit the migration file
# supabase/migrations/20250101000000_add_simulation_metadata.sql
```

### Migration Best Practices

```sql
-- Always use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS new_table (...);

-- Add columns with defaults for existing rows
ALTER TABLE simulations
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Create indexes concurrently in production
CREATE INDEX CONCURRENTLY idx_simulations_metadata
ON simulations USING GIN (metadata);
```

### Rollback Strategy

```sql
-- Include rollback in comments
-- Rollback: DROP INDEX idx_simulations_metadata;
-- Rollback: ALTER TABLE simulations DROP COLUMN metadata;
```

## Performance Monitoring

### Slow Query Log

```sql
-- Find slow queries
SELECT
  query,
  calls,
  mean_time,
  total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Table Statistics

```sql
-- Table sizes
SELECT
  relname as table,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## Backup and Recovery

### Automated Backups

Supabase provides:

- Daily backups (7 day retention on Pro)
- Point-in-time recovery (Pro)

### Manual Backup

```bash
# Export data
npx supabase db dump -f backup.sql

# Restore
npx supabase db restore backup.sql
```

## Related Documents

- [CACHING.md](./CACHING.md) - Caching strategies
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [SECURITY.md](./SECURITY.md) - Security practices
