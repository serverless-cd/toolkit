"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const simple_git_1 = __importDefault(require("simple-git"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs-extra"));
const lodash_1 = require("lodash");
class Checkout {
    constructor(config) {
        this.config = config;
        this.existing = false;
        this.logger = config.logger;
        const execDir = config.execDir || os.tmpdir();
        this.config.execDir = path.isAbsolute(execDir) ? execDir : path.join(process.cwd(), execDir);
        this.logger.info(`execDir: ${this.config.execDir}`);
        fs.ensureDirSync(this.config.execDir);
        this.git = (0, simple_git_1.default)(this.config.execDir);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const { clone_url } = this.config;
            this.existing = fs.existsSync(path.join(this.config.execDir, '.git'));
            this.logger.info(`Existing: ${this.existing}`);
            if (this.existing) {
                this.logger.info(`Updating ${clone_url} into ${this.config.execDir}`);
                yield this.git.remote(['set-url', 'origin', this.getCloneUrl()]);
                yield this.checkout();
            }
            else {
                yield this.clone();
            }
        });
    }
    getCloneUrl() {
        const { provider, owner, clone_url, token } = this.config;
        const newUrl = (0, lodash_1.replace)(clone_url, /http(s)?:\/\//, '');
        if (provider === 'gitee') {
            return `https://${owner}:${token}@${newUrl}`;
        }
        if (provider === 'github') {
            return `https://${token}@${newUrl}`;
        }
        if (provider === 'gitlab') {
            const protocol = clone_url.startsWith('https') ? 'https' : 'http';
            return `${protocol}${owner}:${token}@${newUrl}`;
        }
        if (provider === 'codeup') {
            return `https://${owner}:${token}@${newUrl}`;
        }
    }
    clone() {
        return __awaiter(this, void 0, void 0, function* () {
            const { clone_url } = this.config;
            this.logger.info(`Cloning ${clone_url} into ${this.config.execDir}`);
            const cloneUrl = this.getCloneUrl();
            const inputs = this.checkInputs();
            this.logger.info(`clone params: ${JSON.stringify(inputs)}`);
            if (inputs.isNothing) {
                yield this.git.clone(cloneUrl, this.config.execDir, ['--depth', '1']);
            }
            else {
                yield this.git.clone(cloneUrl, this.config.execDir, ['--no-checkout']);
                yield this.checkout();
            }
            this.logger.info('Cloned successfully');
        });
    }
    checkout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag, branch, commit } = this.checkInputs();
            if (tag) {
                this.logger.info(`Checking out tag ${tag}`);
                yield this.git.checkout(tag, ['--force']);
                commit && (yield this.git.reset(['--hard', commit]));
            }
            else if (branch && commit) {
                this.logger.info(`Checking out branch ${branch} and commit ${commit}`);
                yield this.git.checkout(['--force', '-B', branch, commit]);
            }
            else if (commit) {
                this.logger.info(`Checking out commit ${commit}`);
                yield this.git.checkout(['--force', commit]);
            }
            const res = yield this.git.log(['--no-color', '-n', '1', "--format='HEAD is now at %h %s'"]);
            this.logger.info((0, lodash_1.get)(res, 'latest.hash'));
        });
    }
    checkInputs() {
        const { commit, ref = '' } = this.config;
        const branch = (0, lodash_1.startsWith)(ref, 'refs/heads/') ? (0, lodash_1.replace)(ref, 'refs/heads/', '') : undefined;
        const tag = (0, lodash_1.startsWith)(ref, 'refs/tags/') ? (0, lodash_1.replace)(ref, 'refs/tags/', '') : undefined;
        if (tag) {
            return { tag, commit };
        }
        if (branch && commit) {
            return { branch, commit };
        }
        if (commit) {
            return { commit };
        }
        return { isNothing: true };
    }
}
exports.default = Checkout;
//# sourceMappingURL=checkout.js.map