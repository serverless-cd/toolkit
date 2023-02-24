import simpleGit, { SimpleGit } from 'simple-git';
import { IAddCommit } from './types';
import { ensureDir } from './utils';
const debug = require('debug')('serverless-cd:add-commits');

export default async function addCommit(config: IAddCommit) {
  const { commit, branch } = config;
  const configExecDir = ensureDir(config.execDir);
  const git: SimpleGit = simpleGit(configExecDir);
  await git.add('.').commit(commit || 'Initial Commit');
  git.branch(['-M', branch || 'master']);
  debug(`Git add and commit successfully on branch ${branch}`);
}
