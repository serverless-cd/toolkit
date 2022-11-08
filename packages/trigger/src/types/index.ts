export interface IGithubTrigger {
  // interceptor: 'github';
  secret?: string;
  filters?: {
    eventName: string;
    filter?: string;
  }[];
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
