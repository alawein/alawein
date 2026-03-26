// notion-db-audit.mjs
// Usage: NOTION_TOKEN=<token> node scripts/notion-db-audit.mjs

const NOTION_TOKEN = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
  console.error("NOTION_TOKEN environment variable is required");
  process.exit(1);
}

const NOTION_VERSION = "2022-06-28";
const BASE_URL = "https://api.notion.com/v1";

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

async function fetchAllDatabases() {
  const databases = [];
  let cursor = undefined;

  do {
    const body = {
      filter: { property: "object", value: "database" },
      page_size: 100,
      ...(cursor && { start_cursor: cursor }),
    };

    const res = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Search failed: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    databases.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return databases;
}

async function fetchDatabaseSchema(id) {
  const res = await fetch(`${BASE_URL}/databases/${id}`, { headers });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Schema fetch failed for ${id}: ${JSON.stringify(err)}`);
  }
  return res.json();
}

function formatProperties(properties) {
  return Object.entries(properties)
    .map(([name, prop]) => `${name}:${prop.type}`)
    .join(" | ");
}

function getTitle(db) {
  return db.title?.map((t) => t.plain_text).join("") || "(Untitled)";
}

async function main() {
  console.log("Fetching all databases...\n");

  const dbs = await fetchAllDatabases();
  console.log(`Found ${dbs.length} databases. Fetching schemas...\n`);

  const results = [];

  for (const db of dbs) {
    try {
      const schema = await fetchDatabaseSchema(db.id);
      results.push({
        name: getTitle(schema),
        id: schema.id,
        properties: formatProperties(schema.properties),
      });
    } catch (e) {
      results.push({
        name: getTitle(db),
        id: db.id,
        properties: `Error: ${e.message}`,
      });
    }
  }

  const COL_NAME = 40;
  const COL_ID = 36;
  const pad = (str, len) => str.slice(0, len).padEnd(len);
  const divider = `${"=".repeat(COL_NAME)}-+-${"=".repeat(COL_ID)}-+-${"=".repeat(60)}`;

  console.log(divider);
  console.log(
    `${pad("Database Name", COL_NAME)} | ${pad("Database ID", COL_ID)} | Properties (name:type)`,
  );
  console.log(divider);

  for (const r of results) {
    console.log(
      `${pad(r.name, COL_NAME)} | ${pad(r.id, COL_ID)} | ${r.properties}`,
    );
  }

  console.log(divider);
  console.log("\n\nJSON output:\n");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
