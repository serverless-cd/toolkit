import BaseEvent from './base';
import { getPushInfo, getPrInfo } from '../utils';
import { ITrigger, IGiteeEvent } from '../type';
import { get, isEmpty, includes } from 'lodash';

export default class Gitee extends BaseEvent {
  async verify(): Promise<any> {
    const _gitee: any = get(this.triggers, this.provider);
    if (isEmpty(_gitee)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const gitee = _gitee as ITrigger;

    console.log('verify secret status...');
    const secret = get(gitee, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-gitee-event') as IGiteeEvent;
    console.log(`get x-gitee-event value: ${eventType}`);

    if (isEmpty(eventType)) {
      throw new Error("No 'x-gitee-event' found on request");
    }
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook'], eventType)) {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(gitee, info);
    }
    // pr 检测 tag
    if (eventType === 'Merge Request Hook') {
      const branch = getPrInfo(this.body);
      console.log(`get pr branch: ${branch}`);
      return this.doPr(gitee, branch);
    }
  }
  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-gitee-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
