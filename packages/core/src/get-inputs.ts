import { isEmpty, includes } from 'lodash';
import artTemplate from 'art-template';

interface IkeyValue {
  [key: string]: any;
}

interface IConfig {
  inputs: IkeyValue;
  context: IkeyValue;
}

export function getInputs(config: IConfig) {
  const { inputs, context } = config;
  if (isEmpty(inputs)) return;
  function deepCopy(obj: any) {
    let result: any = obj.constructor === Array ? [] : {};
    if (typeof obj === 'object') {
      for (var i in obj) {
        let val = obj[i];
        if (typeof val === 'string') {
          const compile = artTemplate.compile(val);
          val = compile({ ...context, secret: context.env });
        }
        result[i] = typeof val === 'object' ? deepCopy(val) : val;
      }
    } else {
      result = obj;
    }
    return result;
  }
  return deepCopy(inputs);
}

export function getSecretInputs(config: IConfig) {
  const { inputs, context } = config;
  if (isEmpty(inputs)) return;
  function deepCopy(obj: any) {
    let result: any = obj.constructor === Array ? [] : {};
    if (typeof obj === 'object') {
      for (var i in obj) {
        let val = obj[i];
        if (includes(val, 'secret.')) {
          const compile = artTemplate.compile(val);
          val = compile({ secret: context.env });
          val =
            val.length > 8
              ? val.slice(0, 3) + '*'.repeat(val.length - 6) + val.slice(val.length - 3, val.length)
              : '***';
        } else if (typeof val === 'string') {
          const compile = artTemplate.compile(val);
          val = compile({ ...context });
        }
        result[i] = typeof val === 'object' ? deepCopy(val) : val;
      }
    } else {
      result = obj;
    }
    return result;
  }
  return deepCopy(inputs);
}
