"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const input_1 = require("./types/input");
const lodash_1 = __importDefault(require("lodash"));
const base_1 = __importDefault(require("./providers/base"));
const providers_1 = __importDefault(require("./providers"));
module.exports = function (provider, config) {
    const ProviderGit = lodash_1.default.get(providers_1.default, provider);
    if (provider === input_1.PROVIDER.codeup) {
        return new ProviderGit(config);
    }
    const isExtendsBase = lodash_1.default.get(ProviderGit, 'prototype') instanceof base_1.default;
    if (!isExtendsBase) {
        throw new Error(`Provider ${provider} does not support`);
    }
    return new ProviderGit(config);
};
//# sourceMappingURL=index.js.map