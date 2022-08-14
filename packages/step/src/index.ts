import { getYamlContent, setServerlessCdVariable } from '@serverless-cd/core';
import { get, map, uniqueId } from 'lodash';
import createMachine from './createMachine';
import { IStepOptions } from './types';

async function step() {
  const pipelineContent = getYamlContent();
  const steps: IStepOptions[] = map(get(pipelineContent, 'job.steps', []), (item: IStepOptions) => {
    item.$stepCount = uniqueId();
    return item;
  });
  return await createMachine(steps);
}

export default step;
