import { isEmpty, replace } from 'lodash';
import artTemplate from 'art-template';

interface IkeyValue {
  [key: string]: any;
}

export function getInputs(inputs: IkeyValue, context: IkeyValue) {
  if (isEmpty(inputs)) return;
  function deepCopy(obj: any) {
    let result: any = obj.constructor === Array ? [] : {};
    if (typeof obj === 'object') {
      for (var i in obj) {
        let val = obj[i];
        if (typeof val === 'string') {
          val = replace(val, /\${{/g, '{{');
          const compile = artTemplate.compile(val);
          val = compile(context['$variables']);
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
