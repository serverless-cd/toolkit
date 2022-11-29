import BaseEvent from './base';
import { getPushInfo, getPrInfoWithCodeup, generateErrorResult } from '../utils';
import { ITrigger, ICodeupEvent, IPrTypes, IPrTypesVal } from '../type';
import { get, isEmpty, includes } from 'lodash';

export default class Codeup extends BaseEvent {
  async verify(): Promise<any> {
    const _codeup: any = get(this.triggers, this.provider);
    if (isEmpty(_codeup)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const codeup = _codeup as ITrigger;

    console.log('verify secret status...');
    const secret = get(codeup, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-codeup-event') as ICodeupEvent;
    console.log(`get x-codeup-event value: ${eventType}`);

    if (isEmpty(eventType)) {
      throw new Error("No 'x-codeup-event' found on request");
    }
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook'], eventType)) {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(codeup, info);
    }
    // pr 检测 tag
    if (eventType === 'Merge Request Hook') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = this.checkType(codeup);
      if (!result.success) return generateErrorResult(result.message);
      const branchInfo = getPrInfoWithCodeup(this.body);
      console.log(`get pr branch: ${JSON.stringify(branchInfo)}`);
      return this.doPr(codeup, branchInfo);
    }
  }
  private checkType(github: ITrigger) {
    const action = get(this.body, 'object_attributes.action', '') as IPrTypesVal;
    console.log(`get pull_request type: ${action}`);
    const types = get(github, 'pull_request.types', []) as IPrTypesVal[];
    let valid = false;
    let message = '';
    const actionMap = {
      open: IPrTypes.OPENED,
      close: IPrTypes.CLOSED,
      reopen: IPrTypes.REOPENED,
      merge: IPrTypes.MERGED,
    };
    const newAction = get(actionMap, action, action);
    if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], newAction)) {
      valid = includes(types, newAction);
      message = `pr type is ${action}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.CLOSED) {
      valid = includes(types, IPrTypes.CLOSED);
      message = `pr type is ${newAction}, but only ${types} is allowed`;
    }
    if (newAction === IPrTypes.MERGED) {
      valid = includes(types, IPrTypes.MERGED);
      message = `pr type is ${newAction}, but only ${types} is allowed`;
    }
    if (valid) {
      console.log('check type success');
      return { success: true };
    }
    console.log('check type error');
    return { success: false, message };
  }
  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-codeup-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
