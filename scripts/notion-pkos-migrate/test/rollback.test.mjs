import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRollbackManifest } from '../src/artifacts.mjs';

test('buildRollbackManifest reverses operation order', () => {
  const manifest = buildRollbackManifest('run-1', [
    { rollback: { type: 'page', id: 'page-1' } },
    { rollback: { type: 'database', id: 'db-1' } },
    { rollback: { type: 'view', id: 'view-1' } },
  ]);

  assert.deepEqual(manifest.operations, [
    { type: 'view', id: 'view-1' },
    { type: 'database', id: 'db-1' },
    { type: 'page', id: 'page-1' },
  ]);
});
