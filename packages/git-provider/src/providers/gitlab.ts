import axios from 'axios';
import _ from 'lodash';
import {
  IListBranchs,
  IGetRefCommit,
  IListWebhook,
  ICreateWebhook,
  IUpdateWebhook,
  IDeleteWebhook,
  IGetWebhook,
  IPutFile,
  IGitConfig,
  IGetCommitById,
  ICreateFork,
  IDeleteRepo,
  ICreateRepo,
  IHasRepo,
  ISetProtectBranch,
  IGetProtectBranch,
  IUnprotectBranch,
  ICheckRepoEmpty,
  IEnsureEmptyRepo,
} from '../types/input';
import {
  IRepoOutput,
  IBranchOutput,
  ICommitOutput,
  IGetWebhookOutput,
  ICreateWebhookOutput,
  IForkOutput,
  ICreateRepoOutput,
  IHasRepoOutput,
  IGetProtectBranchOutput,
  ICheckRepoEmptyOutput,
  IEnsureRepoOutput,
} from '../types/output';
import Base from './base';
import makeDebug from 'debug';

const PARAMS = {
  pagination: 1,
  per_page: 100,
};
const debug = makeDebug('serverless-cd/git-provider');
debug.enabled = true;

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

    const rows = await this.requestList(
      `/api/v4/projects/${id}/repository/branches`,
      PARAMS,
      'GET',
    );
    debug('get repo branch successfully');
    return _.map(rows, (row) => ({
      name: row.name,
      commit_sha: _.get(row, 'commit.id'),
      source: row,
    }));
  }

  //https://docs.gitlab.com/ee/api/projects.html#fork-project
  async createFork(params: ICreateFork): Promise<IForkOutput> {
    super.validateCreateForkParams(params);
    const { owner, repo } = params as ICreateFork;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const rows = await this.request(`/api/v4/projects/${id}/fork`, 'POST', params);
    debug('create fork successfully');
    const source = _.get(rows, 'data', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'path_with_namespace', ''),
      url: _.get(source, 'web_url', ''),
    };
  }

  //创建一个repo: https://docs.gitlab.com/ee/api/projects.html#create-project
  async createRepo(params: ICreateRepo): Promise<ICreateRepoOutput> {
    super.validateCreateRepoParams(params);

    const rows = await this.request(`api/v4/projects`, 'POST', params);
    debug('create repo successfully');
    const source = _.get(rows, 'data', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'path_with_namespace', ''),
      url: _.get(source, 'web_url', ''),
    };
  }

  //删除一个repo: https://docs.gitlab.com/ee/api/projects.html#delete-project
  async deleteRepo(params: IDeleteRepo): Promise<void> {
    super.validateDeleteRepoParams(params);
    const { owner, repo } = params as IDeleteRepo;
    const id = encodeURIComponent(`${owner}/${repo}`);
    await this.request(`api/v4/projects/${id}`, 'DELETE', params);
    debug('delete repo successfully');
  }

  //获取一个repo: https://docs.gitlab.com/ee/api/projects.html#get-single-project
  async hasRepo(params: IHasRepo): Promise<IHasRepoOutput> {
    super.validateHasRepoParams(params);
    const { owner, repo } = params as IHasRepo;
    const id = encodeURIComponent(`${owner}/${repo}`);
    try {
      const rows = await this.request(`api/v4/projects/${id}`, 'GET', params);
      debug('check whether has repo successfully');
      const source = _.get(rows, 'data', {});
      return {
        isExist: true,
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'path_with_namespace', ''),
        url: _.get(source, 'web_url', ''),
      };
    } catch (error) {
      return {
        isExist: false,
      };
    }
  }

  //判断一个repo是否为空: https://docs.gitlab.com/ee/api/commits.html#list-repository-commits
  async checkRepoEmpty(params: ICheckRepoEmpty): Promise<ICheckRepoEmptyOutput> {
    super.validateRepoEmptyParams(params);
    const { owner, repo } = params as IHasRepo;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const rows = await this.request(`api/v4/projects/${id}/repository/commits`, 'GET', params);
    debug('check repo empty successfully');
    const source = _.get(rows, 'data', {});
    return {
      isEmpty: source.length === 0,
    };
  }

  //设置保护分支: https://docs.gitlab.com/ee/api/protected_branches.html#protect-repository-branches
  async setProtectionBranch(params: ISetProtectBranch): Promise<void> {
    super.validateProtectBranchParams(params);
    const { owner, repo } = params;
    const id = encodeURIComponent(`${owner}/${repo}`);
    await this.request(`api/v4/projects/${id}/protected_branches`, 'POST', {
      id,
      name: params.branch,
      ...params,
    });
    debug('set protection branch successfully');
  }

  //删除保护分支: https://docs.gitlab.com/ee/api/protected_branches.html#unprotect-repository-branches
  async unProtectionBranch(params: IUnprotectBranch): Promise<any> {
    const { owner, repo, branch } = params;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const parameters = {
      id: id,
      name: params.branch,
    };
    const res = await this.request(
      `api/v4/projects/${id}/protected_branches/${branch}`,
      'DELETE',
      parameters,
    );
    debug('delete protection branch successfully');
    return res;
  }

  //获取保护分支信息: https://docs.gitlab.com/ee/api/protected_branches.html#get-a-single-protected-branch-or-wildcard-protected-branch
  async getProtectionBranch(params: IGetProtectBranch): Promise<IGetProtectBranchOutput> {
    super.validateGetProtectBranchParams(params);
    const { owner, repo, branch: name } = params;
    const id = encodeURIComponent(`${owner}/${repo}`);
    const res = await this.request(
      `api/v4/projects/${id}/protected_branches/${name}`,
      'GET',
      params,
    );
    debug('get protection branch successfully');
    const source = _.get(res, 'data', {});
    return {
      protected: _.isObject(source),
    };
  }

  // 保证远程存在空的特定名称repo，返回其url
  async ensureEmptyRepo(params: IEnsureEmptyRepo): Promise<IEnsureRepoOutput> {
    //存在repo
    const { owner, repo } = params;
    const res = await this.hasRepo({ owner: owner, repo: repo });
    if (res && res.isExist === false) {
      //不存在同名repo,直接创建
      const rows = await this.createRepo({
        name: repo,
      });
      debug('ensure an empty repo successfully, which is new created');
      const url = _.get(rows, 'url') || '';
      return url;
    } else {
      //存在同名repo，检查是否为空
      let resEmpty = await this.checkRepoEmpty({ owner: owner, repo: repo });
      const isEmpty = _.get(resEmpty, 'isEmpty');
      if (isEmpty) {
        //同名repo为空，则直接返回该repo的url
        const url = _.get(res, 'url') || '';
        debug('ensure an empty repo successfully, which is not new created');
        return url;
      } else {
        //同名repo非空，抛出错误
        throw new Error(`There is a repo called ${repo}, which is not empty`);
      }
    }
  }

  async getCommitById(
    params: IGetCommitById | { id: string; sha: string },
  ): Promise<ICommitOutput> {
    let id: string | undefined = _.get(params, 'id');
    if (_.isNil(id)) {
      super.validatGetCommitByIdParams(params);
      const { owner, repo } = params as IGetCommitById;
      id = encodeURIComponent(`${owner}/${repo}`);
    }

    const result = await this.request(
      `/api/v4/projects/${id}/repository/commits/${params.sha}`,
      'GET',
      {},
    );
    debug('get commit by id successfully');
    const source = _.get(result, 'data', {});

    return {
      sha: _.get(source, 'id'),
      message: _.get(source, 'message'),
      author: _.get(source, 'author_name'),
      email: _.get(source, 'author_email'),
      source,
    };
  }

  private async requestList(path: string, params: any, method: any): Promise<any[]> {
    let rows: any[] = [];
    let rowLength = 0;
    do {
      const { data } = await this.request(path, method, params);
      rows = _.concat(rows, data);
      rowLength = _.size(data);
      params.pagination = (params.pagination as number) + 1;
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
