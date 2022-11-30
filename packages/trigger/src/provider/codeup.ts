import BaseEvent from './base';
import {
  getPushInfo,
  getPrInfoWithCodeup,
  generateErrorResult,
  checkTypeWithCodeup,
} from '../utils';
import { ITrigger, ICodeupEvent, IPrTypesVal } from '../type';
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
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook'], eventType)) {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(codeup, info);
    }
    // pr 检测 分支
    if (eventType === 'Merge Request Hook') {
      // 检查type ['opened', 'reopened', 'closed', 'merged']
      const result = checkTypeWithCodeup(codeup, this.body);
      if (!result.success) return generateErrorResult(result.message);
      const prInfo = getPrInfoWithCodeup(this.body);
      console.log(`get pr branch: ${JSON.stringify(prInfo)}`);
      return this.doPr(codeup, { ...prInfo, type: result.type as IPrTypesVal });
    }
    return generateErrorResult(`Unsupported event type: ${eventType}`);
  }
  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-codeup-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
