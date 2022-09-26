import _ from 'lodash';
import { IPayload, ITigger } from './types';
import webhook from './interceptor/events';

async function verifyLegitimacy(triggers: ITigger, payload: IPayload) {
  if (!_.isPlainObject(triggers)) {
    throw new TypeError('The parameter format should be array');
  }

  console.log('get trigger interceptor');
  const interceptor = webhook.getTriggerEvent(payload);
  console.log(`get trigger interceptor: ${interceptor}`);
  const EventClient = _.get(webhook, interceptor);
  const eventClient = new EventClient(triggers, payload, interceptor);
  return await eventClient.verify();
}

export = verifyLegitimacy;