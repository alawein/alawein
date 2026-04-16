import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { DATABASE_CONFIGS } from './architecture.mjs';
import { parseFrontmatterDocument } from './frontmatter.mjs';
import { RUNTIME_PATHS } from './utils.mjs';

function parseSchemaFile(path) {
  return YAML.parse(readFileSync(path, 'utf8')) ?? {};
}

export function loadSchemas(databaseConfigs = DATABASE_CONFIGS, schemaRoot = RUNTIME_PATHS.schemaRoot) {
  return Object.fromEntries(
    databaseConfigs.map((databaseConfig) => [
      databaseConfig.key,
      parseSchemaFile(join(schemaRoot, databaseConfig.schemaFile)),
    ]),
  );
}

export function loadLocalRecords({
  databaseConfigs = DATABASE_CONFIGS,
  dbRoot = RUNTIME_PATHS.dbRoot,
}) {
  const recordsByDatabase = {};
  const allRecords = [];

  for (const databaseConfig of databaseConfigs) {
    const directory = join(dbRoot, databaseConfig.directory);
    const files = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
      .map((entry) => entry.name)
      .sort();

    recordsByDatabase[databaseConfig.key] = files.map((fileName) => {
      const absolutePath = join(directory, fileName);
      const source = readFileSync(absolutePath, 'utf8');
      const parsed = parseFrontmatterDocument(source);
      const frontmatter = parsed.data ?? {};
      const id = frontmatter.id ?? fileName.replace(/\.md$/i, '');
      const record = {
        databaseKey: databaseConfig.key,
        databaseTitle: databaseConfig.title,
        kind: databaseConfig.kind,
        id,
        name: frontmatter.name ?? id,
        sourcePath: absolutePath,
        relativePath: `${databaseConfig.directory}/${fileName}`,
        frontmatter,
        body: parsed.body,
        rawFrontmatter: parsed.rawFrontmatter,
        globalKey: `${databaseConfig.key}:${id}`,
      };
      allRecords.push(record);
      return record;
    });
  }

  return { recordsByDatabase, allRecords };
}
