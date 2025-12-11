# Nexus Framework Naming Convention

> **Proprietary Architecture Names** - Creating a unique identity for the Nexus Framework while maintaining clarity and developer experience.

---

## 🏗️ Core Architecture Components

### Backend Services
```
AWS Amplify         → NexusBackend
AWS CDK            → NexusInfra
```

### Data & Storage
```
DynamoDB           → NexusData
S3                 → NexusStorage
```

### Authentication & Security
```
Cognito            → NexusAuth
IAM                → NexusAccess
```

### Compute & Functions
```
Lambda             → NexusFunctions
Fargate            → NexusContainers
EC2                → NexusCompute
```

### API & Gateway
```
API Gateway        → NexusGateway
AppSync            → NexusGraph
```

### CDN & Edge
```
CloudFront         → NexusEdge
CloudFlare         → NexusDistribution
```

### Monitoring & Observability
```
CloudWatch         → NexusMonitor
X-Ray              → NexusTrace
```

### Database Services
```
RDS                → NexusSQL
DocumentDB         → NexusDocument
ElastiCache        → NexusCache
```

---

## 🌐 Environment Naming

### Standard Environments
```
Development        → NexusDev
Staging           → NexusStage
Production        → NexusProd
Sandbox           → NexusSandbox
```

### Branch Strategy
```
app/dev           → nexus/dev
app/main          → nexus/main
production        → nexus/prod
```

---

## 🔧 Configuration & Templates

### Platform Types
```
SaaS              → NexusSaaS
OSS               → NexusOSS
Blog              → NexusBlog
Store             → NexusStore
Landing           → NexusLanding
```

### Template Structure
```
.nexus/templates/saas/    → .nexus/templates/NexusSaaS/
.nexus/templates/oss/     → .nexus/templates/NexusOSS/
```

---

## 📦 Package & Module Names

### CLI Tool
```
@nexus/cli         → nexus-cli
nexus              → nexus
```

### Shared Components
```
@nexus/ui          → nexus-ui
@nexus/utils       → nexus-utils
@nexus/types       → nexus-types
```

---

## 🚀 Deployment & Infrastructure

### Deployment Commands
```
amplify deploy     → nexus deploy
amplify push       → nexus push
amplify pull       → nexus pull
```

### Infrastructure as Code
```
amplify/backend.ts → nexus/infrastructure.ts
cdk.stack.ts       → nexus.stack.ts
```

---

## 🎯 Implementation Strategy

### Phase 1: Core Framework
1. Update all documentation
2. Rename configuration files
3. Update CLI commands and help text

### Phase 2: Templates
1. Update SaaS template references
2. Update environment configurations
3. Update deployment scripts

### Phase 3: Integrations
1. Update REPZ transformation docs
2. Create provider-agnostic adapters
3. Update GitHub Actions

---

## 📝 File Naming Patterns

### Configuration Files
```
platform.config.ts    → nexus.config.ts
aws-exports.json      → nexus-exports.json
amplify.yml           → nexus.yml
```

### Environment Files
```
.env.example          → nexus.env.example
.env.local            → nexus.env.local
```

### Script Files
```
amplify-push.sh       → nexus-deploy.sh
aws-setup.sh          → nexus-setup.sh
```

---

## 🔀 Migration Guide

### Find and Replace Patterns
```bash
# Global replacements
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.md" | \
  xargs sed -i 's/AWS Amplify/NexusBackend/g'

find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.md" | \
  xargs sed -i 's/amplify/nexus/g'
```

### Import Path Updates
```typescript
// Before
import { Amplify } from 'aws-amplify';
import { defineBackend } from '@aws-amplify/backend';

// After
import { Nexus } from '@nexus/backend';
import { defineInfrastructure } from '@nexus/infra';
```

---

## 🎨 Brand Identity

### Logo & Icons
- Use Nexus branding instead of AWS logos
- Custom icon set for Nexus components
- Consistent color scheme (Nexus Blue #0066CC)

### Terminology
- "Nexus-powered" instead of "AWS-powered"
- "Nexus infrastructure" instead of "AWS infrastructure"
- "Deploy to Nexus" instead of "Deploy to AWS"

---

## ✅ Validation Checklist

- [ ] All AWS references removed from documentation
- [ ] CLI commands use Nexus terminology
- [ ] Configuration files renamed
- [ ] Import paths updated
- [ ] Environment variables renamed
- [ ] GitHub Actions updated
- [ ] README files updated
- [ ] Help text updated
- [ ] Error messages updated
- [ ] Log messages updated

---

## 🚨 Important Notes

1. **Backward Compatibility**: Maintain migration paths for existing projects
2. **Clear Migration**: Provide scripts to help users transition
3. **Documentation**: Update all references consistently
4. **Examples**: Ensure all code examples use new names
5. **Templates**: All templates must use Nexus branding

---

**Next Steps**: Apply these naming conventions across all framework files and documentation.
