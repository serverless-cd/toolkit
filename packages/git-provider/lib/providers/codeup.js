"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const { ROAClient } = require('@alicloud/pop-core');
const PARAMS = { page: 1, pageSize: 100 };
class Codeup {
    constructor(config) {
        const access_token = lodash_1.default.get(config, 'access_token');
        if (lodash_1.default.isEmpty(access_token)) {
            throw new Error('Access token is required');
        }
        this.access_token = access_token;
        this.client = new ROAClient({
            accessKeyId: lodash_1.default.get(config, 'accessKeyId'),
            accessKeySecret: lodash_1.default.get(config, 'accessKeySecret'),
            securityToken: lodash_1.default.get(config, 'securityToken'),
            endpoint: lodash_1.default.get(config, 'endpoint', 'https://devops.cn-hangzhou.aliyuncs.com'),
            apiVersion: '2021-06-25',
        });
    }
    // https://help.aliyun.com/document_detail/460465.html
    listRepos(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizationId = lodash_1.default.get(params, 'organization_id');
            if (!organizationId) {
                throw new Error('You must specify organization_id');
            }
            const url = '/repository/list';
            const rows = yield this.requestList(url, Object.assign(Object.assign({}, PARAMS), { organizationId }));
            // this._test_debug_log(rows, 'list_repos');
            return lodash_1.default.map(rows, row => ({
                id: lodash_1.default.get(row, 'Id', lodash_1.default.get(row, 'id')),
                name: lodash_1.default.get(row, 'name', ''),
                url: lodash_1.default.get(row, 'webUrl', ''),
                avatar_url: '',
                owner: organizationId,
                private: lodash_1.default.get(row, 'visibilityLevel', '0') === '0',
                description: lodash_1.default.get(row, 'description', ''),
                default_branch: lodash_1.default.get(row, 'default_branch', 'master'),
                source: row,
            }));
        });
    }
    // https://help.aliyun.com/document_detail/461641.html
    listBranches(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = lodash_1.default.get(params, 'project_id');
            const organizationId = lodash_1.default.get(params, 'organization_id');
            if (!projectId) {
                throw new Error('You must specify project_id');
            }
            if (!organizationId) {
                throw new Error('You must specify organization_id');
            }
            const url = `/repository/${projectId}/branches`;
            const rows = yield this.requestList(url, Object.assign(Object.assign({}, PARAMS), { organizationId }));
            // this._test_debug_log(rows, 'list_branches');
            return lodash_1.default.map(rows, (row) => ({
                name: row.name,
                commit_sha: lodash_1.default.get(row, 'commit.id'),
                // commit_message: _.get(row, 'commit.message'),
                source: row,
            }));
            ;
        });
    }
    // https://help.aliyun.com/document_detail/463000.html
    getCommitById(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = lodash_1.default.get(params, 'project_id');
            const organizationId = lodash_1.default.get(params, 'organization_id');
            const sha = lodash_1.default.get(params, 'sha');
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
            const result = yield this.request({ url, params: { organizationId } });
            const source = lodash_1.default.get(result, 'result', {});
            // this._test_debug_log(result, 'get_commit_by_id');
            return {
                sha: lodash_1.default.get(source, 'id'),
                message: lodash_1.default.get(source, 'message'),
                source,
            };
        });
    }
    requestList(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = [];
            let rowLength = 0;
            do {
                const res = yield this.request({ url, params });
                const { result: data } = res;
                rows = lodash_1.default.concat(rows, data);
                rowLength = lodash_1.default.size(data);
                params.page = params.page + 1;
            } while (rowLength === params.pageSize);
            return rows;
        });
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method = 'GET', url = '/', params = {}, data = {}, headers = {
                'Content-Type': 'application/json',
            }, options = {}, } = args;
            if (params.accessToken) {
                params.accessToken = this.access_token;
            }
            try {
                return yield this.client.request(method, url, params, JSON.stringify(data), headers, options);
            }
            catch (e) {
                throw e;
            }
        });
    }
    getRefCommit(params) {
        throw new Error('Method not implemented.');
    }
    listWebhook(params) {
        throw new Error('Method not implemented.');
    }
    createWebhook(params) {
        throw new Error('Method not implemented.');
    }
    updateWebhook(params) {
        throw new Error('Method not implemented.');
    }
    deleteWebhook(params) {
        throw new Error('Method not implemented.');
    }
    getWebhook(params) {
        throw new Error('Method not implemented.');
    }
    putFile(params) {
        throw new Error('Method not implemented.');
    }
    _test_debug_log(data, log = 'test') {
        try {
            require('fs').writeFileSync(`packages/git-provider/__tests__/logs_codeup_${log}.log`, JSON.stringify(data, null, 2));
        }
        catch (e) {
            console.log(`${log}.log error: ${e.message}`);
        }
    }
}
exports.default = Codeup;
//# sourceMappingURL=codeup.js.map