import test from 'node:test';
import assert from 'node:assert/strict';
import { NotionApi } from '../src/notion-api.mjs';

test('NotionApi createDatabase and createView hit expected endpoints', async () => {
  const calls = [];
  const api = new NotionApi({
    token: 'test-token',
    notionVersion: '2026-03-11',
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          id: 'db-id',
          url: 'https://www.notion.so/db-id',
          data_sources: [{ id: 'ds-id' }],
        }),
      };
    },
  });
  api.client = null;

  await api.createDatabase({
    parentPageId: 'parent-page',
    title: 'Projects',
    icon: '🚀',
    properties: { Name: { title: {} } },
  });
  await api.createView({
    database_id: 'db-id',
    data_source_id: 'ds-id',
    create_database: { parent: { type: 'page_id', page_id: 'hub-page' } },
    name: 'Projects Admin',
    type: 'table',
  });

  assert.match(calls[0].url, /\/v1\/databases$/);
  assert.match(calls[1].url, /\/v1\/views$/);
  assert.equal(JSON.parse(calls[1].options.body).database_id, 'db-id');
  assert.equal(JSON.parse(calls[0].options.body).initial_data_source.properties.Name.title.constructor, Object);
});

test('NotionApi retries 429 responses with jittered backoff', async () => {
  const sleeps = [];
  let attempts = 0;
  const api = new NotionApi({
    token: 'test-token',
    notionVersion: '2026-03-11',
    sleepImpl: async (delayMs) => {
      sleeps.push(delayMs);
    },
    randomImpl: () => 0,
    fetchImpl: async () => {
      attempts += 1;
      if (attempts === 1) {
        return {
          ok: false,
          status: 429,
          headers: new Headers({ 'retry-after': '1' }),
          text: async () => 'rate limited',
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ id: 'view-id' }),
      };
    },
  });
  api.client = null;

  await api.retrieveView('view-id');

  assert.equal(attempts, 2);
  assert.deepEqual(sleeps, [1000]);
});

test('NotionApi prefers SDK view methods when available', async () => {
  let receivedPayload = null;
  const api = new NotionApi({
    token: 'test-token',
    notionVersion: '2026-03-11',
    fetchImpl: async () => {
      throw new Error('fetch fallback should not be used');
    },
  });

  api.client = {
    views: {
      create: async (payload) => {
        receivedPayload = payload;
        return { id: 'sdk-view-id' };
      },
    },
  };

  const response = await api.createView({
    database_id: 'db-id',
    data_source_id: 'ds-id',
    name: 'SDK View',
    type: 'table',
  });

  assert.equal(response.id, 'sdk-view-id');
  assert.equal(receivedPayload.database_id, 'db-id');
});
