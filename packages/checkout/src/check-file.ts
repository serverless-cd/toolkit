import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { startsWith, replace } from 'lodash';
interface IConfig {
  file: string;
  url: string;
  ref: string;
}

async function checkFile(config: IConfig) {
  const { file, url, ref } = config;
  const baseDir = path.join(os.tmpdir(), Date.now().toString());
  console.log('baseDir', baseDir);
  fs.ensureDirSync(baseDir);
  const git: SimpleGit = simpleGit(baseDir);
  await git.clone(url, baseDir, ['--no-checkout']);
  const branch = startsWith(ref, 'refs/heads/') ? replace(ref, 'refs/heads/', '') : undefined;
  let isExist = false;
  try {
    const cmd = branch ? `origin/${branch}:${file}` : `${ref}:${file}`;
    await git.raw(['show', cmd]);
    isExist = true;
  } catch (error) {
    isExist = false;
  }
  if (isExist) return true;

  if (['.yaml', '.yml'].includes(path.extname(file))) {
    try {
      const newFile = replace(
        url,
        path.extname(url),
        path.extname(url) === '.yaml' ? '.yml' : '.yaml',
      );
      const cmd = branch ? `origin/${branch}:${newFile}` : `${ref}:${newFile}`;
      await git.raw(['show', cmd]);
      isExist = true;
    } catch (error) {
      isExist = false;
    }
  }
  return isExist;
}

export default checkFile;
