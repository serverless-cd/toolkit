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
exports.outputLog = exports.runScript = exports.getProcessTime = exports.parsePlugin = exports.getScript = exports.getDefaultInitLog = exports.getLogPath = void 0;
const lodash_1 = require("lodash");
const core_1 = require("@serverless-cd/core");
const execa_1 = require("execa");
const lodash_2 = __importDefault(require("lodash"));
const pkg = require('../../package.json');
function getLogPath(filePath) {
    return `step_${filePath}.log`;
}
exports.getLogPath = getLogPath;
function getDefaultInitLog() {
    return `Info: ${pkg.name}: ${pkg.version}, ${process.platform}-${process.arch}, node-${process.version}`;
}
exports.getDefaultInitLog = getDefaultInitLog;
function getScript(val) {
    return `
    return async function run({ $, cd, fs, glob, chalk, YAML, which, os, path, logger }) {
      $.log = (entry)=> {
        switch (entry.kind) {
          case 'cmd':
            logger.info(entry.cmd)
            break
          case 'stdout':
          case 'stderr':
            logger.info(entry.data.toString())
            break
          case 'cd':
            logger.info('$ ' + chalk.greenBright('cd') + ' ' +  entry.dir)
            break
        }
      }
      ${val}
    }`;
}
exports.getScript = getScript;
function parsePlugin(steps, that) {
    return __awaiter(this, void 0, void 0, function* () {
        const postArray = [];
        const runArray = [];
        for (const item of steps) {
            const pluginItem = item;
            if (pluginItem.plugin) {
                // 本地路径时，不需要安装依赖
                if (!core_1.fs.existsSync(pluginItem.plugin)) {
                    // --no-save
                    that.logger.info(`install plugin ${pluginItem.plugin}...`);
                    const cp = (0, execa_1.command)(`npm install ${pluginItem.plugin} --registry=https://registry.npmmirror.com`);
                    that.childProcess.push(cp);
                    yield that.onFinish(cp);
                    that.logger.info(`install plugin ${pluginItem.plugin} success`);
                }
                const app = require(pluginItem.plugin);
                pluginItem.type = 'run';
                if (app.postRun) {
                    postArray.push(Object.assign(Object.assign({}, item), { type: 'postRun' }));
                }
            }
            runArray.push(item);
        }
        return [...runArray, ...postArray].map((item) => (Object.assign(Object.assign({}, item), { stepCount: (0, lodash_1.uniqueId)() })));
    });
}
exports.parsePlugin = parsePlugin;
function getProcessTime(time) {
    return (Math.round((Date.now() - time) / 10) * 10) / 1000;
}
exports.getProcessTime = getProcessTime;
/**
 * @desc 执行shell指令，主要处理 >,>>,||,|,&&等case,直接加shell:true的参数
 * @param runStr 执行指令的字符串
 * @param options
 */
function runScript(runStr, options) {
    const shellTokens = ['>', '>>', '|', '||', '&&'];
    const runnerTokens = lodash_2.default.filter(shellTokens, (item) => lodash_2.default.includes(runStr, item));
    if (Array.isArray(runnerTokens) && runnerTokens.length > 0) {
        return (0, execa_1.command)(runStr, Object.assign(Object.assign({}, options), { shell: true }));
    }
    else {
        return (0, execa_1.command)(runStr, options);
    }
}
exports.runScript = runScript;
function outputLog(logger, message) {
    process.env['CLI_VERSION'] ? logger.debug(message) : logger.info(message);
}
exports.outputLog = outputLog;
//# sourceMappingURL=index.js.map