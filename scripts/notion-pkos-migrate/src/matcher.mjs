import { normalizeNotionId, stripDashesFromUuid } from './utils.mjs';

const NOTION_URL_PATTERN = /https:\/\/(?:www\.)?notion\.so\/[^\s)\]]+/g;

export function extractLegacyResourcesFromText(path, text) {
  if (!text) return [];
  const matches = text.match(NOTION_URL_PATTERN) ?? [];
  return matches.map((url, index) => {
    const idMatch = url.match(/([a-fA-F0-9]{32})(?:[?#]|$)/);
    return {
      object: 'source_file_reference',
      id: idMatch ? normalizeNotionId(idMatch[1]) : null,
      url,
      title: `Source reference ${index + 1}`,
      source: path,
      databaseTitle: null,
    };
  });
}

export function buildLegacyIndex(liveResources = [], sourceFileResources = []) {
  const resources = [...liveResources, ...sourceFileResources];
  const byId = new Map();
  const byTitle = new Map();

  for (const resource of resources) {
    if (resource.id) {
      const normalizedId = normalizeNotionId(resource.id);
      byId.set(normalizedId, resource);
      byId.set(stripDashesFromUuid(normalizedId), resource);
    }
    if (resource.title) {
      const titleKey = resource.title.trim().toLowerCase();
      if (!byTitle.has(titleKey)) byTitle.set(titleKey, []);
      byTitle.get(titleKey).push(resource);
    }
  }

  return { resources, byId, byTitle };
}

function scoreTitleCandidates(record, titleMatches) {
  if (!titleMatches?.length) return null;
  const exactDatabase = titleMatches.find(
    (candidate) =>
      candidate.databaseTitle?.toLowerCase() === record.databaseTitle.toLowerCase(),
  );
  if (exactDatabase) {
    return { resource: exactDatabase, strategy: 'database+title', confidence: 0.92 };
  }
  return { resource: titleMatches[0], strategy: 'title', confidence: 0.65 };
}

export function matchLegacyResource(record, legacyIndex) {
  const explicitId = normalizeNotionId(record.frontmatter.notion_page_id);
  if (explicitId && legacyIndex.byId.has(explicitId)) {
    return {
      resource: legacyIndex.byId.get(explicitId),
      strategy: 'explicit_notion_page_id',
      confidence: 1,
    };
  }

  const titleMatch = scoreTitleCandidates(
    record,
    legacyIndex.byTitle.get(record.name.trim().toLowerCase()),
  );
  if (titleMatch) {
    return titleMatch;
  }

  if (record.frontmatter.repo) {
    const repoText = String(record.frontmatter.repo).toLowerCase();
    const repoCandidate = legacyIndex.resources.find(
      (resource) =>
        resource.url?.toLowerCase().includes(repoText) ||
        resource.title?.toLowerCase().includes(record.id.toLowerCase()),
    );
    if (repoCandidate) {
      return { resource: repoCandidate, strategy: 'repo_heuristic', confidence: 0.5 };
    }
  }

  const slugCandidate = legacyIndex.resources.find(
    (resource) =>
      resource.url?.toLowerCase().includes(record.id.toLowerCase()) ||
      resource.title?.toLowerCase().includes(record.id.toLowerCase()),
  );
  if (slugCandidate) {
    return { resource: slugCandidate, strategy: 'slug_heuristic', confidence: 0.45 };
  }

  return null;
}

export function buildUrlMap(records, legacyIndex) {
  const mappings = {};
  const details = [];
  const matchedIds = new Set();

  for (const record of records) {
    const match = matchLegacyResource(record, legacyIndex);
    if (!match?.resource?.url) continue;
    mappings[match.resource.url] = null;
    details.push({
      recordKey: record.globalKey,
      old_url: match.resource.url,
      new_url: null,
      match_strategy: match.strategy,
      confidence: match.confidence,
      legacy_id: match.resource.id,
    });
    if (match.resource.id) matchedIds.add(normalizeNotionId(match.resource.id));
  }

  return { mappings, details, matchedIds };
}

export function buildUnmatchedLegacyResources(legacyIndex, matchedIds) {
  return legacyIndex.resources.filter((resource) => {
    if (!resource.id) return true;
    return !matchedIds.has(normalizeNotionId(resource.id));
  });
}
