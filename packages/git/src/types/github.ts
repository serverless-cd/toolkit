import { RequestParameters } from '@octokit/core/dist-types/types';
import { IListBranchs, IGetConfig } from './input';

export interface IGithubListBranchs extends IListBranchs, RequestParameters {}

export interface IGithubGetConfig extends IGetConfig, RequestParameters {}
