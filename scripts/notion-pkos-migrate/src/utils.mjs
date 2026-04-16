import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '..');
const repoRoot = resolve(packageRoot, '..', '..');
const workspaceRoot = resolve(repoRoot, '..');
const knowledgeBaseRoot = resolve(workspaceRoot, 'knowledge-base');

export const RUNTIME_PATHS = Object.freeze({
  packageRoot,
  repoRoot,
  workspaceRoot,
  knowledgeBaseRoot,
  dbRoot: resolve(knowledgeBaseRoot, 'db'),
  schemaRoot: resolve(knowledgeBaseRoot, 'db', 'schema'),
  artifactRoot: resolve(repoRoot, 'catalog', 'generated', 'notion-migrations'),
});

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
  return path;
}

export function readTextIfExists(path) {
  if (!path || !existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

export function resolveOptionalInput(explicitPath, fallbackFileName) {
  if (explicitPath) return resolve(explicitPath);
  const candidates = [
    resolve(RUNTIME_PATHS.repoRoot, fallbackFileName),
    resolve(RUNTIME_PATHS.workspaceRoot, fallbackFileName),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export function createRunId(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return `${stamp}-${crypto.randomUUID().slice(0, 8)}`;
}

export function stableJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

export function writeJson(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, stableJson(value), 'utf8');
}

export function toTitleCase(value) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function normalizeNotionId(value) {
  if (!value || typeof value !== 'string') return null;
  const stripped = value.trim().replace(/-/g, '');
  if (!/^[a-fA-F0-9]{32}$/.test(stripped)) return null;
  return [
    stripped.slice(0, 8),
    stripped.slice(8, 12),
    stripped.slice(12, 16),
    stripped.slice(16, 20),
    stripped.slice(20),
  ].join('-');
}

export function stripDashesFromUuid(value) {
  return value?.replace(/-/g, '') ?? value;
}

export function chunkText(value, size = 1800) {
  if (!value) return [];
  const text = String(value);
  const parts = [];
  for (let index = 0; index < text.length; index += size) {
    parts.push(text.slice(index, index + size));
  }
  return parts;
}

export function isIsoDateLike(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value.trim());
}

export function sanitizeOptionName(value) {
  return String(value).replace(/,/g, ' - ').trim().slice(0, 100);
}

export function maybeUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function uniqueStrings(values) {
  return [...new Set((values || []).filter(Boolean))];
}

export function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export function createAsyncLimiter(limit) {
  const maxConcurrency = Math.max(1, limit);
  let activeCount = 0;
  const queue = [];

  const runNext = () => {
    if (activeCount >= maxConcurrency || queue.length === 0) return;
    const next = queue.shift();
    activeCount += 1;

    Promise.resolve()
      .then(next.task)
      .then(next.resolve, next.reject)
      .finally(() => {
        activeCount -= 1;
        runNext();
      });
  };

  return function limitTask(task) {
    return new Promise((resolvePromise, rejectPromise) => {
      queue.push({ task, resolve: resolvePromise, reject: rejectPromise });
      runNext();
    });
  };
}

export async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.max(1, limit) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

export function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, nested]) => nested !== undefined && nested !== null),
  );
}

export function richText(text) {
  return chunkText(text).map((content) => ({
    type: 'text',
    text: { content },
  }));
}
