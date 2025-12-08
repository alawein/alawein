# Phase 6B: AI & Prompts Consolidation

**Date**: 2024  
**Status**: 🚀 IN PROGRESS  
**Target**: 6 directories → 2 directories (67% reduction)  

---

## 📊 Current Situation Analysis

### Discovery: Duplicate Directory Structure Found! ⚠️

The prompt-related directories exist in TWO locations:

**Root Level** (tools/):
- `tools/prompts/adaptive/` (5 files)
- `tools/prompts/meta/` (3 files + 6 templates)
- `tools/prompts/composer/` (6 files + 1 template)
- `tools/prompts/testing/` (6 files)

**Inside tools/prompts/** (duplicates):
- `tools/prompts/adaptive-prompts/` (6 files - includes prompt_analytics.db)
- `tools/prompts/meta-prompt/` (3 files + 6 templates)
- `tools/prompts/prompt-composer/` (6 files + 1 template)
- `tools/prompts/prompt-testing/` (6 files)

**Issue**: This is causing confusion and potential sync issues!

---

## 🎯 Consolidation Strategy

### Target Structure (2 directories)

```
tools/
├── ai/ (keep as-is - comprehensive AI utilities)
│   ├── Core AI functionality
│   ├── API, cache, CLI, dashboard
│   ├── Integrations, MCP, notifications
│   └── Utils, VSCode integration
│
└── prompts/ (consolidate all prompt tools here)
    ├── adaptive/ (merged from adaptive-prompts/)
    ├── meta/ (merged from meta-prompt/)
    ├── composer/ (merged from prompt-composer/)
    └── testing/ (merged from prompt-testing/)
```

### Consolidation Plan

**Step 1**: Remove duplicate root-level directories
- Delete `tools/prompts/adaptive/` (keep tools/prompts/adaptive-prompts/)
- Delete `tools/prompts/meta/` (keep tools/prompts/meta-prompt/)
- Delete `tools/prompts/composer/` (keep tools/prompts/prompt-composer/)
- Delete `tools/prompts/testing/` (keep tools/prompts/prompt-testing/)

**Step 2**: Rename subdirectories for clarity
- `tools/prompts/adaptive-prompts/` → `tools/prompts/adaptive/`
- `tools/prompts/meta-prompt/` → `tools/prompts/meta/`
- `tools/prompts/prompt-composer/` → `tools/prompts/composer/`
- `tools/prompts/prompt-testing/` → `tools/prompts/testing/`

**Step 3**: Update imports and references
- Search for imports from old paths
- Update to new paths
- Test all functionality

---

## 📋 Implementation Steps

### Step 1: Remove Duplicate Root Directories ✅

Remove the 4 duplicate directories at root level:

```powershell
Remove-Item -Path 'tools/prompts/adaptive' -Recurse -Force
Remove-Item -Path 'tools/prompts/meta' -Recurse -Force
Remove-Item -Path 'tools/prompts/composer' -Recurse -Force
Remove-Item -Path 'tools/prompts/testing' -Recurse -Force
```

**Impact**: 4 directories removed, keeping organized versions in tools/prompts/

---

### Step 2: Rename Subdirectories for Clarity ✅

Rename subdirectories to shorter, clearer names:

```powershell
Move-Item -Path 'tools/prompts/adaptive-prompts' -Destination 'tools/prompts/adaptive'
Move-Item -Path 'tools/prompts/meta-prompt' -Destination 'tools/prompts/meta'
Move-Item -Path 'tools/prompts/prompt-composer' -Destination 'tools/prompts/composer'
Move-Item -Path 'tools/prompts/prompt-testing' -Destination 'tools/prompts/testing'
```

**Impact**: Clearer, shorter directory names

---

### Step 3: Update Imports and References

Search for and update any imports referencing old paths:

**Old Paths**:
- `tools/prompts/adaptive/`
- `tools/prompts/meta/`
- `tools/prompts/composer/`
- `tools/prompts/testing/`

**New Paths**:
- `tools/prompts/adaptive/`
- `tools/prompts/meta/`
- `tools/prompts/composer/`
- `tools/prompts/testing/`

---

## 📊 File Inventory

### tools/prompts/adaptive/ (5 files) - TO REMOVE
- feedback.json
- learner.py
- personalizer.py
- preferences.json
- test_adaptive.py

### tools/prompts/adaptive-prompts/ (6 files) - TO KEEP & RENAME
- feedback.json
- learner.py
- personalizer.py
- preferences.json
- prompt_analytics.db ⭐ (extra file)
- test_adaptive.py

**Decision**: Keep tools/prompts/adaptive-prompts/ (has extra database file)

---

### tools/prompts/meta/ (9 files) - TO REMOVE
- generator.py
- README.md
- test_generator.py
- templates/architecture.md
- templates/debugging.md
- templates/generic.md
- templates/optimization.md
- templates/refactoring.md
- templates/testing.md

### tools/prompts/meta-prompt/ (9 files) - TO KEEP & RENAME
- generator.py
- README.md
- test_generator.py
- templates/architecture.md
- templates/debugging.md
- templates/generic.md
- templates/optimization.md
- templates/refactoring.md
- templates/testing.md

**Decision**: Keep tools/prompts/meta-prompt/ (identical, but organized)

---

### tools/prompts/composer/ (7 files) - TO REMOVE
- cli.py
- components.py
- composer.py
- example-vars.json
- output.md
- test_composer.py
- templates/fullstack-workflow.md

### tools/prompts/prompt-composer/ (7 files) - TO KEEP & RENAME
- cli.py
- components.py
- composer.py
- example-vars.json
- output.md
- test_composer.py
- templates/fullstack-workflow.md

**Decision**: Keep tools/prompts/prompt-composer/ (identical, but organized)

---

### tools/prompts/testing/ (6 files) - TO REMOVE
- baseline.json
- cli.py
- regression.py
- test_framework.py
- tester.py
- validator.py

### tools/prompts/prompt-testing/ (6 files) - TO KEEP & RENAME
- baseline.json
- cli.py
- regression.py
- test_framework.py
- tester.py
- validator.py

**Decision**: Keep tools/prompts/prompt-testing/ (identical, but organized)

---

## 🎯 Expected Results

### Before Consolidation
```
tools/
├── ai/ (1 directory)
├── adaptive-prompts/ (1 directory) ❌ duplicate
├── meta-prompt/ (1 directory) ❌ duplicate
├── prompt-composer/ (1 directory) ❌ duplicate
├── prompt-testing/ (1 directory) ❌ duplicate
└── prompts/ (1 directory)
    ├── adaptive-prompts/ ✅ keep
    ├── meta-prompt/ ✅ keep
    ├── prompt-composer/ ✅ keep
    └── prompt-testing/ ✅ keep

Total: 6 AI/prompt directories
```

### After Consolidation
```
tools/
├── ai/ (1 directory) ✅
└── prompts/ (1 directory) ✅
    ├── adaptive/ (renamed)
    ├── meta/ (renamed)
    ├── composer/ (renamed)
    └── testing/ (renamed)

Total: 2 AI/prompt directories (67% reduction!)
```

---

## ✅ Success Criteria

- [ ] 4 duplicate root directories removed
- [ ] 4 subdirectories renamed for clarity
- [ ] All imports updated
- [ ] All functionality preserved
- [ ] Tests passing
- [ ] Documentation updated
- [ ] 67% reduction achieved (6 → 2 directories)

---

## 📈 Impact Metrics

### Quantitative
- **Directories Reduced**: 6 → 2 (67% reduction)
- **Duplicates Removed**: 4 directories
- **Files Organized**: 27 files in clear structure
- **Clarity Improved**: Shorter, clearer names

### Qualitative
- ✅ **No More Duplicates**: Single source of truth
- ✅ **Better Organization**: All prompts in one place
- ✅ **Clearer Names**: Shorter, more intuitive
- ✅ **Easier Discovery**: One place to look
- ✅ **Reduced Confusion**: No duplicate directories

---

## 🚀 Next Steps

1. ⏭️ Remove 4 duplicate root directories
2. ⏭️ Rename 4 subdirectories
3. ⏭️ Search for import references
4. ⏭️ Update any found imports
5. ⏭️ Test all prompt tools
6. ⏭️ Update documentation
7. ⏭️ Move to Phase 6C (Development Tools)

---

**Status**: 🚀 **READY TO EXECUTE**  
**Target**: 67% reduction (6 → 2 directories)  
**Risk**: Low (removing duplicates, keeping organized versions)  
**Next**: Execute consolidation commands
