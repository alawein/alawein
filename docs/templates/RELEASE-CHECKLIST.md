# Release Checklist

Use this checklist before every production release.

---

## Pre-Release

### Code Quality

- [ ] All quality gates passing (`npm run quality`)
- [ ] No lint errors (`npm run lint`)
- [ ] No type errors (`npm run type-check`)
- [ ] Code reviewed and approved

### Testing

- [ ] Unit tests passing (`npm run test`)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Test coverage >= 80%
- [ ] Manual QA completed

### Security

- [ ] Security scan clean (`npm run security:check`)
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities
- [ ] Secrets rotated if needed
- [ ] Access permissions reviewed

### Documentation

- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Breaking changes documented

---

## Deployment

### Staging

- [ ] Deployed to staging environment
- [ ] Smoke tests passing
- [ ] Performance acceptable
- [ ] No errors in logs

### Production Preparation

- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] On-call notified
- [ ] Deployment window confirmed

### Production Deployment

- [ ] Deploy initiated
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] Metrics normal

---

## Post-Release

### Verification

- [ ] Production health verified
- [ ] Key user flows tested
- [ ] Performance metrics normal
- [ ] Error rates normal

### Communication

- [ ] Release notes published
- [ ] Stakeholders notified
- [ ] Documentation published
- [ ] Support team briefed

### Cleanup

- [ ] Feature flags updated
- [ ] Old code removed (if applicable)
- [ ] Monitoring thresholds adjusted

---

## Rollback Criteria

Initiate rollback if:

- Error rate > 5% above baseline
- P95 latency > 2x baseline
- Critical functionality broken
- Security vulnerability discovered

**Rollback Command**: `npm run rollback:now "reason"`

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Product | | | |

---

*Template Version: 1.0*
*Last Updated: December 2024*
