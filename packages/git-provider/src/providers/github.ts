import _ from 'lodash';
import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';
import Base from './base';
import { IGithubListBranchs, IGithubGetConfig, IGithubCreateWebhook, IGithubUpdateWebhook, IGithubGetWebhook, IGithubDeleteWebhook, IGIThubPutFile, IGithubGetCommitById, IGithubFork, IGithubCreateRepo, IGithubDeleteRepo, IGithubHasRepo, IGithubSetProtectBranch, IGithubGetProtectBranch } from '../types/github';
import { IRepoOutput, IBranchOutput, ICommitOutput, ICreateWebhookOutput, IGetWebhookOutput, IOrgsOutput, IForkOutput, ICreateRepoOutput, IHasRepoOutput, IGetProtectBranchOutput } from '../types/output';
import { IGetRefCommit, IGitConfig, IListWebhook } from '../types/input';

export default class Github extends Base {
  private getDefaultParame = (): RequestParameters => ({
    per_page: 100,
    page: 1,
    sort: 'updated',
  });
  readonly octokit: Octokit;

  constructor(config: IGitConfig) {
    super(config);

    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    this.octokit = new Octokit({ auth: access_token });
  }

  // https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
  async putFile(params: IGIThubPutFile): Promise<void> {
    super.validatePutFileParams(params);
    params.content = Buffer.from(params.content).toString('base64');
    await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
  }

  async listRepos(): Promise<IRepoOutput[]> {
    let rows: any[] = [];
    // 获取用户的仓库：https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user
    const userRepos = await this.requestList('GET /user/repos', _.defaults(this.getDefaultParame(), { affiliation: 'owner' }));
    console.log('\tlist repo length: ', userRepos.length);
    return _.map(userRepos, (row) => ({
      id: row.id,
      name: row.name,
      avatar_url: _.get(row, 'owner.avatar_url'),
      owner: _.get(row, 'owner.login'),
      url: row.clone_url,
      private: row.private,
      description: row.description,
      default_branch: row.default_branch,
      source: row,
    }));
  };

  //创建一个fork: https://docs.github.com/en/rest/repos/forks#create-a-fork
  async createFork(params: IGithubFork): Promise<IForkOutput> {
    super.validateCreateForkParams(params);
    const rows = await this.octokit.request('POST /repos/{owner}/{repo}/forks',params);
    const source = _.get(rows, 'data', {});
    return {
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'full_name',''),
        url: _.get(source, 'html_url','')
      };
  }

  //创建一个repo: https://docs.github.com/zh/rest/repos/repos#create-an-organization-repository
  async createRepo(params: IGithubCreateRepo): Promise<ICreateRepoOutput> {
    super.validateCreateRepoParams(params);
    const rows = await this.octokit.request('POST /user/repos',params);
    const source = _.get(rows, 'data', {});
    return {
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'full_name',''),
        url: _.get(source, 'url','')
    };
  }

  //删除一个repo: https://docs.github.com/zh/rest/repos/repos#delete-a-repository
  async deleteRepo(params: IGithubDeleteRepo): Promise<any> {
    super.validateDeleteRepoParams(params);
    await this.octokit.request('DELETE /repos/{owner}/{repo}',params);
  }

  //获取一个repo: https://docs.github.com/zh/rest/repos/repos#get-a-repository
  async hasRepo(params: IGithubHasRepo): Promise<IHasRepoOutput> {
    super.validateHasRepoParams(params);
    const rows = await this.octokit.request('GET /repos/{owner}/{repo}',params);
    const source = _.get(rows, 'data', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'full_name',''),
      url: _.get(source, 'html_url','')
    };
  }


  //设置保护分支: https://docs.github.com/zh/rest/branches/branch-protection#update-branch-protection
  async setProtectionBranch(params: IGithubSetProtectBranch): Promise<any> {
    super.validateProtectBranchParams(params);
    const parameters = {
      required_status_checks: null,
      enforce_admins: null,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
      },
      restrictions: null,
      ...params,
    }
    await this.octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection',parameters);
  }

  //获取保护分支信息: https://docs.github.com/zh/rest/branches/branch-protection#get-branch-protection
  async getProtectionBranch(params: IGithubGetProtectBranch): Promise<IGetProtectBranchOutput> {
    super.validateGetProtectBranchParams(params);
    const res = await this.octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection',params);
    const source = _.get(res, 'data', {});
    const required_pull_request_reviews = _.get(source, 'required_pull_request_reviews', {});
    return {
      protected: !_.isNil(required_pull_request_reviews),
    };
  }


  // 获取组织的仓库: https://docs.github.com/cn/rest/repos/repos#list-organization-repositories
  async listOrgRepos (org: string): Promise<IRepoOutput[]> {
    console.log('get org repository: ', org);
    const orgRepos = await this.requestList('GET /orgs/{org}/repos', _.defaults(this.getDefaultParame(),  { org }));
    const rows = orgRepos.filter(orgRepo => orgRepo.permissions.admin);
    console.log('orgRepos length: ', orgRepos.length, '; admin length: ', rows.length);
    return _.map(rows, (row) => ({
      id: row.id,
      name: row.name,
      avatar_url: _.get(row, 'owner.avatar_url'),
      owner: _.get(row, 'owner.login'),
      url: row.clone_url,
      private: row.private,
      description: row.description,
      default_branch: row.default_branch,
      source: row,
    }));
  }

  async listOrgs(): Promise<IOrgsOutput[]> {
    // 获取用户组织：https://docs.github.com/en/rest/orgs/orgs#list-organizations-for-the-authenticated-user
    const orgs = await this.requestList('GET /user/orgs', this.getDefaultParame());
    return _.map(orgs, row => ({
      org: row.login,
      id: row.id,
      source: row,
    }));
  }

  // https://docs.github.com/en/rest/branches/branches#list-branches
  async listBranches(params: IGithubListBranchs): Promise<IBranchOutput[]> {
    super.validateListBranchsParams(params);

    const rows = await this.requestList('GET /repos/{owner}/{repo}/branches', _.defaults(params, this.getDefaultParame()));

    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.sha'), source: row,
    }));
  }

  // https://docs.github.com/en/rest/commits/comments#get-a-commit-comment
  // GET /repos/{owner}/{repo}/comments/{sha}  => GET /repos/{owner}/{repo}/commits/{sha}
  async getCommitById(params: IGithubGetCommitById): Promise<ICommitOutput> {
    super.validatGetCommitByIdParams(params);
    const result = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{sha}', params);
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'sha', ''),
      message: _.get(source, 'commit.message', ''),
      source,
    };
  }

  // https://docs.github.com/en/rest/commits/commits#get-a-commit
  async getRefCommit(params: IGithubGetConfig): Promise<ICommitOutput> {
    super.validateGetRefCommitParams(params);

    const result = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', params);
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'sha', ''),
      message: _.get(source, 'commit.message', ''),
      source,
    };
  }

  // https://docs.github.com/en/rest/webhooks/repos
  async listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]> {
    super.validateListWebhookParams(params);

    const rows = await this.requestList('GET /repos/{owner}/{repo}/hooks', _.defaults(params, this.getDefaultParame()))
    return _.map(rows, (row) => ({
      id: row.id, url: _.get(row, 'config.url'), source: row,
    }));
  }

  // https://docs.github.com/en/rest/webhooks/repos#create-a-repository-webhook
  async createWebhook(params: IGithubCreateWebhook): Promise<ICreateWebhookOutput> {
    super.validateCreateWebhookParams(params);
    const p = {
      owner: params.owner,
      repo: params.repo,
      active: true,
      events: this.getWebhookDefaults(params),
      config: {
        url: params.url,
        content_type: 'json',
        insecure_ssl: '0',
        secret: params.secret,
      },
    };

    const result = await this.octokit.request('POST /repos/{owner}/{repo}/hooks', p);
    const source = _.get(result, 'data', {});
    
    return { id: _.get(source, 'id') as unknown as number, source };
  }

  async updateWebhook(params: IGithubUpdateWebhook): Promise<void> {
    super.validateUpdateWebhookParams(params);

    const p = {
      hook_id: params.hook_id,
      owner: params.owner,
      repo: params.repo,
      active: true,
      events: this.getWebhookDefaults(params),
      config: {
        url: params.url,
        content_type: 'json',
        insecure_ssl: '0',
        secret: params.secret,
      },
    };

    await this.octokit.request('PATCH /repos/{owner}/{repo}/hooks/{hook_id}', p);
  }

  async getWebhook(params: IGithubGetWebhook): Promise<IGetWebhookOutput> {
    super.validateGetWebhookParams(params);

    const result = await this.octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/config', params)
    const source = _.get(result, 'data', {});

    return {
      id: params.hook_id,
      url: _.get(source, 'url', ''),
      source,
    };
  }

  async deleteWebhook(params: IGithubDeleteWebhook): Promise<void> {
    super.validateDeleteWebhookParams(params);

    await this.octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', params)
  }

  async request(path: string, _method: string, params: RequestParameters) {
    return await this.octokit.request(path, params);
  };

  private async requestList(path: string, params: RequestParameters): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.octokit.request(path, params);
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.page = params.page as number + 1;
    } while (rowLength === params.per_page);

    return rows;
  }
}
