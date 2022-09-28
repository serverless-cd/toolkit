import Base from './base';
import { defaults, size } from 'lodash';

export default class Github extends Base {
  private PARAMS = {
    per_page: 100,
    page: 1,
    sort: 'updated',
    affiliation: 'owner',
  };

  async listRepos(): Promise<any> {
    let page = 1;
    let result = await this.listRepo({ page });
    let rows = result.data;
    while (size(result.data) === this.PARAMS.per_page) {
      page += 1;
      result = await this.listRepo({ page });
      rows = rows.concat(result.data);
    }
    return rows;
  }

  private async listRepo(params: any) {
    const p = defaults(params, this.PARAMS);
    return this.octokit.request('GET /user/repos', p);
  }
}
