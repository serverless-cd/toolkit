import _ from 'lodash';
import crypto from 'crypto';
import jexl from 'jexl';
import BaseEvent from './base';
import { generateErrorPayload, generateSuccessResult, generateErrorResult } from 'src/utils';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    const results = [];

    for (const trigger of this.triggers) {
      const interceptor = _.get(trigger, 'interceptor');
      if (interceptor !== 'github') {
        const errorResult = generateErrorPayload('Interceptor is not github');
        results.push(errorResult);
        continue;
      }

      // 疑问: 是否可能配置多个 secret，虽然没有场景 但是存在可能
      const secret = _.get(trigger, 'secret');
      const verifySecretStatus = this.verifySecret(secret);
      if (!verifySecretStatus) {
        const errorResult = generateErrorPayload('Verify secret error');
        results.push(errorResult);
        continue;
      }

      const event = _.get(this.headers, 'x-github-event');
      if (_.isEmpty(event)) {
        const errorResult = generateErrorPayload("No 'x-github-event' found on request");
        results.push(errorResult);
        continue;
      }
      const eventType = _.get(trigger, 'eventType');
      if (eventType !== event) {
        const message = `Event type mismatch.\nListen event: ${eventType}, Accepted Event: ${event}`;
        const errorResult = generateErrorPayload(message);
        results.push(errorResult);
        continue;
      }

      const filter = _.get(trigger, 'filter', '');
      if (!_.isEmpty(filter)) {
        const filterStatus = await jexl.eval(filter, this.requestPayload);
        if (!filterStatus) {
          const message = `Filter status error: ${filterStatus}`
          return generateErrorPayload(message);
        }
      }

      return generateSuccessResult(trigger);
    }

    return generateErrorResult(results);
  }

  verifySecret(secret: string | undefined): boolean {
    const signature = _.get(this.headers, 'x-hub-signature', '');
    if (_.isEmpty(secret) && _.isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature);
    const signed = Buffer.from(`sha1=${crypto.createHmac('sha1', secret as string).update(this.body).digest('hex')}`)
    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }
}
