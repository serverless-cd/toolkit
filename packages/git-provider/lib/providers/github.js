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
const core_1 = require("@octokit/core");
const base_1 = __importDefault(require("./base"));
class Github extends base_1.default {
    constructor(config) {
        super(config);
        this.getDefaultParame = () => ({
            per_page: 100,
            page: 1,
            sort: 'updated',
        });
        const access_token = lodash_1.default.get(config, 'access_token');
        if (lodash_1.default.isEmpty(access_token)) {
            throw new Error('Access token is required');
        }
        this.octokit = new core_1.Octokit({ auth: access_token });
    }
    // https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    putFile(params) {
        const _super = Object.create(null, {
            validatePutFileParams: { get: () => super.validatePutFileParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validatePutFileParams.call(this, params);
            params.content = Buffer.from(params.content).toString('base64');
            yield this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
        });
    }
    listRepos() {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = [];
            // 获取用户的仓库：https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user
            const userRepos = yield this.requestList('GET /user/repos', lodash_1.default.defaults(this.getDefaultParame(), { affiliation: 'owner' }));
            console.log('\tlist repo length: ', userRepos.length);
            return lodash_1.default.map(userRepos, (row) => ({
                id: row.id,
                name: row.name,
                avatar_url: lodash_1.default.get(row, 'owner.avatar_url'),
                owner: lodash_1.default.get(row, 'owner.login'),
                url: row.clone_url,
                private: row.private,
                description: row.description,
                default_branch: row.default_branch,
                source: row,
            }));
        });
    }
    ;
    // 获取组织的仓库: https://docs.github.com/cn/rest/repos/repos#list-organization-repositories
    listOrgRepos(org) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('get org repository: ', org);
            const orgRepos = yield this.requestList('GET /orgs/{org}/repos', lodash_1.default.defaults(this.getDefaultParame(), { org }));
            const rows = orgRepos.filter(orgRepo => orgRepo.permissions.admin);
            console.log('orgRepos length: ', orgRepos.length, '; admin length: ', rows.length);
            return lodash_1.default.map(rows, (row) => ({
                id: row.id,
                name: row.name,
                avatar_url: lodash_1.default.get(row, 'owner.avatar_url'),
                owner: lodash_1.default.get(row, 'owner.login'),
                url: row.clone_url,
                private: row.private,
                description: row.description,
                default_branch: row.default_branch,
                source: row,
            }));
        });
    }
    listOrgs() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取用户组织：https://docs.github.com/en/rest/orgs/orgs#list-organizations-for-the-authenticated-user
            const orgs = yield this.requestList('GET /user/orgs', this.getDefaultParame());
            return lodash_1.default.map(orgs, row => ({
                org: row.login,
                id: row.id,
                source: row,
            }));
        });
    }
    // https://docs.github.com/en/rest/branches/branches#list-branches
    listBranches(params) {
        const _super = Object.create(null, {
            validateListBranchsParams: { get: () => super.validateListBranchsParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateListBranchsParams.call(this, params);
            const rows = yield this.requestList('GET /repos/{owner}/{repo}/branches', lodash_1.default.defaults(params, this.getDefaultParame()));
            return lodash_1.default.map(rows, (row) => ({
                name: row.name, commit_sha: lodash_1.default.get(row, 'commit.sha'), source: row,
            }));
        });
    }
    // https://docs.github.com/en/rest/commits/comments#get-a-commit-comment
    // GET /repos/{owner}/{repo}/comments/{sha}  => GET /repos/{owner}/{repo}/commits/{sha}
    getCommitById(params) {
        const _super = Object.create(null, {
            validatGetCommitByIdParams: { get: () => super.validatGetCommitByIdParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validatGetCommitByIdParams.call(this, params);
            const result = yield this.octokit.request('GET /repos/{owner}/{repo}/commits/{sha}', params);
            const source = lodash_1.default.get(result, 'data', {});
            return {
                sha: lodash_1.default.get(source, 'sha', ''),
                message: lodash_1.default.get(source, 'commit.message', ''),
                source,
            };
        });
    }
    // https://docs.github.com/en/rest/commits/commits#get-a-commit
    getRefCommit(params) {
        const _super = Object.create(null, {
            validateGetRefCommitParams: { get: () => super.validateGetRefCommitParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateGetRefCommitParams.call(this, params);
            const result = yield this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', params);
            const source = lodash_1.default.get(result, 'data', {});
            return {
                sha: lodash_1.default.get(source, 'sha', ''),
                message: lodash_1.default.get(source, 'commit.message', ''),
                source,
            };
        });
    }
    // https://docs.github.com/en/rest/webhooks/repos
    listWebhook(params) {
        const _super = Object.create(null, {
            validateListWebhookParams: { get: () => super.validateListWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateListWebhookParams.call(this, params);
            const rows = yield this.requestList('GET /repos/{owner}/{repo}/hooks', lodash_1.default.defaults(params, this.getDefaultParame()));
            return lodash_1.default.map(rows, (row) => ({
                id: row.id, url: lodash_1.default.get(row, 'config.url'), source: row,
            }));
        });
    }
    // https://docs.github.com/en/rest/webhooks/repos#create-a-repository-webhook
    createWebhook(params) {
        const _super = Object.create(null, {
            validateCreateWebhookParams: { get: () => super.validateCreateWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateCreateWebhookParams.call(this, params);
            const p = {
                owner: params.owner,
                repo: params.repo,
                active: true,
                events: this.getWebhookDefaults(params),
                config: {
                    url: params.url,
                    content_type: 'json',
                    insecure_ssl: '0',
                    secret: params.secret,
                },
            };
            const result = yield this.octokit.request('POST /repos/{owner}/{repo}/hooks', p);
            const source = lodash_1.default.get(result, 'data', {});
            return { id: lodash_1.default.get(source, 'id'), source };
        });
    }
    updateWebhook(params) {
        const _super = Object.create(null, {
            validateUpdateWebhookParams: { get: () => super.validateUpdateWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateUpdateWebhookParams.call(this, params);
            const p = {
                hook_id: params.hook_id,
                owner: params.owner,
                repo: params.repo,
                active: true,
                events: this.getWebhookDefaults(params),
                config: {
                    url: params.url,
                    content_type: 'json',
                    insecure_ssl: '0',
                    secret: params.secret,
                },
            };
            yield this.octokit.request('PATCH /repos/{owner}/{repo}/hooks/{hook_id}', p);
        });
    }
    getWebhook(params) {
        const _super = Object.create(null, {
            validateGetWebhookParams: { get: () => super.validateGetWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateGetWebhookParams.call(this, params);
            const result = yield this.octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/config', params);
            const source = lodash_1.default.get(result, 'data', {});
            return {
                id: params.hook_id,
                url: lodash_1.default.get(source, 'url', ''),
                source,
            };
        });
    }
    deleteWebhook(params) {
        const _super = Object.create(null, {
            validateDeleteWebhookParams: { get: () => super.validateDeleteWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateDeleteWebhookParams.call(this, params);
            yield this.octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', params);
        });
    }
    request(path, _method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.octokit.request(path, params);
        });
    }
    ;
    requestList(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = [];
            let rowLength = 0;
            do {
                const { data } = yield this.octokit.request(path, params);
                rows = lodash_1.default.concat(rows, data);
                rowLength = lodash_1.default.size(data);
                params.page = params.page + 1;
            } while (rowLength === params.per_page);
            return rows;
        });
    }
}
exports.default = Github;
//# sourceMappingURL=github.js.map