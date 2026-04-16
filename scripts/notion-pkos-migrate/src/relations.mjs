import { DATABASE_CONFIG_BY_KEY } from './architecture.mjs';

function coerceArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function extractLinkedIds(links, kind) {
  return coerceArray(links)
    .filter((link) => link && typeof link === 'object' && link.kind === kind && link.id)
    .map((link) => link.id);
}

function firstTruthy(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function uniqueTargets(values) {
  return [...new Set(values.filter(Boolean))];
}

function relationTargetsForRecord(record) {
  const links = record.frontmatter.links;
  switch (record.databaseKey) {
    case 'tasks':
      return {
        Project: uniqueTargets([
          firstTruthy(record.frontmatter.project, record.frontmatter.project_ref),
          ...extractLinkedIds(links, 'project'),
        ]),
      };
    case 'plans':
      return {
        Projects: uniqueTargets([
          ...coerceArray(record.frontmatter.affects),
          ...extractLinkedIds(links, 'project'),
        ]),
      };
    case 'assets':
      return { Projects: uniqueTargets(extractLinkedIds(links, 'project')) };
    case 'decisions':
      return {
        Projects: uniqueTargets(extractLinkedIds(links, 'project')),
        Plans: uniqueTargets(extractLinkedIds(links, 'plan')),
      };
    case 'drafts':
      return {
        Tasks: uniqueTargets([record.frontmatter.task_id, ...extractLinkedIds(links, 'task')]),
      };
    case 'inbox':
      return {
        Tasks: uniqueTargets([record.frontmatter.linked_task, ...extractLinkedIds(links, 'task')]),
        Drafts: uniqueTargets([record.frontmatter.linked_draft, ...extractLinkedIds(links, 'draft')]),
      };
    case 'journal':
      return {
        Projects: uniqueTargets(extractLinkedIds(links, 'project')),
        Tasks: uniqueTargets(extractLinkedIds(links, 'task')),
      };
    default:
      return {};
  }
}

export function buildRelationPlan(records) {
  const plan = new Map();

  for (const record of records) {
    const config = DATABASE_CONFIG_BY_KEY[record.databaseKey];
    if (!config || config.relationProperties.length === 0) continue;

    const propertyTargets = relationTargetsForRecord(record);
    const validProperties = new Set(config.relationProperties.map((property) => property.name));
    const filteredTargets = Object.fromEntries(
      Object.entries(propertyTargets).filter(
        ([propertyName, ids]) => validProperties.has(propertyName) && ids.length > 0,
      ),
    );

    if (Object.keys(filteredTargets).length > 0) {
      plan.set(record.globalKey, filteredTargets);
    }
  }

  return plan;
}
