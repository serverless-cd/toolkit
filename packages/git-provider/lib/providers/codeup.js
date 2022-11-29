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
const PARAMS = { Page: 1, PageSize: 100, Order: 'astactivity_at' };
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
            endpoint: lodash_1.default.get(config, 'endpoint', 'https://codeup.cn-hangzhou.aliyuncs.com'),
            apiVersion: '2020-04-14',
        });
    }
    // https://help.aliyun.com/document_detail/215660.html
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
            let rows = [];
            const url = `/api/v3/projects/${projectId}/repository/branches`;
            const p = Object.assign(Object.assign({}, PARAMS), { OrganizationId: organizationId });
            // 查询指定页
            if (params.page) {
                p.Page = params.page;
                p.Order = params.order;
                p.PageSize = params.page_size;
                rows = yield this.request({ url, params: p });
            }
            else {
                rows = yield this.requestList(url, p);
            }
            return lodash_1.default.map(rows, (row) => ({
                name: row.BranchName, commit_sha: lodash_1.default.get(row, 'CommitInfo.Id'), source: row,
            }));
            ;
        });
    }
    // https://help.aliyun.com/document_detail/300470.html
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
            const url = `/api/v4/projects/${projectId}/repository/commits/${sha}`;
            const p = {
                OrganizationId: organizationId,
            };
            const result = yield this.request({ url, params: p });
            const source = lodash_1.default.get(result, 'Result', {});
            return {
                sha: lodash_1.default.get(source, 'Id'),
                message: lodash_1.default.get(source, 'Message'),
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
                console.log(res);
                const { Result: data } = res;
                rows = lodash_1.default.concat(rows, data);
                rowLength = lodash_1.default.size(data);
                params.Page = params.Page + 1;
            } while (rowLength === params.PageSize);
            return rows;
        });
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method = 'GET', url = '/', params = {}, data = {}, headers = {
                'Content-Type': 'application/json',
            }, options = {}, } = args;
            if (params.AccessToken) {
                params.AccessToken = this.access_token;
            }
            try {
                return yield this.client.request(method, url, params, JSON.stringify(data), headers, options);
            }
            catch (e) {
                console.log('request error:', e);
            }
        });
    }
    listRepos() {
        throw new Error('Method not implemented.');
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