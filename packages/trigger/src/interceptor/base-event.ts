import _ from 'lodash';
import { IRequestPayload, ITigger } from '../types';

export default abstract class BaseEvent {
  readonly trigger: ITigger;
  readonly headers: { [key: string]: string; };
  readonly body: string;
  readonly requestPayload: any;

  constructor(trigger: ITigger, requestPayload: IRequestPayload) {
    const headers = _.get(requestPayload, 'headers');
    if (_.isEmpty(headers)) {
      throw new TypeError("must provide a 'headers' option");
    }

    const body = _.get(requestPayload, 'body');
    if (!_.isString(body)) {
      throw new TypeError("must provide a 'body' option");
    }

    try {
      JSON.parse(body);
    } catch(_e: any) {
      throw new Error('Body is not a json string');
    }
    
    this.trigger = trigger;
    this.headers = _.get(requestPayload, 'headers');
    this.body = _.get(requestPayload, 'body');

    requestPayload.body = JSON.parse(requestPayload.body);
    this.requestPayload = requestPayload;
  }

  abstract handler(): Promise<any>;
}