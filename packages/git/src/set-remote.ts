import { Logger, parseRef } from '@serverless-cd/core';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { ISetRemoteConfig } from './types';
const debug = require('debug')('serverless-cd:git/set-remotes');

export default async function setRemote(config: ISetRemoteConfig) {
  const { provider_platform: provider } = config;
  let { repoUrl } = config;
  const git: SimpleGit = simpleGit(config.execDir);
  const execDir = config.execDir || os.tmpdir();
  const configExecDir: any = path.isAbsolute(execDir) ? execDir : path.join(process.cwd(), execDir);
  debug(`execDir: ${configExecDir}`);
  fs.ensureDirSync(configExecDir);

  if (provider === 'codeup' && repoUrl.indexOf('.git') == -1) {
    repoUrl += '.git';
  }

  await git.addRemote('origin', repoUrl);
  debug("Set git remote successfully, whose remote name is 'origin'");
}
