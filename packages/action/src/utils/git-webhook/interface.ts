export interface IOption {
  path: string;
  secret?: string;
  password?: string;
  events?: string | string[];
}

export interface IRequest {
  path: string;
  method: string;
  headers: {
    [key: string]: any;
  };
  body: any;
  protocol: string;
  url: string;
}

export interface IHookData {
  event: string;
  payload: any;
  protocol: string;
  host: string;
  url: string;
  path: string;
}
