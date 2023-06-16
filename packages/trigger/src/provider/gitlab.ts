import BaseEvent from './base';
import {
  getPushInfoWithGitlab,
  getPrInfoWithCodeupOrGitlab,
  generateErrorResult,
  checkTypeWithCodeupOrGitlab,
} from '../utils';
import { ITrigger, IGitlabEvent, IPrTypesVal } from '../type';
import { get, isEmpty, includes } from 'lodash';

export default class Gitlab extends BaseEvent {
  async verify(): Promise<any> {
    const _gitlab: any = get(this.triggers, this.provider);
    if (isEmpty(_gitlab)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const gitlab = _gitlab as ITrigger;

    console.log('verify secret status...');
    const secret = get(gitlab, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-gitlab-event') as IGitlabEvent;
    console.log(`get x-gitlab-event value: ${eventType}`);
    // 检测 push, pull_request
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook', 'Job Hook'], eventType)) {
      const info = getPushInfoWithGitlab(eventType, this.body);
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(gitlab, info);
    }
    // pull_request 检测 分支
    if (eventType === 'Merge Request Hook') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = checkTypeWithCodeupOrGitlab(gitlab, this.body);
      if (!result.success) return generateErrorResult(result.message);
      const prInfo = getPrInfoWithCodeupOrGitlab(this.body);
      console.log(`get pull_request branch: ${JSON.stringify(prInfo)}`);
      return this.doPr(gitlab, { ...prInfo, type: result.type as IPrTypesVal });
    }
    return generateErrorResult(`Unsupported event type: ${eventType}`);
  }
  verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-gitlab-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
