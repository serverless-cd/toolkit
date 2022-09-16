import _ from 'lodash';
import { IRequestPayload, ITigger } from './types';
import Interceptor from './interceptor';

async function verifyLegitimacy(triggers: ITigger[], requestPayload: IRequestPayload) {
  if (!_.isArray(triggers)) {
    throw new TypeError('The parameter format should be array');
  }

  for (const trigger of triggers) {
    const type = trigger?.interceptor;
    if (_.isEmpty(type) || !_.isString(type)) {
      throw new TypeError(`trigger config type error: ${type}`);
    }
    if (_.has(Interceptor, type)) {
      const interceptor = new Interceptor[type](trigger, requestPayload);
      const result = await interceptor.handler();
      if (result.success) {
        return result;
      }
    }
    console.error(`Not support interceptor: ${type}`);
  }
  return { success: false }
}

export = verifyLegitimacy;