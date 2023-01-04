import axios from 'axios';
import _ from 'lodash';
import Base from './base';
import { IGitConfig, IListBranchs, IGetRefCommit, IListWebhook, IDeleteWebhook, IGetWebhook, ICreateWebhook, IUpdateWebhook, IPutFile, IGetCommitById, ICreateFork } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, IOrgsOutput, IForkOutput } from '../types/output';
import { IWebhookParams } from '../types/gitee';

const V5 = 'https://gitee.com/api/v5';

export default class Gitee extends Base {
  putFile(params: IPutFile): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private getDefaultParame = () => ({
    per_page: 100,
    page: 1,
    sort: 'updated',
  });
  private access_token: string;

  constructor(config: IGitConfig) {
    super(config);

    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    this.access_token = access_token;
  }

  async listOrgs(): Promise<IOrgsOutput[]> {
    const rows = await this.requestList('/user/orgs', this.getDefaultParame());

    return _.map(rows, (row) => ({
      id: row.id,
      org: row.name,
      source: row,
    }));
  }

  // https://gitee.com/api/v5/swagger#/getV5UserRepos
  async listRepos(): Promise<IRepoOutput[]> {
    const rows = await this.requestList('/user/repos', _.defaults(this.getDefaultParame(), { affiliation: 'owner' }));

    return _.map(rows, (row) => ({
      id: row.id,
      name: row.name,
      avatar_url: _.get(row, 'owner.avatar_url'),
      owner: _.get(row, 'owner.login'),
      url: row.html_url,
      private: row.private,
      description: row.description,
      default_branch: row.default_branch,
      source: row,
    }));
  }

  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranches
  async listBranches(params: IListBranchs): Promise<IBranchOutput[]> {
    super.validateListBranchsParams(params);

    const { owner, repo } = params;
    const rows = await this.requestList(`/repos/${owner}/${repo}/branches`, _.defaults(params, this.getDefaultParame()));

    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.sha'), source: row,
    }));
  }


  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoCommitsSha
  async getCommitById(params: IGetCommitById): Promise<ICommitOutput> {
    super.validatGetCommitByIdParams(params);

    const { owner, repo, sha } = params;
    const result = await this.requestV5(`/repos/${owner}/${repo}/commits/${sha}`, 'GET', {});
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'sha'),
      message: _.get(source, 'commit.message'),
      source,
    };
  }

  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranchesBranch
  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoReleasesTagsTag
  async getRefCommit(params: IGetRefCommit): Promise<ICommitOutput> {
    super.validateGetRefCommitParams(params);

    const { owner, repo, ref } = params;

    if (_.startsWith(ref, 'refs/tags/')) {
      const tag = _.replace(ref, 'refs/tags/', '');
      const result = await this.requestV5(`/repos/${owner}/${repo}/releases/tags/${tag}`, 'GET', {});
      const source = _.get(result, 'data', {});

      return {
        sha: _.get(source, 'target_commitish'),
        message: _.get(source, 'tag_name'),
        source,
      };
    }
    const branch = _.startsWith(ref, 'refs/heads/') ? _.replace(ref, 'refs/heads/', '') : ref;
    const result = await this.requestV5(`/repos/${owner}/${repo}/branches/${branch}`, 'GET', {});
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'commit.sha'),
      message: _.get(source, 'commit.commit.message'),
      source,
    };
  }

  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoHooks
  async listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]> {
    super.validateListWebhookParams(params);

    const { owner, repo } = params;
    const rows = await this.requestList(`/repos/${owner}/${repo}/hooks`, _.defaults(params, this.getDefaultParame()));
    
    return _.map(rows, (row) => ({
      id: _.get(row, 'id'),
      url: _.get(row, 'url'),
      source: row,
    }));
  }

  // https://gitee.com/api/v5/swagger#/postV5ReposOwnerRepoHooks
  async createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput> {
    super.validateCreateWebhookParams(params);

    const { owner, repo } = params;
    const p: IWebhookParams = this.getWebHookEvents(params);

    const result = await this.requestV5(`/repos/${owner}/${repo}/hooks`, 'POST', p);
    const source = _.get(result, 'data', {});

    return {
      id: _.get(source, 'id'),
      source: source,
    };
  }

  // https://gitee.com/api/v5/swagger#/patchV5ReposOwnerRepoHooksId
  async updateWebhook(params: IUpdateWebhook): Promise<void> {
    super.validateUpdateWebhookParams(params);

    const { owner, repo, hook_id } = params;
    const p: IWebhookParams = this.getWebHookEvents(params);
    await this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'PATCH', p);
  }

  // https://gitee.com/wss-gitee/git-action-test/hooks/1202839/edit#hook-logs
  async getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput> {
    super.validateGetWebhookParams(params);

    const { owner, repo, hook_id } = params;
    const result = await this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'GET', params);
    const source = _.get(result, 'data', {});

    return {
      id: _.get(source, 'id'),
      url: _.get(source, 'url'),
      source: source,
    };
  }

  // https://gitee.com/api/v5/swagger#/patchV5ReposOwnerRepoHooksId
  async deleteWebhook(params: IDeleteWebhook): Promise<void> {
    super.validateDeleteWebhookParams(params);

    const { owner, repo, hook_id } = params;
    await this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'DELETE', {});
  }


  // https://gitee.com/api/v5/swagger#/postV5ReposOwnerRepoForks
  async createFork(params: ICreateFork): Promise<IForkOutput> {
    super.validateCreateForkParams(params);

    const { owner, repo } = params;
    const result = await this.requestV5(`/repos/${owner}/${repo}/forks`,  'POST', params);
    const source = _.get(result, 'data', {});
    return {
      id: source.id,
      full_name: source.name,
      url: source.url,
    }
  }

  async requestV5(path: string, method: string, params: Object): Promise<any> {
    const p = _.defaults(params, { access_token: this.access_token });
    return await axios({
      method,
      url: `${V5}${path}`,
      params: p,
    });
  }

  private async requestList(url: string, params: any): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.requestV5(url, 'GET', params);
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.page = params.page as number + 1;
    } while (rowLength === params.per_page);

    return rows;
  }

  private getWebHookEvents(params: any) {
    const secret = _.get(params, 'secret');
    const p: IWebhookParams = {
      encryption_type: secret ? 1 : undefined,
      password: secret,
      url: _.get(params, 'url'),
      push_events: false,
      tag_push_events: false,
      merge_requests_events: false,
      issues_events: false,
    };

    const events = this.getWebhookDefaults(params);
    for (const event of events) {
      switch (event) {
        case 'push':
          p.push_events = true;
          break;
        case 'release':
          p.tag_push_events = true;
          break;
        case 'pull_request':
          p.merge_requests_events = true;
          break;
        case 'issues':
          p.issues_events = true;
          break;
        default:
          console.error(`not supported event: ${event}`);
      }
    }

    return p;
  }
}
