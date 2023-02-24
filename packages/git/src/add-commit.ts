import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { IAddCommit } from './types';
const debug = require('debug')('serverless-cd:git/add-commits');

export default async function addCommit(config: IAddCommit) {
  const { commit, branch } = config;
  const execDir = config.execDir || os.tmpdir();
  const configExecDir: any = path.isAbsolute(execDir) ? execDir : path.join(process.cwd(), execDir);
  debug(`execDir: ${configExecDir}`);
  const git: SimpleGit = simpleGit(configExecDir);
  fs.ensureDirSync(configExecDir);

  await git.add('.').commit(commit || 'Initial Commit');
  git.branch(['-M', branch || 'master']);
  debug(`Git add and commit successfully on branch ${branch}`);
}
