import { Client } from '@notionhq/client';
import { createAsyncLimiter, normalizeNotionId, sleep } from './utils.mjs';

function extractTitle(result) {
  if (!result) return '';
  if (result.object === 'database') {
    return (result.title || []).map((item) => item.plain_text || '').join('').trim();
  }
  if (result.object === 'page') {
    const titleProperty = Object.values(result.properties || {}).find(
      (property) => property?.type === 'title',
    );
    return (titleProperty?.title || []).map((item) => item.plain_text || '').join('').trim();
  }
  return '';
}

export class NotionApi {
  constructor({
    token,
    notionVersion,
    fetchImpl = fetch,
    sleepImpl = sleep,
    randomImpl = Math.random,
    mutationConcurrency = 3,
  } = {}) {
    this.token = token;
    this.notionVersion = notionVersion;
    this.fetchImpl = fetchImpl;
    this.sleepImpl = sleepImpl;
    this.randomImpl = randomImpl;
    this.limitMutation = createAsyncLimiter(mutationConcurrency);
    this.client = token ? new Client({ auth: token, notionVersion }) : null;
  }

  get isAuthenticated() {
    return Boolean(this.token);
  }

  assertAuthenticated() {
    if (!this.isAuthenticated) {
      throw new Error('NOTION_TOKEN is required for this operation.');
    }
  }

  async request(path, { method = 'GET', query, body, retries = 4 } = {}) {
    this.assertAuthenticated();
    const url = new URL(path.startsWith('http') ? path : `https://api.notion.com/v1${path}`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    }

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const response = await this.fetchImpl(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (response.ok) {
        if (response.status === 204) return null;
        return response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < retries) {
        const retryAfterSeconds = Number(response.headers.get('retry-after'));
        const baseDelayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : 500 * (2 ** attempt);
        const jitterMs = Math.floor(this.randomImpl() * 250);
        const delayMs = Math.min(10000, Math.max(baseDelayMs, 500) + jitterMs);
        await this.sleepImpl(delayMs);
        continue;
      }

      const payload = await response.text();
      throw new Error(`Notion API ${response.status} ${method} ${url.pathname}: ${payload}`);
    }

    throw new Error(`Unreachable request retry loop for ${method} ${url.pathname}`);
  }

  async mutate(task) {
    return this.limitMutation(task);
  }

  async searchAllResources() {
    this.assertAuthenticated();
    let cursor = undefined;
    const resources = [];

    do {
      let payload;
      if (this.client?.search) {
        payload = await this.client.search({
          query: '',
          page_size: 100,
          start_cursor: cursor,
        });
      } else {
        payload = await this.request('/search', {
          method: 'POST',
          body: { query: '', page_size: 100, start_cursor: cursor },
        });
      }

      for (const result of payload.results || []) {
        resources.push({
          object: result.object,
          id: normalizeNotionId(result.id),
          url: result.url ?? null,
          title: extractTitle(result),
          databaseTitle: result.parent?.database_id ? result.parent.database_id : null,
          parent: result.parent ?? null,
        });
      }

      cursor = payload.has_more ? payload.next_cursor : undefined;
    } while (cursor);

    return resources;
  }

  async createPage({ parent, properties, children }) {
    this.assertAuthenticated();
    const normalizedProperties =
      parent?.type === 'page_id' && !properties.title
        ? {
            title:
              properties.Name?.title ??
              [{ type: 'text', text: { content: 'Untitled' } }],
          }
        : properties;
    const payload = { parent, properties: normalizedProperties };
    let response;

    if (this.client?.pages?.create) {
      response = await this.mutate(() => this.client.pages.create(payload));
    } else {
      response = await this.mutate(() => this.request('/pages', { method: 'POST', body: payload }));
    }

    if (children?.length) {
      await this.appendBlockChildren(response.id, children);
    }

    return response;
  }

  async updatePage(pageId, payload) {
    this.assertAuthenticated();
    if (this.client?.pages?.update) {
      return this.mutate(() => this.client.pages.update({ page_id: pageId, ...payload }));
    }
    return this.mutate(() => this.request(`/pages/${pageId}`, { method: 'PATCH', body: payload }));
  }

  async appendBlockChildren(blockId, children) {
    this.assertAuthenticated();
    for (let index = 0; index < children.length; index += 50) {
      const batch = children.slice(index, index + 50);
      if (this.client?.blocks?.children?.append) {
        await this.mutate(() =>
          this.client.blocks.children.append({
            block_id: blockId,
            children: batch,
          }),
        );
      } else {
        await this.mutate(() =>
          this.request(`/blocks/${blockId}/children`, {
            method: 'PATCH',
            body: { children: batch },
          }),
        );
      }
    }
  }

  async createDatabase({ parentPageId, title, icon, properties, description }) {
    return this.mutate(() =>
      this.request('/databases', {
        method: 'POST',
        body: {
          parent: { type: 'page_id', page_id: parentPageId },
          title: [{ type: 'text', text: { content: title } }],
          icon: icon ? { type: 'emoji', emoji: icon } : undefined,
          description: description
            ? [{ type: 'text', text: { content: description } }]
            : undefined,
          is_inline: false,
          initial_data_source: {
            properties,
          },
        },
      }),
    );
  }

  async updateDatabase(databaseId, payload) {
    return this.mutate(() =>
      this.request(`/databases/${databaseId}`, { method: 'PATCH', body: payload }),
    );
  }

  async updateDataSource(dataSourceId, payload) {
    return this.mutate(() =>
      this.request(`/data_sources/${dataSourceId}`, { method: 'PATCH', body: payload }),
    );
  }

  async retrieveDataSource(dataSourceId) {
    return this.request(`/data_sources/${dataSourceId}`);
  }

  async createView(payload) {
    if (this.client?.views?.create) {
      return this.mutate(() => this.client.views.create(payload));
    }
    return this.mutate(() => this.request('/views', { method: 'POST', body: payload }));
  }

  async retrieveView(viewId) {
    if (this.client?.views?.retrieve) {
      return this.client.views.retrieve({ view_id: viewId });
    }
    return this.request(`/views/${viewId}`);
  }

  async listViews({ databaseId, dataSourceId } = {}) {
    if (this.client?.views?.list) {
      return this.client.views.list({
        database_id: databaseId,
        data_source_id: dataSourceId,
      });
    }
    return this.request('/views', {
      query: {
        database_id: databaseId,
        data_source_id: dataSourceId,
      },
    });
  }

  async deleteView(viewId) {
    if (this.client?.views?.delete) {
      return this.mutate(() => this.client.views.delete({ view_id: viewId }));
    }
    return this.mutate(() => this.request(`/views/${viewId}`, { method: 'DELETE' }));
  }
}
