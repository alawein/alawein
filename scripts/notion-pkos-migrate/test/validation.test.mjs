import test from 'node:test';
import assert from 'node:assert/strict';
import { DATABASE_CONFIG_BY_KEY } from '../src/architecture.mjs';
import { buildDatabasePlan } from '../src/mapping.mjs';
import { loadSchemas } from '../src/records.mjs';
import {
  validateDatabaseStatusMapping,
  validateRelationOwnership,
  validateViewDefinitions,
} from '../src/validation.mjs';

const schemas = loadSchemas([
  DATABASE_CONFIG_BY_KEY.tasks,
  DATABASE_CONFIG_BY_KEY.projects,
  DATABASE_CONFIG_BY_KEY.inbox,
]);

test('validateDatabaseStatusMapping accepts checked-in board status groups', () => {
  const plan = buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks);
  assert.doesNotThrow(() => validateDatabaseStatusMapping(plan));
});

test('validateRelationOwnership rejects duplicate inverse relation declarations', () => {
  const duplicateConfigs = [
    {
      key: 'tasks',
      relationProperties: [{ name: 'Project', target: 'projects', syncedPropertyName: 'Tasks' }],
    },
    {
      key: 'projects',
      relationProperties: [{ name: 'Tasks', target: 'tasks', syncedPropertyName: 'Project' }],
    },
  ];

  assert.throws(
    () => validateRelationOwnership(duplicateConfigs),
    /Duplicate inverse relation declaration/,
  );
});

test('validateViewDefinitions rejects view filters with unknown option values', () => {
  const taskPlan = buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks);
  const databasePlansByKey = { tasks: taskPlan };
  const badConfigs = [
    {
      ...DATABASE_CONFIG_BY_KEY.tasks,
      relationProperties: DATABASE_CONFIG_BY_KEY.tasks.relationProperties,
    },
  ];

  const originalViews = [{
    databaseKey: 'tasks',
    name: 'Bad Tasks',
    type: 'table',
    filter: { property: 'Priority', select: { equals: ['P9'] } },
    sorts: [{ property: 'Priority', direction: 'ascending' }],
    hubKey: 'commandCenter',
  }];

  assert.throws(
    () => {
      validateViewDefinitions(
        badConfigs,
        databasePlansByKey,
        originalViews,
      );
    },
    /not allowed/,
  );
});
