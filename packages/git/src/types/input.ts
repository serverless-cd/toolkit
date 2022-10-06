export type IProvider = 'github' | 'gitee';

export interface IGitConfig {
  access_token: string;
};

export interface IListBranchs {
  owner: string;
  repo: string;
}

export interface IGetRefCommit {
  owner: string;
  repo: string;
  ref: string;
}

export interface IListWebhook {
  owner: string;
  repo: string;
}

export interface ICreateWebhook {
  owner: string;
  repo: string;
  url: string;
}

export interface IUpdateWebhook {
  owner: string;
  repo: string;
  url: string;
  hook_id: number;
}

export interface IDeleteWebhook {
  owner: string;
  repo: string;
  hook_id: number;
}

export interface IGetWebhook {
  owner: string;
  repo: string;
  hook_id: number;
}
