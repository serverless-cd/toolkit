import crypto from 'crypto';
import BaseEvent from './base';
import { getPushInfo, getPrInfo, generateErrorResult } from '../utils';
import { ITrigger, IGithubEvent, IPrTypes, IPrTypesVal } from '../type';
import { get, includes, isEmpty } from 'lodash';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    const _github: any = get(this.triggers, this.provider);
    if (isEmpty(_github)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const github = _github as ITrigger;
    console.log(`github: ${JSON.stringify(github)}`);

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
    // pr 检测 分支
    if (eventType === 'pull_request') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = this.checkType(github);
      if (!result.success) return generateErrorResult(result.message);
      const prInfo = getPrInfo(this.body);
      console.log(`get pr branch: ${JSON.stringify(prInfo)}`);
      return this.doPr(github, { ...prInfo, type: result.type as IPrTypesVal });
    }
  }
  private checkType(github: ITrigger) {
    const action = get(this.body, 'action', '') as IPrTypesVal;
    const merged = get(this.body, 'pull_request.merged', false);
    console.log(`get pull_request type: ${action}`);
    console.log(`get pull_request merged: ${merged}`);
    const types = get(github, 'pull_request.types', []) as IPrTypesVal[];
    let valid = false;
    let message = '';
    let type = '';
    if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], action)) {
      type = action;
      valid = includes(types, action);
      message = `pr type is ${action}, but only ${types} is allowed`;
    }
    if (action === IPrTypes.CLOSED) {
      type = merged ? IPrTypes.MERGED : IPrTypes.CLOSED;
      valid = includes(types, type);
      message = `pr type is ${action} and merged is ${merged}, but only ${types} is allowed`;
    }
    if (valid) {
      console.log('check type success');
      return { success: true, message, type };
    }
    console.log('check type error');
    return { success: false, message, type };
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
