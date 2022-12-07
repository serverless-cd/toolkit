
export interface ISecretConfig {
  accountId?: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken?: string;
  endpoint?: string;
  apiVersion?: string;
  opts?: Record<string, any>;
}

export interface ITablestoreConfig {
  instanceName: string;
  region: string;
  maxRetries?: number;
}

export interface IFC2Config {
  region: string;
  secure?: 'https' | 'http';
  internal?: '-internal';
  headers?: Record<string, string>;
  timeout?: number;
}

export interface IOssConfig {
  region: string;
  bucket?: string;
  internal?: boolean;
  timeout?: number;
}
