import { isEmpty, isNil, isString } from 'lodash';
import getHookKeyword from './git/keyword';
import { IHookOutput, IHookPayload, IUserConfig } from './types';

async function webhook(hookPayload: IHookPayload, userConfig: IUserConfig): Promise<IHookOutput> {
  const { headers, body } = hookPayload || {};
  const { secret, on: eventsConfig } = userConfig || {};

  console.debug('webhook payload: ', hookPayload);
  console.debug('user custom payload: ', userConfig);

  if (isString(body)) {
    throw new TypeError("must provide a 'body' option");
  }

  let obj;
  try {
    obj = JSON.parse(body);
  } catch(_e: any) {
    throw new Error('Body is not a json string');
  }

  if (isEmpty(headers)) {
    throw new TypeError("must provide a 'headers' option");
  }

  if (isEmpty(eventsConfig)) {
    throw new TypeError("must provide a 'on' option");
  }

  const { signatureKey, eventKey, idKey, verify, filterEvent } = getHookKeyword(headers, secret);

  const {
    [signatureKey]: signature,
    [eventKey]: event,
    [idKey]: id,
  } = headers;

  if (isEmpty(event)) {
    throw new Error(`No ${eventKey} found on request`);
  }

  if (isEmpty(id)) {
    throw new Error(`No ${idKey} found on request`);
  }

  if (!verify(signature, body, obj)) {
    throw new Error(`${signatureKey} does not match blob signature`);
  }

  if (filterEvent) {
    const hasEvent = filterEvent(event, obj, eventsConfig);
    if (!isNil(hasEvent)) {
      return { success: true };
    }
  }

  return {
    success: false,
    message: `No ${event} event was matched`,
  }
}

export = webhook;
