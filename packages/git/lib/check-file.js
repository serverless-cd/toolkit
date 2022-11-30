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
function checkFile(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { file, clone_url, ref } = config;
        const baseDir = path.join(os.tmpdir(), path.basename(clone_url, '.git'));
        console.log('baseDir', baseDir);
        let git = {};
        if (fs.existsSync(baseDir)) {
            console.log(`baseDir ${baseDir} exists`);
            git = (0, simple_git_1.default)(baseDir);
        }
        else {
            fs.ensureDirSync(baseDir);
            git = (0, simple_git_1.default)(baseDir);
            const newCloneUrl = getCloneUrl(config);
            for (let index = 0; index < 3; index++) {
                try {
                    console.log(`git clone ${newCloneUrl} ${baseDir} --no-checkout : ${index + 1} times`);
                    yield git.clone(newCloneUrl, baseDir, ['--no-checkout']);
                    break;
                }
                catch (error) {
                    if (index === 2) {
                        fs.removeSync(baseDir);
                        throw new Error(`git clone ${newCloneUrl} ${baseDir} --no-checkout failed`);
                    }
                }
            }
            console.log('clone success');
        }
        const branch = (0, lodash_1.startsWith)(ref, 'refs/heads/') ? (0, lodash_1.replace)(ref, 'refs/heads/', '') : undefined;
        let isExist = false;
        try {
            const cmd = branch ? `origin/${branch}:${file}` : `${ref}:${file}`;
            console.log(`git cat-file -e ${cmd}`);
            yield git.raw(['cat-file', '-e', cmd]);
            console.log('cat-file success');
            isExist = true;
        }
        catch (error) {
            isExist = false;
            console.log('cat-file failure');
        }
        if (isExist)
            return true;
        if (['.yaml', '.yml'].includes(path.extname(file))) {
            try {
                const newFile = (0, lodash_1.replace)(file, path.extname(file), path.extname(file) === '.yaml' ? '.yml' : '.yaml');
                const cmd = branch ? `origin/${branch}:${newFile}` : `${ref}:${newFile}`;
                console.log(`git cat-file -e ${cmd}`);
                yield git.raw(['cat-file', '-e', cmd]);
                console.log('cat-file success');
                isExist = true;
            }
            catch (error) {
                isExist = false;
            }
        }
        return isExist;
    });
}
function getCloneUrl({ provider, owner, clone_url, token }) {
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
exports.default = checkFile;
//# sourceMappingURL=check-file.js.map