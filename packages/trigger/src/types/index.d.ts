
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

export interface ITigger {
  github: IGithubTrigger;
}

export type IPayload = IGithubWebhook;
