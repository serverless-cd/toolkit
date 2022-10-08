import _ from 'lodash';
import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';
import Base from './base';
import { IGithubListBranchs, IGithubGetConfig, IGithubCreateWebhook, IGithubUpdateWebhook, IGithubGetWebhook, IGithubDeleteWebhook } from '../types/github';
import { IRepoOutput, IBranchOutput, ICommitOutput, ICreateWebhookOutput, IGetWebhookOutput } from '../types/output';
import { IGitConfig, IListWebhook } from '../types/input';

export default class Github extends Base {
  private PARAMS: RequestParameters = {
    per_page: 100,
    page: 1,
    sort: 'updated',
  };
  readonly octokit: Octokit;

  constructor(config: IGitConfig) {
    super(config);

    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    this.octokit = new Octokit({ auth: access_token });
  }

  // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
  async listRepos(): Promise<IRepoOutput[]> {
    const rows = await this.requestList('GET /user/repos', _.defaults(this.PARAMS, { affiliation: 'owner' }));

    return _.map(rows, (row) => ({
      id: row.id,
      name: row.name,
      url: row.html_url,
      source: row,
      avatar_url: _.get(row, 'owner.avatar_url'),
      owner: _.get(row, 'owner.login'),
    }));
  }

  // https://docs.github.com/en/rest/branches/branches#list-branches
  async listBranchs(params: IGithubListBranchs): Promise<IBranchOutput[]> {
    super.validateListBranchsParams(params);

    const rows = await this.requestList('GET /repos/{owner}/{repo}/branches', _.defaults(params, this.PARAMS))

    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.sha'), source: row,
    }));
  }

  // https://docs.github.com/en/rest/commits/commits#get-a-commit
  async getRefCommit(params: IGithubGetConfig): Promise<ICommitOutput> {
    super.validateGetRefCommitParams(params);

    const result = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', params);
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'sha'),
      message: _.get(source, 'commit.message'),
      source,
    };
  }

  // https://docs.github.com/en/rest/webhooks/repos
  async listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]> {
    super.validateListWebhookParams(params);

    const rows = await this.requestList('GET /repos/{owner}/{repo}/hooks', _.defaults(params, this.PARAMS))
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
        token: params.secret,
      },
    };

    const result = await this.octokit.request('POST /repos/{owner}/{repo}/hooks', p);
    const source = _.get(result, 'data', {});
    
    return { id: _.get(source, 'id'), source };
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
        token: params.secret,
      },
    };

    await this.octokit.request('PATCH /repos/{owner}/{repo}/hooks/{hook_id}', p);
  }

  async getWebhook(params: IGithubGetWebhook): Promise<IGetWebhookOutput> {
    super.validateGetWebhookParams(params);

    const result = await this.octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/config', params)
    const source = _.get(result, 'data', {});
    this._test_debug_log(source, 'getWebhook')

    return {
      id: params.hook_id,
      url: _.get(source, 'url'),
      source,
    };
  }

  async deleteWebhook(params: IGithubDeleteWebhook): Promise<void> {
    super.validateDeleteWebhookParams(params);

    await this.octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', params)
  }

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
