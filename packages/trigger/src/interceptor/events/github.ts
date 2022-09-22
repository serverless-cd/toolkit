import _ from 'lodash';
import crypto from 'crypto';
import jexl from 'jexl';
import BaseEvent from './base';
import { generateErrorPayload, generateSuccessResult, generateErrorResult } from 'src/utils';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    if (!_.has(this.triggers, this.interceptor)) {
      throw new Error('The interceptor does not exist github');
    }

    const github = _.get(this.triggers, this.interceptor);

    console.log('verify secret status');
    const secret = _.get(github, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (!verifySecretStatus) {
      throw new Error('Verify secret error');
    }

    console.log('verify x-github-event empty');
    const eventName = _.get(this.headers, 'x-github-event');
    if (_.isEmpty(eventName)) {
      throw new Error("No 'x-github-event' found on request");
    }

    const results = [];

    console.log('verify events config empty');
    const events = _.get(github, 'events', []);
    if (_.isEmpty(events)) {
      throw new Error('No event rules configured');
    }
    for (const event of events) {
      console.log('event contrast');
      const eventType = _.get(event, 'eventName');
      if (eventType !== eventName) {
        const message = `Event type mismatch.\nListen event: ${eventType}, Accepted Event: ${event}`;
        const errorResult = generateErrorPayload(message);
        results.push(errorResult);
        continue;
      }

      console.log('run filter');
      const filter = _.get(event, 'filter', '');
      if (!_.isEmpty(filter)) {
        const filterStatus = await jexl.eval(filter, this.requestPayload);
        if (!filterStatus) {
          const message = `Filter status error: ${filterStatus}`
          return generateErrorPayload(message);
        }
      }

      console.log('return success');
      return generateSuccessResult({ ...event , interceptor: this.interceptor,  });
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
