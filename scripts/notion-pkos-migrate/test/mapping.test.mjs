import test from 'node:test';
import assert from 'node:assert/strict';
import { DATABASE_CONFIG_BY_KEY } from '../src/architecture.mjs';
import { buildDatabasePlan, buildPropertiesForRecord } from '../src/mapping.mjs';
import { loadSchemas } from '../src/records.mjs';

const schemas = loadSchemas([DATABASE_CONFIG_BY_KEY.tasks]);

test('buildPropertiesForRecord maps task fields into notion properties', () => {
  const plan = buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks);
  const record = {
    databaseKey: 'tasks',
    kind: 'task',
    id: 'task-1',
    name: 'Ship migration',
    relativePath: 'tasks/task-1.md',
    frontmatter: {
      id: 'task-1',
      kind: 'task',
      status: 'active',
      name: 'Ship migration',
      task_type: 'feature',
      priority: 'P1',
      created: '2026-04-10',
      updated: '2026-04-11',
      tags: ['notion', 'migration'],
      notion_page_id: '3226d8de221581509c08f63b53856f6a',
    },
  };

  const properties = buildPropertiesForRecord(record, plan, {
    legacyUrl: 'https://www.notion.so/example',
  });

  assert.equal(properties.Name.title[0].text.content, 'Ship migration');
  assert.equal(properties.Status.status.name, 'active');
  assert.equal(properties['Task Type'].select.name, 'feature');
  assert.equal(properties.Priority.select.name, 'P1');
  assert.equal(properties.Tags.multi_select.length, 2);
  assert.equal(properties['Legacy URL'].url, 'https://www.notion.so/example');
});

test('buildDatabasePlan uses checked-in task status groups', () => {
  const plan = buildDatabasePlan(DATABASE_CONFIG_BY_KEY.tasks, schemas.tasks);
  const status = plan.properties.Status.status;

  assert.deepEqual(
    status.groups.map((group) => [group.name, group.option_ids.length]),
    [
      ['To-do', 1],
      ['In progress', 3],
      ['Complete', 2],
    ],
  );
});
