
export interface IGithubTrigger {
  interceptor: 'github';
  eventType: string;
  secret?: string;
  filter?: string;
}

export type ITigger = IGithubTrigger;

export interface IRequestPayload {
  headers: {
    [key: string]: string;
  };
  body: string; // webhook 请求体【json 串】
}
