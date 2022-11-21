import axios from 'axios';
import _ from 'lodash';
import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook, IPutFile, IGitConfig } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';
import Base from './base';

const PARAMS = {
  pagination: 1,
  per_page: 100,
}


export default class Gitlab extends Base {
  private access_token: string;
  readonly endpoint: string;

  constructor(config: IGitConfig) {
    const access_token = _.get(config, 'access_token');
    const endpoint = _.get(config, 'endpoint');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }
    if (_.isEmpty(endpoint)) {
      throw new Error('Endpoint is required');
    }

    super(config);
    this.access_token = access_token;
    this.endpoint = endpoint as string;
  }

  async listBranches(params: IListBranchs | { id: string }): Promise<IBranchOutput[]> {
    let id: string | undefined = _.get(params, 'id');
    if (_.isNil(id)) {
      super.validateListBranchsParams(params);
      const { owner, repo } = params as IListBranchs;
      id = encodeURIComponent(`${owner}/${repo}`);
    }

    const rows = await this.requestList(`/api/v4/projects/${id}/repository/branches`, PARAMS);
    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.id'), source: row,
    }));
  }

  private async requestList(path: string, params: any): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.request(path, 'GET', params);
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.pagination = params.pagination as number + 1;
    } while (rowLength === params.per_page);

    return rows;
  }

  async request(path: string, method: string, params: Object): Promise<any> {
    const p = _.defaults(params, { private_token: this.access_token });

    console.log('endpoint: ', `${this.endpoint}${path}`);
    return await axios({
      method,
      url: `${this.endpoint}${path}`,
      params: p,
    });
  }

  listRepos(): Promise<IRepoOutput[]> {
    throw new Error('Method not implemented.');
  }
  getRefCommit(params: IGetRefCommit): Promise<ICommitOutput> {
    throw new Error('Method not implemented.');
  }
  listWebhook(params: IListWebhook): Promise<IGetWebhookOutput[]> {
    throw new Error('Method not implemented.');
  }
  createWebhook(params: ICreateWebhook): Promise<ICreateWebhookOutput> {
    throw new Error('Method not implemented.');
  }
  updateWebhook(params: IUpdateWebhook): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteWebhook(params: IDeleteWebhook): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getWebhook(params: IGetWebhook): Promise<IGetWebhookOutput> {
    throw new Error('Method not implemented.');
  }
  putFile(params: IPutFile): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
