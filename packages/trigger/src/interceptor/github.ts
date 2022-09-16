import _ from 'lodash';
import crypto from 'crypto';
import jexl from 'jexl';
import BaseEvent from './base-event';

export default class Github extends BaseEvent {
  async handler(): Promise<any> {
    const ua: string = _.get(this.headers, 'user-agent', '');

    if (!_.startsWith(ua, 'GitHub-Hookshot')) {
      console.error('Request payload and interceptor configuration do not match');
      console.error(`interceptor is 'github', but ua is ${ua || null}.`);
      return { success: false };
    }

    const verifySecretStatus = this.verifySecret();
    if (!verifySecretStatus) {
      console.error('Verify secret error.');
      return { success: false };
    }

    const event = _.get(this.headers, 'x-github-event');
    if (_.isEmpty(event)) {
      console.error("No 'x-github-event' found on request");
      return { success: false };
    }

    const { eventType } = this.trigger;
    if (eventType !== event) {
      console.error(`Event type mismatch.\nListen event: ${eventType}, Accepted Event: ${event}`);
      return { success: false };
    }

    if (this.trigger.filter) {
      const filterStatus = await jexl.eval(this.trigger.filter, this.requestPayload);
      if (!filterStatus) {
        console.log('Filter status error: ', filterStatus);
        return { success: false }
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
