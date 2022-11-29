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
const V5 = 'https://gitee.com/api/v5';
class Gitee extends base_1.default {
    putFile(params) {
        throw new Error('Method not implemented.');
    }
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
        this.access_token = access_token;
    }
    listOrgs() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.requestList('/user/orgs', this.getDefaultParame());
            return lodash_1.default.map(rows, (row) => ({
                id: row.id,
                org: row.name,
                source: row,
            }));
        });
    }
    // https://gitee.com/api/v5/swagger#/getV5UserRepos
    listRepos() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.requestList('/user/repos', lodash_1.default.defaults(this.getDefaultParame(), { affiliation: 'owner' }));
            return lodash_1.default.map(rows, (row) => ({
                id: row.id,
                name: row.name,
                avatar_url: lodash_1.default.get(row, 'owner.avatar_url'),
                owner: lodash_1.default.get(row, 'owner.login'),
                url: row.html_url,
                private: row.private,
                description: row.description,
                default_branch: row.default_branch,
                source: row,
            }));
        });
    }
    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranches
    listBranches(params) {
        const _super = Object.create(null, {
            validateListBranchsParams: { get: () => super.validateListBranchsParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateListBranchsParams.call(this, params);
            const { owner, repo } = params;
            const rows = yield this.requestList(`/repos/${owner}/${repo}/branches`, lodash_1.default.defaults(params, this.getDefaultParame()));
            return lodash_1.default.map(rows, (row) => ({
                name: row.name, commit_sha: lodash_1.default.get(row, 'commit.sha'), source: row,
            }));
        });
    }
    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoCommitsSha
    getCommitById(params) {
        const _super = Object.create(null, {
            validatGetCommitByIdParams: { get: () => super.validatGetCommitByIdParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validatGetCommitByIdParams.call(this, params);
            const { owner, repo, sha } = params;
            const result = yield this.requestV5(`/repos/${owner}/${repo}/commits/${sha}`, 'GET', {});
            const source = lodash_1.default.get(result, 'data', {});
            return {
                sha: lodash_1.default.get(source, 'sha'),
                message: lodash_1.default.get(source, 'commit.message'),
                source,
            };
        });
    }
    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranchesBranch
    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoReleasesTagsTag
    getRefCommit(params) {
        const _super = Object.create(null, {
            validateGetRefCommitParams: { get: () => super.validateGetRefCommitParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateGetRefCommitParams.call(this, params);
            const { owner, repo, ref } = params;
            if (lodash_1.default.startsWith(ref, 'refs/tags/')) {
                const tag = lodash_1.default.replace(ref, 'refs/tags/', '');
                const result = yield this.requestV5(`/repos/${owner}/${repo}/releases/tags/${tag}`, 'GET', {});
                const source = lodash_1.default.get(result, 'data', {});
                return {
                    sha: lodash_1.default.get(source, 'target_commitish'),
                    message: lodash_1.default.get(source, 'tag_name'),
                    source,
                };
            }
            const branch = lodash_1.default.startsWith(ref, 'refs/heads/') ? lodash_1.default.replace(ref, 'refs/heads/', '') : ref;
            const result = yield this.requestV5(`/repos/${owner}/${repo}/branches/${branch}`, 'GET', {});
            const source = lodash_1.default.get(result, 'data', {});
            return {
                sha: lodash_1.default.get(source, 'commit.sha'),
                message: lodash_1.default.get(source, 'commit.commit.message'),
                source,
            };
        });
    }
    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoHooks
    listWebhook(params) {
        const _super = Object.create(null, {
            validateListWebhookParams: { get: () => super.validateListWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateListWebhookParams.call(this, params);
            const { owner, repo } = params;
            const rows = yield this.requestList(`/repos/${owner}/${repo}/hooks`, lodash_1.default.defaults(params, this.getDefaultParame()));
            return lodash_1.default.map(rows, (row) => ({
                id: lodash_1.default.get(row, 'id'),
                url: lodash_1.default.get(row, 'url'),
                source: row,
            }));
        });
    }
    // https://gitee.com/api/v5/swagger#/postV5ReposOwnerRepoHooks
    createWebhook(params) {
        const _super = Object.create(null, {
            validateCreateWebhookParams: { get: () => super.validateCreateWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateCreateWebhookParams.call(this, params);
            const { owner, repo } = params;
            const p = this.getWebHookEvents(params);
            const result = yield this.requestV5(`/repos/${owner}/${repo}/hooks`, 'POST', p);
            const source = lodash_1.default.get(result, 'data', {});
            return {
                id: lodash_1.default.get(source, 'id'),
                source: source,
            };
        });
    }
    // https://gitee.com/api/v5/swagger#/patchV5ReposOwnerRepoHooksId
    updateWebhook(params) {
        const _super = Object.create(null, {
            validateUpdateWebhookParams: { get: () => super.validateUpdateWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateUpdateWebhookParams.call(this, params);
            const { owner, repo, hook_id } = params;
            const p = this.getWebHookEvents(params);
            yield this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'PATCH', p);
        });
    }
    // https://gitee.com/wss-gitee/git-action-test/hooks/1202839/edit#hook-logs
    getWebhook(params) {
        const _super = Object.create(null, {
            validateGetWebhookParams: { get: () => super.validateGetWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateGetWebhookParams.call(this, params);
            const { owner, repo, hook_id } = params;
            const result = yield this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'GET', params);
            const source = lodash_1.default.get(result, 'data', {});
            return {
                id: lodash_1.default.get(source, 'id'),
                url: lodash_1.default.get(source, 'url'),
                source: source,
            };
        });
    }
    // https://gitee.com/api/v5/swagger#/patchV5ReposOwnerRepoHooksId
    deleteWebhook(params) {
        const _super = Object.create(null, {
            validateDeleteWebhookParams: { get: () => super.validateDeleteWebhookParams }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.validateDeleteWebhookParams.call(this, params);
            const { owner, repo, hook_id } = params;
            yield this.requestV5(`/repos/${owner}/${repo}/hooks/${hook_id}`, 'DELETE', {});
        });
    }
    requestV5(path, method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = lodash_1.default.defaults(params, { access_token: this.access_token });
            return yield (0, axios_1.default)({
                method,
                url: `${V5}${path}`,
                params: p,
            });
        });
    }
    requestList(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = [];
            let rowLength = 0;
            do {
                const { data } = yield this.requestV5(url, 'GET', params);
                rows = lodash_1.default.concat(rows, data);
                rowLength = lodash_1.default.size(data);
                params.page = params.page + 1;
            } while (rowLength === params.per_page);
            return rows;
        });
    }
    getWebHookEvents(params) {
        const secret = lodash_1.default.get(params, 'secret');
        const p = {
            encryption_type: secret ? 1 : undefined,
            password: secret,
            url: lodash_1.default.get(params, 'url'),
            push_events: false,
            tag_push_events: false,
            merge_requests_events: false,
            issues_events: false,
        };
        const events = this.getWebhookDefaults(params);
        for (const event of events) {
            switch (event) {
                case 'push':
                    p.push_events = true;
                    break;
                case 'release':
                    p.tag_push_events = true;
                    break;
                case 'pull_request':
                    p.merge_requests_events = true;
                    break;
                case 'issues':
                    p.issues_events = true;
                    break;
                default:
                    console.error(`not supported event: ${event}`);
            }
        }
        return p;
    }
}
exports.default = Gitee;
//# sourceMappingURL=gitee.js.map