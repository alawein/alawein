import YAML from 'yaml';

function normalizeHeader(rawContent) {
  if (rawContent.startsWith('---type:')) {
    return `---\n${rawContent.slice(3)}`;
  }
  return rawContent;
}

function splitFirstColon(value) {
  const index = value.indexOf(':');
  if (index === -1) return [value, ''];
  return [value.slice(0, index), value.slice(index + 1)];
}

function parseInlineArray(value) {
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];
  const delimiter = inner.includes(',') ? /\s*,\s*/ : /\s+/;
  return inner
    .split(delimiter)
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (!value) return '';
  if (value.startsWith('[') && value.endsWith(']')) return parseInlineArray(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function parsePermissiveYaml(header) {
  const lines = header.replace(/\r\n/g, '\n').split('\n');
  const result = {};

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const topLevelMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!topLevelMatch) {
      index += 1;
      continue;
    }

    const [, key, rawValue] = topLevelMatch;
    if (rawValue.trim()) {
      result[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    const list = [];
    index += 1;
    while (index < lines.length) {
      const current = lines[index];
      if (!current.trim()) {
        index += 1;
        continue;
      }
      if (/^[A-Za-z0-9_-]+:\s*/.test(current)) break;
      const itemMatch = current.match(/^\s*-\s*(.*)$/);
      if (!itemMatch) {
        index += 1;
        continue;
      }

      const itemValue = itemMatch[1];
      if (itemValue.includes(':')) {
        const [itemKey, itemRest] = splitFirstColon(itemValue);
        const item = { [itemKey.trim()]: parseScalar(itemRest) };
        index += 1;
        while (index < lines.length) {
          const nested = lines[index];
          if (!nested.trim()) {
            index += 1;
            continue;
          }
          if (/^\s*-\s*/.test(nested) || /^[A-Za-z0-9_-]+:\s*/.test(nested)) break;
          const nestedMatch = nested.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
          if (nestedMatch) {
            item[nestedMatch[1]] = parseScalar(nestedMatch[2]);
          }
          index += 1;
        }
        list.push(item);
        continue;
      }

      list.push(parseScalar(itemValue));
      index += 1;
    }

    result[key] = list;
  }

  return result;
}

export function parseFrontmatterDocument(rawContent) {
  const normalized = normalizeHeader(rawContent);
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      data: {},
      body: normalized.trim(),
      rawFrontmatter: '',
      normalized,
    };
  }

  const [, header, body] = match;
  let data;
  try {
    data = YAML.parse(header) ?? {};
  } catch {
    data = parsePermissiveYaml(header);
  }

  return {
    data,
    body: body.trim(),
    rawFrontmatter: header,
    normalized,
  };
}
