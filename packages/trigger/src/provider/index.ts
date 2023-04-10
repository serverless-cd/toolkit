import _ from 'lodash';
import Github from './github';
import Gitee from './gitee';
import Codeup from './codeup';
import Gitlab from './gitlab';
import { IUserAgent, IProvider } from '../type';

const getTriggerEvent = (payload: any): IProvider => {
  const triggerType = _.get(payload, 'body.triggerType');

  // TODO：手动触发
  if (triggerType === 'manual_dispatch') {
    throw new Error('Unrecognized manual_dispatch trigger');
  }
  // TODO：定时触发
  if (triggerType === 'schedule') {
    throw new Error('Unrecognized schedule trigger');
  }
  // 如果 triggerType 存在，但是不为 manual_dispatch 或者 schedule，则为异常
  if (!_.isEmpty(triggerType)) {
    throw new Error(`Not support triggerType: ${triggerType}`);
  }

  // webhook events
  const ua: string = _.get(payload, 'headers[user-agent]', '');
  console.log(`get webhook user-agent: ${ua}`);

  if (_.startsWith(ua, 'GitHub-Hookshot')) {
    return IUserAgent.GITHUB;
  }
  // https://gitee.com/help/articles/4186#article-header0
  if (ua === 'git-oschina-hook') {
    return IUserAgent.GITEE;
  }

  if (_.startsWith(ua, 'okhttp')) {
    return IUserAgent.CODEUP;
  }
  if (isGitlab(payload)) {
    return IUserAgent.GITLAB;
  }

  throw new Error('Unrecognized trigger type');
};

function isGitlab(payload: any) {
  const ua: string = _.get(payload, 'headers[user-agent]', '');
  if (_.startsWith(ua, 'GitLab')) {
    return true;
  }
  const headers = _.get(payload, 'headers', {});
  if (_.isPlainObject(headers)) {
    for (const key in headers) {
      if (_.startsWith(_.toLower(key), 'x-gitlab')) {
        return true;
      }
    }
  }
}

export default {
  github: Github,
  gitee: Gitee,
  codeup: Codeup,
  gitlab: Gitlab,
  getTriggerEvent,
};
