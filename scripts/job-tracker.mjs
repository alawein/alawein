/**
 * job-tracker.mjs — Job application tracker for alawein workspace.
 *
 * Syncs job application engagement records to/from the Notion "Engagements" database.
 *
 * Modes:
 *   --from-notion          Read existing Engagements from Notion and print a status summary
 *   --from-file <path>     Read a JSON file of engagement records and upsert to Notion
 *
 * Environment variables:
 *   NOTION_TOKEN               — Notion integration token (required)
 *   NOTION_ENGAGEMENTS_DB_ID   — Engagements database ID (required)
 *
 * JSON file format (--from-file):
 *   [
 *     {
 *       "company": "Anthropic",
 *       "date": "2026-03-20",
 *       "type": "Technical Screen",
 *       "status": "In Progress",
 *       "contact": "Jane Doe",
 *       "link": "https://example.com/posting",
 *       "notes": "L5 AI Research Engineer role"
 *     }
 *   ]
 *
 * Status mapping (for email keyword extraction):
 *   "interview scheduled", "schedule", "phone screen", "technical screen",
 *     "onsite", "coding challenge", "take-home", "next steps" → In Progress
 *   "offer"                                                     → Offer
 *   "rejection", "unfortunately", "regret"                      → Declined
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_ENGAGEMENTS_DB_ID;

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN environment variable.');
  process.exit(1);
}
if (!NOTION_DB_ID) {
  console.error('Missing NOTION_ENGAGEMENTS_DB_ID environment variable.');
  process.exit(1);
}

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': NOTION_VERSION,
};

// Property names matching the Engagements DB schema
const PROP = {
  name: 'Name',            // title
  status: 'Status',        // status
  type: 'Type',            // select
  category: 'Category',    // select
  company: 'Company / Org',// rich_text
  date: 'Date',            // date
  link: 'Link',            // url
  notes: 'Notes',          // rich_text
  counterpart: 'Counterpart', // rich_text
};

// Interview-related keywords for email classification
const KEYWORDS = {
  inProgress: [
    'interview', 'schedule', 'technical screen', 'phone screen',
    'onsite', 'coding challenge', 'take-home', 'next steps',
  ],
  offer: ['offer', 'congratulations', 'pleased to offer'],
  declined: ['rejection', 'unfortunately', 'regret', 'not moving forward', 'decided not to'],
};

// ---------------------------------------------------------------------------
// Notion helpers
// ---------------------------------------------------------------------------

async function notionFetch(path, options = {}) {
  const url = `${NOTION_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

async function queryAllPages() {
  const pages = [];
  let cursor;
  do {
    const body = {};
    if (cursor) body.start_cursor = cursor;
    const res = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages;
}

function extractPlainText(prop) {
  if (!prop) return '';
  if (prop.type === 'title') return prop.title?.map((t) => t.plain_text).join('') || '';
  if (prop.type === 'rich_text') return prop.rich_text?.map((t) => t.plain_text).join('') || '';
  if (prop.type === 'url') return prop.url || '';
  if (prop.type === 'date') return prop.date?.start || '';
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'status') return prop.status?.name || '';
  return '';
}

// ---------------------------------------------------------------------------
// Deduplication key
// ---------------------------------------------------------------------------

function dedupeKey(company, date) {
  return `${(company || '').trim().toLowerCase()}|${(date || '').trim()}`;
}

// ---------------------------------------------------------------------------
// Status inference from text
// ---------------------------------------------------------------------------

function inferStatus(text) {
  const lower = (text || '').toLowerCase();
  for (const kw of KEYWORDS.offer) {
    if (lower.includes(kw)) return 'Offer';
  }
  for (const kw of KEYWORDS.declined) {
    if (lower.includes(kw)) return 'Declined';
  }
  for (const kw of KEYWORDS.inProgress) {
    if (lower.includes(kw)) return 'In Progress';
  }
  return 'Not Started';
}

// ---------------------------------------------------------------------------
// Build Notion page properties from an engagement record
// ---------------------------------------------------------------------------

function buildProperties(record) {
  const props = {};

  // Name (title) — use company + type as the engagement name
  const title = record.company
    ? `${record.company} — ${record.type || 'Application'}`
    : record.type || 'Application';
  props[PROP.name] = { title: [{ text: { content: title } }] };

  // Status (status type) — Notion status properties use { status: { name } }
  if (record.status) {
    props[PROP.status] = { status: { name: record.status } };
  }

  // Type (select)
  if (record.type) {
    props[PROP.type] = { select: { name: record.type } };
  }

  // Category (select) — default to "Job Application"
  props[PROP.category] = { select: { name: record.category || 'Job Application' } };

  // Company / Org (rich_text)
  if (record.company) {
    props[PROP.company] = {
      rich_text: [{ text: { content: record.company } }],
    };
  }

  // Date (date)
  if (record.date) {
    props[PROP.date] = { date: { start: record.date } };
  }

  // Link (url)
  if (record.link) {
    props[PROP.link] = { url: record.link };
  }

  // Notes (rich_text)
  if (record.notes) {
    props[PROP.notes] = {
      rich_text: [{ text: { content: record.notes } }],
    };
  }

  // Counterpart (rich_text) — contact person
  if (record.contact) {
    props[PROP.counterpart] = {
      rich_text: [{ text: { content: record.contact } }],
    };
  }

  return props;
}

// ---------------------------------------------------------------------------
// --from-notion: read and summarize
// ---------------------------------------------------------------------------

async function fromNotion() {
  console.log('Fetching all Engagements from Notion...\n');
  const pages = await queryAllPages();
  console.log(`Total engagements: ${pages.length}\n`);

  // Build summary
  const byStatus = {};
  const byType = {};
  const byCompany = {};
  const recent = [];

  for (const page of pages) {
    const p = page.properties;
    const status = extractPlainText(p[PROP.status]);
    const type = extractPlainText(p[PROP.type]);
    const company = extractPlainText(p[PROP.company]);
    const date = extractPlainText(p[PROP.date]);
    const name = extractPlainText(p[PROP.name]);

    byStatus[status || '(none)'] = (byStatus[status || '(none)'] || 0) + 1;
    if (type) byType[type] = (byType[type] || 0) + 1;
    if (company) byCompany[company] = (byCompany[company] || 0) + 1;

    if (date) {
      recent.push({ name, company, status, type, date });
    }
  }

  // Print status breakdown
  console.log('=== Status Breakdown ===');
  for (const [status, count] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${status}: ${count}`);
  }

  console.log('\n=== Type Breakdown ===');
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  // Top companies
  const topCompanies = Object.entries(byCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  if (topCompanies.length) {
    console.log('\n=== Top Companies (by engagement count) ===');
    for (const [company, count] of topCompanies) {
      console.log(`  ${company}: ${count}`);
    }
  }

  // Recent engagements (last 10 by date)
  recent.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const recentSlice = recent.slice(0, 10);
  if (recentSlice.length) {
    console.log('\n=== Recent Engagements ===');
    for (const r of recentSlice) {
      console.log(`  ${r.date}  ${r.company || '(unknown)'}  [${r.status}]  ${r.type || ''}`);
    }
  }

  // Summary line for CI
  const inProgress = byStatus['In Progress'] || 0;
  const offers = byStatus['Offer'] || 0;
  const declined = byStatus['Declined'] || 0;
  console.log(
    `\n--- Summary: ${pages.length} total | ${inProgress} in progress | ${offers} offers | ${declined} declined ---`
  );
}

// ---------------------------------------------------------------------------
// --from-file: read JSON and upsert to Notion
// ---------------------------------------------------------------------------

async function fromFile(filePath) {
  const absPath = resolve(filePath);
  console.log(`Reading engagement records from ${absPath}...`);
  const raw = readFileSync(absPath, 'utf-8');
  const records = JSON.parse(raw);

  if (!Array.isArray(records)) {
    console.error('Expected a JSON array of engagement records.');
    process.exit(1);
  }

  console.log(`Found ${records.length} records in file.`);

  // Fetch existing pages for deduplication
  console.log('Fetching existing Notion pages for deduplication...');
  const existingPages = await queryAllPages();
  const existingKeys = new Map();

  for (const page of existingPages) {
    const p = page.properties;
    const company = extractPlainText(p[PROP.company]);
    const date = extractPlainText(p[PROP.date]);
    const key = dedupeKey(company, date);
    if (key !== '|') {
      existingKeys.set(key, page.id);
    }
  }

  console.log(`${existingKeys.size} existing dedupe keys found.\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const record of records) {
    // Infer status from notes/type if not explicitly provided
    if (!record.status) {
      record.status = inferStatus(`${record.type || ''} ${record.notes || ''}`);
    }

    const key = dedupeKey(record.company, record.date);
    const existingId = existingKeys.get(key);

    const properties = buildProperties(record);

    try {
      if (existingId) {
        await notionFetch(`/pages/${existingId}`, {
          method: 'PATCH',
          body: JSON.stringify({ properties }),
        });
        console.log(`  Updated: ${record.company} (${record.date})`);
        updated++;
      } else if (key === '|') {
        console.log(`  Skipped (no company or date): ${JSON.stringify(record).slice(0, 80)}`);
        skipped++;
      } else {
        await notionFetch('/pages', {
          method: 'POST',
          body: JSON.stringify({
            parent: { database_id: NOTION_DB_ID },
            properties,
          }),
        });
        existingKeys.set(key, 'new');
        console.log(`  Created: ${record.company} (${record.date})`);
        created++;
      }
    } catch (err) {
      console.error(`  ERROR for ${record.company}: ${err.message}`);
    }
  }

  console.log(`\n--- Done: ${created} created, ${updated} updated, ${skipped} skipped ---`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printUsage() {
  console.log(`Usage:
  node scripts/job-tracker.mjs --from-notion
  node scripts/job-tracker.mjs --from-file <path-to-records.json>

Environment variables:
  NOTION_TOKEN               Notion integration token (required)
  NOTION_ENGAGEMENTS_DB_ID   Engagements database ID (required)
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--from-notion')) {
    await fromNotion();
  } else if (args.includes('--from-file')) {
    const idx = args.indexOf('--from-file');
    const filePath = args[idx + 1];
    if (!filePath) {
      console.error('--from-file requires a path argument.');
      printUsage();
      process.exit(1);
    }
    await fromFile(filePath);
  } else {
    printUsage();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
