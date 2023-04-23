import { isEmpty, replace } from 'lodash';
import getArtTemplate from './get-art-template';

function getInputs(inputs: Record<string, any>, context: Record<string, any>) {
  if (isEmpty(inputs)) return;
  const artTemplate = getArtTemplate(context);
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

export default getInputs;
