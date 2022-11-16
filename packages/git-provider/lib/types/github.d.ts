import { RequestParameters } from '@octokit/core/dist-types/types';
import { IListBranchs, IGetRefCommit, ICreateWebhook, IUpdateWebhook, IGetWebhook, IDeleteWebhook, IPutFile } from './input';
export interface IGithubListBranchs extends IListBranchs, RequestParameters {
}
export interface IGithubGetConfig extends IGetRefCommit, RequestParameters {
}
export interface IGithubCreateWebhook extends ICreateWebhook, RequestParameters {
}
export interface IGithubUpdateWebhook extends IUpdateWebhook, RequestParameters {
}
export interface IGithubGetWebhook extends IGetWebhook, RequestParameters {
}
export interface IGithubDeleteWebhook extends IDeleteWebhook, RequestParameters {
}
export interface IGIThubPutFile extends IPutFile, RequestParameters {
}
