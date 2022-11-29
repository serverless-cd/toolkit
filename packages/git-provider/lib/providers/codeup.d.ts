import { IGetCommitById, IListBranch } from '../types/codeup';
import { IAliConfig } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';
export default class Codeup {
    readonly client: any;
    private access_token;
    constructor(config: IAliConfig);
    listBranches(params: IListBranch): Promise<IBranchOutput[]>;
    getCommitById(params: IGetCommitById): Promise<ICommitOutput>;
    private requestList;
    request(args: {
        method?: string;
        url?: string;
        params?: any;
        data?: any;
        headers?: any;
        options?: any;
    }): Promise<any>;
    listRepos(): Promise<IRepoOutput[]>;
    getRefCommit(params: any): Promise<ICommitOutput>;
    listWebhook(params: any): Promise<IGetWebhookOutput[]>;
    createWebhook(params: any): Promise<ICreateWebhookOutput>;
    updateWebhook(params: any): Promise<void>;
    deleteWebhook(params: any): Promise<void>;
    getWebhook(params: any): Promise<IGetWebhookOutput>;
    putFile(params: any): Promise<void>;
    private _test_debug_log;
}
