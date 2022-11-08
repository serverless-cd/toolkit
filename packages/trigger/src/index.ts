import _ from 'lodash';
import { IPayload, ITriggers } from './types';
import webhook from './interceptor/events';

async function verifyLegitimacy(triggers: ITriggers, payload: IPayload) {
  if (!_.isPlainObject(triggers)) {
    throw new TypeError('The parameter format should be object');
  }

  console.log('get trigger provider start');
  const provider = webhook.getTriggerEvent(payload);
  console.log(`get trigger provider success: ${provider}`);

  const EventClient = _.get(webhook, provider);
  const eventClient = new EventClient(triggers, payload, provider);
  return await eventClient.verify();
}

export = verifyLegitimacy;
