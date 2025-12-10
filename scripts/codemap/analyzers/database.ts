/**
 * Database Analyzer - Analyzes SQL schema files
 */

import fs from 'fs';
import path from 'path';

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  primaryKey?: string;
  foreignKeys: ForeignKeyInfo[];
  indexes: string[];
  rlsPolicies: string[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  references?: string;
}

export interface ForeignKeyInfo {
  column: string;
  references: {
    table: string;
    column: string;
  };
  onDelete?: string;
}

export interface SchemaInfo {
  name: string;
  path: string;
  tables: TableInfo[];
}

export interface DatabaseAnalysis {
  schemas: SchemaInfo[];
  stats: {
    totalTables: number;
    totalColumns: number;
    totalForeignKeys: number;
    totalRlsPolicies: number;
  };
}

export class DatabaseAnalyzer {
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  analyze(): DatabaseAnalysis {
    const schemas: SchemaInfo[] = [];

    // Find all SQL files
    const sqlFiles = this.findSqlFiles(this.rootDir);

    for (const sqlFile of sqlFiles) {
      const content = fs.readFileSync(sqlFile, 'utf-8');
      const tables = this.parseSqlFile(content);

      if (tables.length > 0) {
        schemas.push({
          name: this.getSchemaName(sqlFile),
          path: sqlFile,
          tables,
        });
      }
    }

    // Calculate stats
    const stats = {
      totalTables: schemas.reduce((sum, s) => sum + s.tables.length, 0),
      totalColumns: schemas.reduce((sum, s) => sum + s.tables.reduce((tSum, t) => tSum + t.columns.length, 0), 0),
      totalForeignKeys: schemas.reduce(
        (sum, s) => sum + s.tables.reduce((tSum, t) => tSum + t.foreignKeys.length, 0),
        0,
      ),
      totalRlsPolicies: schemas.reduce(
        (sum, s) => sum + s.tables.reduce((tSum, t) => tSum + t.rlsPolicies.length, 0),
        0,
      ),
    };

    return { schemas, stats };
  }

  private findSqlFiles(dir: string): string[] {
    const files: string[] = [];
    const ignoreDirs = ['node_modules', '.git', 'dist'];

    const scan = (currentDir: string) => {
      if (!fs.existsSync(currentDir)) return;

      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        if (ignoreDirs.includes(item)) continue;

        const itemPath = path.join(currentDir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          scan(itemPath);
        } else if (item.endsWith('.sql')) {
          files.push(itemPath);
        }
      }
    };

    scan(dir);
    return files;
  }

  private getSchemaName(filePath: string): string {
    // Extract meaningful name from path
    const parts = filePath.split(path.sep);
    const platformIndex = parts.findIndex((p) => p === 'platforms' || p === 'organizations');

    if (platformIndex !== -1 && parts[platformIndex + 1]) {
      return parts[platformIndex + 1];
    }

    return path.basename(filePath, '.sql');
  }

  private parseSqlFile(content: string): TableInfo[] {
    const tables: TableInfo[] = [];

    // Find CREATE TABLE statements
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = tableRegex.exec(content)) !== null) {
      const tableName = match[1];
      const tableBody = match[2];

      const table: TableInfo = {
        name: tableName,
        columns: this.parseColumns(tableBody),
        foreignKeys: this.parseForeignKeys(tableBody),
        indexes: [],
        rlsPolicies: [],
      };

      // Find primary key
      const pkMatch = tableBody.match(/(\w+)\s+.*?PRIMARY\s+KEY/i);
      if (pkMatch) {
        table.primaryKey = pkMatch[1];
      }

      tables.push(table);
    }

    // Find RLS policies
    const policyRegex = /CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+(?:public\.)?(\w+)/gi;
    while ((match = policyRegex.exec(content)) !== null) {
      const policyName = match[1];
      const tableName = match[2];

      const table = tables.find((t) => t.name === tableName);
      if (table) {
        table.rlsPolicies.push(policyName);
      }
    }

    // Find indexes
    const indexRegex = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+ON\s+(?:public\.)?(\w+)/gi;
    while ((match = indexRegex.exec(content)) !== null) {
      const indexName = match[1];
      const tableName = match[2];

      const table = tables.find((t) => t.name === tableName);
      if (table) {
        table.indexes.push(indexName);
      }
    }

    return tables;
  }

  private parseColumns(tableBody: string): ColumnInfo[] {
    const columns: ColumnInfo[] = [];
    const lines = tableBody.split(',').map((l) => l.trim());

    for (const line of lines) {
      // Skip constraints
      if (line.match(/^\s*(PRIMARY|FOREIGN|UNIQUE|CHECK|CONSTRAINT)/i) || !line.trim()) {
        continue;
      }

      const colMatch = line.match(/^(\w+)\s+(\w+(?:\([^)]+\))?)/i);
      if (colMatch) {
        const column: ColumnInfo = {
          name: colMatch[1],
          type: colMatch[2].toUpperCase(),
          nullable: !line.toUpperCase().includes('NOT NULL'),
        };

        // Check for DEFAULT
        const defaultMatch = line.match(/DEFAULT\s+([^,\s]+)/i);
        if (defaultMatch) {
          column.default = defaultMatch[1];
        }

        // Check for REFERENCES
        const refMatch = line.match(/REFERENCES\s+(?:public\.)?(\w+)\((\w+)\)/i);
        if (refMatch) {
          column.references = `${refMatch[1]}.${refMatch[2]}`;
        }

        columns.push(column);
      }
    }

    return columns;
  }

  private parseForeignKeys(tableBody: string): ForeignKeyInfo[] {
    const foreignKeys: ForeignKeyInfo[] = [];

    // Inline references
    const inlineRegex = /(\w+)\s+\w+.*?REFERENCES\s+(?:public\.)?(\w+)\((\w+)\)(?:\s+ON\s+DELETE\s+(\w+))?/gi;
    let match;

    while ((match = inlineRegex.exec(tableBody)) !== null) {
      foreignKeys.push({
        column: match[1],
        references: {
          table: match[2],
          column: match[3],
        },
        onDelete: match[4],
      });
    }

    return foreignKeys;
  }
}
