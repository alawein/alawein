import { join } from 'node:path';
import {
  buildHubViewCollections,
  DATABASE_CONFIGS,
  HUB_DEFINITIONS,
  NOTION_VERSION,
  TEMPLATE_LIBRARY_PAGE,
  scopeToDatabaseKey,
} from './architecture.mjs';
import { createArtifactContext, writeDryRunPlan, writeExecutionArtifacts, buildRollbackManifest } from './artifacts.mjs';
import { extractLegacyResourcesFromText, buildLegacyIndex, buildUnmatchedLegacyResources, buildUrlMap } from './matcher.mjs';
import { buildTemplatePageBlocks, buildDatabasePlan, buildPropertiesForRecord, buildRelationUpdatePayload } from './mapping.mjs';
import { markdownToBlocks } from './markdown.mjs';
import { NotionApi } from './notion-api.mjs';
import { loadLocalRecords, loadSchemas } from './records.mjs';
import { buildRelationPlan } from './relations.mjs';
import {
  RUNTIME_PATHS,
  createRunId,
  resolveOptionalInput,
  runWithConcurrency,
  readTextIfExists,
} from './utils.mjs';
import { validateMigrationInputs } from './validation.mjs';

function normalizeScope(scopeTokens) {
  if (!scopeTokens?.length) return DATABASE_CONFIGS;
  const keys = new Set(scopeTokens.map((token) => scopeToDatabaseKey(token)).filter(Boolean));
  return DATABASE_CONFIGS.filter((config) => keys.has(config.key));
}

function buildHubBlocks(hubDefinition) {
  return markdownToBlocks(`# ${hubDefinition.title}\n\n${hubDefinition.description}`);
}

function toPageParent(pageId) {
  return { type: 'page_id', page_id: pageId };
}

function toDataSourceParent(dataSourceId) {
  return { type: 'data_source_id', data_source_id: dataSourceId };
}

function resourceLogEntry({ type, id, title, url, extra = {}, rollback }) {
  return {
    type,
    id,
    title,
    url: url ?? null,
    created_at: new Date().toISOString(),
    ...extra,
    rollback,
  };
}

function serializeError(error) {
  if (!error) return null;
  return {
    message: error.message,
    name: error.name,
  };
}

function buildResourceLogPayload({ runId, status, resources, preflight, error }) {
  return {
    run_id: runId,
    status,
    generated_at: new Date().toISOString(),
    preflight: preflight
      ? {
          status: preflight.status,
          started_at: preflight.startedAt,
          completed_at: preflight.completedAt ?? null,
          verified_views: preflight.verifiedViews ?? [],
          probe_resources: preflight.probeResources ?? [],
          cleanup: preflight.cleanup ?? null,
        }
      : null,
    error: serializeError(error),
    resources,
  };
}

function buildDryRunSummary({
  runId,
  databaseConfigs,
  recordsByDatabase,
  legacyResources,
  sourceFiles,
}) {
  const hubViews = buildHubViewCollections(databaseConfigs);
  return {
    run_id: runId,
    notion_version: NOTION_VERSION,
    source_files: sourceFiles,
    apply_preflight: true,
    counts: {
      hub_pages: HUB_DEFINITIONS.length,
      template_pages: databaseConfigs.length,
      databases: databaseConfigs.length,
      views: Object.values(hubViews).reduce((sum, views) => sum + views.length, 0),
      records: databaseConfigs.reduce(
        (sum, config) => sum + (recordsByDatabase[config.key]?.length || 0),
        0,
      ),
      legacy_resources_discovered: legacyResources.length,
    },
    databases: databaseConfigs.map((config) => ({
      key: config.key,
      title: config.title,
      records: recordsByDatabase[config.key]?.length || 0,
      relations: config.relationProperties,
    })),
    hubs: hubViews,
  };
}

async function discoverLegacySources({ api, snapshotPath, databasesPath, agentsPath }) {
  const sourceFiles = [snapshotPath, databasesPath, agentsPath].filter(Boolean);
  const liveResources = api.isAuthenticated ? await api.searchAllResources() : [];
  const sourceResources = sourceFiles.flatMap((path) =>
    extractLegacyResourcesFromText(path, readTextIfExists(path)),
  );
  return {
    sourceFiles,
    legacyIndex: buildLegacyIndex(liveResources, sourceResources),
  };
}

function buildPreflightProbeProperties() {
  return {
    Name: { title: {} },
    Status: {
      status: {
        options: [
          { id: 'probe-queued', name: 'queued', color: 'default' },
          { id: 'probe-review', name: 'review', color: 'blue' },
          { id: 'probe-done', name: 'done', color: 'green' },
        ],
        groups: [
          { id: 'probe-group-todo', name: 'To-do', color: 'gray', option_ids: ['probe-queued'] },
          { id: 'probe-group-progress', name: 'In progress', color: 'blue', option_ids: ['probe-review'] },
          { id: 'probe-group-complete', name: 'Complete', color: 'green', option_ids: ['probe-done'] },
        ],
      },
    },
    Priority: {
      select: {
        options: [{ name: 'P0' }, { name: 'P1' }, { name: 'P2' }],
      },
    },
  };
}

async function cleanupProbeResources(api, probeResources) {
  const errors = [];
  for (const resource of [...probeResources].reverse()) {
    try {
      if (resource.rollback?.type === 'view') {
        await api.deleteView(resource.rollback.id);
      } else if (resource.rollback?.type === 'database') {
        await api.updateDatabase(resource.rollback.id, { in_trash: true });
      } else if (resource.rollback?.type === 'page') {
        await api.updatePage(resource.rollback.id, { in_trash: true });
      }
    } catch (error) {
      errors.push({ resource_id: resource.id, error: serializeError(error) });
    }
  }

  return errors;
}

export async function runApplyPreflight(api, parentPageId, runId) {
  const startedAt = new Date().toISOString();
  const probeResources = [];
  const verifiedViews = [];

  try {
    const probePage = await api.createPage({
      parent: toPageParent(parentPageId),
      properties: {
        Name: {
          title: [{ type: 'text', text: { content: `PKOS Preflight ${runId}` } }],
        },
      },
      children: markdownToBlocks(
        'Disposable preflight surface for validating linked-view placement and filter serialization.',
      ),
    });
    probeResources.push(
      resourceLogEntry({
        type: 'preflight_page',
        id: probePage.id,
        title: `PKOS Preflight ${runId}`,
        url: probePage.url,
        rollback: { type: 'page', id: probePage.id },
      }),
    );

    const probeDatabase = await api.createDatabase({
      parentPageId: probePage.id,
      title: `PKOS Preflight Database ${runId}`,
      icon: '🧪',
      description: 'Disposable data source used to validate view creation before the real migration.',
      properties: buildPreflightProbeProperties(),
    });
    probeResources.push(
      resourceLogEntry({
        type: 'preflight_database',
        id: probeDatabase.id,
        title: `PKOS Preflight Database ${runId}`,
        url: probeDatabase.url,
        extra: { data_source_id: probeDatabase.data_sources?.[0]?.id },
        rollback: { type: 'database', id: probeDatabase.id },
      }),
    );

    const probeDataSourceId = probeDatabase.data_sources?.[0]?.id;
    const probeViewDefinitions = [
      {
        name: 'Probe Status Equals',
        type: 'table',
        filter: { property: 'Status', status: { equals: ['queued', 'review'] } },
        sorts: [{ property: 'Priority', direction: 'ascending' }],
      },
      {
        name: 'Probe Status Exclude',
        type: 'table',
        filter: { property: 'Status', status: { does_not_equal: ['done'] } },
        sorts: [{ property: 'Name', direction: 'ascending' }],
      },
      {
        name: 'Probe Priority Equals',
        type: 'table',
        filter: { property: 'Priority', select: { equals: ['P0', 'P1'] } },
        sorts: [{ property: 'Status', direction: 'ascending' }],
      },
    ];

    for (const definition of probeViewDefinitions) {
      const view = await api.createView({
        database_id: probeDatabase.id,
        data_source_id: probeDataSourceId,
        create_database: {
          parent: { type: 'page_id', page_id: probePage.id },
        },
        name: definition.name,
        type: definition.type,
        filter: definition.filter,
        sorts: definition.sorts,
      });

      probeResources.push(
        resourceLogEntry({
          type: 'preflight_view',
          id: view.id,
          title: definition.name,
          url: probeDatabase.url ? `${probeDatabase.url}?v=${view.id.replace(/-/g, '')}` : null,
          rollback: { type: 'view', id: view.id },
        }),
      );

      const retrieved = await api.retrieveView(view.id);
      if (JSON.stringify(retrieved.filter ?? null) !== JSON.stringify(definition.filter ?? null)) {
        throw new Error(`View preflight failed: filter mismatch for ${definition.name}.`);
      }
      if (JSON.stringify(retrieved.sorts ?? []) !== JSON.stringify(definition.sorts ?? [])) {
        throw new Error(`View preflight failed: sort mismatch for ${definition.name}.`);
      }
      verifiedViews.push({
        id: view.id,
        name: retrieved.name ?? definition.name,
        filter: retrieved.filter ?? null,
        sorts: retrieved.sorts ?? [],
      });
    }

    const listedViews = await api.listViews({ dataSourceId: probeDataSourceId });
    const listedIds = new Set((listedViews.results || []).map((view) => view.id));
    for (const resource of probeResources.filter((entry) => entry.type === 'preflight_view')) {
      if (!listedIds.has(resource.id)) {
        throw new Error(`View preflight failed: linked view ${resource.title} was not returned by listViews().`);
      }
    }

    const cleanupErrors = await cleanupProbeResources(api, probeResources);
    return {
      status: cleanupErrors.length === 0 ? 'passed' : 'cleanup_failed',
      startedAt,
      completedAt: new Date().toISOString(),
      verifiedViews,
      probeResources,
      cleanup: {
        status: cleanupErrors.length === 0 ? 'succeeded' : 'failed',
        errors: cleanupErrors,
      },
      pendingRollbackResources: cleanupErrors.length === 0 ? [] : [...probeResources],
    };
  } catch (error) {
    const cleanupErrors = await cleanupProbeResources(api, probeResources);
    error.preflight = {
      status: 'failed',
      startedAt,
      completedAt: new Date().toISOString(),
      verifiedViews,
      probeResources,
      cleanup: {
        status: cleanupErrors.length === 0 ? 'succeeded' : 'failed',
        errors: cleanupErrors,
      },
      pendingRollbackResources: cleanupErrors.length === 0 ? [] : [...probeResources],
    };
    throw error;
  }
}

async function createHubPages(api, parentPageId, resources) {
  const hubPages = {};
  for (const hub of HUB_DEFINITIONS) {
    const page = await api.createPage({
      parent: toPageParent(parentPageId),
      properties: {
        Name: {
          title: [{ type: 'text', text: { content: hub.title } }],
        },
      },
      children: buildHubBlocks(hub),
    });
    hubPages[hub.key] = page;
    resources.push(
      resourceLogEntry({
        type: 'hub_page',
        id: page.id,
        title: hub.title,
        url: page.url,
        rollback: { type: 'page', id: page.id },
      }),
    );
  }
  return hubPages;
}

async function createTemplateLibrary(api, operationsHubPageId, resources) {
  const page = await api.createPage({
    parent: toPageParent(operationsHubPageId),
    properties: {
      Name: { title: [{ type: 'text', text: { content: TEMPLATE_LIBRARY_PAGE.title } }] },
    },
    children: markdownToBlocks(TEMPLATE_LIBRARY_PAGE.description),
  });
  resources.push(
    resourceLogEntry({
      type: 'template_library',
      id: page.id,
      title: TEMPLATE_LIBRARY_PAGE.title,
      url: page.url,
      rollback: { type: 'page', id: page.id },
    }),
  );
  return page;
}

async function createDatabases(api, operationsHubPageId, databasePlans, resources) {
  const created = {};
  for (const databasePlan of databasePlans) {
    const response = await api.createDatabase({
      parentPageId: operationsHubPageId,
      title: databasePlan.databaseConfig.title,
      icon: databasePlan.databaseConfig.icon,
      description: `Canonical ${databasePlan.databaseConfig.title} database for the PKOS Notion rebuild migrator.`,
      properties: databasePlan.properties,
    });

    created[databasePlan.databaseConfig.key] = {
      databaseId: response.id,
      dataSourceId: response.data_sources?.[0]?.id,
      url: response.url,
      title: databasePlan.databaseConfig.title,
    };

    resources.push(
      resourceLogEntry({
        type: 'database',
        id: response.id,
        title: databasePlan.databaseConfig.title,
        url: response.url,
        extra: { data_source_id: response.data_sources?.[0]?.id },
        rollback: { type: 'database', id: response.id },
      }),
    );
  }
  return created;
}

async function patchRelations(api, databasePlans, createdDatabases) {
  for (const databasePlan of databasePlans) {
    if (!databasePlan.relationProperties.length) continue;
    const properties = {};
    for (const relationProperty of databasePlan.relationProperties) {
      properties[relationProperty.name] = {
        relation: {
          data_source_id: createdDatabases[relationProperty.target].dataSourceId,
          dual_property: {
            synced_property_name: relationProperty.syncedPropertyName,
          },
        },
      };
    }
    await api.updateDataSource(createdDatabases[databasePlan.databaseConfig.key].dataSourceId, {
      properties,
    });
  }
}

export async function verifyPatchedRelations(api, databasePlans, createdDatabases) {
  const dataSources = new Map();
  const getDataSource = async (databaseKey) => {
    if (!dataSources.has(databaseKey)) {
      dataSources.set(
        databaseKey,
        await api.retrieveDataSource(createdDatabases[databaseKey].dataSourceId),
      );
    }
    return dataSources.get(databaseKey);
  };

  for (const databasePlan of databasePlans) {
    if (!databasePlan.relationProperties.length) continue;

    const sourceDataSource = await getDataSource(databasePlan.databaseConfig.key);
    const sourceProperties = Object.values(sourceDataSource.properties || {});

    for (const relationProperty of databasePlan.relationProperties) {
      const sourceMatches = sourceProperties.filter(
        (property) => property?.name === relationProperty.name && property?.type === 'relation',
      );
      const targetDataSource = await getDataSource(relationProperty.target);
      const targetProperties = Object.values(targetDataSource.properties || {});
      const targetMatches = targetProperties.filter(
        (property) => property?.name === relationProperty.syncedPropertyName && property?.type === 'relation',
      );

      if (sourceMatches.length !== 1) {
        throw new Error(
          `Relation verification failed for ${databasePlan.databaseConfig.key}.${relationProperty.name}: expected exactly one source property, found ${sourceMatches.length}.`,
        );
      }

      if (targetMatches.length !== 1) {
        throw new Error(
          `Relation verification failed for ${relationProperty.target}.${relationProperty.syncedPropertyName}: expected exactly one synced property, found ${targetMatches.length}.`,
        );
      }
    }
  }
}

async function createTemplatePages(api, templateLibraryPageId, databaseConfigs, resources) {
  const templatePages = {};
  for (const databaseConfig of databaseConfigs) {
    const page = await api.createPage({
      parent: toPageParent(templateLibraryPageId),
      properties: {
        Name: {
          title: [{ type: 'text', text: { content: `Template - ${databaseConfig.title}` } }],
        },
      },
      children: buildTemplatePageBlocks(databaseConfig),
    });
    templatePages[databaseConfig.key] = page;
    resources.push(
      resourceLogEntry({
        type: 'template_page',
        id: page.id,
        title: `Template - ${databaseConfig.title}`,
        url: page.url,
        rollback: { type: 'page', id: page.id },
      }),
    );
  }
  return templatePages;
}

async function createHubViews(api, hubPages, databaseConfigs, createdDatabases, resources) {
  const allViews = buildHubViewCollections(databaseConfigs);

  for (const [hubKey, viewDefinitions] of Object.entries(allViews)) {
    for (const viewDefinition of viewDefinitions) {
      const database = createdDatabases[viewDefinition.databaseKey];
      const view = await api.createView({
        database_id: database.databaseId,
        data_source_id: database.dataSourceId,
        create_database: {
          parent: { type: 'page_id', page_id: hubPages[hubKey].id },
        },
        name: viewDefinition.name,
        type: viewDefinition.type,
        filter: viewDefinition.filter,
        sorts: viewDefinition.sorts,
      });
      resources.push(
        resourceLogEntry({
          type: 'view',
          id: view.id,
          title: viewDefinition.name,
          url: database.url ? `${database.url}?v=${view.id.replace(/-/g, '')}` : null,
          extra: { hub: hubKey, database_key: viewDefinition.databaseKey },
          rollback: { type: 'view', id: view.id },
        }),
      );
    }
  }
}

async function createRecordPages(api, records, databasePlansByKey, createdDatabases, legacyUrlDetails, resources) {
  const recordPages = new Map();
  const detailByRecordKey = new Map(legacyUrlDetails.map((detail) => [detail.recordKey, detail]));

  await runWithConcurrency(records, 3, async (record) => {
    const databasePlan = databasePlansByKey[record.databaseKey];
    const detail = detailByRecordKey.get(record.globalKey);
    const page = await api.createPage({
      parent: toDataSourceParent(createdDatabases[record.databaseKey].dataSourceId),
      properties: buildPropertiesForRecord(record, databasePlan, {
        legacyUrl: detail?.old_url,
      }),
      children: markdownToBlocks(record.body),
    });

    recordPages.set(record.globalKey, page);
    resources.push(
      resourceLogEntry({
        type: 'record_page',
        id: page.id,
        title: record.name,
        url: page.url,
        extra: {
          database_key: record.databaseKey,
          record_id: record.id,
          source_file: record.relativePath,
        },
        rollback: { type: 'page', id: page.id },
      }),
    );

    if (detail) {
      detail.new_url = page.url;
    }
  });

  return recordPages;
}

async function applyRelations(api, relationPlan, recordPages, databasePlansByKey) {
  for (const [recordKey, propertyTargets] of relationPlan.entries()) {
    const page = recordPages.get(recordKey);
    if (!page) continue;
    const properties = {};
    const databaseKey = recordKey.split(':', 1)[0];
    const relationConfigByName = new Map(
      (databasePlansByKey[databaseKey]?.relationProperties || []).map((property) => [
        property.name,
        property,
      ]),
    );
    for (const [propertyName, targetRecordIds] of Object.entries(propertyTargets)) {
      const relationConfig = relationConfigByName.get(propertyName);
      if (!relationConfig) continue;
      const targetPageIds = targetRecordIds
        .map((targetId) => recordPages.get(`${relationConfig.target}:${targetId}`)?.id)
        .filter(Boolean);
      if (targetPageIds.length > 0) {
        Object.assign(properties, buildRelationUpdatePayload(propertyName, targetPageIds));
      }
    }
    if (Object.keys(properties).length > 0) {
      await api.updatePage(page.id, { properties });
    }
  }
}

function resolveSourcePaths(options) {
  return {
    snapshotPath: resolveOptionalInput(options.sourceSnapshot, 'workspace-snapshot.md'),
    databasesPath: resolveOptionalInput(options.sourceDatabases, 'databases.md'),
    agentsPath: resolveOptionalInput(options.sourceAgents, 'agents.md'),
  };
}

function assignUrlMapDetails(urlMapDetails) {
  const mappings = {};
  for (const detail of urlMapDetails) {
    if (detail.old_url && detail.new_url) {
      mappings[detail.old_url] = detail.new_url;
    }
  }
  return { mappings, details: urlMapDetails };
}

export async function runMigration(rawOptions = {}) {
  const options = {
    mode: rawOptions.mode ?? 'dry-run',
    token: rawOptions.token ?? process.env.NOTION_TOKEN ?? '',
    parentPageId: rawOptions.parentPageId ?? process.env.NOTION_PARENT_PAGE_ID ?? '',
    scope: rawOptions.scope ?? [],
    sourceSnapshot: rawOptions.sourceSnapshot,
    sourceDatabases: rawOptions.sourceDatabases,
    sourceAgents: rawOptions.sourceAgents,
  };

  const databaseConfigs = normalizeScope(options.scope);
  const runId = createRunId();
  const artifactContext = createArtifactContext(RUNTIME_PATHS.artifactRoot, runId);
  const schemas = loadSchemas(databaseConfigs);
  const { recordsByDatabase, allRecords } = loadLocalRecords({ databaseConfigs });
  const databasePlans = databaseConfigs.map((config) => buildDatabasePlan(config, schemas[config.key]));
  const databasePlansByKey = Object.fromEntries(databasePlans.map((plan) => [plan.databaseConfig.key, plan]));
  const relationPlan = buildRelationPlan(allRecords);
  validateMigrationInputs(databaseConfigs, databasePlans, databasePlansByKey);
  const api = new NotionApi({ token: options.token, notionVersion: NOTION_VERSION });
  const sourcePaths = resolveSourcePaths(options);
  const { sourceFiles, legacyIndex } = await discoverLegacySources({ api, ...sourcePaths });
  const urlMapDraft = buildUrlMap(allRecords, legacyIndex);
  const unmatchedDraft = buildUnmatchedLegacyResources(legacyIndex, urlMapDraft.matchedIds);

  const dryRunPlan = buildDryRunSummary({
    runId,
    databaseConfigs,
    recordsByDatabase,
    legacyResources: legacyIndex.resources,
    sourceFiles,
  });
  writeDryRunPlan(artifactContext, dryRunPlan);

  if (options.mode === 'dry-run') {
    return {
      runId,
      artifactContext,
      dryRunPlan,
      unmatched: unmatchedDraft,
    };
  }

  if (options.mode === 'rollback') {
    if (!rawOptions.rollbackManifest) {
      throw new Error('--rollback requires a rollback manifest path.');
    }
    const rollbackManifest = JSON.parse(readTextIfExists(rawOptions.rollbackManifest));
    for (const operation of rollbackManifest.operations || []) {
      if (operation.type === 'page') {
        await api.updatePage(operation.id, { in_trash: true });
      } else if (operation.type === 'database') {
        await api.updateDatabase(operation.id, { in_trash: true });
      } else if (operation.type === 'view') {
        await api.deleteView(operation.id);
      }
    }
    return { runId, rollback: rollbackManifest };
  }

  if (!options.parentPageId) {
    throw new Error('NOTION_PARENT_PAGE_ID or --parent-page-id is required for --apply.');
  }

  const resources = [];
  let preflight = null;

  try {
    preflight = await runApplyPreflight(api, options.parentPageId, runId);
    if (preflight.cleanup?.status !== 'succeeded') {
      throw new Error('Apply preflight created disposable resources but cleanup did not fully succeed.');
    }

    const hubPages = await createHubPages(api, options.parentPageId, resources);
    const createdDatabases = await createDatabases(
      api,
      hubPages.operationsHub.id,
      databasePlans,
      resources,
    );
    await patchRelations(api, databasePlans, createdDatabases);
    await verifyPatchedRelations(api, databasePlans, createdDatabases);
    const templateLibrary = await createTemplateLibrary(api, hubPages.operationsHub.id, resources);
    await createTemplatePages(api, templateLibrary.id, databaseConfigs, resources);
    await createHubViews(api, hubPages, databaseConfigs, createdDatabases, resources);
    const recordPages = await createRecordPages(
      api,
      allRecords,
      databasePlansByKey,
      createdDatabases,
      urlMapDraft.details,
      resources,
    );
    await applyRelations(api, relationPlan, recordPages, databasePlansByKey);

    const urlMap = assignUrlMapDetails(urlMapDraft.details);
    const rollback = buildRollbackManifest(runId, resources);
    const unmatched = {
      resources: buildUnmatchedLegacyResources(legacyIndex, urlMapDraft.matchedIds),
    };

    writeExecutionArtifacts(artifactContext, {
      resourceLog: buildResourceLogPayload({
        runId,
        status: 'succeeded',
        resources,
        preflight,
      }),
      urlMap,
      rollback,
      unmatched,
    });

    return {
      runId,
      artifactContext,
      dryRunPlan,
      preflight,
      resourceLog: resources,
      urlMap,
      rollback,
      unmatched,
    };
  } catch (error) {
    preflight = error.preflight ?? preflight;
    const urlMap = assignUrlMapDetails(urlMapDraft.details);
    const unmatched = {
      resources: buildUnmatchedLegacyResources(legacyIndex, urlMapDraft.matchedIds),
    };
    const rollback = buildRollbackManifest(runId, [
      ...(preflight?.pendingRollbackResources || []),
      ...resources,
    ]);

    writeExecutionArtifacts(artifactContext, {
      resourceLog: buildResourceLogPayload({
        runId,
        status: 'failed',
        resources,
        preflight,
        error,
      }),
      urlMap,
      rollback,
      unmatched,
    });
    throw error;
  }
}
