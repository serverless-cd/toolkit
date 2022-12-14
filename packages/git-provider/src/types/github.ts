import { RequestParameters } from '@octokit/core/dist-types/types';
import { IListBranchs, ICreateFork, IGetRefCommit, ICreateWebhook, IUpdateWebhook, IGetWebhook, IDeleteWebhook, IPutFile, IGetCommitById } from './input';

interface _IWebhookParams {
  name?: string;
  active?: boolean;
  events?: string[];
  config?: {
    url: string;
    content_type?: string;
    secret?: string;
    insecure_ssl?: string | number;
    token?: string;
    digest?: string;
  }
}

export interface IGithubListBranchs extends IListBranchs, RequestParameters {}
export interface IGithubFork extends ICreateFork, RequestParameters {}
export interface IGithubGetCommitById extends IGetCommitById, RequestParameters {}
export interface IGithubGetConfig extends IGetRefCommit, RequestParameters {}



export interface IGithubCreateWebhook extends ICreateWebhook, RequestParameters { }
export interface IGithubUpdateWebhook extends IUpdateWebhook, RequestParameters { }
export interface IGithubGetWebhook extends IGetWebhook, RequestParameters {}
export interface IGithubDeleteWebhook extends IDeleteWebhook, RequestParameters {}
export interface IGIThubPutFile extends IPutFile, RequestParameters {}
