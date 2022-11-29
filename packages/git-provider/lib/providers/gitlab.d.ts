import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook, IPutFile, IGitConfig, IGetCommitById } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';
import Base from './base';
export default class Gitlab extends Base {
    private access_token;
    readonly endpoint: string;
    constructor(config: IGitConfig);
    listBranches(params: IListBranchs | {
        id: string;
    }): Promise<IBranchOutput[]>;
    getCommitById(params: IGetCommitById | {
        id: string;
        sha: string;
    }): Promise<ICommitOutput>;
    private requestList;
    request(path: string, method: string, params: Object): Promise<any>;
    listRepos(): Promise<IRepoOutput[]>;
    getRefCommit(params: IGetRefCommit): Promise<ICommitOutput>;
    listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]>;
    createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput>;
    updateWebhook(params: IUpdateWebhook): Promise<void>;
    deleteWebhook(params: IDeleteWebhook): Promise<void>;
    getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput>;
    putFile(params: IPutFile): Promise<void>;
}
