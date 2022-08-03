import simpleGit from 'simple-git';
import * as C from '../constants';
import * as Interface from './interface';

const clone = async (params: Interface.IGit) => {
  const { token, logger, execDir, provider, path_with_namespace, username, uri } = params;
  const hostname = uri.replace(/http(s)?:\/\//, '');
  let gitRepo = `${hostname}/${path_with_namespace}.git`;
  switch (provider) {
    case C.C_PROVIDER.GITEE:
      logger.info(`Git clone https://${username}:***@${gitRepo}`);
      await simpleGit().clone(`https://${username}:${token}@${gitRepo}`, execDir, ['--depth', '1']);
      break;
    case C.C_PROVIDER.GITHUB:
      logger.info(`Git clone https://***@${gitRepo}`);
      await simpleGit().clone(`https://${token}@${gitRepo}`, execDir, ['--depth', '1']);
      break;
    case C.C_PROVIDER.GITLAB: {
      const protocol = uri.replace(hostname, '');
      logger.info(`Git clone ${protocol}${username}:***@${gitRepo}`);
      await simpleGit().clone(`${protocol}${username}:${token}@${gitRepo}`, execDir, [
        '--depth',
        '1',
      ]);
      break;
    }
    case C.C_PROVIDER.CODEUP:
      logger.info(`Git clone https://${username}:***@${gitRepo}`);
      await simpleGit().clone(`https://${username}:${token}@${gitRepo}`, execDir, ['--depth', '1']);
      break;
    default:
      break;
  }
};

const fetch = async (params: Interface.IPush | Interface.ITag) => {
  const { logger, provider, path_with_namespace, execDir, token, username, uri } = params;
  let tag;
  let commit;
  let branch;
  if (Interface.isTag(params)) {
    tag = params.tag;
  } else {
    commit = params.commit;
    branch = params.branch;
  }
  logger.info(`run fetch params: ${JSON.stringify(params, null, 2)}`);
  let ref;
  const hostname = uri.replace(/http(s)?:\/\//, '');
  let gitRepo = `${hostname}/${path_with_namespace}.git`;
  logger.info(`Git simple ${execDir}`);
  const git = simpleGit(execDir);
  logger.info(`Git Init ${execDir}`);
  await git.init();
  switch (provider) {
    case C.C_PROVIDER.GITEE:
      logger.info(`Git remote add origin https://${username}:***@${gitRepo}`);
      await git.addRemote('origin', `https://${username}:${token}@${gitRepo}`);
      break;
    case C.C_PROVIDER.GITHUB:
      logger.info(`Git remote add origin https://***@${gitRepo}`);
      await git.addRemote('origin', `https://${token}@${gitRepo}`);
      break;
    case C.C_PROVIDER.GITLAB: {
      const protocol = uri.replace(hostname, '');
      logger.info(`Git remote add origin ${protocol}${username}:***@${gitRepo}`);
      await git.addRemote('origin', `${protocol}${username}:${token}@${gitRepo}`);
      break;
    }
    case C.C_PROVIDER.CODEUP:
      logger.info(`Git remote add origin https://${username}:***@${gitRepo}`);
      await git.addRemote('origin', `https://${username}:${token}@${gitRepo}`);
      break;
    default:
      break;
  }
  if (branch && commit) {
    ref = `+${commit}:refs/remotes/origin/${branch}`;
  } else if (tag) {
    ref = `refs/tags/${tag}`;
  } else {
    ref = 'HEAD';
  }
  // gitlab 旧版本 git fetch 存在问题，拉取不了代码
  if (provider === C.C_PROVIDER.GITLAB && branch && commit) {
    logger.info(`Git pull origin ${branch}`);
    await git.pull(`origin`, branch);
    logger.info(`Git reset --hard ${commit}`);
    await git.reset(['--hard', commit]);
  } else {
    logger.info(`Git fetch --depth=1 origin ${ref}`);
    await git.fetch(`origin`, ref, { '--depth': '1' });
    logger.info(`Git reset --hard FETCH_HEAD`);
    await git.reset(['--hard', 'FETCH_HEAD']);
  }
};

const push = async ({
  logger,
  execDir,
  provider,
  branch,
  token,
  path_with_namespace,
  username,
  uri,
}: Interface.IPush) => {
  const hostname = uri.replace(/http(s)?:\/\//, '');
  let gitRepo = `${hostname}/${path_with_namespace}.git`;
  logger.info(`Git Init ${execDir}`);
  const git = simpleGit(execDir);
  await git.init();
  logger.info(`Git addConfig`);
  git
    .addConfig('user.name', 'serverless-devs')
    .addConfig('user.email', 'serverless-devs@alibaba-inc.com');
  await git.add('.').commit('Initial commit');
  await git.branch(['-M', branch]);
  switch (provider) {
    case C.C_PROVIDER.GITEE:
      logger.info(`Git remote add origin https://${username}:***@${gitRepo}`);
      await git.addRemote('origin', `https://${username}:${token}@${gitRepo}`);
      break;
    case C.C_PROVIDER.GITHUB:
      logger.info(`Git remote add origin https://***@${gitRepo}`);
      await git.addRemote('origin', `https://${token}@${gitRepo}`);
      break;
    case C.C_PROVIDER.GITLAB: {
      const protocol = uri.replace(hostname, '');
      logger.info(`Git remote add origin ${protocol}${username}:***@${gitRepo}`);
      await git.addRemote('origin', `${protocol}${username}:${token}@${gitRepo}`);
      break;
    }
    case C.C_PROVIDER.CODEUP:
      logger.info(`Git remote add origin https://${username}:***@${gitRepo}`);
      await git.addRemote('origin', `https://${username}:${token}@${gitRepo}`);
      break;
    default:
      break;
  }
  logger.info(`Git Push ${gitRepo} branch: ${branch}`);
  try {
    await git.push(['-f', '-u', 'origin', branch]);
  } catch (error) {
    logger.error(`Failed to Push: ${gitRepo} , errorMsg:[${error}] `);
    throw error;
  }
  logger.info(`Git Push succeed`);
};

export default {
  push,
  clone,
  fetch,
};
