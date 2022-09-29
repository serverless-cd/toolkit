export type IProvider = 'github' | 'gitee';

export interface IGitConfig {
  access_token: string;
};

export interface IListBranchs {
  owner: string;
  repo: string;
}

export interface IGetConfig {
  owner: string;
  repo: string;
  ref: string;
}
