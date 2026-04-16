import test from 'node:test';
import assert from 'node:assert/strict';
import { DATABASE_CONFIG_BY_KEY } from '../src/architecture.mjs';
import { buildDatabasePlan } from '../src/mapping.mjs';
import { runApplyPreflight, verifyPatchedRelations } from '../src/migrator.mjs';
import { loadSchemas } from '../src/records.mjs';

test('runApplyPreflight creates, verifies, lists, and cleans up probe resources', async () => {
  const calls = [];
  const createdViews = [];
  const api = {
    async createPage() {
      calls.push('createPage');
      return { id: 'probe-page', url: 'https://notion.so/probe-page' };
    },
    async createDatabase() {
      calls.push('createDatabase');
      return {
        id: 'probe-db',
        url: 'https://notion.so/probe-db',
        data_sources: [{ id: 'probe-ds' }],
      };
    },
    async createView(payload) {
      calls.push(`createView:${payload.name}`);
      const view = {
        id: `view-${createdViews.length + 1}`,
        name: payload.name,
        filter: payload.filter,
        sorts: payload.sorts,
      };
      createdViews.push(view);
      return view;
    },
    async retrieveView(viewId) {
      calls.push(`retrieveView:${viewId}`);
      return createdViews.find((view) => view.id === viewId);
    },
    async listViews() {
      calls.push('listViews');
      return { results: createdViews.map((view) => ({ id: view.id })) };
    },
    async deleteView(viewId) {
      calls.push(`deleteView:${viewId}`);
      return { id: viewId };
    },
    async updateDatabase(databaseId, payload) {
      calls.push(`updateDatabase:${databaseId}:${payload.in_trash}`);
      return { id: databaseId };
    },
    async updatePage(pageId, payload) {
      calls.push(`updatePage:${pageId}:${payload.in_trash}`);
      return { id: pageId };
    },
  };

  const result = await runApplyPreflight(api, 'parent-page', 'run-123');

  assert.equal(result.status, 'passed');
  assert.equal(result.cleanup.status, 'succeeded');
  assert.equal(result.probeResources.length, 5);
  assert.equal(result.verifiedViews.length, 3);
  assert.deepEqual(result.pendingRollbackResources, []);
  assert.deepEqual(
    calls.slice(-5),
    [
      'deleteView:view-3',
      'deleteView:view-2',
      'deleteView:view-1',
      'updateDatabase:probe-db:true',
      'updatePage:probe-page:true',
    ],
  );
});

test('verifyPatchedRelations confirms a single synced relation on both sides', async () => {
  const schemas = loadSchemas([DATABASE_CONFIG_BY_KEY.tasks, DATABASE_CONFIG_BY_KEY.projects]);
  const databasePlans = [
    buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks),
    buildDatabasePlan(DATABASE_CONFIG_BY_KEY.projects, schemas.projects),
  ];

  const createdDatabases = {
    tasks: { dataSourceId: 'tasks-ds' },
    projects: { dataSourceId: 'projects-ds' },
  };

  const api = {
    async retrieveDataSource(dataSourceId) {
      if (dataSourceId === 'tasks-ds') {
        return {
          properties: {
            taskProject: { name: 'Project', type: 'relation' },
          },
        };
      }
      return {
        properties: {
          projectTasks: { name: 'Tasks', type: 'relation' },
        },
      };
    },
  };

  await assert.doesNotReject(() =>
    verifyPatchedRelations(api, databasePlans, createdDatabases),
  );
});

test('verifyPatchedRelations fails when Notion creates duplicate synced relation columns', async () => {
  const schemas = loadSchemas([DATABASE_CONFIG_BY_KEY.tasks, DATABASE_CONFIG_BY_KEY.projects]);
  const databasePlans = [
    buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks),
    buildDatabasePlan(DATABASE_CONFIG_BY_KEY.projects, schemas.projects),
  ];

  const createdDatabases = {
    tasks: { dataSourceId: 'tasks-ds' },
    projects: { dataSourceId: 'projects-ds' },
  };

  const api = {
    async retrieveDataSource(dataSourceId) {
      if (dataSourceId === 'tasks-ds') {
        return {
          properties: {
            taskProject: { name: 'Project', type: 'relation' },
          },
        };
      }
      return {
        properties: {
          projectTasksA: { name: 'Tasks', type: 'relation' },
          projectTasksB: { name: 'Tasks', type: 'relation' },
        },
      };
    },
  };

  await assert.rejects(
    () => verifyPatchedRelations(api, databasePlans, createdDatabases),
    /expected exactly one synced property, found 2/,
  );
});
