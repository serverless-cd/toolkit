import { RequestParameters } from '@octokit/core/dist-types/types';
import { IListBranchs, IGetRefCommit } from './input';

export interface IGithubListBranchs extends IListBranchs, RequestParameters {}

export interface IGithubGetConfig extends IGetRefCommit, RequestParameters {}
