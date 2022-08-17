import { getYamlContent } from '@serverless-cd/core';
import { get, map, uniqueId } from 'lodash';
import createMachine from './createMachine';
import { IStepOptions } from './types';

async function engine() {
  const pipelineContent: any = getYamlContent();
  const jobs = get(pipelineContent, 'jobs', {});
  let steps = [] as IStepOptions[];
  for (const key in jobs) {
    steps = map(get(jobs[key], 'steps', []), (item: IStepOptions) => {
      item.$stepCount = uniqueId();
      return item;
    });
    // 暂时只支持一个job
    break;
  }
  return await createMachine(steps);
}

export default engine;
