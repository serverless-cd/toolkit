
export interface IGithubTrigger {
  interceptor: 'github';
  eventType: string;
  secret?: string;
  filter?: string;
}


export interface IGithubWebhook {
  headers: {
    [key: string]: string;
  };
  body: string; // webhook 请求体【json 串】
}

export type ITigger = IGithubTrigger;
export type IPayload = IGithubWebhook;
