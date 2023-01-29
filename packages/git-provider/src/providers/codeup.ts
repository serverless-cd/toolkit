import _, { map } from 'lodash';
import { IGetCommitById, IListBranch, IListRepo, IDeleteRepo, ICreateRepo, IHasRepo } from '../types/codeup';
import { IAliConfig } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, ICreateRepoOutput, IHasRepoOutput } from '../types/output';


const { ROAClient } = require('@alicloud/pop-core');
const PARAMS = { page: 1, pageSize: 100 };

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
      accessKeyId: _.get(config, 'accessKeyId'),
      accessKeySecret: _.get(config, 'accessKeySecret'),
      securityToken: _.get(config, 'securityToken'),
      endpoint: _.get(config, 'endpoint', 'https://devops.cn-hangzhou.aliyuncs.com'),
      apiVersion: '2021-06-25',
    });
  }

  // https://help.aliyun.com/document_detail/460465.html
  async listRepos(params: IListRepo): Promise<IRepoOutput[]> {
    const organizationId = _.get(params, 'organization_id');
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }

    const url = '/repository/list';
    const rows = await this.requestList(url, {
      ...PARAMS,
      organizationId,
    });
    // this._test_debug_log(rows, 'list_repos');

    return _.map(rows, row => ({
      id: _.get(row, 'Id', _.get(row, 'id')) as unknown as number,
      name: _.get(row, 'name', ''),
      url: _.get(row, 'webUrl', ''),
      avatar_url: '',
      owner: organizationId,
      private: _.get(row, 'visibilityLevel', '0') === '0',
      description: _.get(row, 'description', ''),
      default_branch: _.get(row, 'default_branch', 'master'),
      source: row,
    }))
  }

  // https://help.aliyun.com/document_detail/461641.html
  async listBranches(params: IListBranch): Promise<IBranchOutput[]> {
    const projectId = _.get(params, 'project_id');
    const organizationId = _.get(params, 'organization_id');
    if (!projectId) {
      throw new Error('You must specify project_id');
    }
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }

    const url = `/repository/${projectId}/branches`;
    const rows = await this.requestList(url, {
      ...PARAMS,
      organizationId,
    });
    // this._test_debug_log(rows, 'list_branches');

    return _.map(rows, (row) => ({
      name: row.name,
      commit_sha: _.get(row, 'commit.id'),
      // commit_message: _.get(row, 'commit.message'),
      source: row,
    }));;
  }

  // https://help.aliyun.com/document_detail/463000.html
  async getCommitById(params: IGetCommitById): Promise<ICommitOutput> {
    const projectId = _.get(params, 'project_id');
    const organizationId = _.get(params, 'organization_id');
    const sha = _.get(params, 'sha');
    if (!projectId) {
      throw new Error('You must specify project_id');
    }
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }
    if (!sha) {
      throw new Error('You must specify sha');
    }
  
    const url = `/repository/${projectId}/commits/${sha}`;
    const result = await this.request({ url, params: { organizationId } });
    const source = _.get(result, 'result', {});

    // this._test_debug_log(result, 'get_commit_by_id');

    return {
      sha: _.get(source, 'id'),
      message: _.get(source, 'message'),
      source,
    };
  }

  //创建一个repo: https://help.aliyun.com/document_detail/215681.html
  async createRepo(params: ICreateRepo): Promise<ICreateRepoOutput> {
    const name = _.get(params, 'name');
    const organizationId = _.get(params, 'organization_id');
    const visibilityLevel = _.get(params, 'visibility_level') || '10';
    const description =  _.get(params, 'description') || '';

    if (!name) {
      throw new Error('You must specify project_name');
    }
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }
    
    const url ='/repository/create';
    const result = await this.request({ url, method: 'POST' , params: { organizationId }, data: { name , visibilityLevel , description  }});
    const source = _.get(result, 'result', {});
    return {
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'name',''),
        url: _.get(source, 'webUrl','')
    };
  }

  //删除一个repo: https://help.aliyun.com/document_detail/460705.html
  async deleteRepo(params: IDeleteRepo): Promise<any> {
    const repositoryId = _.get(params, 'project_id');
    const organizationId = _.get(params, 'organization_id');

    if (!repositoryId) {
      throw new Error('You must specify project_repositoryId');
    }
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }
    const reason = _.get(params, 'repositoryId') || 'git-provider删除代码库';
    const url = `/repository/${repositoryId}/remove`
    await this.request({ url, method: 'POST' , params: { organizationId, repositoryId }, data: { reason }});
  }

  //获取一个repo: https://help.aliyun.com/document_detail/460466.html
  async hasRepo(params: IHasRepo): Promise<IHasRepoOutput> {
    const identity = _.get(params, 'project_id');
    const organizationId = _.get(params, 'organization_id');

    
    if (!identity) {
      throw new Error('You must specify project_identity');
    }
    if (!organizationId) {
      throw new Error('You must specify organization_id');
    }

    const url='/repository/get'
    const rows = await this.request({ url, params : { identity, organizationId } });
    const source = _.get(rows, 'repository', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'name',''),
      url: _.get(source, 'webUrl','')
    };
  }

  private async requestList(url: string, params: { [key: string]: any }): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const res = await this.request({ url, params });
      const { result: data } = res;
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.page = params.page as number + 1;
    } while (rowLength === params.pageSize);

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
    if (params.accessToken) {
      params.accessToken = this.access_token;
    }
    try {
      return await this.client.request(method, url, params, JSON.stringify(data), headers, options);
    } catch (e) {
      throw e;
    }
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
  createFork(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private _test_debug_log(data: any, log: string = 'test') {
    try {
      require('fs').writeFileSync(`packages/git-provider/__tests__/logs_codeup_${log}.log`, JSON.stringify(data, null, 2));
    } catch (e: any) {
      console.log(`${log}.log error: ${e.message}`);
    }
  }
}