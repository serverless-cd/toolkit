export enum PROVIDER {
  github = 'github',
  gitee = 'gitee',
  codeup = 'codeup',
  gitlab = 'gitlab',
}

export type IProvider = `${PROVIDER}`;

export type IWebhookEvent = 'push' | 'release' | 'pull_request' | 'issues';

export interface IGitConfig {
  access_token: string;
  endpoint?: string;
};

export interface IAliConfig {
  access_token: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken?: string;
  endpoint?: string;
}

export interface IListBranchs {
  owner: string;
  repo: string;
}

export interface ICreateFork {
  owner: string;
  repo: string;
}

export interface ICreateRepo {
  name: string;
}

export interface IDeleteRepo {
  owner: string;
  repo: string;
}

export interface IHasRepo {
  owner: string;
  repo: string;
}

export interface IGetRefCommit {
  owner: string;
  repo: string;
  ref: string;
}

export interface IGetCommitById {
  owner: string;
  repo: string;
  sha: string;
}

export interface IListWebhook {
  owner: string;
  repo: string;
}

export interface ICreateWebhook {
  owner: string;
  repo: string;
  url: string;
  secret?: string;
  events?: IWebhookEvent[],
}

export interface IUpdateWebhook extends ICreateWebhook{
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

export interface IPutFile {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  branch?: string;
  committer?: {
    name: string;
    email: string;
  };
}
