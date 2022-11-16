"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class Base {
    constructor(_config) { }
    getWebhookDefaults(params) {
        return lodash_1.default.get(params, 'events', ['push', 'release']);
    }
    validatePutFileParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'path')) {
            throw new Error('You must specify path');
        }
        if (!lodash_1.default.has(params, 'message')) {
            throw new Error('You must specify message');
        }
        if (!lodash_1.default.has(params, 'content')) {
            throw new Error('You must specify content');
        }
    }
    validateListBranchsParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
    }
    validateGetRefCommitParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'ref')) {
            throw new Error('You must specify repo');
        }
    }
    validateListWebhookParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
    }
    validateCreateWebhookParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'url')) {
            throw new Error('You must specify url');
        }
        if (lodash_1.default.has(params, 'events') && !lodash_1.default.isArray(lodash_1.default.get(params, 'events'))) {
            throw new Error('You must specify events, array of strings');
        }
    }
    validateUpdateWebhookParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'url')) {
            throw new Error('You must specify url');
        }
        if (!lodash_1.default.has(params, 'hook_id')) {
            throw new Error('You must specify hook_id');
        }
    }
    validateGetWebhookParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'hook_id')) {
            throw new Error('You must specify hook_id');
        }
    }
    validateDeleteWebhookParams(params) {
        if (!lodash_1.default.has(params, 'owner')) {
            throw new Error('You must specify owner');
        }
        if (!lodash_1.default.has(params, 'repo')) {
            throw new Error('You must specify repo');
        }
        if (!lodash_1.default.has(params, 'hook_id')) {
            throw new Error('You must specify hook_id');
        }
    }
    _test_debug_log(data, log = 'test') {
        try {
            require('fs').writeFileSync(`${log}.log`, JSON.stringify(data, null, 2));
        }
        catch (e) {
            console.log(`${log}.log error: ${e.message}`);
        }
    }
}
exports.default = Base;
//# sourceMappingURL=base.js.map