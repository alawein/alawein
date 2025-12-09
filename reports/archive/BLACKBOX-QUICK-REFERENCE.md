# Blackbox Consolidation System - Quick Reference Card

## 📍 Location

All prompts: `.config/ai/superprompts/`

---

## 🎯 Master Prompt

**Start Here**: `BLACKBOX-CONSOLIDATION-MASTER.yaml`

- Complete orchestration strategy
- All phases, systems, and metrics
- Read first before beginning

---

## 📋 Phase-by-Phase Prompt Guide

### Phase 1: Discovery (Week 1)

| Day | Prompt                          | Purpose              | Output             |
| --- | ------------------------------- | -------------------- | ------------------ |
| 1-2 | `REPOSITORY-STRUCTURE-AUDIT.md` | Audit repo structure | Structure report   |
| 3   | `DUPLICATION-DETECTION.md`      | Find duplicates      | Duplication report |
| 4   | `DEPENDENCY-MAPPING.md`         | Map dependencies     | Dependency graph   |
| 5   | `GOVERNANCE-INVENTORY.md`       | Catalog policies     | Policy inventory   |
| 5   | `POLICY-CONSOLIDATION.md`       | Analyze policies     | Policy analysis    |

### Phase 2: Analysis (Week 2)

- Review discovery reports
- Prioritize opportunities
- Assess risks
- Finalize consolidation plan

### Phase 3: Design (Weeks 3-4)

| System     | Prompt                            | Key Deliverable         |
| ---------- | --------------------------------- | ----------------------- |
| Workflows  | `WORKFLOW-CONSOLIDATION.md`       | Unified workflow engine |
| Prompts    | `PROMPT-LIBRARY-CONSOLIDATION.md` | Centralized library     |
| Config     | `CONFIG-UNIFICATION.md`           | Unified config system   |
| Governance | `GOVERNANCE-CONSOLIDATION.md`     | Unified framework       |
| CI/CD      | `CICD-PIPELINE-UNIFICATION.md`    | Composable pipelines    |
| Docs       | Referenced in index               | Documentation hub       |
| Testing    | Referenced in index               | Unified framework       |
| Tooling    | Referenced in index               | Integrated platform     |

### Phase 4: Implementation (Weeks 5-8)

| Week | Prompt                            | Focus              |
| ---- | --------------------------------- | ------------------ |
| 5    | `INCREMENTAL-REFACTORING-PLAN.md` | Quick wins         |
| 6    | System prompts                    | Core systems       |
| 7    | System prompts                    | Governance & CI/CD |
| 8    | `MIGRATION-STRATEGY.md`           | Full migration     |

### Phase 5: Validation (Week 9)

| Day   | Prompt                      | Purpose               |
| ----- | --------------------------- | --------------------- |
| 41-42 | `TESTING-STRATEGY.md`       | Comprehensive testing |
| 43    | `VALIDATION-CHECKPOINTS.md` | Verify metrics        |
| 44    | `ROLLBACK-PROCEDURES.md`    | Test rollback         |
| 45    | Final review                | Sign-off              |

---

## 🎯 Success Metrics

| Metric          | Current       | Target | Track  |
| --------------- | ------------- | ------ | ------ |
| Files           | ~5000+        | ~3000  | Weekly |
| Configs         | 50+ locations | 5-10   | Weekly |
| Duplication     | 15-20%        | <5%    | Weekly |
| Build Time      | 30 min        | 15 min | Weekly |
| Onboarding      | 4-6 hrs       | <2 hrs | End    |
| Maintainability | 6/10          | 8/10   | End    |

---

## 📚 Reference Documents

| Document                           | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `README-BLACKBOX-SYSTEM.md`        | System overview               |
| `BLACKBOX-PROMPTS-INDEX.md`        | Complete prompt index         |
| `BLACKBOX-IMPLEMENTATION-GUIDE.md` | Detailed implementation guide |
| `BLACKBOX-QUICK-REFERENCE.md`      | This document                 |

---

## 🚨 Emergency Contacts

### Rollback Trigger Conditions

- Critical functionality broken
- Data loss detected
- Performance degradation >20%
- Security vulnerability
- Stakeholder request

### Rollback Steps

1. Stop work immediately
2. Notify stakeholders
3. Execute `ROLLBACK-PROCEDURES.md`
4. Restore from backup
5. Analyze root cause

---

## ✅ Daily Checklist

### Before Starting Work

- [ ] Review previous day's progress
- [ ] Check current phase objectives
- [ ] Verify backup exists
- [ ] Review relevant prompt

### During Work

- [ ] Follow prompt instructions
- [ ] Document changes
- [ ] Run tests frequently
- [ ] Track metrics

### After Completing Work

- [ ] Run full test suite
- [ ] Update progress tracking
- [ ] Commit changes
- [ ] Update documentation
- [ ] Communicate status

---

## 🎯 Quick Commands

### Create Backup

```bash
mkdir -p .backups/pre-consolidation-$(date +%Y%m%d)
cp -r . .backups/pre-consolidation-$(date +%Y%m%d)/
```

### Create Branch

```bash
git checkout -b blackboxai/consolidation-phase-1
```

### Run Tests

```bash
npm test
npm run test:integration
npm run test:e2e
```

### Check Metrics

```bash
# File count
find . -type f | wc -l

# Duplication check
npx jscpd .

# Build time
time npm run build
```

---

## 📊 Progress Tracking Template

```markdown
## Week [X] Progress

### Completed

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Metrics

- Files: [current] → [target]
- Duplication: [current]% → [target]%
- Build time: [current] min → [target] min

### Blockers

- None / [List blockers]

### Next Week

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

---

## 🔗 Quick Links

### Documentation

- [Master Prompt](.config/ai/superprompts/BLACKBOX-CONSOLIDATION-MASTER.yaml)
- [Implementation Guide](BLACKBOX-IMPLEMENTATION-GUIDE.md)
- [System Overview](.config/ai/superprompts/README-BLACKBOX-SYSTEM.md)

### Reports Directory

- `reports/` - All analysis and validation reports
- `designs/` - All system design documents
- `docs/` - Updated documentation

---

## 💡 Tips for Success

1. **Read the prompt fully** before starting
2. **Follow the order** - phases build on each other
3. **Test frequently** - catch issues early
4. **Document everything** - future you will thank you
5. **Communicate often** - keep stakeholders informed
6. **Take breaks** - this is a marathon, not a sprint
7. **Ask for help** - when stuck, refer to prompts
8. **Celebrate wins** - acknowledge progress

---

## 🎉 Completion Criteria

### Phase Complete When:

- [ ] All prompt objectives met
- [ ] All deliverables created
- [ ] All tests passing
- [ ] Metrics improved
- [ ] Documentation updated
- [ ] Stakeholders notified

### Project Complete When:

- [ ] All 5 phases complete
- [ ] 40%+ file reduction achieved
- [ ] 80%+ config centralization
- [ ] <5% code duplication
- [ ] 50%+ build time reduction
- [ ] All tests passing
- [ ] Production deployed
- [ ] Team trained
- [ ] Celebration! 🎉

---

**Print this card** and keep it handy during implementation!

**Status**: Ready for Implementation  
**Timeline**: 9 weeks (45 days)  
**Success Probability**: High with proper execution

For detailed guidance, see: `BLACKBOX-IMPLEMENTATION-GUIDE.md`
