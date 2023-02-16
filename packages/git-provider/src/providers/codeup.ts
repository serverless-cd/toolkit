import _, { map } from 'lodash';
import {
  IGetCommitById,
  IListBranch,
  IListRepo,
  IDeleteRepo,
  ICreateRepo,
  IHasRepo,
  ISetProtectBranch,
  IGetProtectBranch,
  ICheckRepoEmpty,
  IEnsureEmptyRepo,
  IGetRepoId,
} from '../types/codeup';
import { IAliConfig } from '../types/input';
import {
  IRepoOutput,
  IBranchOutput,
  ICommitOutput,
  IGetWebhookOutput,
  ICreateWebhookOutput,
  ICreateRepoOutput,
  IHasRepoOutput,
  IGetProtectBranchOutput,
  ICheckRepoEmptyOutput,
  IEnsureRepoOutput,
  IGetRepoIdOutput,
} from '../types/output';
import CodeupBase from './codeup-base';

const debug = require('debug')('serverless-cd:git-provider');
const { ROAClient } = require('@alicloud/pop-core');
const PARAMS = { page: 1, pageSize: 100 };

export default class Codeup extends CodeupBase {
  readonly client: any;
  private access_token: string;

  constructor(config: IAliConfig) {
    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }

    super(config);
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
    super.validateListReposParams(params);
    const { organization_id: organizationId } = params as IListRepo;

    const url = '/repository/list';
    const rows = await this.requestList(url, {
      ...PARAMS,
      organizationId,
    });
    debug('get repos list successfully');
    // this._test_debug_log(rows, 'list_repos');

    return _.map(rows, (row) => ({
      id: _.get(row, 'Id', _.get(row, 'id')) as unknown as number,
      name: _.get(row, 'name', ''),
      url: _.get(row, 'webUrl', ''),
      avatar_url: '',
      owner: organizationId,
      private: _.get(row, 'visibilityLevel', '0') === '0',
      description: _.get(row, 'description', ''),
      default_branch: _.get(row, 'default_branch', 'master'),
      source: row,
    }));
  }

  // https://help.aliyun.com/document_detail/461641.html
  async listBranches(params: IListBranch): Promise<IBranchOutput[]> {
    super.validateListBranchesParams(params);
    const { organization_id: organizationId, project_id: projectId } = params as IListBranch;

    const url = `/repository/${projectId}/branches`;
    const rows = await this.requestList(url, {
      ...PARAMS,
      organizationId,
    });
    debug('get branches list successfully');
    // this._test_debug_log(rows, 'list_branches');

    return _.map(rows, (row) => ({
      name: row.name,
      commit_sha: _.get(row, 'commit.id'),
      // commit_message: _.get(row, 'commit.message'),
      source: row,
    }));
  }

  // https://help.aliyun.com/document_detail/463000.html
  async getCommitById(params: IGetCommitById): Promise<ICommitOutput> {
    super.validateGetCommitByIdParams(params);
    const {
      organization_id: organizationId,
      project_id: projectId,
      sha,
    } = params as IGetCommitById;

    const url = `/repository/${projectId}/commits/${sha}`;
    const result = await this.request({
      url,
      params: { organizationId, accessToken: this.access_token },
    });
    debug('get commit by id successfully');
    const source = _.get(result, 'result', {});

    // this._test_debug_log(result, 'get_commit_by_id');

    return {
      sha: _.get(source, 'id'),
      message: _.get(source, 'message'),
      author: _.get(source, 'author.name'),
      email: _.get(source, 'author.email'),
      source,
    };
  }

  //创建一个repo: https://help.aliyun.com/document_detail/215681.html
  async createRepo(params: ICreateRepo): Promise<ICreateRepoOutput> {
    super.validateCreateRepoParams(params);
    const { name, organization_id: organizationId } = params as ICreateRepo;
    const visibilityLevel = _.get(params, 'visibility_level') || '10';
    const description = _.get(params, 'description') || '';

    const url = '/repository/create';
    const result = await this.request({
      url,
      method: 'POST',
      params: { organizationId },
      data: { name, visibilityLevel, description },
    });
    debug('create repo successfully');
    const source = _.get(result, 'result', {});
    return {
      id: _.get(source, 'id') as unknown as number,
      full_name: _.get(source, 'name', ''),
      url: _.get(source, 'webUrl', ''),
    };
  }

  //删除一个repo: https://help.aliyun.com/document_detail/460705.html
  async deleteRepo(params: IDeleteRepo): Promise<any> {
    super.validateDeleteRepoParams(params);
    const { project_id: repositoryId, organization_id: organizationId } = params as IDeleteRepo;

    const reason = _.get(params, 'repositoryId') || 'git-provider删除代码库';
    const url = `/repository/${repositoryId}/remove`;
    await this.request({
      url,
      method: 'POST',
      params: { organizationId, repositoryId },
      data: { reason },
    });
    debug('delete repo successfully');
  }

  //获取一个repo: https://help.aliyun.com/document_detail/460466.html
  async hasRepo(params: IHasRepo): Promise<IHasRepoOutput> {
    super.validateHasRepoParams(params);
    const { project_id: identity, organization_id: organizationId } = params as IHasRepo;

    const url = '/repository/get';
    try {
      const rows = await this.request({ url, params: { identity, organizationId } });
      debug('check whether has repo successfully');
      const source = _.get(rows, 'repository', {});
      return {
        isExist: true,
        id: _.get(source, 'id') as unknown as number,
        full_name: _.get(source, 'name', ''),
        url: _.get(source, 'webUrl', ''),
      };
    } catch (error) {
      return {
        isExist: false,
      };
    }
  }

  //判断一个repo是否为空: https://help.aliyun.com/document_detail/463001.html
  async checkRepoEmpty(params: ICheckRepoEmpty): Promise<ICheckRepoEmptyOutput> {
    super.validateRepoEmptyParams(params);
    const { project_id: project_id, organization_id: organizationId } = params as ICheckRepoEmpty;

    const url = `/repository/${project_id}/files/tree`;
    const rows = await this.request({ url, params: { project_id, organizationId } });
    debug('check repo empty successfully');
    const result = _.get(rows, 'result', []);
    return {
      isEmpty: result.length === 0,
    };
  }

  //设置一个保护分支: https://help.aliyun.com/document_detail/463003.html
  async setProtectionBranch(params: ISetProtectBranch): Promise<void> {
    super.validateProtectBranchParams(params);
    const {
      project_id: repositoryId,
      organization_id: organizationId,
      branch,
    } = params as ISetProtectBranch;

    const url = `/repository/${repositoryId}/protect_branches`;
    await this.request({
      url,
      method: 'POST',
      params: { organizationId, repositoryId },
      data: { branch, allowPushRoles: [40], allowMergeRoles: [40] },
    });
    debug('set protection branch successfully');
  }

  //获取一个保护分支: https://help.aliyun.com/document_detail/215681.html
  async getProtectionBranch(params: IGetProtectBranch): Promise<IGetProtectBranchOutput> {
    super.validateProtectBranchParams(params);
    const {
      project_id: repositoryId,
      organization_id: organizationId,
      branch,
    } = params as ISetProtectBranch;

    const url = `/repository/${repositoryId}/protect_branches`;
    const rows = await this.request({ url, params: { organizationId, repositoryId } });
    debug('get protection branch successfully');
    const array = _.get(rows, 'result', {});
    array.filter((item: any) => {
      return item.branch === branch;
    }, []);
    return {
      protected: !_.isEmpty(array),
    };
  }

  // 保证远程存在空的特定名称repo，返回其url
  async ensureEmptyRepo(params: IEnsureEmptyRepo): Promise<IEnsureRepoOutput> {
    //存在repo
    const { name: name, organization_id: organizationId } = params as IEnsureEmptyRepo;
    const identity = organizationId + '/' + name;
    const res = await this.hasRepo({
      project_id: organizationId + '/' + name,
      organization_id: organizationId,
    });
    const id = '' + _.get(res, 'id');
    if (res && res.isExist === false) {
      //不存在同名repo,直接创建
      const rows = await this.createRepo({
        name: name,
        organization_id: organizationId,
      });
      debug('ensure an empty repo successfully, which is new created');
      const url = _.get(rows, 'url') || '';
      return url;
    } else {
      //存在同名repo，检查是否为空
      let resEmpty = await this.checkRepoEmpty({
        project_id: id,
        organization_id: organizationId,
      });
      const isEmpty = _.get(resEmpty, 'isEmpty');
      if (isEmpty) {
        //同名repo为空，则直接返回该repo的url
        const url = _.get(res, 'url') || '';
        debug('ensure an empty repo successfully, which is not new created');
        return url;
      } else {
        //同名repo非空，抛出错误
        throw new Error(`There is a repo called ${identity}, which is not empty`);
      }
    }
  }

  // 根据repo name获取id: https://help.aliyun.com/document_detail/460466.html
  async getRepoId(params: IGetRepoId): Promise<IGetRepoIdOutput> {
    super.validateGetRepoId(params);
    const { name: identity, organization_id: organizationId } = params as IGetRepoId;

    const url = `/repository/get`;
    const rows = await this.request({ url, params: { organizationId, identity } });
    debug('get repo id successfully');
    const repo = _.get(rows, 'repository', '');
    const id = _.get(repo, 'id');
    return {
      id: id,
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
      params.page = (params.page as number) + 1;
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
      require('fs').writeFileSync(
        `packages/git-provider/__tests__/logs_codeup_${log}.log`,
        JSON.stringify(data, null, 2),
      );
    } catch (e: any) {
      console.log(`${log}.log error: ${e.message}`);
    }
  }
}