import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';
import Base from './base';
import { IGithubListBranchs, IGithubGetConfig, IGithubCreateWebhook, IGithubUpdateWebhook, IGithubGetWebhook, IGithubDeleteWebhook, IGIThubPutFile } from '../types/github';
import { IRepoOutput, IBranchOutput, ICommitOutput, ICreateWebhookOutput, IGetWebhookOutput, IOrgsOutput } from '../types/output';
import { IGitConfig, IListWebhook } from '../types/input';
export default class Github extends Base {
    private getDefaultParame;
    readonly octokit: Octokit;
    constructor(config: IGitConfig);
    putFile(params: IGIThubPutFile): Promise<void>;
    listRepos(): Promise<IRepoOutput[]>;
    listOrgRepos(org: string): Promise<IRepoOutput[]>;
    listOrgs(): Promise<IOrgsOutput[]>;
    listBranches(params: IGithubListBranchs): Promise<IBranchOutput[]>;
    getRefCommit(params: IGithubGetConfig): Promise<ICommitOutput>;
    listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]>;
    createWebhook(params: IGithubCreateWebhook): Promise<ICreateWebhookOutput>;
    updateWebhook(params: IGithubUpdateWebhook): Promise<void>;
    getWebhook(params: IGithubGetWebhook): Promise<IGetWebhookOutput>;
    deleteWebhook(params: IGithubDeleteWebhook): Promise<void>;
    request(path: string, _method: string, params: RequestParameters): Promise<import("@octokit/types").OctokitResponse<any, number>>;
    private requestList;
}
