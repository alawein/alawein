/**
 * daily-digest.mjs — Aggregate GitHub, Gmail, and Calendar into a Notion Inbox digest.
 *
 * Environment variables:
 *   NOTION_TOKEN        — Notion integration token (required)
 *   GITHUB_TOKEN        — GitHub personal access token (required)
 *   NOTION_INBOX_DB_ID  — Notion Inbox database ID (required)
 *
 * Gmail and Google Calendar integrations are stubbed — they require OAuth
 * credentials that cannot be provided in a CI environment. The stubs log a
 * warning and return empty results so the digest still runs with GitHub data.
 *
 * Usage:
 *   NOTION_TOKEN=<token> GITHUB_TOKEN=<token> NOTION_INBOX_DB_ID=<id> \
 *     node scripts/daily-digest.mjs
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NOTION_INBOX_DB_ID = process.env.NOTION_INBOX_DB_ID;

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const GITHUB_API = 'https://api.github.com';

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN environment variable.');
  process.exit(1);
}

if (!GITHUB_TOKEN) {
  console.error('Missing GITHUB_TOKEN environment variable.');
  process.exit(1);
}

if (!NOTION_INBOX_DB_ID) {
  console.error('Missing NOTION_INBOX_DB_ID environment variable.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayDate() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function last24hISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString();
}

async function notionFetch(path, options = {}) {
  const url = `${NOTION_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

async function githubFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${GITHUB_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Data sources
// ---------------------------------------------------------------------------

/**
 * Fetch GitHub notifications from the last 24 hours.
 * Returns an array of { repo, title, type, reason, url, updatedAt }.
 */
async function fetchGitHubNotifications() {
  const since = last24hISO();
  try {
    const notifications = await githubFetch(
      `/notifications?since=${encodeURIComponent(since)}&all=false&per_page=50`
    );

    return notifications.map((n) => ({
      repo: n.repository?.full_name || 'unknown',
      title: n.subject?.title || '(no title)',
      type: n.subject?.type || 'unknown',
      reason: n.reason || 'unknown',
      url: n.subject?.url || '',
      updatedAt: n.updated_at,
    }));
  } catch (err) {
    console.warn(`GitHub notifications fetch failed: ${err.message}`);
    return [];
  }
}

/**
 * Fetch recent GitHub events for the authenticated user (last 24h).
 * Returns summary counts by event type.
 */
async function fetchGitHubActivity() {
  try {
    const events = await githubFetch('/users/alawein/received_events?per_page=30');
    const cutoff = new Date(last24hISO());
    const recent = events.filter((e) => new Date(e.created_at) >= cutoff);

    const summary = {};
    for (const e of recent) {
      const type = e.type.replace('Event', '');
      summary[type] = (summary[type] || 0) + 1;
    }
    return summary;
  } catch (err) {
    console.warn(`GitHub activity fetch failed: ${err.message}`);
    return {};
  }
}

/**
 * Fetch open PRs and issues assigned to the user across alawein org.
 */
async function fetchGitHubActionItems() {
  const items = [];
  try {
    // PRs requesting review
    const reviewRequested = await githubFetch(
      '/search/issues?q=is:open+is:pr+review-requested:@me+org:alawein&per_page=10'
    );
    for (const pr of reviewRequested.items || []) {
      items.push({
        kind: 'PR review requested',
        title: pr.title,
        repo: pr.repository_url?.split('/').slice(-2).join('/') || '',
        url: pr.html_url,
      });
    }

    // Issues assigned to me
    const assigned = await githubFetch(
      '/search/issues?q=is:open+assignee:@me+org:alawein&per_page=10'
    );
    for (const issue of assigned.items || []) {
      items.push({
        kind: issue.pull_request ? 'PR assigned' : 'Issue assigned',
        title: issue.title,
        repo: issue.repository_url?.split('/').slice(-2).join('/') || '',
        url: issue.html_url,
      });
    }
  } catch (err) {
    console.warn(`GitHub action items fetch failed: ${err.message}`);
  }
  return items;
}

/**
 * Stub: Gmail integration requires OAuth setup.
 */
async function fetchGmailDigest() {
  console.warn(
    'Gmail integration requires OAuth setup — returning empty results. ' +
    'To enable, provide GMAIL_ACCESS_TOKEN and implement OAuth refresh.'
  );
  return { emails: [], actionItems: [] };
}

/**
 * Stub: Google Calendar integration requires OAuth setup.
 */
async function fetchCalendarEvents() {
  console.warn(
    'Google Calendar integration requires OAuth setup — returning empty results. ' +
    'To enable, provide GCAL_ACCESS_TOKEN and implement OAuth refresh.'
  );
  return [];
}

// ---------------------------------------------------------------------------
// Digest assembly
// ---------------------------------------------------------------------------

function buildDigestMarkdown({ date, actionItems, notifications, activitySummary, emails, calendarEvents }) {
  const lines = [];

  lines.push(`# Daily Digest - ${date}`);
  lines.push('');

  // --- Action Items ---
  lines.push('## Action Items');
  lines.push('');
  if (actionItems.length === 0) {
    lines.push('No action items from GitHub.');
  } else {
    for (const item of actionItems) {
      lines.push(`- **[${item.kind}]** ${item.title} (${item.repo})`);
    }
  }
  lines.push('');

  // --- Emails Needing Response ---
  lines.push('## Emails Needing Response');
  lines.push('');
  if (emails.length === 0) {
    lines.push('Gmail integration not configured. See script docs for OAuth setup.');
  } else {
    for (const email of emails) {
      lines.push(`- **${email.subject}** from ${email.from}`);
    }
  }
  lines.push('');

  // --- GitHub Activity ---
  lines.push('## GitHub Activity');
  lines.push('');
  if (notifications.length === 0 && Object.keys(activitySummary).length === 0) {
    lines.push('No GitHub activity in the last 24 hours.');
  } else {
    if (notifications.length > 0) {
      lines.push(`**${notifications.length} notification(s):**`);
      lines.push('');

      // Group by repo
      const byRepo = {};
      for (const n of notifications) {
        if (!byRepo[n.repo]) byRepo[n.repo] = [];
        byRepo[n.repo].push(n);
      }
      for (const [repo, items] of Object.entries(byRepo)) {
        lines.push(`**${repo}:**`);
        for (const item of items) {
          lines.push(`- [${item.type}] ${item.title} (${item.reason})`);
        }
        lines.push('');
      }
    }

    if (Object.keys(activitySummary).length > 0) {
      lines.push('**Event summary:**');
      for (const [type, count] of Object.entries(activitySummary)) {
        lines.push(`- ${type}: ${count}`);
      }
      lines.push('');
    }
  }

  // --- Today's Schedule ---
  lines.push("## Today's Schedule");
  lines.push('');
  if (calendarEvents.length === 0) {
    lines.push('Google Calendar integration not configured. See script docs for OAuth setup.');
  } else {
    for (const event of calendarEvents) {
      lines.push(`- ${event.time} ${event.summary}`);
    }
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Truncate text to fit within Notion rich_text limit (2000 chars).
 * Notion blocks can hold more, so we split into block children.
 */
function splitIntoBlocks(text, chunkSize = 1900) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    // Try to split at a newline near the boundary
    let end = Math.min(remaining.length, chunkSize);
    if (end < remaining.length) {
      const lastNewline = remaining.lastIndexOf('\n', end);
      if (lastNewline > chunkSize * 0.5) {
        end = lastNewline + 1;
      }
    }
    chunks.push(remaining.slice(0, end));
    remaining = remaining.slice(end);
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Notion page creation
// ---------------------------------------------------------------------------

async function createNotionDigestPage(date, digestMarkdown) {
  // Build paragraph blocks for the digest body
  const chunks = splitIntoBlocks(digestMarkdown);
  const children = chunks.map((chunk) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: chunk } }],
    },
  }));

  // Truncate the Notes property to 2000 chars (Notion rich_text property limit)
  const notesSummary = digestMarkdown.length > 2000
    ? digestMarkdown.slice(0, 1997) + '...'
    : digestMarkdown;

  const payload = {
    parent: { database_id: NOTION_INBOX_DB_ID },
    properties: {
      Item: {
        title: [{ text: { content: `Daily Digest ${date}` } }],
      },
      Status: {
        select: { name: 'To Do' },
      },
      Priority: {
        select: { name: 'Medium' },
      },
      Source: {
        rich_text: [{ text: { content: 'Claude Agent' } }],
      },
      Notes: {
        rich_text: [{ text: { content: notesSummary } }],
      },
    },
    children,
  };

  const page = await notionFetch('/pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return page;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const date = todayDate();
  console.log(`Building daily digest for ${date}...`);

  // Fetch all sources in parallel, with graceful degradation
  const [notifications, activitySummary, actionItems, gmailResult, calendarEvents] =
    await Promise.all([
      fetchGitHubNotifications(),
      fetchGitHubActivity(),
      fetchGitHubActionItems(),
      fetchGmailDigest(),
      fetchCalendarEvents(),
    ]);

  console.log(`  GitHub notifications: ${notifications.length}`);
  console.log(`  GitHub action items:  ${actionItems.length}`);
  console.log(`  Activity event types: ${Object.keys(activitySummary).length}`);
  console.log(`  Emails:               ${gmailResult.emails.length}`);
  console.log(`  Calendar events:      ${calendarEvents.length}`);

  const digestMarkdown = buildDigestMarkdown({
    date,
    actionItems,
    notifications,
    activitySummary,
    emails: gmailResult.emails,
    emailActionItems: gmailResult.actionItems,
    calendarEvents,
  });

  console.log('\n--- Digest Preview ---');
  console.log(digestMarkdown);
  console.log('--- End Preview ---\n');

  console.log('Creating Notion Inbox page...');
  const page = await createNotionDigestPage(date, digestMarkdown);
  console.log(`Notion page created: ${page.url || page.id}`);
  console.log('Daily digest complete.');
}

main().catch((err) => {
  console.error('Daily digest failed:', err.message || err);
  process.exit(1);
});
