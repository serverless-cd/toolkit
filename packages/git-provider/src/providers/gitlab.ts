import axios from 'axios';
import _ from 'lodash';
import { IListBranchs, IGetRefCommit, IListWebhook, ICreateWebhook, IUpdateWebhook, IDeleteWebhook, IGetWebhook, IPutFile, IGitConfig, IGetCommitById, ICreateFork, IDeleteRepo, ICreateRepo, IHasRepo } from '../types/input';
import { IRepoOutput, IBranchOutput, ICommitOutput, IGetWebhookOutput, ICreateWebhookOutput, IForkOutput, ICreateRepoOutput, IHasRepoOutput } from '../types/output';
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

  // https://www.bookstack.cn/read/gitlab-doc-zh/docs-296.md#7tkudr
  async listBranches(params: IListBranchs | { id: string }): Promise<IBranchOutput[]> {
    let id: string | undefined = _.get(params, 'id');
    if (_.isNil(id)) {
      super.validateListBranchsParams(params);
      const { owner, repo } = params as IListBranchs;
      id = encodeURIComponent(`${owner}/${repo}`);
    }

    const rows = await this.requestList(`/api/v4/projects/${id}/repository/branches`, PARAMS, 'GET');
    return _.map(rows, (row) => ({
      name: row.name, commit_sha: _.get(row, 'commit.id'), source: row,
    }));
  }

  //https://docs.gitlab.com/ee/api/projects.html#fork-project
  async createFork(params: ICreateFork): Promise<IForkOutput> {
    super.validateCreateForkParams(params);
    const { owner, repo } = params as ICreateFork;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const rows = await this.request(`/api/v4/projects/${id}/fork`, 'POST', params);
    const source = _.get(rows, 'data', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'path_with_namespace',''),
      url: _.get(source, 'web_url','')
    };
  }

   //创建一个repo: https://docs.gitlab.com/ee/api/projects.html#delete-project
   async createRepo(params: ICreateRepo): Promise<ICreateRepoOutput> {
    super.validateCreateRepoParams(params);

    const rows = await this.request(`api/v4/projects`,'POST',params);
    const source = _.get(rows, 'data', {});
    return {
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'path_with_namespace',''),
        url: _.get(source, 'web_url','')
    };
  }

  //删除一个repo: https://docs.gitlab.com/ee/api/projects.html#delete-project
  async deleteRepo(params: IDeleteRepo): Promise<any> {
    super.validateDeleteRepoParams(params);
    const { owner, repo } = params as IDeleteRepo;
    const id = encodeURIComponent(`${owner}/${repo}`);
    await this.request(`api/v4/projects/${id}`,'DELETE',params);
  }

   //获取一个repo: https://docs.github.com/zh/rest/repos/repos#delete-a-repository
   async hasRepo(params: IHasRepo): Promise<IHasRepoOutput> {
    super.validateHasRepoParams(params);
    const { owner, repo } = params as IHasRepo;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const rows = await this.request(`api/v4/projects/${id}`,'GET',params);
    const source = _.get(rows, 'data', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'path_with_namespace',''),
      url: _.get(source, 'web_url','')
    };
  }

  async getCommitById(params: IGetCommitById | { id: string; sha: string }): Promise<ICommitOutput> {
    let id: string | undefined = _.get(params, 'id');
    if (_.isNil(id)) {
      super.validatGetCommitByIdParams(params);
      const { owner, repo } = params as IGetCommitById;
      id = encodeURIComponent(`${owner}/${repo}`);
    }
  
    const result = await this.request(`/api/v4/projects/${id}/repository/commits/${params.sha}`, 'GET', {});
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'id'),
      message: _.get(source, 'message'),
      source,
    };
  }


  private async requestList(path: string, params: any, method: any): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.request(path, method , params);
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
