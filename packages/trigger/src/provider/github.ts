import crypto from 'crypto';
import BaseEvent from './base';
import { getPushInfo, getPrInfo } from '../utils';
import { ITrigger, IGithubEvent } from '../type';
import { get, isEmpty } from 'lodash';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    const _github: any = get(this.triggers, this.provider);
    if (isEmpty(_github)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const github = _github as ITrigger;

    console.log('verify secret status...');
    const secret = get(github, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-github-event') as IGithubEvent;
    console.log(`get x-github-event value: ${eventType}`);

    if (isEmpty(eventType)) {
      throw new Error("No 'x-github-event' found on request");
    }
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (eventType === 'push') {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(github, info);
    }
    // pr 检测 tag
    if (eventType === 'pull_request') {
      const branch = getPrInfo(this.body);
      console.log(`get pr branch: ${branch}`);
      return this.doPr(github, branch);
    }
  }

  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-hub-signature', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature);
    const signed = Buffer.from(
      `sha1=${crypto
        .createHmac('sha1', secret as string)
        .update(JSON.stringify(this.body))
        .digest('hex')}`,
    );

    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }
}
