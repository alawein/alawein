/**
 * task-sync.mjs — Bidirectional sync between Notion "Master Tasks" DB and GitHub Issues.
 *
 * Field ownership (from knowledge-base/config/work-orchestration.yaml):
 *   Notion owns: status, priority, due_date
 *   GitHub owns: repo, github_ref, github_issue_url, github_state
 *
 * Required env vars: NOTION_TOKEN, NOTION_TASKS_DB_ID, GITHUB_TOKEN
 *
 * Sync logic:
 *   1. Read all Notion tasks with Source = "GitHub"
 *   2. For each, verify the linked GitHub issue still exists; sync github_state -> Notion Status
 *   3. Read recent GitHub issues (last 7 days) across target repos
 *   4. Create Notion pages for new issues not yet tracked (matched by External ID)
 *   5. Update existing Notion pages when GitHub issue state changes
 *
 * Idempotent — safe to re-run. Uses External ID (owner/repo#number) as dedup key.
 */

// ---------------------------------------------------------------------------
// Config — all sensitive values sourced exclusively from environment
// ---------------------------------------------------------------------------

function requireEnv(name) {
  const val = process.env[name];
  if (!val) { console.error(`Missing required env var: ${name}`); process.exit(1); }
  return val;
}

const notionToken = requireEnv('NOTION_TOKEN');
const githubToken = requireEnv('GITHUB_TOKEN');
const notionDbId = requireEnv('NOTION_TASKS_DB_ID').replaceAll('-', '');

const GITHUB_OWNER = 'alawein';
const TARGET_REPOS = ['meshal-web', 'morphism', 'neper', 'qaplibria', 'edfp'];

// Notion property names (must match Master Tasks DB schema)
const PROP = {
  TASK_NAME:    'Task Name',       // title
  STATUS:       'Status',          // select
  PRIORITY:     'Priority',        // select
  DOMAIN:       'Domain',          // select
  TAGS:         'Tags',            // multi_select
  DUE_DATE:     'Due Date',        // date
  ASSIGNEE:     'Assignee',        // people
  URL:          'URL',             // url
  EXTERNAL_ID:  'External ID',     // rich_text — dedup key: "owner/repo#number"
  SOURCE:       'Source',          // select
  ACTION_REQ:   'Action Required', // checkbox
};

// Map GitHub issue state to Notion Status select values
const GITHUB_STATE_TO_NOTION_STATUS = {
  open:   'In Progress',
  closed: 'Done',
};

// Map GitHub labels to Notion Priority (first match wins)
const LABEL_TO_PRIORITY = {
  'priority: critical': 'Critical',
  'priority: high':     'High',
  'priority: medium':   'Medium',
  'priority: low':      'Low',
  'bug':                'High',
  'enhancement':        'Medium',
};

// Map repo name to Domain
const REPO_TO_DOMAIN = {
  'meshal-web':  'Personal',
  'morphism':    'Work',
  'neper':       'Scientific Computing',
  'qaplibria':   'Scientific Computing',
  'edfp':        'Scientific Computing',
};

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const GITHUB_API = 'https://api.github.com';

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function notionFetch(path, options = {}) {
  const url = `${NOTION_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Notion API returned HTTP ${res.status} on ${options.method || 'GET'} ${path}`);
  }
  return res.json();
}

async function githubFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${GITHUB_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'alawein-task-sync/1.0',
      ...(options.headers || {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub API returned HTTP ${res.status} on ${options.method || 'GET'} ${path}`);
  }
  const data = await res.json();
  const link = res.headers.get('link');
  return { data, link };
}

// ---------------------------------------------------------------------------
// Notion helpers
// ---------------------------------------------------------------------------

function makeExternalId(owner, repo, number) {
  return `${owner}/${repo}#${number}`;
}

function parseExternalId(extId) {
  const m = (extId || '').match(/^([^/]+)\/([^#]+)#(\d+)$/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10) };
}

function richTextPlain(rt) {
  return (rt || []).map((t) => t.plain_text || '').join('').trim();
}

async function getAllGitHubTasks() {
  const pages = [];
  let cursor;
  do {
    const body = {
      page_size: 100,
      filter: {
        property: PROP.SOURCE,
        select: { equals: 'GitHub' },
      },
    };
    if (cursor) body.start_cursor = cursor;
    const res = await notionFetch(`/databases/${notionDbId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    pages.push(...(res.results || []));
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages;
}

function buildExternalIdIndex(pages) {
  const index = new Map();
  for (const page of pages) {
    const extId = richTextPlain(page.properties?.[PROP.EXTERNAL_ID]?.rich_text);
    if (extId) index.set(extId, page);
  }
  return index;
}

function getNotionStatus(page) {
  return page.properties?.[PROP.STATUS]?.select?.name || '';
}

// ---------------------------------------------------------------------------
// GitHub helpers
// ---------------------------------------------------------------------------

async function fetchGitHubIssue(owner, repo, number) {
  const result = await githubFetch(`/repos/${owner}/${repo}/issues/${number}`);
  return result?.data || null;
}

async function fetchRecentIssues(owner, repo) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const issues = [];
  let url = `/repos/${owner}/${repo}/issues?state=all&since=${since}&per_page=100&sort=updated&direction=desc`;

  while (url) {
    const result = await githubFetch(url);
    if (!result) break;
    for (const issue of result.data) {
      if (issue.pull_request) continue;
      issues.push(issue);
    }
    url = parseLinkNext(result.link);
  }
  return issues;
}

function parseLinkNext(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

function derivePriority(issue) {
  const labels = (issue.labels || []).map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());
  for (const [pattern, priority] of Object.entries(LABEL_TO_PRIORITY)) {
    if (labels.includes(pattern)) return priority;
  }
  return 'Medium';
}

function deriveTags(issue) {
  const exclude = new Set(Object.keys(LABEL_TO_PRIORITY));
  return (issue.labels || [])
    .map((l) => (typeof l === 'string' ? l : l.name))
    .filter((name) => !exclude.has(name.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Sync: Notion -> GitHub (verify existing tracked tasks)
// ---------------------------------------------------------------------------

async function syncExistingTasks(taskIndex) {
  let checked = 0;
  let updated = 0;
  let stale = 0;

  for (const [extId, page] of taskIndex) {
    const parsed = parseExternalId(extId);
    if (!parsed) {
      console.warn(`  [WARN] Malformed External ID: "${extId}" — skipping`);
      continue;
    }

    checked++;
    const issue = await fetchGitHubIssue(parsed.owner, parsed.repo, parsed.number);

    if (!issue) {
      console.warn(`  [WARN] GitHub issue not found: ${extId} — marking stale`);
      stale++;
      continue;
    }

    const ghState = issue.state;
    const expectedStatus = GITHUB_STATE_TO_NOTION_STATUS[ghState] || 'In Progress';
    const currentStatus = getNotionStatus(page);

    if (currentStatus !== expectedStatus) {
      await notionFetch(`/pages/${page.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          properties: {
            [PROP.STATUS]: { select: { name: expectedStatus } },
          },
        }),
      });
      updated++;
      console.log(`  [UPDATE] ${extId}: Status "${currentStatus}" -> "${expectedStatus}"`);
    }
  }

  console.log(`  Existing tasks: checked=${checked}, updated=${updated}, stale=${stale}`);
  return { checked, updated, stale };
}

// ---------------------------------------------------------------------------
// Sync: GitHub -> Notion (discover new issues, update changed ones)
// ---------------------------------------------------------------------------

async function syncNewAndChangedIssues(taskIndex) {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const repo of TARGET_REPOS) {
    console.log(`  Scanning ${GITHUB_OWNER}/${repo}...`);
    const issues = await fetchRecentIssues(GITHUB_OWNER, repo);
    console.log(`    Found ${issues.length} recent issues`);

    for (const issue of issues) {
      const extId = makeExternalId(GITHUB_OWNER, repo, issue.number);
      const existingPage = taskIndex.get(extId);

      if (existingPage) {
        const ghState = issue.state;
        const expectedStatus = GITHUB_STATE_TO_NOTION_STATUS[ghState] || 'In Progress';
        const currentStatus = getNotionStatus(existingPage);

        if (currentStatus !== expectedStatus) {
          await notionFetch(`/pages/${existingPage.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              properties: {
                [PROP.STATUS]: { select: { name: expectedStatus } },
                [PROP.URL]:    { url: issue.html_url },
              },
            }),
          });
          updated++;
          console.log(`    [UPDATE] ${extId}: "${currentStatus}" -> "${expectedStatus}"`);
        } else {
          skipped++;
        }
      } else {
        const properties = buildNewTaskProperties(issue, repo);
        await notionFetch('/pages', {
          method: 'POST',
          body: JSON.stringify({
            parent: { database_id: notionDbId },
            properties,
          }),
        });
        created++;
        taskIndex.set(extId, { id: 'new' });
        console.log(`    [CREATE] ${extId}: "${issue.title}"`);
      }
    }
  }

  console.log(`  GitHub scan: created=${created}, updated=${updated}, skipped=${skipped}`);
  return { created, updated, skipped };
}

function buildNewTaskProperties(issue, repo) {
  const extId = makeExternalId(GITHUB_OWNER, repo, issue.number);
  const ghState = issue.state;
  const status = GITHUB_STATE_TO_NOTION_STATUS[ghState] || 'In Progress';
  const priority = derivePriority(issue);
  const tags = deriveTags(issue);
  const domain = REPO_TO_DOMAIN[repo] || 'Personal';

  const properties = {
    [PROP.TASK_NAME]: {
      title: [{ text: { content: issue.title.slice(0, 2000) } }],
    },
    [PROP.STATUS]: {
      select: { name: status },
    },
    [PROP.PRIORITY]: {
      select: { name: priority },
    },
    [PROP.SOURCE]: {
      select: { name: 'GitHub' },
    },
    [PROP.EXTERNAL_ID]: {
      rich_text: [{ text: { content: extId } }],
    },
    [PROP.URL]: {
      url: issue.html_url,
    },
    [PROP.ACTION_REQ]: {
      checkbox: ghState === 'open',
    },
  };

  if (domain) {
    properties[PROP.DOMAIN] = { select: { name: domain } };
  }

  if (tags.length > 0) {
    properties[PROP.TAGS] = {
      multi_select: tags.map((t) => ({ name: t })),
    };
  }

  if (issue.milestone?.due_on) {
    properties[PROP.DUE_DATE] = {
      date: { start: issue.milestone.due_on.split('T')[0] },
    };
  }

  return properties;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now();
  console.log(`task-sync: starting at ${new Date().toISOString()}`);
  console.log(`  Target repos: ${TARGET_REPOS.join(', ')}`);
  console.log();

  // Step 1: Load all existing GitHub-sourced tasks from Notion
  console.log('[1/3] Loading existing GitHub tasks from Notion...');
  const existingPages = await getAllGitHubTasks();
  const taskIndex = buildExternalIdIndex(existingPages);
  console.log(`  Found ${existingPages.length} Notion pages with Source=GitHub (${taskIndex.size} with External ID)`);
  console.log();

  // Step 2: Verify existing tasks against GitHub
  console.log('[2/3] Verifying existing tasks against GitHub...');
  const existingStats = await syncExistingTasks(taskIndex);
  console.log();

  // Step 3: Scan GitHub for new/changed issues
  console.log('[3/3] Scanning GitHub repos for recent issues...');
  const scanStats = await syncNewAndChangedIssues(taskIndex);
  console.log();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`task-sync complete in ${elapsed}s`);
  console.log(`  Summary: existing_checked=${existingStats.checked}, existing_updated=${existingStats.updated}, stale=${existingStats.stale}`);
  console.log(`           new_created=${scanStats.created}, scan_updated=${scanStats.updated}, scan_skipped=${scanStats.skipped}`);
}

main().catch((err) => {
  console.error('task-sync FATAL:', err.message || err);
  process.exit(1);
});
