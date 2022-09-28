import Base from './base';
import _ from 'lodash';
import { RequestParameters } from '@octokit/core/dist-types/types';

interface IListBranchs extends RequestParameters {
  owner: string;
  repo: string;
}

export default class Github extends Base {
  private PARAMS: RequestParameters = {
    per_page: 100,
    page: 1,
    sort: 'updated',
  };

  // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
  async listRepos(params?: RequestParameters): Promise<any[]> {
    return this.requestList('GET /user/repos', _.defaults(params, { affiliation: 'owner' }));
  }

  // https://docs.github.com/en/rest/branches/branches#list-branches
  async listBranchs(params: IListBranchs): Promise<any[]> {
    if (!_.has(params, 'owner')) {
      throw new Error('You must specify owner');
    }
    if (!_.has(params, 'repo')) {
      throw new Error('You must specify repo');
    }

    return this.requestList('GET /repos/{owner}/{repo}/branches', params);
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
