import { setServerlessCdVariable } from '@serverless-cd/core';
import path from 'path';
import fs from 'fs-extra';
import git from './lib/git';
import Logger from './lib/logger';
import * as inputHelper from './lib/input-helper';
import * as stateHelper from './lib/state-helper';

const jobId = Date.now();
const logPath = path.join(process.cwd(), 'checkout', `${jobId}.log`);
const logger = new Logger(logPath);

async function run(): Promise<void> {
  try {
    const inputs = inputHelper.getInputs(logger, stateHelper.ExecDir);
    logger.info(`run inputs: ${JSON.stringify(inputs, null, 2)}`);
    await fs.remove(stateHelper.ExecDir);
    await fs.ensureDir(stateHelper.ExecDir);
    await git.fetch(inputs);
  } catch (e) {
    console.log(process);
    logger.error(`Failed to checkout, errorMsg:[${e}]`);
  }
}

async function cleanup(): Promise<void> {
  try {
    // TODO，移除进程
    logger.info('clean action');
    // await git.clean(stateHelper.RepositoryPath);
  } catch (e) {
    logger.error(`Failed to cleanup, errorMsg:[${e}]`);
  }
}

// // this action is not running
if (!stateHelper.Action) {
  logger.info('Begin run');
  run();
} else {
  logger.info('Begin cleanup');
  cleanup();
}
