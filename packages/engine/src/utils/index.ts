import { map, uniqueId } from 'lodash';
import { IStepOptions, IUsesOptions } from '../types';
import { fs } from '@serverless-cd/core';
import { command } from 'execa';
const pkg = require('../../package.json');

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

export function getSteps(steps: IStepOptions[], childProcess: any[]) {
  const postArray = [] as IUsesOptions[];
  const runArray = map(steps, (item: IStepOptions) => {
    const usesItem = item as IUsesOptions;
    if (usesItem.uses) {
      // 本地路径调试时，不在安装依赖
      if (!fs.existsSync(usesItem.uses)) {
        const cp = command(`npm i ${usesItem.uses} --no-save`);
        childProcess.push(cp);
      }
      const app = require(usesItem.uses);
      usesItem.type = 'run';
      if (app.postRun) {
        postArray.push({ ...item, type: 'postRun' } as IUsesOptions);
      }
    }
    return item;
  });
  return [...runArray, ...postArray].map((item) => ({ ...item, stepCount: uniqueId() }));
}

export function getProcessTime(time: number) {
  return (Math.round((Date.now() - time) / 10) * 10) / 1000;
}
