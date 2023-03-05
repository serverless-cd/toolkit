import simpleGit, { SimpleGit } from 'simple-git';
import { ensureDir } from './utils';
const debug = require('debug')('toolkit:add-commits');

export interface IAddCommit {
  execDir: string;
  branch?: string;
  commit?: string;
}

export default async function addCommit(config: IAddCommit, baseGit?: SimpleGit) {
  const { commit, branch } = config;
  const git = baseGit || simpleGit(ensureDir(config.execDir));
  try {
    await git.add('.').commit(commit || 'Initial Commit');
  } catch (error: any) {
    if (error?.message?.indexOf('nothing to commit') > 0) {
      // ignore error
    } else {
      // retry
      await git.add('.').commit(commit || 'Initial Commit');
    }
  }
  await git.branch(['-M', branch || 'master']);
  debug(`Git add and commit successfully on branch ${branch}`);
  return git;
}
