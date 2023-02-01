
import _ from 'lodash';
import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook, IWebhookEvent, IPutFile, IGetCommitById, ICreateFork, IDeleteRepo, ICreateRepo, IHasRepo, ISetProtectBranch, IGetProtectBranch } from '../types/input';
import { IBranchOutput, IRepoOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, IForkOutput, ICreateRepoOutput, IHasRepoOutput, IGetProtectBranchOutput  } from '../types/output';

export default abstract class Base {
  constructor(_config: any) { }
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
  abstract createFork(params: ICreateFork): Promise<IForkOutput>;
  abstract createRepo(params: ICreateRepo): Promise<ICreateRepoOutput>;
  abstract deleteRepo(params: IDeleteRepo): Promise<void>;
  abstract hasRepo(params: IHasRepo): Promise<IHasRepoOutput>;
  abstract setProtectionBranch(params: ISetProtectBranch): Promise<void>;
  abstract getProtectionBranch(params: IGetProtectBranch): Promise<IGetProtectBranchOutput>;

  getWebhookDefaults(params: any): IWebhookEvent[] {
    return _.get(params, 'events', ['push', 'release']);
  }

  validatePutFileParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'path')) {
      throw new Error('You must specify path');
    }
    if (!_.has(params, 'message')) {
      throw new Error('You must specify message');
    }
    if (!_.has(params, 'content')) {
      throw new Error('You must specify content');
    }
  }

  validateListBranchsParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
  }

  validateCreateForkParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
  }

  validateDeleteRepoParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
  }

  validateHasRepoParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
  }

  validateCreateRepoParams(params: unknown) {
    if (!_.has(params, 'name')) {
      throw new Error('You must specify the name of the repository');
    }
  }

  validateProtectBranchParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'branch')) {
      throw new Error('You must specify branch');
    }
  }

  validateGetProtectBranchParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'branch')) {
      throw new Error('You must specify branch');
    }
  }

  validateGetRefCommitParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'ref')) {
      throw new Error('You must specify ref');
    }
  }

  validatGetCommitByIdParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'sha')) {
      throw new Error('You must specify sha');
    }
  }

  validateListWebhookParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
  }
  
  validateCreateWebhookParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'url')) {
      throw new Error('You must specify url');
    }
    if (_.has(params, 'events') && !_.isArray(_.get(params, 'events'))) {
      throw new Error('You must specify events, array of strings');
    }
  }

  validateUpdateWebhookParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'url')) {
      throw new Error('You must specify url');
    }
    if (!_.has(params, 'hook_id')) {
      throw new Error('You must specify hook_id');
    }
  }

  validateGetWebhookParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'hook_id')) {
      throw new Error('You must specify hook_id');
    }
  }

  validateDeleteWebhookParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'hook_id')) {
      throw new Error('You must specify hook_id');
    }
  }
    
  _test_debug_log(data: any, log: string = 'test') {
    try {
      require('fs').writeFileSync(`packages/git-provider/__tests__/logs_${log}.log`, JSON.stringify(data, null, 2));
    } catch (e: any) {
      console.log(`${log}.log error: ${e.message}`);
    }
  }
}