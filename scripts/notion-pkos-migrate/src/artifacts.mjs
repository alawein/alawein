import { join } from 'node:path';
import { ensureDir, writeJson } from './utils.mjs';

export function createArtifactContext(artifactRoot, runId) {
  const outputDir = ensureDir(join(artifactRoot, runId));
  return {
    outputDir,
    files: {
      dryRunPlan: join(outputDir, 'dry-run-plan.json'),
      resourceLog: join(outputDir, 'resource-log.json'),
      urlMap: join(outputDir, 'url-map.json'),
      rollback: join(outputDir, 'rollback.json'),
      unmatched: join(outputDir, 'unmatched.json'),
    },
  };
}

export function writeDryRunPlan(artifactContext, plan) {
  writeJson(artifactContext.files.dryRunPlan, plan);
}

export function writeExecutionArtifacts(artifactContext, payload) {
  writeJson(artifactContext.files.resourceLog, payload.resourceLog);
  writeJson(artifactContext.files.urlMap, payload.urlMap);
  writeJson(artifactContext.files.rollback, payload.rollback);
  writeJson(artifactContext.files.unmatched, payload.unmatched);
}

export function buildRollbackManifest(runId, resources) {
  const operations = [...resources]
    .filter((resource) => resource.rollback)
    .map((resource) => resource.rollback)
    .reverse();

  return {
    run_id: runId,
    generated_at: new Date().toISOString(),
    operations,
  };
}
