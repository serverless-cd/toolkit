import _ from 'lodash';
import { IPayload, ITigger } from './types';
import Interceptor from './interceptor';
import { generateErrorResult } from './utils';

async function verifyLegitimacy(triggers: ITigger[], payload: IPayload) {
  if (!_.isArray(triggers)) {
    throw new TypeError('The parameter format should be array');
  }

  const results = [];
  for (const trigger of triggers) {
    const type = trigger?.interceptor;
    if (_.isEmpty(type) || !_.isString(type)) {
      const errorResult = generateErrorResult(`trigger config type error: ${type}`);
      results.push(errorResult);
      continue;
    }
    if (_.has(Interceptor, type)) {
      const interceptor = new Interceptor[type](trigger, payload);
      const result = await interceptor.verify();
      if (result.success) {
        return result;
      }
      results.push(result);
    }
    const errorResult = generateErrorResult(`Not support interceptor: ${type}`);
    results.push(errorResult);
  }
  return { success: false, results }
}

export = verifyLegitimacy;