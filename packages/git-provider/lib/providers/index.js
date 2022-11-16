"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../types/input");
const github_1 = __importDefault(require("./github"));
const gitee_1 = __importDefault(require("./gitee"));
const codeup_1 = __importDefault(require("./codeup"));
const gitlab_1 = __importDefault(require("./gitlab"));
exports.default = {
    [input_1.PROVIDER.github]: github_1.default,
    [input_1.PROVIDER.gitee]: gitee_1.default,
    [input_1.PROVIDER.codeup]: codeup_1.default,
    [input_1.PROVIDER.gitlab]: gitlab_1.default,
};
//# sourceMappingURL=index.js.map