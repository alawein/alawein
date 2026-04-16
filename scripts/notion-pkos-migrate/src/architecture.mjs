export const NOTION_VERSION = '2026-03-11';
export const TITLE_PROPERTY_NAME = 'Name';
export const COMMON_PROPERTY_NAMES = Object.freeze({
  recordId: 'Record ID',
  kind: 'Kind',
  sourceFile: 'Source File',
  legacyNotionId: 'Legacy Notion ID',
  legacyUrl: 'Legacy URL',
  linksJson: 'Links JSON',
  metadataJson: 'Metadata JSON',
});

export const DATABASE_CONFIGS = Object.freeze([
  {
    key: 'assets',
    kind: 'asset',
    directory: 'assets',
    schemaFile: 'asset.yaml',
    title: 'Assets',
    icon: '🧰',
    templateSections: [
      'Purpose',
      'Location / Invocation',
      'Usage Notes',
      'Related Projects / Plans',
      'Maintenance Notes',
    ],
    fieldOverrides: {
      asset_type: { type: 'select', name: 'Asset Type' },
      scope: { type: 'select', name: 'Scope' },
      location: { type: 'rich_text', name: 'Location' },
      invocation: { type: 'rich_text', name: 'Invocation' },
      count: { type: 'number', name: 'Count' },
    },
    statusGroups: {
      inProgress: ['active', 'evaluating'],
      complete: ['deprecated', 'archived'],
    },
    relationProperties: [
      { name: 'Projects', target: 'projects', syncedPropertyName: 'Assets' },
    ],
  },
  {
    key: 'decisions',
    kind: 'decision',
    directory: 'decisions',
    schemaFile: 'decision.yaml',
    title: 'Decisions',
    icon: '⚖️',
    templateSections: [
      'Context',
      'Options Considered',
      'Decision',
      'Consequences',
      'Follow-up',
    ],
    fieldOverrides: {
      context: { type: 'rich_text', name: 'Context' },
      decision: { type: 'rich_text', name: 'Decision' },
      superseded_by: { type: 'rich_text', name: 'Superseded By' },
    },
    statusGroups: {
      todo: ['proposed'],
      complete: ['accepted', 'deprecated', 'superseded'],
    },
    relationProperties: [
      { name: 'Projects', target: 'projects', syncedPropertyName: 'Decisions' },
      { name: 'Plans', target: 'plans', syncedPropertyName: 'Decisions' },
    ],
  },
  {
    key: 'drafts',
    kind: 'draft',
    directory: 'drafts',
    schemaFile: 'draft.yaml',
    title: 'Drafts',
    icon: '✍️',
    templateSections: [
      'Audience',
      'Goal',
      'Draft Body',
      'Review Notes',
      'Next Revision',
    ],
    fieldOverrides: {
      channel: { type: 'select', name: 'Channel' },
      task_id: { type: 'rich_text', name: 'Task ID' },
      audience: { type: 'rich_text', name: 'Audience' },
      publish_target: { type: 'rich_text', name: 'Publish Target' },
      requested_by: { type: 'rich_text', name: 'Requested By' },
      stakeholders: { type: 'rich_text', name: 'Stakeholders' },
      ops_deadline: { type: 'date', name: 'Ops Deadline' },
      subject: { type: 'rich_text', name: 'Subject' },
      to: { type: 'rich_text', name: 'To' },
      cc: { type: 'rich_text', name: 'Cc' },
      bcc: { type: 'rich_text', name: 'Bcc' },
      thread_id: { type: 'rich_text', name: 'Thread ID' },
      body_source: { type: 'select', name: 'Body Source' },
      content_hash: { type: 'rich_text', name: 'Content Hash' },
      sources: { type: 'rich_text', name: 'Sources' },
      generated_from: { type: 'rich_text', name: 'Generated From' },
      remote_draft_id: { type: 'rich_text', name: 'Remote Draft ID' },
      source_url: { type: 'url', name: 'Source URL' },
      ai_summary: { type: 'rich_text', name: 'AI Summary' },
      ai_outline: { type: 'rich_text', name: 'AI Outline' },
      ai_title_suggestions: { type: 'rich_text', name: 'AI Title Suggestions' },
      sync_state: { type: 'select', name: 'Sync State' },
      field_ownership_version: { type: 'rich_text', name: 'Field Ownership Version' },
      last_write_system: { type: 'select', name: 'Last Write System' },
    },
    statusGroups: {
      todo: ['draft'],
      inProgress: ['review'],
      complete: ['approved', 'published', 'discarded'],
    },
    requireFullStatusGroups: true,
    relationProperties: [
      { name: 'Tasks', target: 'tasks', syncedPropertyName: 'Drafts' },
    ],
  },
  {
    key: 'inbox',
    kind: 'inbox',
    directory: 'inbox',
    schemaFile: 'inbox.yaml',
    title: 'Inbox',
    icon: '📥',
    templateSections: [
      'Source Context',
      'Triage Decision',
      'Converted Task',
      'Follow-up',
      'Notes',
    ],
    fieldOverrides: {
      source: { type: 'select', name: 'Source' },
      external_id: { type: 'rich_text', name: 'External ID' },
      received_at: { type: 'date', name: 'Received At' },
      priority: { type: 'select', name: 'Priority' },
      owner: { type: 'rich_text', name: 'Owner' },
      next_action: { type: 'rich_text', name: 'Next Action' },
      snooze_until: { type: 'date', name: 'Snooze Until' },
      ops_notes: { type: 'rich_text', name: 'Ops Notes' },
      sender: { type: 'rich_text', name: 'Sender' },
      sender_email: { type: 'rich_text', name: 'Sender Email' },
      repo: { type: 'rich_text', name: 'Repo' },
      github_ref: { type: 'rich_text', name: 'GitHub Ref' },
      github_state: { type: 'select', name: 'GitHub State' },
      item_type: { type: 'select', name: 'Item Type' },
      action: { type: 'select', name: 'Action' },
      canonical_url: { type: 'url', name: 'Canonical URL' },
      source_url: { type: 'url', name: 'Source URL' },
      last_seen_at: { type: 'date', name: 'Last Seen At' },
      snippet: { type: 'rich_text', name: 'Snippet' },
      summary: { type: 'rich_text', name: 'Summary' },
      suggested_actions: { type: 'rich_text', name: 'Suggested Actions' },
      suggested_tags: { type: 'multi_select', name: 'Suggested Tags' },
      linked_task: { type: 'rich_text', name: 'Linked Task' },
      fingerprint: { type: 'rich_text', name: 'Fingerprint' },
      sync_state: { type: 'select', name: 'Sync State' },
      field_ownership_version: { type: 'rich_text', name: 'Field Ownership Version' },
      last_write_system: { type: 'select', name: 'Last Write System' },
    },
    statusGroups: {
      todo: ['new', 'deferred'],
      inProgress: ['in_review'],
      complete: ['converted', 'ignored', 'archived'],
    },
    requireFullStatusGroups: true,
    relationProperties: [
      { name: 'Tasks', target: 'tasks', syncedPropertyName: 'Inbox' },
      { name: 'Drafts', target: 'drafts', syncedPropertyName: 'Inbox' },
    ],
  },
  {
    key: 'journal',
    kind: 'journal',
    directory: 'journal',
    schemaFile: 'journal.yaml',
    title: 'Journal',
    icon: '📓',
    templateSections: [
      'Date Summary',
      'Highlights',
      'Linked Work',
      'Next Steps',
    ],
    statusGroups: {
      inProgress: ['active'],
      complete: ['archived'],
    },
    fieldOverrides: {
      source: { type: 'rich_text', name: 'Source' },
    },
    relationProperties: [
      { name: 'Projects', target: 'projects', syncedPropertyName: 'Journal' },
      { name: 'Tasks', target: 'tasks', syncedPropertyName: 'Journal' },
    ],
  },
  {
    key: 'plans',
    kind: 'plan',
    directory: 'plans',
    schemaFile: 'plan.yaml',
    title: 'Plans',
    icon: '🗺️',
    templateSections: [
      'Requirements',
      'Phases',
      'Dependencies',
      'Risks',
      'Success Criteria',
    ],
    fieldOverrides: {
      plan_type: { type: 'select', name: 'Plan Type' },
      scope: { type: 'rich_text', name: 'Scope' },
      horizon: { type: 'select', name: 'Horizon' },
      affects: { type: 'rich_text', name: 'Affects' },
    },
    statusGroups: {
      todo: ['draft'],
      inProgress: ['active'],
      complete: ['completed', 'abandoned'],
    },
    requireFullStatusGroups: true,
    relationProperties: [
      { name: 'Projects', target: 'projects', syncedPropertyName: 'Plans' },
    ],
  },
  {
    key: 'profile',
    kind: 'profile',
    directory: 'profile',
    schemaFile: 'profile.yaml',
    title: 'Profile',
    icon: '👤',
    templateSections: [
      'Roles',
      'Domains',
      'Current Focus',
      'Key Links',
      'Notes',
    ],
    fieldOverrides: {
      full_name: { type: 'rich_text', name: 'Full Name' },
      role: { type: 'multi_select', name: 'Roles' },
      domains: { type: 'multi_select', name: 'Domains' },
      location: { type: 'rich_text', name: 'Location' },
      linkedin_url: { type: 'url', name: 'LinkedIn URL' },
      email: { type: 'rich_text', name: 'Email' },
      website: { type: 'url', name: 'Website' },
      current_focus: { type: 'rich_text', name: 'Current Focus' },
    },
    statusGroups: {
      inProgress: ['active'],
      complete: ['archived'],
    },
    relationProperties: [],
  },
  {
    key: 'projects',
    kind: 'project',
    directory: 'projects',
    schemaFile: 'project.yaml',
    title: 'Projects',
    icon: '🚀',
    templateSections: [
      'Overview',
      'Phase',
      'Linked Tasks / Plans / Assets / Decisions',
      'Milestones',
      'Notes',
    ],
    fieldOverrides: {
      one_liner: { type: 'rich_text', name: 'One Liner' },
      repo: { type: 'rich_text', name: 'Repo' },
      phase: { type: 'rich_text', name: 'Phase' },
      stack: { type: 'multi_select', name: 'Stack' },
      domain: { type: 'select', name: 'Domain' },
      priority: { type: 'select', name: 'Priority' },
      started: { type: 'date', name: 'Started' },
      last_activity: { type: 'rich_text', name: 'Last Activity' },
      type: { type: 'rich_text', name: 'Project Type' },
    },
    statusGroups: {
      todo: ['planning', 'paused'],
      inProgress: ['active', 'maintenance'],
      complete: ['completed', 'archived'],
    },
    requireFullStatusGroups: true,
    relationProperties: [],
  },
  {
    key: 'syncEvents',
    kind: 'sync-event',
    directory: 'sync-events',
    schemaFile: 'sync-event.yaml',
    title: 'Sync Events',
    icon: '🔁',
    templateSections: [],
    fieldOverrides: {
      object_kind: { type: 'select', name: 'Object Kind' },
      object_id: { type: 'rich_text', name: 'Object ID' },
      origin_system: { type: 'select', name: 'Origin System' },
      action: { type: 'select', name: 'Action' },
      occurred_at: { type: 'date', name: 'Occurred At' },
      target_system: { type: 'select', name: 'Target System' },
      run_id: { type: 'rich_text', name: 'Run ID' },
      fingerprint_before: { type: 'rich_text', name: 'Fingerprint Before' },
      fingerprint_after: { type: 'rich_text', name: 'Fingerprint After' },
      sync_state: { type: 'select', name: 'Sync State' },
      review_required: { type: 'checkbox', name: 'Review Required' },
      conflict_fields: { type: 'multi_select', name: 'Conflict Fields' },
      ownership_violation: { type: 'rich_text', name: 'Ownership Violation' },
      error: { type: 'rich_text', name: 'Error' },
      payload_ref: { type: 'rich_text', name: 'Payload Ref' },
    },
    statusGroups: {
      inProgress: ['conflict', 'error'],
      complete: ['applied', 'skipped'],
    },
    relationProperties: [],
  },
  {
    key: 'tasks',
    kind: 'task',
    directory: 'tasks',
    schemaFile: 'task.yaml',
    title: 'Tasks',
    icon: '✅',
    templateSections: [
      'Context',
      'Acceptance Criteria',
      'Blockers',
      'Next Action',
      'Worklog',
    ],
    fieldOverrides: {
      task_type: { type: 'select', name: 'Task Type' },
      priority: { type: 'select', name: 'Priority' },
      assignee: { type: 'rich_text', name: 'Assignee' },
      due_date: { type: 'date', name: 'Due Date' },
      due: { type: 'date', name: 'Due' },
      project_ref: { type: 'rich_text', name: 'Project Ref' },
      project: { type: 'rich_text', name: 'Project' },
      next_action: { type: 'rich_text', name: 'Next Action' },
      blocked_reason: { type: 'rich_text', name: 'Blocked Reason' },
      review_cadence: { type: 'rich_text', name: 'Review Cadence' },
      linked_inbox: { type: 'rich_text', name: 'Linked Inbox' },
      linked_draft: { type: 'rich_text', name: 'Linked Draft' },
      repo: { type: 'rich_text', name: 'Repo' },
      github_ref: { type: 'rich_text', name: 'GitHub Ref' },
      github_issue_url: { type: 'url', name: 'GitHub Issue URL' },
      github_state: { type: 'select', name: 'GitHub State' },
      task_spec: { type: 'rich_text', name: 'Task Spec' },
      acceptance_criteria: { type: 'rich_text', name: 'Acceptance Criteria' },
      local_worklog: { type: 'rich_text', name: 'Local Worklog' },
      ai_breakdown: { type: 'rich_text', name: 'AI Breakdown' },
      ai_risks: { type: 'rich_text', name: 'AI Risks' },
      ai_next_steps_suggestions: { type: 'rich_text', name: 'AI Next Steps Suggestions' },
      sync_state: { type: 'select', name: 'Sync State' },
      field_ownership_version: { type: 'rich_text', name: 'Field Ownership Version' },
      last_write_system: { type: 'select', name: 'Last Write System' },
    },
    statusGroups: {
      todo: ['backlog'],
      inProgress: ['active', 'blocked', 'waiting'],
      complete: ['done', 'cancelled'],
    },
    requireFullStatusGroups: true,
    relationProperties: [
      { name: 'Project', target: 'projects', syncedPropertyName: 'Tasks' },
    ],
  },
]);

export const DATABASE_CONFIG_BY_KEY = Object.freeze(
  Object.fromEntries(DATABASE_CONFIGS.map((config) => [config.key, config])),
);

export const HUB_DEFINITIONS = Object.freeze([
  {
    key: 'commandCenter',
    title: 'Command Center',
    icon: '🧭',
    description:
      'Operational dashboard for urgent work, active plans, and incident-level sync visibility.',
  },
  {
    key: 'personal',
    title: 'Personal',
    icon: '🏠',
    description:
      'Personal operating surface for profile context, journal entries, drafts, and personal projects.',
  },
  {
    key: 'work',
    title: 'Work',
    icon: '💼',
    description:
      'Work dashboard for active projects, plans, tasks, and operational assets.',
  },
  {
    key: 'operationsHub',
    title: 'Operations Hub',
    icon: '⚙️',
    description:
      'Canonical PKOS administration surface containing databases, admin views, templates, and incident tracking.',
  },
]);

export const TEMPLATE_LIBRARY_PAGE = Object.freeze({
  title: 'Template Library',
  icon: '🧱',
  description:
    'API-created template source pages for PKOS records. Notion does not yet provide a dedicated template-creation endpoint, so these pages act as reusable template sources.',
});

export const HUB_VIEW_DEFINITIONS = Object.freeze({
  commandCenter: [
    {
      databaseKey: 'inbox',
      name: 'Inbox Triage',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['new', 'in_review'] } },
      sorts: [{ property: 'Received At', direction: 'descending' }],
    },
    {
      databaseKey: 'tasks',
      name: 'Priority Tasks',
      type: 'table',
      filter: {
        and: [
          { property: 'Priority', select: { equals: ['P0', 'P1'] } },
          { property: 'Status', status: { does_not_equal: ['done', 'cancelled'] } },
        ],
      },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'projects',
      name: 'Active Projects',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['active', 'planning'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'plans',
      name: 'Active Plans',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['active'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'syncEvents',
      name: 'Sync Incidents',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['conflict', 'error'] } },
      sorts: [{ property: 'Occurred At', direction: 'descending' }],
    },
  ],
  personal: [
    {
      databaseKey: 'profile',
      name: 'Profile',
      type: 'table',
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'projects',
      name: 'Personal Projects',
      type: 'table',
      filter: { property: 'Domain', select: { equals: ['personal'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'tasks',
      name: 'Personal Tasks',
      type: 'table',
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'journal',
      name: 'Journal',
      type: 'table',
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'drafts',
      name: 'Drafts',
      type: 'table',
      filter: { property: 'Status', status: { does_not_equal: ['discarded'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
  ],
  work: [
    {
      databaseKey: 'projects',
      name: 'Work Projects',
      type: 'table',
      filter: {
        and: [
          { property: 'Domain', select: { does_not_equal: ['personal'] } },
          { property: 'Status', status: { equals: ['active', 'planning', 'maintenance'] } },
        ],
      },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'tasks',
      name: 'Open Tasks',
      type: 'table',
      filter: { property: 'Status', status: { does_not_equal: ['done', 'cancelled'] } },
      sorts: [{ property: 'Priority', direction: 'ascending' }],
    },
    {
      databaseKey: 'plans',
      name: 'Plans',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['active'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
    {
      databaseKey: 'assets',
      name: 'Operational Assets',
      type: 'table',
      filter: { property: 'Status', status: { equals: ['active', 'evaluating'] } },
      sorts: [{ property: 'Updated', direction: 'descending' }],
    },
  ],
  operationsHub: [],
});

export function buildOperationsHubAdminViews(databaseConfigs) {
  const adminViews = databaseConfigs.map((databaseConfig) => ({
    databaseKey: databaseConfig.key,
    name: `${databaseConfig.title} Admin`,
    type: 'table',
    sorts: [{ property: 'Updated', direction: 'descending' }],
  }));

  adminViews.push({
    databaseKey: 'syncEvents',
    name: 'Sync Events Incident Queue',
    type: 'table',
    filter: { property: 'Status', status: { equals: ['conflict', 'error'] } },
    sorts: [{ property: 'Occurred At', direction: 'descending' }],
  });

  return adminViews;
}

export function buildHubViewCollections(databaseConfigs) {
  return {
    commandCenter: HUB_VIEW_DEFINITIONS.commandCenter.filter((view) =>
      databaseConfigs.some((config) => config.key === view.databaseKey),
    ),
    personal: HUB_VIEW_DEFINITIONS.personal.filter((view) =>
      databaseConfigs.some((config) => config.key === view.databaseKey),
    ),
    work: HUB_VIEW_DEFINITIONS.work.filter((view) =>
      databaseConfigs.some((config) => config.key === view.databaseKey),
    ),
    operationsHub: buildOperationsHubAdminViews(databaseConfigs),
  };
}

export function flattenHubViewDefinitions(databaseConfigs) {
  return Object.entries(buildHubViewCollections(databaseConfigs)).flatMap(([hubKey, views]) =>
    views.map((view) => ({ ...view, hubKey })),
  );
}

export function scopeToDatabaseKey(value) {
  if (!value) return null;
  const normalized = value.replace(/[\s_-]+/g, '').toLowerCase();
  return (
    DATABASE_CONFIGS.find((config) => {
      const candidates = [
        config.key,
        config.kind,
        config.directory,
        config.title,
        config.title.replace(/s$/i, ''),
      ];
      return candidates.some(
        (candidate) => candidate.replace(/[\s_-]+/g, '').toLowerCase() === normalized,
      );
    })?.key ?? null
  );
}
