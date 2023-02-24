import simpleGit, { SimpleGit } from 'simple-git';
import * as os from 'os';
import { IInitConfig } from './types';
import { ensureDir } from './utils';
const debug = require('debug')('serverless-cd:init-config');

export default async function initConfig(config: IInitConfig) {
  const { userName, userEmail } = config;
  const configExecDir = ensureDir(config.execDir);

  const git: SimpleGit = simpleGit(configExecDir);
  await git.init();
  debug('Git init successfully');
  await git.addConfig('user.name', userName).addConfig('user.email', userEmail);
  debug(`Git config successfully`);
}
