/**
 * Workflow Analyzer - Analyzes GitHub Actions workflows
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface WorkflowInfo {
  name: string;
  filename: string;
  path: string;
  triggers: string[];
  jobs: JobInfo[];
  isReusable: boolean;
  uses: string[];
}

export interface JobInfo {
  name: string;
  runsOn: string;
  needs: string[];
  steps: number;
}

export interface WorkflowAnalysis {
  workflows: WorkflowInfo[];
  reusableWorkflows: WorkflowInfo[];
  stats: {
    totalWorkflows: number;
    totalJobs: number;
    reusableCount: number;
    triggerTypes: Record<string, number>;
  };
}

export class WorkflowAnalyzer {
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  analyze(): WorkflowAnalysis {
    const workflowsDir = path.join(this.rootDir, '.github', 'workflows');
    const workflows: WorkflowInfo[] = [];
    const reusableWorkflows: WorkflowInfo[] = [];
    const triggerTypes: Record<string, number> = {};

    if (!fs.existsSync(workflowsDir)) {
      return {
        workflows: [],
        reusableWorkflows: [],
        stats: {
          totalWorkflows: 0,
          totalJobs: 0,
          reusableCount: 0,
          triggerTypes: {},
        },
      };
    }

    const files = fs.readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = path.join(workflowsDir, file);
      const workflow = this.parseWorkflow(filePath);

      if (workflow) {
        if (workflow.isReusable) {
          reusableWorkflows.push(workflow);
        } else {
          workflows.push(workflow);
        }

        // Count triggers
        for (const trigger of workflow.triggers) {
          triggerTypes[trigger] = (triggerTypes[trigger] || 0) + 1;
        }
      }
    }

    const totalJobs = [...workflows, ...reusableWorkflows].reduce((sum, w) => sum + w.jobs.length, 0);

    return {
      workflows,
      reusableWorkflows,
      stats: {
        totalWorkflows: workflows.length + reusableWorkflows.length,
        totalJobs,
        reusableCount: reusableWorkflows.length,
        triggerTypes,
      },
    };
  }

  private parseWorkflow(filePath: string): WorkflowInfo | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const doc = yaml.load(content) as any;

      if (!doc) return null;

      const filename = path.basename(filePath);
      const triggers = this.extractTriggers(doc);
      const jobs = this.extractJobs(doc);
      const uses = this.extractUses(doc);
      const isReusable = filename.startsWith('reusable-') || triggers.includes('workflow_call');

      return {
        name: doc.name || filename.replace(/\.(yml|yaml)$/, ''),
        filename,
        path: filePath,
        triggers,
        jobs,
        isReusable,
        uses,
      };
    } catch (error) {
      console.warn(`Failed to parse workflow: ${filePath}`);
      return null;
    }
  }

  private extractTriggers(doc: any): string[] {
    const triggers: string[] = [];

    if (!doc.on) return triggers;

    if (typeof doc.on === 'string') {
      triggers.push(doc.on);
    } else if (Array.isArray(doc.on)) {
      triggers.push(...doc.on);
    } else if (typeof doc.on === 'object') {
      triggers.push(...Object.keys(doc.on));
    }

    return triggers;
  }

  private extractJobs(doc: any): JobInfo[] {
    const jobs: JobInfo[] = [];

    if (!doc.jobs) return jobs;

    for (const [jobName, jobDef] of Object.entries(doc.jobs)) {
      const job = jobDef as any;

      jobs.push({
        name: jobName,
        runsOn: job['runs-on'] || 'unknown',
        needs: Array.isArray(job.needs) ? job.needs : job.needs ? [job.needs] : [],
        steps: Array.isArray(job.steps) ? job.steps.length : 0,
      });
    }

    return jobs;
  }

  private extractUses(doc: any): string[] {
    const uses: string[] = [];

    if (!doc.jobs) return uses;

    for (const jobDef of Object.values(doc.jobs)) {
      const job = jobDef as any;

      // Job-level uses (reusable workflow)
      if (job.uses) {
        uses.push(job.uses);
      }

      // Step-level uses
      if (Array.isArray(job.steps)) {
        for (const step of job.steps) {
          if (step.uses) {
            uses.push(step.uses);
          }
        }
      }
    }

    return [...new Set(uses)];
  }
}
