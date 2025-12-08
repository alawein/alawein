#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitWorkflowOptimizer {
  constructor() {
    this.prompts = this.loadPrompts();
  }

  loadPrompts() {
    const promptsDir = path.join(__dirname, 'prompts');
    const prompts = {};
    
    if (fs.existsSync(promptsDir)) {
      fs.readdirSync(promptsDir).forEach(file => {
        if (file.endsWith('.md')) {
          const name = file.replace('.md', '');
          prompts[name] = fs.readFileSync(path.join(promptsDir, file), 'utf8');
        }
      });
    }
    
    return prompts;
  }

  optimize(type = 'commit') {
    switch (type) {
      case 'commit':
        return this.optimizeCommit();
      case 'branch':
        return this.optimizeBranch();
      case 'merge':
        return this.optimizeMerge();
      default:
        return this.showHelp();
    }
  }

  optimizeCommit() {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const diff = execSync('git diff --cached', { encoding: 'utf8' });
    
    console.log('🔍 Analyzing commit...');
    console.log('📝 Staged changes:', status.split('\n').filter(Boolean).length);
    
    if (this.prompts['commit-optimizer']) {
      console.log('\n💡 Commit optimization suggestions:');
      console.log(this.prompts['commit-optimizer']);
    }
    
    return { status, diff };
  }

  optimizeBranch() {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    console.log(`🌿 Current branch: ${branch}`);
    
    if (this.prompts['branch-optimizer']) {
      console.log('\n💡 Branch optimization suggestions:');
      console.log(this.prompts['branch-optimizer']);
    }
  }

  optimizeMerge() {
    console.log('🔀 Merge optimization');
    
    if (this.prompts['merge-optimizer']) {
      console.log('\n💡 Merge optimization suggestions:');
      console.log(this.prompts['merge-optimizer']);
    }
  }

  showHelp() {
    console.log(`
Git Workflow Optimizer

Usage:
  git-workflow-optimizer [type]

Types:
  commit  - Optimize commit workflow
  branch  - Optimize branch workflow  
  merge   - Optimize merge workflow
`);
  }
}

if (require.main === module) {
  const optimizer = new GitWorkflowOptimizer();
  const type = process.argv[2];
  optimizer.optimize(type);
}

module.exports = GitWorkflowOptimizer;