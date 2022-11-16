import Base from './base';
import { IGitConfig, IListBranchs, IGetRefCommit, IListWebhook, IDeleteWebhook, IGetWebhook, ICreateWebhook, IUpdateWebhook, IPutFile } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, IOrgsOutput } from '../types/output';
export default class Gitee extends Base {
    putFile(params: IPutFile): Promise<void>;
    private getDefaultParame;
    private access_token;
    constructor(config: IGitConfig);
    listOrgs(): Promise<IOrgsOutput[]>;
    listRepos(): Promise<IRepoOutput[]>;
    listBranches(params: IListBranchs): Promise<IBranchOutput[]>;
    getRefCommit(params: IGetRefCommit): Promise<ICommitOutput>;
    listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]>;
    createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput>;
    updateWebhook(params: IUpdateWebhook): Promise<void>;
    getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput>;
    deleteWebhook(params: IDeleteWebhook): Promise<void>;
    requestV5(path: string, method: string, params: Object): Promise<any>;
    private requestList;
    private getWebHookEvents;
}
