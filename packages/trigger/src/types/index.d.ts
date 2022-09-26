
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
  body: string; // webhook 请求体【json 串】
}

export interface ITigger {
  github: IGithubTrigger;
}

export type IPayload = IGithubWebhook;
