# Backup & Disaster Recovery System

Comprehensive backup and disaster recovery solution for Live It Iconic platform, ensuring data protection and rapid recovery in case of system failures.

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Configuration](#configuration)
- [Usage](#usage)
- [Monitoring](#monitoring)
- [Disaster Recovery](#disaster-recovery)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Create a Backup

```bash
npm run backup:create
```

### List All Backups

```bash
npm run backup:list
```

### Restore from Backup

```bash
npm run backup:restore /path/to/backup
```

### View Backup Stats

```bash
npm run backup:stats
```

---

## Features

### Automated Backups
- **Schedule:** Daily at 2:00 AM UTC
- **Frequency:** Once per day
- **Retention:** 30 days local, 90 days S3
- **Backup Size:** ~100-200MB depending on data

### Comprehensive Data Protection
- **Database Tables:** Products, Orders, Users, Inventory, Customers, Reviews, Wishlists
- **Metadata:** Backup timestamp, table lists, record counts
- **Verification:** Automatic integrity checking
- **Encryption:** AES-256 for all backups

### Cloud Integration
- **Primary:** AWS S3 for long-term storage
- **Backup Verification:** Automatic weekly restores to staging
- **Failover:** Rapid restore from S3 if local backups unavailable

### Monitoring & Alerting
- **Dashboard:** Admin UI at `/admin/backups`
- **Notifications:** Email and webhook support
- **Logging:** Detailed audit logs per backup
- **Metrics:** Backup size, duration, success rate

---

## Configuration

### Environment Variables

```bash
# Backup storage location
BACKUP_DIR=/backups

# AWS S3 Configuration
S3_BACKUP_BUCKET=live-it-iconic-backups
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
ENABLE_S3_UPLOAD=true

# Supabase Configuration (required for database access)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Notifications
ENABLE_NOTIFICATIONS=true
BACKUP_NOTIFICATION_EMAIL=ops@liveitic.com
BACKUP_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# Backup Schedule (cron format)
BACKUP_SCHEDULE="0 2 * * *"  # 2 AM UTC daily
```

### Create .env File

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Directory Structure

```
/backups/                          # Backup storage directory
├── 2024-01-15T02-00-00-000Z/     # Backup directories (timestamp)
│   ├── metadata.json             # Backup metadata
│   ├── products.json             # Table backup files
│   ├── orders.json
│   ├── users.json
│   └── ...
└── logs/                         # Backup logs
    ├── 2024-01-15.log
    └── 2024-01-14.log
```

---

## Usage

### Manual Backup Operations

#### Create Immediate Backup

```bash
npm run backup:create
```

Output:
```
Created backup directory: /backups/2024-01-15T10-30-45-123Z
✓ Backed up 5234 records from products
✓ Backed up 12543 records from orders
✓ Backed up 3421 records from users
✓ Backup completed successfully
  Location: /backups/2024-01-15T10-30-45-123Z
  Total records: 50000
```

#### List Available Backups

```bash
npm run backup:list
```

Output:
```
Available Backups:
1. 2024-01-15T02-00-00-000Z (124.5MB) - 50,234 records
2. 2024-01-14T02-00-00-000Z (123.2MB) - 49,987 records
3. 2024-01-13T02-00-00-000Z (122.8MB) - 49,654 records
```

#### Validate Backup Integrity

```bash
npm run backup:validate /backups/2024-01-15T02-00-00-000Z
```

Output:
```
✓ Backup validation passed
✓ metadata.json: Valid
✓ products.json: 5234 records (matches metadata)
✓ orders.json: 12543 records (matches metadata)
All tables accounted for
```

#### Restore from Backup

```bash
npm run backup:restore /backups/2024-01-15T02-00-00-000Z
```

Output:
```
Restoring backup from 2024-01-15T02-00-00-000Z
Restoring table: products
  Clearing existing data...
  Inserting 5234 records...
  Progress: 5234/5234
  ✓ Restored 5234 records to products
Restoring table: orders
  Clearing existing data...
  Inserting 12543 records...
  Progress: 12543/12543
  ✓ Restored 12543 records to orders
✓ Restore completed
  Total records restored: 50234
```

#### Download from S3

```bash
npm run backup:download-s3 2024-01-15T02-00-00-000Z
```

### API Endpoints

#### List Backups

```bash
curl -X GET https://live-it-iconic.com/api/admin/backups \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "id": "2024-01-15T02-00-00-000Z",
        "timestamp": "2024-01-15T02:00:00Z",
        "tables": ["products", "orders", "users", ...],
        "recordCounts": {
          "products": 5234,
          "orders": 12543,
          ...
        },
        "totalRecords": 50234,
        "size": 124502400,
        "status": "success"
      }
    ]
  }
}
```

#### Create Backup

```bash
curl -X POST https://live-it-iconic.com/api/admin/backups \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Restore Backup

```bash
curl -X POST https://live-it-iconic.com/api/admin/backups/2024-01-15T02-00-00-000Z/restore \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"confirm": true}'
```

---

## Monitoring

### Admin Dashboard

Navigate to `https://live-it-iconic.com/admin/backups` to access the backup management dashboard.

**Features:**
- View all backups with timestamps and sizes
- Create new backups on-demand
- Restore from previous backups
- Delete old backups
- View backup statistics
- Track recent backup activity

### Monitoring Metrics

```bash
npm run backup:stats
```

Output:
```json
{
  "state": {
    "lastBackupTime": "2024-01-15T02:00:00Z",
    "lastBackupStatus": "success",
    "backupCount": 30,
    "errorCount": 0
  },
  "recentBackups": [
    {
      "name": "2024-01-15T02-00-00-000Z",
      "timestamp": "2024-01-15T02:00:00Z",
      "size": 124502400
    }
  ],
  "diskUsage": {
    "total": 1099511627776,
    "used": 5368709120,
    "available": 1094142918656
  }
}
```

### Alerts

The system automatically triggers alerts for:

**Critical (Page on-call):**
- Backup failed for > 24 hours
- S3 upload failed
- Database corruption detected

**Warning (Slack notification):**
- Backup took > 1 hour to complete
- Backup size increased > 25% from average
- Local disk space < 20% remaining

### Logs

Backup logs are stored in `/backups/logs/`:

```bash
tail -f /backups/logs/2024-01-15.log
```

---

## Disaster Recovery

### Recovery Time Objectives (RTO)

| Scenario | RTO | Steps |
|---|---|---|
| Database Corruption | 1 hour | Download backup → Validate → Restore |
| Service Failure | 4 hours | Provision → Deploy → Restore → Test |
| Complete Failure | 24 hours | Full infrastructure rebuild |

### Recovery Point Objectives (RPO)

- **Database:** 24 hours (daily automated backups)
- **Application Code:** 0 hours (Git version control)
- **Configuration:** 0 hours (Version controlled)

### Recovery Procedures

See `/docs/DISASTER_RECOVERY.md` for detailed recovery procedures:

1. **Database Corruption Recovery** - Step-by-step restore from backup
2. **Complete System Failure** - Infrastructure rebuild and data restoration
3. **Partial Service Failure** - Service-specific recovery

### Testing Backups

**Monthly Drill (First Friday):**

```bash
# Provision test environment
terraform apply -var="environment=test"

# Download latest backup
npm run backup:download-s3 latest

# Restore to test database
npm run backup:restore /tmp/latest-backup

# Run test suite
npm run test

# Verify data integrity
npm run db:verify-counts
```

---

## Troubleshooting

### Backup Failed

**Check logs:**
```bash
tail -f /backups/logs/$(date +%Y-%m-%d).log
```

**Common causes:**
- Supabase connection error → Check SUPABASE_URL and SUPABASE_SERVICE_KEY
- Disk space full → Check disk usage: `df -h /backups`
- S3 upload failed → Check AWS credentials and bucket permissions
- Database locked → Wait for locks to release or check for long-running queries

**Solution:**
```bash
# Retry backup
npm run backup:create

# If persistent, check database health
supabase status
```

### Restore Failed

**Validate backup first:**
```bash
npm run backup:validate /path/to/backup
```

**Common issues:**
- Invalid backup format → Check metadata.json structure
- Corrupted backup files → Re-download from S3
- Database constraints → Check for foreign key violations

**Recovery:**
```bash
# Download fresh copy from S3
npm run backup:download-s3 backup-id

# Validate and retry
npm run backup:validate /path/to/backup
npm run backup:restore /path/to/backup
```

### S3 Upload Issues

**Check AWS credentials:**
```bash
aws s3 ls s3://live-it-iconic-backups
```

**If access denied:**
```bash
# Verify IAM policy
aws iam get-user-policy --user-name backup-user --policy-name backup-policy

# Recreate policy if needed
aws iam put-user-policy --user-name backup-user \
  --policy-name backup-policy \
  --policy-document file://backup-policy.json
```

### High Backup Duration

**Symptoms:** Backup takes > 1 hour

**Causes:**
- Large database size
- Slow network connection
- Concurrent queries blocking access
- S3 upload throttling

**Solutions:**
```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('live_it_iconic'));

# Optimize indexes
REINDEX DATABASE live_it_iconic;

# Increase backup parallelization (if supported)
BACKUP_PARALLEL_JOBS=4 npm run backup:create
```

### Disk Space Issues

**Check backup directory size:**
```bash
du -sh /backups
du -sh /backups/*

# Find largest backups
ls -lhS /backups/ | head -10
```

**Cleanup old backups:**
```bash
# The cleanup runs automatically after backups
# To manually cleanup:
npm run backup:cleanup --retention-days=20

# Or delete specific backup
rm -rf /backups/2024-01-01T02-00-00-000Z
```

---

## Performance Optimization

### Backup Performance Tips

1. **Schedule during off-peak hours**
   - Currently 2:00 AM UTC
   - Avoids impact on user-facing services

2. **Monitor backup duration**
   - Typical: 15-30 minutes
   - If > 1 hour: Investigate database size or load

3. **Archive old backups**
   - Local: 30 days
   - S3: 90 days
   - Move to Glacier for longer storage

4. **Optimize backup size**
   - Exclude temporary tables
   - Compress before S3 upload
   - Use differential backups for large databases

### Restore Performance

1. **Parallel restores**
   - Restore multiple tables concurrently
   - Default: Sequential (change if needed)

2. **Index optimization**
   - Disable indexes during bulk insert
   - Rebuild after restore completes
   - Time savings: 30-50%

3. **Skip integrity checks**
   - Only in non-production
   - Full validation in production
   - Trade-off: Speed vs. safety

---

## Support & Documentation

**Additional Resources:**
- Disaster Recovery Plan: `/docs/DISASTER_RECOVERY.md`
- API Documentation: `/src/api/admin/backups.ts`
- UI Component: `/src/pages/admin/Backups.tsx`
- Scripts: `/scripts/backup/`

**Getting Help:**
1. Check logs: `/backups/logs/`
2. Review Troubleshooting section above
3. Contact DBA team
4. Check AWS status: https://status.aws.amazon.com/

---

**Last Updated:** 2024-01-15
**Version:** 1.0.0
