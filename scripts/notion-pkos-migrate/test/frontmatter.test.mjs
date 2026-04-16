import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatterDocument } from '../src/frontmatter.mjs';

test('parseFrontmatterDocument handles nonstandard frontmatter opener', () => {
  const source = `---type: canonical
source: none
sync: none
sla: none

id: sample
kind: task
name: Sample
created: 2026-04-01
updated: 2026-04-02
---

Body text.`;

  const parsed = parseFrontmatterDocument(source);

  assert.equal(parsed.data.id, 'sample');
  assert.equal(parsed.data.kind, 'task');
  assert.equal(parsed.body, 'Body text.');
});
