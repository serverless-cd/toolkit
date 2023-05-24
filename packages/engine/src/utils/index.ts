import { IStepOptions, IPluginOptions } from '../types';
import { fs, lodash } from '@serverless-cd/core';
import { command } from 'execa';
import * as path from 'path';
import { INIT_STEP_COUNT, PLUGIN_INSTALL_PATH } from '../constants';
import { STEP_IF } from '../types'
import flatted from 'flatted';
const pkg = require('../../package.json');
const { uniqueId, get, omit, map, isEmpty, split, first, replace, values, includes } = lodash;

const debug = require('@serverless-cd/debug')('serverless-cd:engine');

export function getLogPath(filePath: string) {
  return `step_${filePath}.log`;
}

export function getDefaultInitLog() {
  return `Info: ${pkg.name}: ${pkg.version}, ${process.platform}-${process.arch}, node-${process.version}`;
}

export function getPluginRequirePath(val: string) {
  if (fs.existsSync(val)) return val;
  const prefix = getPluginPrefixPath(val);
  const [user, plugin] = split(val, '/');
  const [name] = split(plugin, '@');
  return path.join(prefix, 'node_modules', user, name);
}
export function getPluginPrefixPath(val: string) {
  const [user, name] = split(val, '/');
  return path.join(PLUGIN_INSTALL_PATH, user, name);
}

function getPluginInfo(val: string, packageJsonPath: string) {
  const [user, plugin] = split(val, '/');
  const [name, version] = split(plugin, '@');
  if (version) return val;
  const packageJson = require(packageJsonPath);
  const newVersion = values(packageJson.dependencies);
  return `${user}/${name}@${replace(first(newVersion), '^', '')}`;
}

export async function parsePlugin(steps: IStepOptions[], that: any) {
  if (isEmpty(steps)) return [];
  const installedPlugins = []
  const postArray = [] as IPluginOptions[];
  const runArray = [] as IStepOptions[];
  for (const item of steps) {
    item.stepCount = uniqueId()
    const pluginItem = item as IPluginOptions;
    if (pluginItem.plugin) {
      const originPlugin = pluginItem.plugin;
      const newPlugin = path.isAbsolute(pluginItem.plugin)
        ? pluginItem.plugin
        : path.join(that.context.cwd, pluginItem.plugin);
      // 本地路径时，不需要安装依赖
      if (fs.existsSync(newPlugin)) {
        pluginItem.plugin = newPlugin;
      } else if (!includes(installedPlugins, pluginItem.plugin)) {
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
        await that.onFinish(cp, INIT_STEP_COUNT);
        installedPlugins.push(pluginItem.plugin);
        that.logger.info(`install plugin ${getPluginInfo(pluginItem.plugin, packageJsonPath)} success`);
      }
      const app = require(getPluginRequirePath(pluginItem.plugin));
      pluginItem.type = 'run';
      // log显示的时候，仅需要展示最初的plugin值
      pluginItem.name = pluginItem.name || `Run ${originPlugin}`;
      if (app.postRun) {
        postArray.unshift({
          ...pluginItem,
          type: 'postRun',
          name: `Post Run ${get(pluginItem, 'name', originPlugin)}`,
          if: STEP_IF.ALWAYS,
          runStepCount: item.stepCount,
        } as IPluginOptions);
      }
    }
    runArray.push(item);
  }
  return [...runArray, ...map(postArray, (item) => ({ ...item, stepCount: uniqueId() }))];
}

export function getProcessTime(time: number) {
  return (Math.round((Date.now() - time) / 10) * 10) / 1000;
}

export const stringify = (value: any) => {
  try {
    const removeKey = 'logConfig.customLogger';
    const customLogger = get(value, removeKey);
    return customLogger ? JSON.stringify(omit(value, [removeKey])) : JSON.stringify(value);
  } catch (error) {
    return flatted.stringify(value);
  }
};
