import { IStepOptions, IPluginOptions } from '../types';
import { fs, lodash } from '@serverless-cd/core';
import { command } from 'execa';
import * as path from 'path';
import { PLUGIN_INSTALL_PATH } from '../constants';
import debug from 'debug';
const pkg = require('../../package.json');
const { uniqueId } = lodash;

export function getLogPath(filePath: string) {
  return `step_${filePath}.log`;
}

export function getDefaultInitLog() {
  return `Info: ${pkg.name}: ${pkg.version}, ${process.platform}-${process.arch}, node-${process.version}`;
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
        const cmd = `npm install ${pluginItem.plugin} --registry=https://registry.npmmirror.com`;
        debug(`install plugin: ${cmd}`);
        const cp = command(cmd, { cwd: pluginPrefixPath });
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

export function outputLog(logger: any, message: any) {
  process.env['CLI_VERSION'] ? logger.debug(message) : logger.info(message);
}
