// Database-related types

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  connected: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: any[];
}

export interface DatabaseSchema {
  tables: TableSchema[];
  indexes: IndexSchema[];
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  primaryKey?: string[];
}

export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
}

export interface IndexSchema {
  name: string;
  table: string;
  columns: string[];
  unique: boolean;
}
