import { EngineLogger } from '@serverless-cd/core';

export type IProvider = 'github' | 'gitee' | 'gitlab' | 'codeup';

export interface IConfig {
  token: string;
  provider: IProvider;
  logger: EngineLogger;
  username: string;
  url: string;
  execDir: string;
  ref?: string;
  commit?: string;
}
