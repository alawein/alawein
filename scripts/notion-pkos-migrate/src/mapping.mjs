import {
  COMMON_PROPERTY_NAMES,
  TITLE_PROPERTY_NAME,
} from './architecture.mjs';
import {
  compactObject,
  isIsoDateLike,
  maybeUrl,
  richText,
  sanitizeOptionName,
  toTitleCase,
} from './utils.mjs';

const GLOBAL_MULTI_SELECT_FIELDS = new Set([
  'tags',
  'domains',
  'role',
  'stack',
  'conflict_fields',
  'suggested_tags',
]);

const GLOBAL_RICH_TEXT_FIELDS = new Set([
  'id',
  'phase',
  'task_type',
  'asset_type',
  'scope',
  'external_id',
  'object_kind',
  'object_id',
  'repo',
  'github_ref',
  'next_action',
  'blocked_reason',
  'summary',
  'one_liner',
  'location',
  'invocation',
]);

const COMMON_FIELD_EXCLUDES = new Set(['links', 'notion_page_id']);

function optionObjects(values) {
  return values.map((name) => ({ name: sanitizeOptionName(name) }));
}

function statusOptionsFromGroups(statusGroups) {
  return ['todo', 'inProgress', 'complete'].flatMap((groupKey) => statusGroups?.[groupKey] || []);
}

const STATUS_GROUP_META = Object.freeze({
  todo: { id: 'group-todo', name: 'To-do', color: 'gray' },
  inProgress: { id: 'group-progress', name: 'In progress', color: 'blue' },
  complete: { id: 'group-complete', name: 'Complete', color: 'green' },
});

function buildStatusGroups(options, statusGroups) {
  const normalized = options.map((name) => ({
    id: `status-${sanitizeOptionName(name).toLowerCase().replace(/\s+/g, '-')}`,
    name,
  }));

  const optionIdByName = new Map(normalized.map((item) => [item.name, item.id]));
  const groups = Object.entries(statusGroups || {}).flatMap(([groupKey, optionNames]) => {
    const meta = STATUS_GROUP_META[groupKey];
    if (!meta || !optionNames?.length) return [];
    return [
      {
        id: meta.id,
        name: meta.name,
        color: meta.color,
        option_ids: optionNames.map((name) => optionIdByName.get(name)),
      },
    ];
  });

  return { groups, normalized };
}

function defaultFieldType(fieldName, value) {
  if (fieldName === 'name') return 'title';
  if (fieldName === 'status') return 'status';
  if (GLOBAL_MULTI_SELECT_FIELDS.has(fieldName)) return 'multi_select';
  if (GLOBAL_RICH_TEXT_FIELDS.has(fieldName)) return 'rich_text';
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'rich_text';
  if (maybeUrl(value) || /(_url|website)$/i.test(fieldName)) return 'url';
  if (
    isIsoDateLike(value) ||
    /(created|updated|started|date|deadline|occurred_at|received_at|seen_at|snooze)/i.test(fieldName)
  ) {
    return 'date';
  }
  return 'rich_text';
}

function buildPropertySchema(fieldName, type, options, config = {}) {
  if (type === 'title') return { title: {} };
  if (type === 'rich_text') return { rich_text: {} };
  if (type === 'url') return { url: {} };
  if (type === 'date') return { date: {} };
  if (type === 'checkbox') return { checkbox: {} };
  if (type === 'number') return { number: { format: 'number' } };
  if (type === 'select') {
    return { select: options?.length ? { options: optionObjects(options) } : {} };
  }
  if (type === 'multi_select') {
    return { multi_select: options?.length ? { options: optionObjects(options) } : {} };
  }
  if (type === 'status') {
    if (!options?.length) return { status: {} };
    const { groups, normalized } = buildStatusGroups(options, config.statusGroups);
    const completeNames = new Set(config.statusGroups?.complete || []);
    const inProgressNames = new Set(config.statusGroups?.inProgress || []);
    return {
      status: {
        options: normalized.map(({ id, name }) => ({
          id,
          name,
          color: completeNames.has(name)
            ? 'green'
            : inProgressNames.has(name)
              ? 'blue'
              : 'default',
        })),
        groups,
      },
    };
  }
  throw new Error(`Unsupported property schema type '${type}' for ${fieldName}`);
}

function buildPropertyValue(type, value) {
  if (value === undefined || value === null || value === '') return null;
  if (type === 'title') return { title: richText(value) };
  if (type === 'rich_text') {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    return { rich_text: richText(stringValue) };
  }
  if (type === 'url') return maybeUrl(value) ? { url: value } : null;
  if (type === 'date') {
    if (!isIsoDateLike(String(value))) return null;
    return { date: { start: String(value) } };
  }
  if (type === 'checkbox') return { checkbox: Boolean(value) };
  if (type === 'number') return { number: Number(value) };
  if (type === 'select') return { select: { name: sanitizeOptionName(value) } };
  if (type === 'multi_select') {
    const values = Array.isArray(value) ? value : [value];
    return { multi_select: values.filter(Boolean).map((entry) => ({ name: sanitizeOptionName(entry) })) };
  }
  if (type === 'status') return { status: { name: sanitizeOptionName(value) } };
  if (type === 'relation') {
    const relationValues = Array.isArray(value) ? value : [value];
    return { relation: relationValues.filter(Boolean).map((id) => ({ id })) };
  }
  return null;
}

export function buildDatabasePlan(databaseConfig, schemaDefinition) {
  const fieldSpecs = new Map();
  const propertySpecs = new Map();
  const properties = {
    [TITLE_PROPERTY_NAME]: { title: {} },
    [COMMON_PROPERTY_NAMES.recordId]: { rich_text: {} },
    [COMMON_PROPERTY_NAMES.kind]: { rich_text: {} },
    [COMMON_PROPERTY_NAMES.sourceFile]: { rich_text: {} },
    [COMMON_PROPERTY_NAMES.legacyNotionId]: { rich_text: {} },
    [COMMON_PROPERTY_NAMES.legacyUrl]: { url: {} },
    [COMMON_PROPERTY_NAMES.linksJson]: { rich_text: {} },
    [COMMON_PROPERTY_NAMES.metadataJson]: { rich_text: {} },
  };

  fieldSpecs.set('name', { propertyName: TITLE_PROPERTY_NAME, type: 'title' });
  fieldSpecs.set('id', { propertyName: COMMON_PROPERTY_NAMES.recordId, type: 'rich_text' });
  fieldSpecs.set('kind', { propertyName: COMMON_PROPERTY_NAMES.kind, type: 'rich_text' });
  fieldSpecs.set('notion_page_id', { propertyName: COMMON_PROPERTY_NAMES.legacyNotionId, type: 'rich_text' });
  fieldSpecs.set('__sourceFile', { propertyName: COMMON_PROPERTY_NAMES.sourceFile, type: 'rich_text' });
  fieldSpecs.set('__legacyUrl', { propertyName: COMMON_PROPERTY_NAMES.legacyUrl, type: 'url' });
  fieldSpecs.set('links', { propertyName: COMMON_PROPERTY_NAMES.linksJson, type: 'rich_text' });
  fieldSpecs.set('__metadataJson', { propertyName: COMMON_PROPERTY_NAMES.metadataJson, type: 'rich_text' });
  propertySpecs.set(TITLE_PROPERTY_NAME, { fieldName: 'name', propertyName: TITLE_PROPERTY_NAME, type: 'title' });
  propertySpecs.set(COMMON_PROPERTY_NAMES.recordId, {
    fieldName: 'id',
    propertyName: COMMON_PROPERTY_NAMES.recordId,
    type: 'rich_text',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.kind, {
    fieldName: 'kind',
    propertyName: COMMON_PROPERTY_NAMES.kind,
    type: 'rich_text',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.sourceFile, {
    fieldName: '__sourceFile',
    propertyName: COMMON_PROPERTY_NAMES.sourceFile,
    type: 'rich_text',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.legacyNotionId, {
    fieldName: 'notion_page_id',
    propertyName: COMMON_PROPERTY_NAMES.legacyNotionId,
    type: 'rich_text',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.legacyUrl, {
    fieldName: '__legacyUrl',
    propertyName: COMMON_PROPERTY_NAMES.legacyUrl,
    type: 'url',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.linksJson, {
    fieldName: 'links',
    propertyName: COMMON_PROPERTY_NAMES.linksJson,
    type: 'rich_text',
  });
  propertySpecs.set(COMMON_PROPERTY_NAMES.metadataJson, {
    fieldName: '__metadataJson',
    propertyName: COMMON_PROPERTY_NAMES.metadataJson,
    type: 'rich_text',
  });

  const schemaFields = [...(schemaDefinition.required || []), ...(schemaDefinition.optional || [])];
  for (const fieldName of schemaFields) {
    if (COMMON_FIELD_EXCLUDES.has(fieldName) || fieldName === 'name' || fieldName === 'id' || fieldName === 'kind') {
      continue;
    }
    const override = databaseConfig.fieldOverrides?.[fieldName];
    const vocabulary = schemaDefinition[`${fieldName}_vocabulary`];
    const inferredType = override?.type ?? defaultFieldType(fieldName, null);
    const propertyName = override?.name ?? toTitleCase(fieldName);
    const effectiveOptions =
      inferredType === 'status' && (!vocabulary || vocabulary.length === 0)
        ? statusOptionsFromGroups(databaseConfig.statusGroups)
        : vocabulary;
    properties[propertyName] = buildPropertySchema(fieldName, inferredType, effectiveOptions, {
      statusGroups: fieldName === 'status' ? databaseConfig.statusGroups : undefined,
    });
    fieldSpecs.set(fieldName, { propertyName, type: inferredType });
    propertySpecs.set(propertyName, {
      fieldName,
      propertyName,
      type: inferredType,
      options: effectiveOptions ? [...effectiveOptions] : [],
    });
  }

  return {
    databaseConfig,
    schemaDefinition,
    properties,
    fieldSpecs,
    propertySpecs,
    relationProperties: databaseConfig.relationProperties ?? [],
  };
}

export function buildPropertiesForRecord(record, databasePlan, extraContext = {}) {
  const metadata = {};
  const properties = {
    [TITLE_PROPERTY_NAME]: buildPropertyValue('title', record.name),
    [COMMON_PROPERTY_NAMES.recordId]: buildPropertyValue('rich_text', record.id),
    [COMMON_PROPERTY_NAMES.kind]: buildPropertyValue('rich_text', record.kind),
    [COMMON_PROPERTY_NAMES.sourceFile]: buildPropertyValue('rich_text', record.relativePath),
  };

  if (record.frontmatter.notion_page_id) {
    properties[COMMON_PROPERTY_NAMES.legacyNotionId] = buildPropertyValue(
      'rich_text',
      record.frontmatter.notion_page_id,
    );
  }

  if (extraContext.legacyUrl) {
    properties[COMMON_PROPERTY_NAMES.legacyUrl] = buildPropertyValue('url', extraContext.legacyUrl);
  }

  if (record.frontmatter.links) {
    properties[COMMON_PROPERTY_NAMES.linksJson] = buildPropertyValue(
      'rich_text',
      JSON.stringify(record.frontmatter.links),
    );
  }

  for (const [fieldName, value] of Object.entries(record.frontmatter)) {
    if (COMMON_FIELD_EXCLUDES.has(fieldName) || fieldName === 'name' || fieldName === 'id' || fieldName === 'kind') {
      continue;
    }
    const spec = databasePlan.fieldSpecs.get(fieldName);
    if (!spec) {
      metadata[fieldName] = value;
      continue;
    }
    const notionValue = buildPropertyValue(spec.type, value);
    if (notionValue) {
      properties[spec.propertyName] = notionValue;
    } else {
      metadata[fieldName] = value;
    }
  }

  if (Object.keys(metadata).length > 0) {
    properties[COMMON_PROPERTY_NAMES.metadataJson] = buildPropertyValue(
      'rich_text',
      JSON.stringify(metadata),
    );
  }

  return compactObject(properties);
}

export function buildRelationUpdatePayload(propertyName, pageIds) {
  return {
    [propertyName]: buildPropertyValue('relation', pageIds),
  };
}

export function buildTemplatePageBlocks(databaseConfig) {
  const intro = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: richText(
          `Reusable source template for ${databaseConfig.title}. Notion does not currently provide a dedicated API for creating database templates, so this page acts as a template source page.`,
        ),
      },
    },
  ];

  const sections = databaseConfig.templateSections.flatMap((section) => [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: richText(section) },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: richText(`Populate ${section.toLowerCase()} here.`),
      },
    },
  ]);

  return [...intro, ...sections];
}
