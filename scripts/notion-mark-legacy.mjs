/**
 * Mark legacy Notion rows as archived with replacement notes.
 *
 * Required env:
 * - NOTION_TOKEN
 * - NOTION_DB_ID
 *
 * Optional env (defaults match your current DB):
 * - NOTION_NAME_PROPERTY=Project Name
 * - NOTION_STATUS_PROPERTY=Status
 * - NOTION_ONELINER_PROPERTY=One-Liner
 */
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NAME_PROP = process.env.NOTION_NAME_PROPERTY || 'Project Name';
const STATUS_PROP = process.env.NOTION_STATUS_PROPERTY || 'Status';
const ONELINER_PROP = process.env.NOTION_ONELINER_PROPERTY || 'One-Liner';

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DB_ID.');
  process.exit(1);
}

const NOTION_API = 'https://api.notion.com/v1';
const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

async function notionFetch(path, options = {}) {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

async function findByName(name) {
  const body = {
    filter: {
      property: NAME_PROP,
      title: { equals: name },
    },
  };
  const result = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return result.results || [];
}

function getRichTextPlain(prop) {
  if (!prop?.rich_text?.length) return '';
  return prop.rich_text.map((r) => r.plain_text || '').join('');
}

async function markLegacy(name, replacementLabel, replacementRepo) {
  const rows = await findByName(name);
  if (!rows.length) {
    console.log(`Not found: ${name}`);
    return;
  }
  for (const row of rows) {
    const oldOneLiner = getRichTextPlain(row.properties[ONELINER_PROP]);
    const note = `Legacy row. Replaced by ${replacementLabel} (${replacementRepo}).`;
    const merged = oldOneLiner.includes('Legacy row.') ? oldOneLiner : `${oldOneLiner} ${note}`.trim();

    await notionFetch(`/pages/${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          [STATUS_PROP]: { select: { name: 'archived' } },
          [ONELINER_PROP]: { rich_text: [{ text: { content: merged.slice(0, 1800) } }] },
        },
      }),
    });
    console.log(`Archived: ${name} (${row.id})`);
  }
}

async function main() {
  await markLegacy('morphism.systems', 'Morphism', 'morphism-org/morphism');
  await markLegacy('aiclarity.com', 'Event Discovery Framework', 'alawein/edfp');
  console.log('Legacy marking complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

