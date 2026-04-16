import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelationPlan } from '../src/relations.mjs';

test('buildRelationPlan normalizes task and inbox relations', () => {
  const records = [
    {
      globalKey: 'tasks:task-1',
      databaseKey: 'tasks',
      frontmatter: {
        project: 'proj-1',
      },
    },
    {
      globalKey: 'inbox:inbox-1',
      databaseKey: 'inbox',
      frontmatter: {
        linked_task: 'task-1',
        linked_draft: 'draft-1',
      },
    },
  ];

  const plan = buildRelationPlan(records);

  assert.deepEqual(plan.get('tasks:task-1'), { Project: ['proj-1'] });
  assert.deepEqual(plan.get('inbox:inbox-1'), {
    Tasks: ['task-1'],
    Drafts: ['draft-1'],
  });
});
