
import _ from 'lodash';
import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook } from '../types/input';
import { IBranchOutput, IRepoOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';

export default abstract class Base {
  constructor(_config: any) { }
  abstract listRepos(): Promise<IRepoOutput[]>;
  abstract listBranchs(params: IListBranchs): Promise<IBranchOutput[]>;
  abstract getRefCommit(params: IGetRefCommit): Promise<ICommitOutput>;
  abstract listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]>;
  abstract createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput>;
  abstract updateWebhook(params: IUpdateWebhook): Promise<void>;
  abstract deleteWebhook(params: IDeleteWebhook): Promise<void>;
  abstract getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput>;

  validateListBranchsParams(params: unknown) {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
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
      throw new Error('You must specify repo');
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
      require('child_process').execSync(`echo '${JSON.stringify(data, null, 2)})}' > ${log}.log`);
    } catch (e: any) {
      console.log(`${log}.log error: ${e.message}`);
    }
  }
}