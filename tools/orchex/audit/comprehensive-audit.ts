/**
 * Comprehensive LLC & Project Audit System
 * Parallel orchestration for governance, structure, quality, and dependency audits
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface AuditResult {
  phase: string;
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: any;
  timestamp: Date;
}

interface ProjectInfo {
  name: string;
  path: string;
  type: 'llc' | 'research' | 'personal' | 'infrastructure';
  hasPackageJson: boolean;
  hasTsConfig: boolean;
}

export class ComprehensiveAuditSystem {
  private results: AuditResult[] = [];
  private rootPath: string;
  private projects: ProjectInfo[] = [];

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }

  /**
   * Execute full audit pipeline
   */
  async executeFullAudit(): Promise<void> {
    console.log('🚀 Starting Comprehensive LLC & Project Audit\n');
    console.log('=' .repeat(80));

    // Phase 1: Quick Scan (Parallel)
    await this.phase1QuickScan();

    // Phase 2: Deep Analysis (Parallel)
    await this.phase2DeepAnalysis();

    // Phase 3: Cross-Project Analysis (Sequential)
    await this.phase3CrossProject();

    // Generate Report
    this.generateReport();
  }

  /**
   * Phase 1: Quick Scan (5 minutes)
   * - File structure scan
   * - Dependency check
   * - Lint check
   * - Type check
   */
  private async phase1QuickScan(): Promise<void> {
    console.log('\n📋 PHASE 1: Quick Scan (Parallel Execution)');
    console.log('-'.repeat(80));

    const tasks = [
      this.scanFileStructure(),
      this.checkDependencies(),
      this.runLintCheck(),
      this.runTypeCheck()
    ];

    await Promise.allSettled(tasks);
  }

  /**
   * Scan file structure and identify projects
   */
  private async scanFileStructure(): Promise<void> {
    console.log('  🔍 Scanning file structure...');
    
    try {
      // Identify LLCs
      const llcDirs = ['repz-llc', 'live-it-iconic-llc', 'alawein-technologies-llc'];
      
      for (const llc of llcDirs) {
        const llcPath = path.join(this.rootPath, 'organizations', llc);
        if (fs.existsSync(llcPath)) {
          this.projects.push({
            name: llc,
            path: llcPath,
            type: 'llc',
            hasPackageJson: fs.existsSync(path.join(llcPath, 'package.json')),
            hasTsConfig: fs.existsSync(path.join(llcPath, 'tsconfig.json'))
          });
        }
      }

      // Identify research projects
      const researchPath = path.join(this.rootPath, 'research');
      if (fs.existsSync(researchPath)) {
        const researchDirs = fs.readdirSync(researchPath, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name);

        for (const dir of researchDirs) {
          const projectPath = path.join(researchPath, dir);
          this.projects.push({
            name: `research/${dir}`,
            path: projectPath,
            type: 'research',
            hasPackageJson: fs.existsSync(path.join(projectPath, 'package.json')),
            hasTsConfig: fs.existsSync(path.join(projectPath, 'tsconfig.json'))
          });
        }
      }

      // Identify personal projects
      const personalPath = path.join(this.rootPath, '.personal');
      if (fs.existsSync(personalPath)) {
        const personalDirs = fs.readdirSync(personalPath, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name);

        for (const dir of personalDirs) {
          const projectPath = path.join(personalPath, dir);
          this.projects.push({
            name: `.personal/${dir}`,
            path: projectPath,
            type: 'personal',
            hasPackageJson: fs.existsSync(path.join(projectPath, 'package.json')),
            hasTsConfig: fs.existsSync(path.join(projectPath, 'tsconfig.json'))
          });
        }
      }

      // Root infrastructure
      this.projects.push({
        name: 'root-infrastructure',
        path: this.rootPath,
        type: 'infrastructure',
        hasPackageJson: fs.existsSync(path.join(this.rootPath, 'package.json')),
        hasTsConfig: fs.existsSync(path.join(this.rootPath, 'tsconfig.json'))
      });

      this.results.push({
        phase: 'Phase 1',
        category: 'File Structure',
        status: 'pass',
        message: `Identified ${this.projects.length} projects`,
        details: {
          llcs: this.projects.filter(p => p.type === 'llc').length,
          research: this.projects.filter(p => p.type === 'research').length,
          personal: this.projects.filter(p => p.type === 'personal').length,
          infrastructure: this.projects.filter(p => p.type === 'infrastructure').length
        },
        timestamp: new Date()
      });

      console.log(`    ✅ Found ${this.projects.length} projects`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 1',
        category: 'File Structure',
        status: 'fail',
        message: `Failed to scan file structure: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Check dependencies across all projects
   */
  private async checkDependencies(): Promise<void> {
    console.log('  📦 Checking dependencies...');

    try {
      const projectsWithPackageJson = this.projects.filter(p => p.hasPackageJson);
      let outdatedCount = 0;
      let vulnerabilityCount = 0;

      for (const project of projectsWithPackageJson) {
        try {
          // Check for outdated packages
          const outdated = execSync('npm outdated --json', {
            cwd: project.path,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'ignore']
          });
          
          if (outdated) {
            const outdatedPackages = JSON.parse(outdated);
            outdatedCount += Object.keys(outdatedPackages).length;
          }
        } catch (error) {
          // npm outdated returns non-zero exit code when packages are outdated
          // This is expected behavior
        }

        try {
          // Check for vulnerabilities
          const audit = execSync('npm audit --json', {
            cwd: project.path,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'ignore']
          });

          if (audit) {
            const auditResult = JSON.parse(audit);
            vulnerabilityCount += auditResult.metadata?.vulnerabilities?.total || 0;
          }
        } catch (error) {
          // npm audit may fail, continue
        }
      }

      const status = vulnerabilityCount > 0 ? 'warning' : 'pass';
      this.results.push({
        phase: 'Phase 1',
        category: 'Dependencies',
        status,
        message: `Checked ${projectsWithPackageJson.length} projects`,
        details: {
          outdatedPackages: outdatedCount,
          vulnerabilities: vulnerabilityCount
        },
        timestamp: new Date()
      });

      console.log(`    ✅ Checked ${projectsWithPackageJson.length} projects`);
      if (outdatedCount > 0) console.log(`    ⚠️  ${outdatedCount} outdated packages`);
      if (vulnerabilityCount > 0) console.log(`    ⚠️  ${vulnerabilityCount} vulnerabilities`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 1',
        category: 'Dependencies',
        status: 'fail',
        message: `Failed to check dependencies: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Run lint checks
   */
  private async runLintCheck(): Promise<void> {
    console.log('  🔧 Running lint checks...');

    try {
      // Check if ESLint is configured
      const hasEslint = fs.existsSync(path.join(this.rootPath, 'eslint.config.js')) ||
                       fs.existsSync(path.join(this.rootPath, '.eslintrc.json'));

      if (!hasEslint) {
        this.results.push({
          phase: 'Phase 1',
          category: 'Linting',
          status: 'warning',
          message: 'ESLint not configured',
          timestamp: new Date()
        });
        console.log('    ⚠️  ESLint not configured');
        return;
      }

      // Run ESLint
      try {
        execSync('npm run lint', {
          cwd: this.rootPath,
          encoding: 'utf-8',
          stdio: 'pipe'
        });

        this.results.push({
          phase: 'Phase 1',
          category: 'Linting',
          status: 'pass',
          message: 'No linting errors',
          timestamp: new Date()
        });
        console.log('    ✅ No linting errors');
      } catch (error) {
        this.results.push({
          phase: 'Phase 1',
          category: 'Linting',
          status: 'warning',
          message: 'Linting errors found',
          details: { error: String(error) },
          timestamp: new Date()
        });
        console.log('    ⚠️  Linting errors found');
      }
    } catch (error) {
      this.results.push({
        phase: 'Phase 1',
        category: 'Linting',
        status: 'fail',
        message: `Failed to run lint check: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Run type checks
   */
  private async runTypeCheck(): Promise<void> {
    console.log('  📝 Running type checks...');

    try {
      const projectsWithTsConfig = this.projects.filter(p => p.hasTsConfig);

      if (projectsWithTsConfig.length === 0) {
        this.results.push({
          phase: 'Phase 1',
          category: 'Type Checking',
          status: 'warning',
          message: 'No TypeScript projects found',
          timestamp: new Date()
        });
        console.log('    ⚠️  No TypeScript projects found');
        return;
      }

      // Run TypeScript compiler
      try {
        execSync('npx tsc --noEmit', {
          cwd: this.rootPath,
          encoding: 'utf-8',
          stdio: 'pipe'
        });

        this.results.push({
          phase: 'Phase 1',
          category: 'Type Checking',
          status: 'pass',
          message: `No type errors in ${projectsWithTsConfig.length} projects`,
          timestamp: new Date()
        });
        console.log(`    ✅ No type errors in ${projectsWithTsConfig.length} projects`);
      } catch (error) {
        this.results.push({
          phase: 'Phase 1',
          category: 'Type Checking',
          status: 'warning',
          message: 'Type errors found',
          details: { error: String(error) },
          timestamp: new Date()
        });
        console.log('    ⚠️  Type errors found');
      }
    } catch (error) {
      this.results.push({
        phase: 'Phase 1',
        category: 'Type Checking',
        status: 'fail',
        message: `Failed to run type check: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Phase 2: Deep Analysis (15 minutes)
   * - Governance audit
   * - Security scan
   * - Test coverage
   * - Documentation review
   */
  private async phase2DeepAnalysis(): Promise<void> {
    console.log('\n📊 PHASE 2: Deep Analysis (Parallel Execution)');
    console.log('-'.repeat(80));

    const tasks = [
      this.auditGovernance(),
      this.scanSecurity(),
      this.checkTestCoverage(),
      this.reviewDocumentation()
    ];

    await Promise.allSettled(tasks);
  }

  /**
   * Audit governance compliance
   */
  private async auditGovernance(): Promise<void> {
    console.log('  ⚖️  Auditing governance compliance...');

    try {
      const checks = {
        rootStructureContract: fs.existsSync(path.join(this.rootPath, 'docs/ROOT_STRUCTURE_CONTRACT.md')),
        metaHubPolicies: fs.existsSync(path.join(this.rootPath, '.metaHub/policies')),
        securityPolicy: fs.existsSync(path.join(this.rootPath, 'SECURITY.md')),
        licenseFile: fs.existsSync(path.join(this.rootPath, 'LICENSES.md')),
        codeowners: fs.existsSync(path.join(this.rootPath, '.github/CODEOWNERS'))
      };

      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      const status = passedChecks === totalChecks ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 2',
        category: 'Governance',
        status,
        message: `${passedChecks}/${totalChecks} governance checks passed`,
        details: checks,
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} ${passedChecks}/${totalChecks} checks passed`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 2',
        category: 'Governance',
        status: 'fail',
        message: `Failed to audit governance: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Scan for security issues
   */
  private async scanSecurity(): Promise<void> {
    console.log('  🔒 Scanning security...');

    try {
      const checks = {
        secretsBaseline: fs.existsSync(path.join(this.rootPath, '.secrets.baseline')),
        gitignore: fs.existsSync(path.join(this.rootPath, '.gitignore')),
        envExample: fs.existsSync(path.join(this.rootPath, '.env.example'))
      };

      // Check for exposed secrets in .env files
      const envFiles = this.findFiles(this.rootPath, /\.env$/);
      const exposedEnvFiles = envFiles.filter(f => !f.includes('.env.example'));

      const status = exposedEnvFiles.length === 0 ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 2',
        category: 'Security',
        status,
        message: exposedEnvFiles.length === 0 ? 'No security issues found' : `${exposedEnvFiles.length} .env files found`,
        details: {
          ...checks,
          exposedEnvFiles: exposedEnvFiles.length
        },
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} Security scan complete`);
      if (exposedEnvFiles.length > 0) {
        console.log(`    ⚠️  ${exposedEnvFiles.length} .env files should be in .gitignore`);
      }
    } catch (error) {
      this.results.push({
        phase: 'Phase 2',
        category: 'Security',
        status: 'fail',
        message: `Failed to scan security: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Check test coverage
   */
  private async checkTestCoverage(): Promise<void> {
    console.log('  🧪 Checking test coverage...');

    try {
      const testFiles = this.findFiles(this.rootPath, /\.(test|spec)\.(ts|tsx|js|jsx)$/);
      const sourceFiles = this.findFiles(this.rootPath, /\.(ts|tsx|js|jsx)$/, ['node_modules', 'dist', 'build', '.next']);

      const coverage = testFiles.length > 0 ? (testFiles.length / sourceFiles.length) * 100 : 0;
      const status = coverage > 50 ? 'pass' : coverage > 20 ? 'warning' : 'fail';

      this.results.push({
        phase: 'Phase 2',
        category: 'Test Coverage',
        status,
        message: `${testFiles.length} test files found`,
        details: {
          testFiles: testFiles.length,
          sourceFiles: sourceFiles.length,
          estimatedCoverage: `${coverage.toFixed(1)}%`
        },
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : status === 'warning' ? '⚠️ ' : '❌'} ${testFiles.length} test files (est. ${coverage.toFixed(1)}% coverage)`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 2',
        category: 'Test Coverage',
        status: 'fail',
        message: `Failed to check test coverage: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Review documentation
   */
  private async reviewDocumentation(): Promise<void> {
    console.log('  📚 Reviewing documentation...');

    try {
      const checks = {
        rootReadme: fs.existsSync(path.join(this.rootPath, 'README.md')),
        docsDirectory: fs.existsSync(path.join(this.rootPath, 'docs')),
        architectureDocs: fs.existsSync(path.join(this.rootPath, 'docs/ARCHITECTURE.md')),
        apiDocs: fs.existsSync(path.join(this.rootPath, 'docs/APIS.md'))
      };

      // Count README files in projects
      const readmeFiles = this.findFiles(this.rootPath, /README\.md$/);
      const projectsWithReadme = this.projects.filter(p => 
        fs.existsSync(path.join(p.path, 'README.md'))
      ).length;

      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      const status = passedChecks >= 3 ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 2',
        category: 'Documentation',
        status,
        message: `${passedChecks}/${totalChecks} documentation checks passed`,
        details: {
          ...checks,
          totalReadmeFiles: readmeFiles.length,
          projectsWithReadme: `${projectsWithReadme}/${this.projects.length}`
        },
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} ${passedChecks}/${totalChecks} checks passed`);
      console.log(`    📄 ${projectsWithReadme}/${this.projects.length} projects have README files`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 2',
        category: 'Documentation',
        status: 'fail',
        message: `Failed to review documentation: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Phase 3: Cross-Project Analysis (10 minutes)
   * - Dependency deduplication
   * - Shared code extraction
   * - Architecture consistency
   */
  private async phase3CrossProject(): Promise<void> {
    console.log('\n🔗 PHASE 3: Cross-Project Analysis (Sequential)');
    console.log('-'.repeat(80));

    await this.analyzeDependencyDuplication();
    await this.identifySharedCode();
    await this.validateArchitectureConsistency();
  }

  /**
   * Analyze dependency duplication
   */
  private async analyzeDependencyDuplication(): Promise<void> {
    console.log('  🔄 Analyzing dependency duplication...');

    try {
      const dependencyMap = new Map<string, Set<string>>();
      const projectsWithPackageJson = this.projects.filter(p => p.hasPackageJson);

      for (const project of projectsWithPackageJson) {
        const packageJsonPath = path.join(project.path, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };

        for (const [dep, version] of Object.entries(allDeps)) {
          if (!dependencyMap.has(dep)) {
            dependencyMap.set(dep, new Set());
          }
          dependencyMap.get(dep)!.add(version as string);
        }
      }

      const duplicates = Array.from(dependencyMap.entries())
        .filter(([_, versions]) => versions.size > 1)
        .map(([dep, versions]) => ({ dep, versions: Array.from(versions) }));

      const status = duplicates.length === 0 ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 3',
        category: 'Dependency Deduplication',
        status,
        message: duplicates.length === 0 ? 'No duplicate dependencies' : `${duplicates.length} dependencies with version conflicts`,
        details: {
          totalDependencies: dependencyMap.size,
          duplicates: duplicates.slice(0, 10) // Top 10
        },
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} ${duplicates.length} version conflicts found`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 3',
        category: 'Dependency Deduplication',
        status: 'fail',
        message: `Failed to analyze dependencies: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Identify shared code patterns
   */
  private async identifySharedCode(): Promise<void> {
    console.log('  🔍 Identifying shared code patterns...');

    try {
      const sharedPatterns = {
        utilsPackage: fs.existsSync(path.join(this.rootPath, 'packages/utils')),
        sharedTypes: fs.existsSync(path.join(this.rootPath, 'packages/types')),
        sharedConfig: fs.existsSync(path.join(this.rootPath, 'packages/config')),
        sharedUI: fs.existsSync(path.join(this.rootPath, 'packages/ui'))
      };

      const sharedPackagesCount = Object.values(sharedPatterns).filter(Boolean).length;
      const status = sharedPackagesCount >= 2 ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 3',
        category: 'Shared Code',
        status,
        message: `${sharedPackagesCount} shared packages found`,
        details: sharedPatterns,
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} ${sharedPackagesCount} shared packages`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 3',
        category: 'Shared Code',
        status: 'fail',
        message: `Failed to identify shared code: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Validate architecture consistency
   */
  private async validateArchitectureConsistency(): Promise<void> {
    console.log('  🏗️  Validating architecture consistency...');

    try {
      const checks = {
        monorepoStructure: fs.existsSync(path.join(this.rootPath, 'turbo.json')),
        packagesDirectory: fs.existsSync(path.join(this.rootPath, 'packages')),
        organizationsDirectory: fs.existsSync(path.join(this.rootPath, 'organizations')),
        toolsDirectory: fs.existsSync(path.join(this.rootPath, 'tools'))
      };

      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      const status = passedChecks === totalChecks ? 'pass' : 'warning';

      this.results.push({
        phase: 'Phase 3',
        category: 'Architecture Consistency',
        status,
        message: `${passedChecks}/${totalChecks} architecture checks passed`,
        details: checks,
        timestamp: new Date()
      });

      console.log(`    ${status === 'pass' ? '✅' : '⚠️ '} ${passedChecks}/${totalChecks} checks passed`);
    } catch (error) {
      this.results.push({
        phase: 'Phase 3',
        category: 'Architecture Consistency',
        status: 'fail',
        message: `Failed to validate architecture: ${error}`,
        timestamp: new Date()
      });
      console.log(`    ❌ Failed: ${error}`);
    }
  }

  /**
   * Generate comprehensive audit report
   */
  private generateReport(): void {
    console.log('\n📊 AUDIT REPORT');
    console.log('='.repeat(80));

    // Summary by phase
    const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
    for (const phase of phases) {
      const phaseResults = this.results.filter(r => r.phase === phase);
      const passed = phaseResults.filter(r => r.status === 'pass').length;
      const warnings = phaseResults.filter(r => r.status === 'warning').length;
      const failed = phaseResults.filter(r => r.status === 'fail').length;

      console.log(`\n${phase}:`);
      console.log(`  ✅ Passed: ${passed}`);
      console.log(`  ⚠️  Warnings: ${warnings}`);
      console.log(`  ❌ Failed: ${failed}`);
    }

    // Overall summary
    const totalPassed = this.results.filter(r => r.status === 'pass').length;
    const totalWarnings = this.results.filter(r => r.status === 'warning').length;
    const totalFailed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;

    console.log('\n' + '='.repeat(80));
    console.log('OVERALL SUMMARY:');
    console.log(`  Total Checks: ${total}`);
    console.log(`  ✅ Passed: ${totalPassed} (${((totalPassed/total)*100).toFixed(1)}%)`);
    console.log(`  ⚠️  Warnings: ${totalWarnings} (${((totalWarnings/total)*100).toFixed(1)}%)`);
    console.log(`  ❌ Failed: ${totalFailed} (${((totalFailed/total)*100).toFixed(1)}%)`);

    // Save report to file
    const reportPath = path.join(this.rootPath, 'AUDIT-REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      projects: this.projects,
      results: this.results,
      summary: {
        total,
        passed: totalPassed,
        warnings: totalWarnings,
        failed: totalFailed
      }
    }, null, 2));

    console.log(`\n📄 Full report saved to: ${reportPath}`);
    console.log('='.repeat(80));
  }

  /**
   * Helper: Find files matching pattern
   */
  private findFiles(dir: string, pattern: RegExp, exclude: string[] = ['node_modules', '.git', 'dist', 'build', '.next']): string[] {
    const results: string[] = [];

    const walk = (currentDir: string) => {
      try {
        const files = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const file of files) {
          const filePath = path.join(currentDir, file.name);
          const relativePath = path.relative(dir, filePath);

          // Skip excluded directories
          if (exclude.some(ex => relativePath.includes(ex))) {
            continue;
          }

          if (file.isDirectory()) {
            walk(filePath);
          } else if (pattern.test(file.name)) {
            results.push(filePath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    walk(dir);
    return results;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const audit = new ComprehensiveAuditSystem();
  audit.executeFullAudit().catch(console.error);
}

export default ComprehensiveAuditSystem;
