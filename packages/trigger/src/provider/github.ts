import _ from 'lodash';
import crypto from 'crypto';
import jexl from 'jexl';
import BaseEvent from './base';
import { generateSuccessResult, generateErrorResult } from '../utils';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    if (!_.has(this.triggers, this.provider)) {
      throw new Error('The triggers does not exist github');
    }

    const github = _.get(this.triggers, this.provider);

    console.log('verify secret status');
    const secret = _.get(github, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (!verifySecretStatus) {
      throw new Error('Verify secret error');
    }

    const eventName = _.get(this.headers, 'x-github-event');
    console.log(`get x-github-event value: ${eventName}`);

    if (_.isEmpty(eventName)) {
      throw new Error("No 'x-github-event' found on request");
    }

    const events = _.get(github, 'events', []);
    console.log(`get github events: ${JSON.stringify(events)}`);
    if (_.isEmpty(events)) {
      throw new Error('No event rules configured');
    }
    for (const event of events) {
      console.log('event contrast');
      const eventType = _.get(event, 'eventName');
      if (eventType !== eventName) {
        console.log(`Event type mismatch,listen event: ${eventType}`);
        continue;
      }
      console.log('run filter');
      const filter = _.get(event, 'filter', '');
      if (!_.isEmpty(filter)) {
        console.log(`filter: ${filter}`);
        const filterStatus = await jexl.eval(filter, this.requestPayload);
        console.log(`filter status: ${filterStatus}`);
        if (!filterStatus) {
          console.log(`Filter status error: ${filterStatus}`);
          continue;
        }
      }
      console.log('return success');
      return generateSuccessResult({ ...(event as {}), provider: this.provider });
    }

    return generateErrorResult('Event type mismatch');
  }

  verifySecret(secret: string | undefined): boolean {
    const signature = _.get(this.headers, 'x-hub-signature', '');
    if (_.isEmpty(secret) && _.isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature);
    const signed = Buffer.from(
      `sha1=${crypto
        .createHmac('sha1', secret as string)
        .update(this.body)
        .digest('hex')}`,
    );

    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }
}
