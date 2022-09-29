export type IProvider = 'github';

export interface IListBranchs {
  owner: string;
  repo: string;
}

export interface IGetConfig {
  owner: string;
  repo: string;
  ref: string;
}