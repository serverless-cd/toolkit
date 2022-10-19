import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

interface IConfig {
  file: string;
  url: string;
  branch: string;
}

async function checkFile(config: IConfig) {
  const { file, url, branch } = config;
  const baseDir = path.join(os.tmpdir(), Date.now().toString());
  fs.ensureDirSync(baseDir);
  const git: SimpleGit = simpleGit(baseDir);
  await git.clone(url, baseDir, ['--no-checkout']);
  try {
    await git.raw(['show', `${branch}:${file}`]);
    return true;
  } catch (error) {
    return false;
  }
}

export default checkFile;
