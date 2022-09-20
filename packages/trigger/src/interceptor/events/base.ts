import _ from 'lodash';
import { IGithubWebhook, ITigger } from '../../types';

// webhook
export default abstract class BaseEvent {
  readonly triggers: ITigger[];
  readonly headers: { [key: string]: string; };
  readonly body: string;
  readonly requestPayload: any;

  constructor(triggers: ITigger[], requestPayload: IGithubWebhook) {
    const headers = _.get(requestPayload, 'headers');
    if (_.isEmpty(headers)) {
      throw new TypeError("must provide a 'headers' option");
    }

    const body = _.get(requestPayload, 'body');
    if (!_.isString(body)) {
      throw new TypeError("must provide a 'body' option");
    }

    this.triggers = triggers;
    this.headers = _.get(requestPayload, 'headers');
    this.body = _.get(requestPayload, 'body');

    try {
      requestPayload.body = JSON.parse(body);
      this.requestPayload = requestPayload;
    } catch(_e: any) {
      throw new Error('Body is not a json string');
    }
  }

  abstract verify(): Promise<any>;
}