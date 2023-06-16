import BaseEvent from './base';
import crypto from 'crypto';
import { getPushInfo, getPrInfo, generateErrorResult } from '../utils';
import { IGiteeTrigger, IGiteeEvent, IPrTypes, IPrTypesVal, IGiteeAction } from '../type';
import { get, isEmpty, includes } from 'lodash';

export default class Gitee extends BaseEvent {
  async verify(): Promise<any> {
    const _gitee: any = get(this.triggers, this.provider);
    if (isEmpty(_gitee)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const gitee = _gitee as IGiteeTrigger;
    const secret = get(gitee, 'secret', '');
    let verifySecretStatus = false;

    if (secret) {
      verifySecretStatus = this.verifySecret(secret)
    } else {
      verifySecretStatus = this.verifyPassword(gitee)
    }

    if (verifySecretStatus) {
      console.log('verify secret or password success');
    } else {
      throw new Error('verify secret or password error');
    }

    const eventType = get(this.headers, 'x-gitee-event') as IGiteeEvent;
    console.log(`get x-gitee-event value: ${eventType}`);
    // 检测 push, pull_request
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook'], eventType)) {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(gitee, info);
    }
    // pull_request 检测 分支
    if (eventType === 'Merge Request Hook') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = this.checkType(gitee);
      if (!result.success) return generateErrorResult(result.message);
      const prInfo = getPrInfo(this.body);
      console.log(`get pull_request branch: ${JSON.stringify(prInfo)}`);
      return this.doPr(gitee, { ...prInfo, type: result.type as IPrTypesVal });
    }
    return generateErrorResult(`Unsupported event type: ${eventType}`);
  }
  private checkType(github: IGiteeTrigger) {
    const action = get(this.body, 'action', '') as IPrTypesVal;
    const merged = get(this.body, 'pull_request.merged', false);
    console.log(`get pull_request type: ${action}`);
    console.log(`get pull_request merged: ${merged}`);
    const types = get(github, 'pull_request.types', []) as IPrTypesVal[];
    let valid = false;
    let message = '';
    const newAction = get(IGiteeAction, action, action);
    if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], newAction)) {
      valid = includes(types, newAction);
      message = `pull_request type is ${newAction}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.CLOSED) {
      valid = includes(types, IPrTypes.CLOSED) && !merged;
      message = `pull_request type is ${newAction} and merged is ${merged}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.MERGED) {
      valid = includes(types, IPrTypes.MERGED) && merged;
      message = `pull_request type is ${newAction} and merged is ${merged}, but only ${types} is allowed`;
    }
    if (valid) {
      console.log('check type success');
      return { success: true, message, type: newAction };
    }
    console.log('check type error');
    return { success: false, message, type: newAction };
  }
  verifySecret(secret:string | undefined): boolean {
    const signature = get(this.headers, 'x-gitee-token', '');
    console.log('verify secret status...');
    const timestamp = get(this.headers, 'x-gitee-timestamp', '');
    const str = crypto
        .createHmac('sha256', secret as string)
        .update(`${timestamp}\n${secret}`)
        .digest()
        .toString('base64');
      return str === signature;
  }

  private verifyPassword(gitee: IGiteeTrigger): boolean {
    const signature = get(this.headers, 'x-gitee-token', '');
    const password = get(gitee, 'password', '');
    if (password) {
      console.log('verify password status...');
      return signature === password;
    }
    if (isEmpty(signature)) return true;
    return false;
  }
}
