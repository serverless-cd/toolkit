import _ from 'lodash';
import crypto from 'crypto';
import jexl from 'jexl';
import BaseEvent from './webhook';
import { generateErrorResult } from 'src/utils';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    const ua: string = _.get(this.headers, 'user-agent', '');

    if (!_.startsWith(ua, 'GitHub-Hookshot')) {
      const message = `Request payload and interceptor configuration do not match
interceptor is 'github', but ua is ${ua || null}.`;
      return generateErrorResult(message);
    }

    const verifySecretStatus = this.verifySecret();
    if (!verifySecretStatus) {
      const message = 'Verify secret error.';
      throw new Error(message);
      // console.error(message);
      // return { success: false, message };
    }

    const event = _.get(this.headers, 'x-github-event');
    if (_.isEmpty(event)) {
      return generateErrorResult("No 'x-github-event' found on request");
    }

    const { eventType } = this.trigger;
    if (eventType !== event) {
      const message = `Event type mismatch.\nListen event: ${eventType}, Accepted Event: ${event}`;
      return generateErrorResult(message);
    }

    if (this.trigger.filter) {
      const filterStatus = await jexl.eval(this.trigger.filter, this.requestPayload);
      if (!filterStatus) {
        const message = `Filter status error: ${filterStatus}`
        return generateErrorResult(message);
      }
    }

    return { success: true, filter: this.trigger.filter, event };
  }

  verifySecret() {
    const { secret } = this.trigger;
    const signature = _.get(this.headers, 'x-hub-signature');
    if (_.isEmpty(secret) && _.isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature || '');
    const signed = Buffer.from(`sha1=${crypto.createHmac('sha1', secret as string).update(this.body).digest('hex')}`)
    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }
}
