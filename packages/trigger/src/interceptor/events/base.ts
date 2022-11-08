import _ from 'lodash';
import { IGithubWebhook, ITriggers, IProvider } from '../../types';

// webhook
export default abstract class BaseEvent {
  readonly triggers: ITriggers;
  readonly headers: { [key: string]: string };
  readonly body: string;
  readonly requestPayload: any;
  readonly provider: IProvider;

  constructor(triggers: ITriggers, requestPayload: IGithubWebhook, provider: IProvider) {
    const headers = _.get(requestPayload, 'headers');
    if (_.isEmpty(headers)) {
      throw new TypeError("must provide a 'headers' option");
    }
    const body = _.get(requestPayload, 'body');
    if (!_.isPlainObject(body)) {
      throw new Error('Body is not a json');
    }

    this.provider = provider;
    this.triggers = triggers;
    this.headers = headers;
    this.requestPayload = requestPayload;
    this.body = JSON.stringify(body);
  }

  abstract verify(): Promise<any>;
}
