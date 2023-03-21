import simpleGit, { SimpleGit } from 'simple-git';
import { ensureDir } from './utils';
const debug = require('@serverless-cd/debug')('serverless-cd:git_init-config');

export interface IInitConfig {
  execDir: string;
  userName: string;
  userEmail: string;
}

export default async function initConfig(config: IInitConfig, baseGit?: SimpleGit) {
  const { userName, userEmail } = config;
  const git = baseGit || simpleGit(ensureDir(config.execDir));
  await git.init();
  debug('Git init successfully');
  await git.addConfig('user.name', userName).addConfig('user.email', userEmail);
  debug(`Git config successfully`);
  return git;
}
