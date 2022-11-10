export interface IGithubTrigger {
  secret?: string;
  filters?: {
    eventName: string;
    filter?: string;
  }[];
  push?: {
    branches?: {
      prefix?: string[];
      precise?: string[];
      exclude?: string[];
      include?: string[];
    };
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
