import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { replace } from 'lodash';
import { IProvider } from './types';
import { parseRef } from '@serverless-cd/core';
interface IConfig {
  token: string;
  provider: IProvider;
  owner: string;
  clone_url: string;
  ref: string;
  file: string;
}

async function checkFile(config: IConfig) {
  const { file, clone_url, ref } = config;
  const baseDir = path.join(os.tmpdir(), path.basename(clone_url, '.git'));
  console.log('baseDir', baseDir);
  let git = {} as SimpleGit;
  if (fs.existsSync(baseDir)) {
    console.log(`baseDir ${baseDir} exists`);
    git = simpleGit(baseDir);
  } else {
    fs.ensureDirSync(baseDir);
    git = simpleGit(baseDir);
    const newCloneUrl = getCloneUrl(config) as string;
    for (let index = 0; index < 3; index++) {
      try {
        console.log(`git clone ${newCloneUrl} ${baseDir} --no-checkout : ${index + 1} times`);
        await git.clone(newCloneUrl, baseDir, ['--no-checkout']);
        break;
      } catch (error) {
        if (index === 2) {
          fs.removeSync(baseDir);
          throw new Error(`git clone ${newCloneUrl} ${baseDir} --no-checkout failed`);
        }
      }
    }

    console.log('clone success');
  }
  const refInfo = parseRef(ref);
  let isExist = false;
  try {
    const cmd = refInfo.type === 'branch' ? `origin/${refInfo.value}:${file}` : `${ref}:${file}`;
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
      const cmd =
        refInfo?.type === 'branch' ? `origin/${refInfo.value}:${newFile}` : `${ref}:${newFile}`;
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

interface ICloneConfig {
  token: string;
  provider: IProvider;
  owner: string;
  clone_url: string;
}

function getCloneUrl({ provider, owner, clone_url, token }: ICloneConfig) {
  const newUrl = replace(clone_url, /http(s)?:\/\//, '');
  if (provider === 'gitee') {
    return `https://${owner}:${token}@${newUrl}`;
  }
  if (provider === 'github') {
    return `https://${token}@${newUrl}`;
  }
  if (provider === 'gitlab') {
    const protocol = clone_url.startsWith('https') ? 'https' : 'http';
    return `${protocol}${owner}:${token}@${newUrl}`;
  }
  if (provider === 'codeup') {
    return `https://${owner}:${token}@${newUrl}`;
  }
}

export default checkFile;
