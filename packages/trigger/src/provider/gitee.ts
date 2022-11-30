import BaseEvent from './base';
import { getPushInfo, getPrInfo, generateErrorResult } from '../utils';
import { ITrigger, IGiteeEvent, IPrTypes, IPrTypesVal, IGiteeAction } from '../type';
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
    // pr 检测 分支
    if (eventType === 'Merge Request Hook') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = this.checkType(gitee);
      if (!result.success) return generateErrorResult(result.message);
      const prInfo = getPrInfo(this.body);
      console.log(`get pr branch: ${JSON.stringify(prInfo)}`);
      return this.doPr(gitee, { ...prInfo, type: result.type as IPrTypesVal });
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
    const newAction = get(IGiteeAction, action, action);
    if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], newAction)) {
      valid = includes(types, newAction);
      message = `pr type is ${newAction}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.CLOSED) {
      valid = includes(types, IPrTypes.CLOSED) && !merged;
      message = `pr type is ${newAction} and merged is ${merged}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.MERGED) {
      valid = includes(types, IPrTypes.MERGED) && merged;
      message = `pr type is ${newAction} and merged is ${merged}, but only ${types} is allowed`;
    }
    if (valid) {
      console.log('check type success');
      return { success: true, message, type: newAction };
    }
    console.log('check type error');
    return { success: false, message, type: newAction };
  }
  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-gitee-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
