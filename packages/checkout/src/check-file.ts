import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

interface IConfig {
  file: string;
  url: string;
  ref: string;
}

async function checkFile(config: IConfig) {
  const { file, url, ref } = config;
  const baseDir = path.join(os.tmpdir(), Date.now().toString());
  fs.ensureDirSync(baseDir);
  const git: SimpleGit = simpleGit(baseDir);
  await git.clone(url, baseDir, ['--no-checkout']);
  try {
    await git.raw(['show', ref ? `${ref}:${file}` : file]);
    return true;
  } catch (error) {
    return false;
  }
}

export default checkFile;
