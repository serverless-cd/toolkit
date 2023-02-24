import simpleGit, { SimpleGit } from 'simple-git';
import { ISetRemoteConfig } from './types';
import { ensureDir } from './utils';
const debug = require('debug')('serverless-cd:set-remotes');

export default async function setRemote(config: ISetRemoteConfig) {
  const { provider_platform: provider } = config;
  let { repoUrl } = config;
  const configExecDir = ensureDir(config.execDir);
  debug(`execDir: ${configExecDir}`);
  const git: SimpleGit = simpleGit(configExecDir);
  if (provider === 'codeup' && repoUrl.indexOf('.git') == -1) {
    repoUrl += '.git';
  }
  await git.addRemote('origin', repoUrl);
  debug(`Set git remote successfully, ${repoUrl}`);
}
