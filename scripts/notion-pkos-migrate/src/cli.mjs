#!/usr/bin/env node
import { runMigration } from './migrator.mjs';

function parseArgs(argv) {
  const options = {
    mode: 'dry-run',
    scope: [],
    sourceSnapshot: undefined,
    sourceDatabases: undefined,
    sourceAgents: undefined,
    parentPageId: undefined,
    rollbackManifest: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case '--dry-run':
        options.mode = 'dry-run';
        break;
      case '--apply':
        options.mode = 'apply';
        break;
      case '--rollback':
        options.mode = 'rollback';
        options.rollbackManifest = argv[index + 1];
        index += 1;
        break;
      case '--parent-page-id':
        options.parentPageId = argv[index + 1];
        index += 1;
        break;
      case '--scope':
        options.scope = (argv[index + 1] || '')
          .split(',')
          .map((token) => token.trim())
          .filter(Boolean);
        index += 1;
        break;
      case '--source-snapshot':
        options.sourceSnapshot = argv[index + 1];
        index += 1;
        break;
      case '--source-databases':
        options.sourceDatabases = argv[index + 1];
        index += 1;
        break;
      case '--source-agents':
        options.sourceAgents = argv[index + 1];
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function printSummary(result) {
  if (result.dryRunPlan) {
    console.log(`Run ID: ${result.runId}`);
    console.log(`Dry-run plan: ${result.artifactContext.files.dryRunPlan}`);
    console.log(
      `Counts => hubs: ${result.dryRunPlan.counts.hub_pages}, databases: ${result.dryRunPlan.counts.databases}, views: ${result.dryRunPlan.counts.views}, records: ${result.dryRunPlan.counts.records}`,
    );
  }

  if (result.resourceLog) {
    console.log(`Artifacts: ${result.artifactContext.outputDir}`);
    if (result.preflight) {
      console.log(`Apply preflight: ${result.preflight.status}`);
    }
    console.log(`Created resources: ${result.resourceLog.length}`);
    console.log(`URL map: ${result.artifactContext.files.urlMap}`);
    console.log(`Rollback manifest: ${result.artifactContext.files.rollback}`);
  }

  if (result.rollback) {
    console.log(`Rollback completed using ${result.rollback.run_id}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await runMigration(options);
  printSummary(result);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
