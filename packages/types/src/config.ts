// Configuration-related types

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface ServerConfig {
  port: number;
  host: string;
  ssl?: boolean;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  database: DatabaseConfig;
  server: ServerConfig;
}
