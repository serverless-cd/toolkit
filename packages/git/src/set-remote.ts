import simpleGit, { SimpleGit } from 'simple-git';
import { IProvider } from './types';
import { ensureDir } from './utils';
const debug = require('debug')('toolkit:set-remotes');

export interface ISetRemoteConfig {
  provider_platform: IProvider;
  execDir: string;
  repoUrl: string;
}

export default async function setRemote(config: ISetRemoteConfig, baseGit?: SimpleGit) {
  const { provider_platform: provider } = config;
  let { repoUrl } = config;
  const git = baseGit || simpleGit(ensureDir(config.execDir));
  if (provider === 'codeup' && repoUrl.indexOf('.git') == -1) {
    repoUrl += '.git';
  }
  await git.addRemote('origin', repoUrl);
  debug(`Set git remote successfully, ${repoUrl}`);
  return git;
}
