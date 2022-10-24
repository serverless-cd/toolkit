import _ from 'lodash';
import { IListBranch } from '../types/codeup';
import { IAliConfig } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput } from '../types/output';


const { ROAClient } = require('@alicloud/pop-core');
const PARAMS = { Page: 1, PageSize: 100, Order: 'astactivity_at' };

export default class Codeup {
  readonly client: any;
  private access_token: string;

  constructor(config: IAliConfig) {
    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }

    this.access_token = access_token;
    this.client = new ROAClient({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: 'https://codeup.cn-hangzhou.aliyuncs.com',
      apiVersion: '2020-04-14',
    });
  }

  async listBranchs(params: IListBranch): Promise<IBranchOutput[]> {
    const projectId = _.get(params, 'ProjectId');
    const OrganizationId = _.get(params, 'OrganizationId');
    if (!projectId) {
      throw new Error('You must specify ProjectId');
    }
    if (!OrganizationId) {
      throw new Error('You must specify OrganizationId');
    }

    const url = `/api/v3/projects/${projectId}/repository/branches`;
    if (params.Page) {
      return await this.request({ url, params });
    }
    const p = _.defaults(params, PARAMS);
    const rows = await this.requestList(url, p);

    return _.map(rows, (row) => ({
      name: row.BranchName, commit_sha: _.get(row, 'CommitInfo.Id'), source: row,
    }));;
  }

  private async requestList(url: string, params: { [key: string]: any }): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const res = await this.request({ url, params });
      console.log(res);
      const { Result: data } = res;
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.Page = params.Page as number + 1;
    } while (rowLength === params.PageSize);

    return rows;
  }

  async request(args: {
    method?: string;
    url?: string;
    params?: any;
    data?: any;
    headers?: any;
    options?: any;
  }) {
    const {
      method = 'GET',
      url = '/',
      params = {},
      data = {},
      headers = {
        'Content-Type': 'application/json',
      },
      options = {},
    } = args;

    if (params.AccessToken) {
      params.AccessToken = this.access_token;
    }

    try {
      return await this.client.request(method, url, params, JSON.stringify(data), headers, options);
    } catch (e) {
      console.log('request error:', e);
    }
  }

  listRepos(): Promise<IRepoOutput[]> {
    throw new Error('Method not implemented.');
  }
  getRefCommit(params: any): Promise<ICommitOutput> {
    throw new Error('Method not implemented.');
  }
  listWebhook(params: any): Promise<IGetWebhookOutput[]> {
    throw new Error('Method not implemented.');
  }
  createWebhook(params: any): Promise<ICreateWebhookOutput> {
    throw new Error('Method not implemented.');
  }
  updateWebhook(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteWebhook(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getWebhook(params: any): Promise<IGetWebhookOutput> {
    throw new Error('Method not implemented.');
  }
  putFile(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}