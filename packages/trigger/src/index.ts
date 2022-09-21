import _ from 'lodash';
import { IPayload, ITigger } from './types';
import webhook from './interceptor/events';

async function verifyLegitimacy(triggers: ITigger[], payload: IPayload) {
  if (!_.isArray(triggers)) {
    throw new TypeError('The parameter format should be array');
  }

  const triggerType = _.get(payload, 'triggerType');

  // TODO：手动触发
  if (triggerType === 'manual_dispatch') {
    return {};
  }

  // TODO：定时触发
  if (triggerType === 'schedule') {
    return {};
  }

  // 如果 triggerType 存在，但是不为 manual_dispatch 或者 schedule，则为异常
  if (!_.isEmpty(triggerType)) {
    throw new Error(`Not support triggerType: ${triggerType}`);
  }

  // webhook events
  const EventClient = _.get(webhook, webhook.getTriggerEvent(payload));
  const eventClient = new EventClient(triggers, payload);
  return await eventClient.verify();
}

export = verifyLegitimacy;