# Configuration Unification Prompt

## Objective
Unify scattered configuration files across multiple formats and locations into a single, centralized configuration system.

## Current State
- Multiple configuration formats (YAML, JSON, env, .config)
- Configurations scattered across projects
- Inconsistent configuration naming
- No centralized configuration management
- Configuration duplication
- Difficult to manage environment-specific configs
- Unclear configuration inheritance

## Target State
- Single unified configuration system
- Centralized configuration management
- Consistent configuration format
- Clear configuration inheritance
- Environment-specific configuration overrides
- Easy configuration discovery
- Automated configuration validation

## Consolidation Strategy

### Phase 1: Configuration Inventory & Analysis
```
1. Catalog all configurations
   - Configuration file location
   - Configuration format
   - Configuration purpose
   - Configuration scope
   - Configuration dependencies

2. Identify configuration categories
   - Build configurations
   - Deployment configurations
   - Environment configurations
   - Application configurations
   - Tool configurations
   - Secret configurations

3. Analyze configuration relationships
   - Configuration dependencies
   - Configuration inheritance
   - Configuration overrides
   - Configuration conflicts

4. Assess configuration coverage
   - Covered areas
   - Gaps
   - Overlaps
   - Redundancies
```

### Phase 2: Unified Configuration System
```
Create system with:

1. Configuration Format
   - Standardize on YAML
   - Clear structure
   - Type definitions
   - Validation schemas

2. Configuration Hierarchy
   - Global configurations
   - Organization configurations
   - Project configurations
   - Environment configurations
   - Local configurations

3. Configuration Inheritance
   - Base configurations
   - Override mechanisms
   - Merge strategies
   - Conflict resolution

4. Configuration Management
   - Configuration versioning
   - Configuration updates
   - Configuration validation
   - Configuration documentation
```

### Phase 3: Unified Configuration Structure
```
Create structure:

config/
├── README.md
├── SCHEMA.md
├── defaults.yaml
├── global/
│   ├── build.yaml
│   ├── deployment.yaml
│   ├── security.yaml
│   └── monitoring.yaml
├── organizations/
│   ├── alawein-technologies-llc/
│   │   ├── build.yaml
│   │   ├── deployment.yaml
│   │   └── security.yaml
│   ├── live-it-iconic-llc/
│   │   ├── build.yaml
│   │   └── deployment.yaml
│   └── repz-llc/
│       ├── build.yaml
│       └── deployment.yaml
├── projects/
│   ├── librex/
│   │   ├── build.yaml
│   │   └── test.yaml
│   ├── helios/
│   │   ├── build.yaml
│   │   └── test.yaml
│   └── [other projects]/
├── environments/
│   ├── development.yaml
│   ├── staging.yaml
│   ├── production.yaml
│   └── local.yaml
├── secrets/
│   ├── .gitignore
│   ├── secrets.example.yaml
│   └── secrets.vault
├── schemas/
│   ├── build-schema.json
│   ├── deployment-schema.json
│   └── application-schema.json
└── tools/
    ├── config-validator.js
    ├── config-merger.js
    └── config-generator.js
```

### Phase 4: Configuration Inheritance System
```
Implement inheritance:

1. Configuration Loading Order
   - Load global defaults
   - Load organization config
   - Load project config
   - Load environment config
   - Load local overrides

2. Merge Strategy
   - Deep merge for objects
   - Array concatenation or replacement
   - Conflict resolution rules
   - Validation after merge

3. Override Mechanism
   - Environment variables
   - Command-line arguments
   - Local configuration files
   - Runtime configuration

4. Validation
   - Schema validation
   - Type checking
   - Required field validation
   - Cross-field validation
```

## Unified Configuration Format

### Configuration Template
```yaml
# config/projects/[project]/config.yaml

version: "1.0"
project: [project-name]
description: [Project description]

# Build configuration
build:
  type: [node|python|go|rust]
  version: [version]
  commands:
    install: [install command]
    build: [build command]
    test: [test command]
    lint: [lint command]
  artifacts:
    - path: [artifact path]
      name: [artifact name]
  cache:
    enabled: true
    paths:
      - node_modules
      - .cache

# Deployment configuration
deployment:
  environments:
    development:
      url: [dev url]
      region: [region]
      replicas: 1
    staging:
      url: [staging url]
      region: [region]
      replicas: 2
    production:
      url: [prod url]
      region: [region]
      replicas: 3
  strategy: [rolling|blue-green|canary]
  healthcheck:
    path: /health
    interval: 30s
    timeout: 5s

# Testing configuration
testing:
  frameworks:
    - [framework1]
    - [framework2]
  coverage:
    minimum: 80
    report: true
  parallel: 4

# Security configuration
security:
  scanning:
    enabled: true
    tools:
      - [tool1]
      - [tool2]
  dependencies:
    check: true
    update: weekly
  secrets:
    vault: true
    rotation: monthly

# Monitoring configuration
monitoring:
  enabled: true
  metrics:
    - [metric1]
    - [metric2]
  alerts:
    - [alert1]
    - [alert2]
  logging:
    level: info
    format: json
```

## Configuration Schema

### Build Configuration Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["node", "python", "go", "rust"]
    },
    "version": {
      "type": "string"
    },
    "commands": {
      "type": "object",
      "properties": {
        "install": { "type": "string" },
        "build": { "type": "string" },
        "test": { "type": "string" },
        "lint": { "type": "string" }
      },
      "required": ["install", "build"]
    },
    "artifacts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "path": { "type": "string" },
          "name": { "type": "string" }
        },
        "required": ["path"]
      }
    }
  },
  "required": ["type", "version", "commands"]
}
```

## Configuration Management Tools

### Configuration Validator
```javascript
// config/tools/config-validator.js

const Ajv = require('ajv');
const fs = require('fs');
const yaml = require('js-yaml');

class ConfigValidator {
  constructor(schemaPath) {
    this.ajv = new Ajv();
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    this.validate = this.ajv.compile(this.schema);
  }

  validateConfig(configPath) {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    const valid = this.validate(config);
    
    if (!valid) {
      throw new Error(`Config validation failed: ${JSON.stringify(this.validate.errors)}`);
    }
    
    return config;
  }
}

module.exports = ConfigValidator;
```

### Configuration Merger
```javascript
// config/tools/config-merger.js

const deepMerge = require('deep-merge');

class ConfigMerger {
  merge(...configs) {
    return configs.reduce((acc, config) => {
      return deepMerge(acc, config);
    }, {});
  }

  loadConfig(paths) {
    const configs = paths.map(path => {
      const yaml = require('js-yaml');
      const fs = require('fs');
      return yaml.load(fs.readFileSync(path, 'utf8'));
    });
    
    return this.merge(...configs);
  }
}

module.exports = ConfigMerger;
```

## Configuration Loading Example

```javascript
// Load configuration with inheritance

const ConfigMerger = require('./config-merger');
const ConfigValidator = require('./config-validator');

const merger = new ConfigMerger();
const validator = new ConfigValidator('./schemas/config-schema.json');

// Load configurations in order
const config = merger.loadConfig([
  'config/defaults.yaml',
  'config/organizations/alawein-technologies-llc/config.yaml',
  'config/projects/librex/config.yaml',
  `config/environments/${process.env.NODE_ENV}.yaml`,
  'config/local.yaml' // Optional local overrides
]);

// Validate merged configuration
validator.validateConfig(config);

// Apply environment variable overrides
if (process.env.BUILD_TYPE) {
  config.build.type = process.env.BUILD_TYPE;
}

module.exports = config;
```

## Migration Plan

### Step 1: Audit & Categorize
- [ ] Catalog all configurations
- [ ] Categorize by type
- [ ] Identify duplicates
- [ ] Map dependencies

### Step 2: Create Unified System
- [ ] Create directory structure
- [ ] Create configuration templates
- [ ] Create configuration schemas
- [ ] Create configuration tools

### Step 3: Migrate Configurations
- [ ] Migrate build configurations
- [ ] Migrate deployment configurations
- [ ] Migrate environment configurations
- [ ] Migrate application configurations
- [ ] Migrate tool configurations
- [ ] Migrate secret configurations

### Step 4: Implement Tools
- [ ] Implement configuration validator
- [ ] Implement configuration merger
- [ ] Implement configuration generator
- [ ] Implement configuration loader

### Step 5: Validate & Deploy
- [ ] Validate all configurations
- [ ] Test configuration loading
- [ ] Gather feedback
- [ ] Deploy to production

## Success Metrics
- [ ] 80% reduction in configuration files
- [ ] 100% of configurations centralized
- [ ] 100% of configurations validated
- [ ] <1 second configuration loading time
- [ ] Zero configuration errors in production
- [ ] Developer satisfaction >8/10

## Rollback Procedures
1. Keep all original configurations in archive
2. Maintain compatibility layer
3. Monitor for issues
4. Rollback if needed
5. Document lessons learned

## Validation Checkpoints
- [ ] All configurations cataloged
- [ ] System created
- [ ] Schemas defined
- [ ] Tools implemented
- [ ] First batch migrated
- [ ] All configurations migrated
- [ ] Documentation complete