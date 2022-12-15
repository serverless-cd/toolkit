import { IStepOptions, IPluginOptions } from '../types';
import { fs, lodash } from '@serverless-cd/core';
import { command, Options } from 'execa';
import * as path from 'path';
import { PLUGIN_INSTALL_PATH } from '../constants';
const pkg = require('../../package.json');
const { uniqueId, filter, includes } = lodash;

export function getLogPath(filePath: string) {
  return `step_${filePath}.log`;
}

export function getDefaultInitLog() {
  return `Info: ${pkg.name}: ${pkg.version}, ${process.platform}-${process.arch}, node-${process.version}`;
}

export function getScript(val: string) {
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

export function getPluginRequirePath(val: string) {
  if (fs.existsSync(val)) return val;
  const prefix = getPluginPrefixPath(val);
  return path.join(prefix, 'node_modules', val);
}
export function getPluginPrefixPath(val: string) {
  const [user, name] = val.split('/');
  return path.join(PLUGIN_INSTALL_PATH, user, name);
}

export async function parsePlugin(steps: IStepOptions[], that: any) {
  const postArray = [] as IPluginOptions[];
  const runArray = [] as IStepOptions[];
  for (const item of steps) {
    const pluginItem = item as IPluginOptions;
    if (pluginItem.plugin) {
      const originPlugin = pluginItem.plugin;
      const newPlugin = path.isAbsolute(pluginItem.plugin)
        ? pluginItem.plugin
        : path.join(that.context.cwd, pluginItem.plugin);
      // 本地路径时，不需要安装依赖
      if (fs.existsSync(newPlugin)) {
        pluginItem.plugin = newPlugin;
      } else {
        that.logger.info(`install plugin ${pluginItem.plugin}...`);
        const pluginPrefixPath = getPluginPrefixPath(pluginItem.plugin);
        fs.ensureDirSync(pluginPrefixPath);
        const packageJsonPath = path.join(pluginPrefixPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
          fs.writeFileSync(packageJsonPath, JSON.stringify({ dependencies: {} }, null, 2));
        }
        const cp = command(
          `npm install ${pluginItem.plugin} --registry=https://registry.npmmirror.com`,
          { cwd: pluginPrefixPath },
        );
        that.childProcess.push(cp);
        await that.onFinish(cp);
        that.logger.info(`install plugin ${pluginItem.plugin} success`);
      }
      const app = require(getPluginRequirePath(pluginItem.plugin));
      pluginItem.type = 'run';
      // log显示的时候，仅需要展示最初的plugin值
      pluginItem.name = pluginItem.name || `Run ${originPlugin}`;
      if (app.postRun) {
        postArray.push({
          ...pluginItem,
          type: 'postRun',
          name: `Post Run ${originPlugin}`,
        } as IPluginOptions);
      }
    }
    runArray.push(item);
  }
  return [...runArray, ...postArray].map((item) => ({ ...item, stepCount: uniqueId() }));
}

export function getProcessTime(time: number) {
  return (Math.round((Date.now() - time) / 10) * 10) / 1000;
}

/**
 * @desc 执行shell指令，主要处理 >,>>,||,|,&&等case,直接加shell:true的参数
 * @param runStr 执行指令的字符串
 * @param options
 */
export function runScript(runStr: string, options: Options<string>) {
  const shellTokens = ['>', '>>', '|', '||', '&&'];
  const runnerTokens = filter(shellTokens, (item) => includes(runStr, item));
  if (Array.isArray(runnerTokens) && runnerTokens.length > 0) {
    return command(runStr, { ...options, shell: true });
  } else {
    return command(runStr, options);
  }
}

export function outputLog(logger: any, message: any) {
  process.env['CLI_VERSION'] ? logger.debug(message) : logger.info(message);
}
