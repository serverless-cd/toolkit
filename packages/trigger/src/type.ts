export interface IBranches {
  prefix?: string[];
  precise?: string[];
  exclude?: string[];
  include?: string[];
}
export interface IGithubTrigger {
  secret?: string;
  push?: {
    branches?: IBranches;
    tags?: IBranches;
  };
  pr?: {
    branches?: IBranches;
  };
}

export interface IGithubWebhook {
  headers: {
    [key: string]: string;
  };
  body: any;
}

export interface ITriggers {
  github: IGithubTrigger;
}

export type IPayload = IGithubWebhook;

export type IProvider = 'github';

export type IEventType = 'push' | 'pull_request';

export interface IPushInfo {
  branch?: string;
  tag?: string;
}
