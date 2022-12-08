import { IPayload, ITriggers, IVerify } from './type';
import webhook from './provider';
import { isPlainObject, get } from 'lodash';
export { IPrTypes } from './type';

export async function verifyLegitimacy(triggers: ITriggers, payload: IPayload) {
  if (!isPlainObject(triggers)) {
    throw new TypeError('The parameter format should be object');
  }

  console.log('get trigger provider...');
  const provider = webhook.getTriggerEvent(payload);
  console.log(`get trigger provider success: ${provider}`);

  const EventClient = get(webhook, provider) as any;
  const eventClient = new EventClient(triggers, payload, provider);
  const res: IVerify = await eventClient.verify();
  return res;
}

export const getProvider = webhook.getTriggerEvent;

export default verifyLegitimacy;
