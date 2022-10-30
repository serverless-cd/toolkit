import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { startsWith, replace } from 'lodash';
interface IConfig {
  file: string;
  clone_url: string;
  ref: string;
}

async function checkFile(config: IConfig) {
  const { file, clone_url, ref } = config;
  const baseDir = path.join(os.tmpdir(), path.basename(clone_url, '.git'));
  console.log('baseDir', baseDir);
  let git = {} as SimpleGit;
  if (!fs.existsSync(baseDir)) {
    fs.ensureDirSync(baseDir);
    git = simpleGit(baseDir);
    await git.clone(clone_url, baseDir, ['--no-checkout']);
    console.log('clone success');
  }
  const branch = startsWith(ref, 'refs/heads/') ? replace(ref, 'refs/heads/', '') : undefined;
  let isExist = false;
  try {
    const cmd = branch ? `origin/${branch}:${file}` : `${ref}:${file}`;
    console.log(`git cat-file -e ${cmd}`);
    await git.raw(['cat-file', '-e', cmd]);
    console.log('cat-file success');
    isExist = true;
  } catch (error) {
    isExist = false;
    console.log('cat-file failure');
  }
  if (isExist) return true;

  if (['.yaml', '.yml'].includes(path.extname(file))) {
    try {
      const newFile = replace(
        file,
        path.extname(file),
        path.extname(file) === '.yaml' ? '.yml' : '.yaml',
      );
      const cmd = branch ? `origin/${branch}:${newFile}` : `${ref}:${newFile}`;
      console.log(`git cat-file -e ${cmd}`);

      await git.raw(['cat-file', '-e', cmd]);
      console.log('cat-file success');
      isExist = true;
    } catch (error) {
      isExist = false;
    }
  }
  return isExist;
}

export default checkFile;
