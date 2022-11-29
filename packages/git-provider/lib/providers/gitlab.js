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
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const base_1 = __importDefault(require("./base"));
const PARAMS = {
    pagination: 1,
    per_page: 100,
};
class Gitlab extends base_1.default {
    constructor(config) {
        const access_token = lodash_1.default.get(config, 'access_token');
        const endpoint = lodash_1.default.get(config, 'endpoint');
        if (lodash_1.default.isEmpty(access_token)) {
            throw new Error('Access token is required');
        }
        if (lodash_1.default.isEmpty(endpoint)) {
            throw new Error('Endpoint is required');
        }
        super(config);
        this.access_token = access_token;
        this.endpoint = endpoint;
    }
    // https://www.bookstack.cn/read/gitlab-doc-zh/docs-296.md#7tkudr
    listBranches(params) {
        const _super = Object.create(null, {
            validateListBranchsParams: { get: () => super.validateListBranchsParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let id = lodash_1.default.get(params, 'id');
            if (lodash_1.default.isNil(id)) {
                _super.validateListBranchsParams.call(this, params);
                const { owner, repo } = params;
                id = encodeURIComponent(`${owner}/${repo}`);
            }
            const rows = yield this.requestList(`/api/v4/projects/${id}/repository/branches`, PARAMS);
            return lodash_1.default.map(rows, (row) => ({
                name: row.name, commit_sha: lodash_1.default.get(row, 'commit.id'), source: row,
            }));
        });
    }
    getCommitById(params) {
        const _super = Object.create(null, {
            validatGetCommitByIdParams: { get: () => super.validatGetCommitByIdParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let id = lodash_1.default.get(params, 'id');
            if (lodash_1.default.isNil(id)) {
                _super.validatGetCommitByIdParams.call(this, params);
                const { owner, repo } = params;
                id = encodeURIComponent(`${owner}/${repo}`);
            }
            const result = yield this.request(`/api/v4/projects/${id}/repository/commits/${params.sha}`, 'GET', {});
            const source = lodash_1.default.get(result, 'data', {});
            return {
                sha: lodash_1.default.get(source, 'id'),
                message: lodash_1.default.get(source, 'message'),
                source,
            };
        });
    }
    requestList(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = [];
            let rowLength = 0;
            do {
                const { data } = yield this.request(path, 'GET', params);
                rows = lodash_1.default.concat(rows, data);
                rowLength = lodash_1.default.size(data);
                params.pagination = params.pagination + 1;
            } while (rowLength === params.per_page);
            return rows;
        });
    }
    request(path, method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = lodash_1.default.defaults(params, { private_token: this.access_token });
            console.log('endpoint: ', `${this.endpoint}${path}`);
            return yield (0, axios_1.default)({
                method,
                url: `${this.endpoint}${path}`,
                params: p,
            });
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
}
exports.default = Gitlab;
//# sourceMappingURL=gitlab.js.map