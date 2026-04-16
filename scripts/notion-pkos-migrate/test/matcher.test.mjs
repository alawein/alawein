import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLegacyIndex, matchLegacyResource, buildUrlMap } from '../src/matcher.mjs';

test('matchLegacyResource prioritizes explicit notion_page_id', () => {
  const legacyIndex = buildLegacyIndex([
    {
      id: '3226d8de-2215-8150-9c08-f63b53856f6a',
      url: 'https://www.notion.so/meshal-alawein-3226d8de221581509c08f63b53856f6a',
      title: 'Meshal Alawein',
      databaseTitle: 'Profile',
    },
  ]);

  const record = {
    globalKey: 'profile:meshal-alawein',
    databaseTitle: 'Profile',
    id: 'meshal-alawein',
    name: 'Meshal Alawein',
    frontmatter: {
      notion_page_id: '3226d8de221581509c08f63b53856f6a',
    },
  };

  const match = matchLegacyResource(record, legacyIndex);
  assert.equal(match.strategy, 'explicit_notion_page_id');

  const urlMap = buildUrlMap([record], legacyIndex);
  assert.equal(
    urlMap.details[0].old_url,
    'https://www.notion.so/meshal-alawein-3226d8de221581509c08f63b53856f6a',
  );
});
