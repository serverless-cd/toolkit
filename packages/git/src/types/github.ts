import { RequestParameters } from '@octokit/core/dist-types/types';

export interface IGithubConfig {
  access_token: string;
};

export interface IGithubListBranchs extends RequestParameters {
  owner: string;
  repo: string;
}

export interface IGithubGetConfig extends RequestParameters {
  owner: string;
  repo: string;
  ref: string;
}
