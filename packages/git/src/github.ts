import _ from 'lodash';
import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';
import Base from './base';
import { IConfig } from './interface';

interface IListBranchs extends RequestParameters {
  owner: string;
  repo: string;
}

interface IGetConfig extends RequestParameters {
  owner: string;
  repo: string;
  ref: string;
}

export default class Github extends Base {
  private PARAMS: RequestParameters = {
    per_page: 100,
    page: 1,
    sort: 'updated',
  };
  readonly octokit: Octokit;

  constructor(config: IConfig) {
    super(config);

    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    this.octokit = new Octokit({ auth: access_token });
  }

  // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
  async listRepos(params?: RequestParameters): Promise<any[]> {
    return await this.requestList('GET /user/repos', _.defaults(params, { affiliation: 'owner' }));
  }

  // https://docs.github.com/en/rest/branches/branches#list-branches
  async listBranchs(params: IListBranchs): Promise<any[]> {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }

    return await this.requestList('GET /repos/{owner}/{repo}/branches', params);
  }

  // https://docs.github.com/en/rest/commits/commits#get-a-commit
  async getCommit(params: IGetConfig): Promise<any> {
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
    return _.get(result, 'data', {});
  }

  private async requestList(path: string, params?: RequestParameters): Promise<any[]> {
    const p = _.defaults(params, this.PARAMS);
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.octokit.request(path, p);
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      p.page = p.page as number + 1;
    } while (rowLength === p.per_page);

    return rows;
  }
}
