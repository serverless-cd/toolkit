import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook, IWebhookEvent, IPutFile, IGetCommitById } from '../types/input';
import { IBranchOutput, IRepoOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';
export default abstract class Base {
    constructor(_config: any);
    abstract listRepos(): Promise<IRepoOutput[]>;
    abstract listBranches(params: IListBranchs): Promise<IBranchOutput[]>;
    abstract getRefCommit(params: IGetRefCommit): Promise<ICommitOutput>;
    abstract getCommitById(params: IGetCommitById): Promise<ICommitOutput>;
    abstract listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]>;
    abstract createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput>;
    abstract updateWebhook(params: IUpdateWebhook): Promise<void>;
    abstract deleteWebhook(params: IDeleteWebhook): Promise<void>;
    abstract getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput>;
    abstract putFile(params: IPutFile): Promise<void>;
    getWebhookDefaults(params: any): IWebhookEvent[];
    validatePutFileParams(params: unknown): void;
    validateListBranchsParams(params: unknown): void;
    validateGetRefCommitParams(params: unknown): void;
    validatGetCommitByIdParams(params: unknown): void;
    validateListWebhookParams(params: unknown): void;
    validateCreateWebhookParams(params: unknown): void;
    validateUpdateWebhookParams(params: unknown): void;
    validateGetWebhookParams(params: unknown): void;
    validateDeleteWebhookParams(params: unknown): void;
    _test_debug_log(data: any, log?: string): void;
}
