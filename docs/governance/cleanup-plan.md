---
title: 'GitHub Repository Cleanup Plan'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# GitHub Repository Cleanup Plan

## Current State Analysis

- Total size: ~8.5GB (organizations: 3.6GB, apps: 3.3GB, node_modules: 1.1GB)
- 478+ symlinks detected, many broken (mainly in archive folder)
- Multiple duplicate/unused directories

## Cleanup Actions

### 1. Remove Broken Symlinks

```powershell
# Find and remove broken symlinks
Get-ChildItem -Recurse -Attributes ReparsePoint | Where-Object { -not (Test-Path $_.Target) } | Remove-Item -Force
```

### 2. Remove Unused Directories

- `.personal` (0MB) - Empty/unused
- `.allstar` (0.01MB) - Legacy
- `family-platforms` (0.07MB) - Unused
- `archive/historical` - Contains broken symlinks, old data

### 3. Consolidate Duplicate Structures

- Merge `automation` and `automation-ts` into single tool
- Remove duplicate `node_modules` at root (use workspace-level)
- Archive old experiments in `research`

### 4. Optimize Git History

- Remove large binaries from history
- Git LFS for large files
- Clean up .gitignore patterns

### 5. Restructure for Monorepo

```
GitHub/
├── apps/           # Active applications
├── packages/       # Shared packages
├── tools/          # Automation and utilities
├── docs/           # Documentation
└── archive/        # Cleaned archive
```

## Execution Steps

1. Backup current state
2. Remove broken symlinks
3. Delete unused directories
4. Consolidate duplicate tools
5. Update .gitignore
6. Commit cleanup
