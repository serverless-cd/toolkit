
import _ from 'lodash';
import { IListRepo, IListBranch, IGetCommitById, IDeleteRepo, ICreateRepo, IHasRepo, ISetProtectBranch, IGetProtectBranch } from '../types/codeup';
import { IBranchOutput, IRepoOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, IForkOutput, ICreateRepoOutput, IHasRepoOutput, IGetProtectBranchOutput  } from '../types/output';

export default abstract class CodeupBase {
  constructor(_config: any) {}
  abstract listRepos(params: IListRepo): Promise<IRepoOutput[]>;
  abstract listBranches(params: IListBranch): Promise<IBranchOutput[]>;
  abstract getRefCommit(params: any): Promise<ICommitOutput>;
  abstract getCommitById(params: IGetCommitById): Promise<ICommitOutput>;
  abstract listWebhook(params: any): Promise<IGetWebhookOutput[]>;
  abstract createWebhook(params: any): Promise<ICreateWebhookOutput>;
  abstract updateWebhook(params: any): Promise<void>;
  abstract deleteWebhook(params: any): Promise<void>;
  abstract getWebhook(params: any): Promise<IGetWebhookOutput>;
  abstract putFile(params: any): Promise<void>;
  abstract createFork(params: any): Promise<void>;
  abstract createRepo(params: ICreateRepo): Promise<ICreateRepoOutput>;
  abstract deleteRepo(params: IDeleteRepo): Promise<void>;
  abstract hasRepo(params: IHasRepo): Promise<IHasRepoOutput>;
  abstract setProtectionBranch(params: ISetProtectBranch): Promise<void>;
  abstract getProtectionBranch(params: IGetProtectBranch): Promise<IGetProtectBranchOutput>;

  validateListReposParams(params: unknown) {
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }

  validateListBranchesParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_id');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }

  validateGetCommitByIdParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_id');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
    if (!_.has(params, 'sha')) {
      throw new Error('You must specify sha');
    }
  }

  validateDeleteRepoParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_id');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }

  validateHasRepoParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_identity');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }

  validateRepoEmptyParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_identity');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }

  validateCreateRepoParams(params: unknown) {
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
    if (!_.has(params, 'name')) {
      throw new Error('You must specify the name of the repository');
    }
  }

  validateProtectBranchParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_id');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
    if (!_.has(params, 'branch')) {
      throw new Error('You must specify branch');
    }
  }

  validateGetProtectBranchParams(params: unknown) {
    if (!_.has(params, 'project_id')) {
      throw new Error('You must specify project_id');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
    if (!_.has(params, 'branch')) {
      throw new Error('You must specify branch');
    }
  }

  validateGetRepoId(params: unknown) {
    if (!_.has(params, 'name')) {
      throw new Error('You must specify repo name');
    }
    if (!_.has(params, 'organization_id')) {
      throw new Error('You must specify organization_id');
    }
  }
}