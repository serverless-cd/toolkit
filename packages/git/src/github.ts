import _ from 'lodash';
import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';
import Base from './base';
import { IGithubConfig, IGithubListBranchs, IGithubGetConfig } from './types/github';
import { IRepoOutput, IBranchOutput, ICommitOutput } from './types/output';

export default class Github extends Base {
  private PARAMS: RequestParameters = {
    per_page: 100,
    page: 1,
    sort: 'updated',
  };
  readonly octokit: Octokit;

  constructor(config: IGithubConfig) {
    super(config);

    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    this.octokit = new Octokit({ auth: access_token });
  }

  // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
  async listRepos(): Promise<IRepoOutput[]> {
    const rows = await this.requestList('GET /user/repos', _.defaults({ affiliation: 'owner' }, this.PARAMS));

    return _.map(rows, (row) => ({
      id: row.id, name: row.name, url: row.url, source: row,
    }));
  }

  // https://docs.github.com/en/rest/branches/branches#list-branches
  async listBranchs(params: IGithubListBranchs): Promise<IBranchOutput[]> {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }

    const rows = await this.requestList('GET /repos/{owner}/{repo}/branches', _.defaults(params, this.PARAMS))

    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.sha'), source: row,
    }));
  }

  // https://docs.github.com/en/rest/commits/commits#get-a-commit
  async getCommit(params: IGithubGetConfig): Promise<ICommitOutput> {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }
    if (!_.has(params, 'ref')) {
      throw new Error('You must specify repo');
    }
    const result = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', params);
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'sha'),
      message: _.get(source, 'commit.message'),
      url: _.get(source, 'commit.url'),
      source,
    };
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
