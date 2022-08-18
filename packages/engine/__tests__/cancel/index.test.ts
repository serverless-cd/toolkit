import Engine from '../../src';
import { IStepOptions } from '../../src/types';
import * as path from 'path';
import * as core from '@serverless-cd/core';
import { get, map, uniqueId } from 'lodash';

function getStep() {
  const pipelineContent: any = core.getYamlContent();
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
  return steps;
}

export const lazy = (fn: any) => {
  setTimeout(() => {
    console.log('3s后执行 callback');
    fn();
  }, 3000);
};

test('cancel测试', (done) => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'cancel.yaml'));
  const steps = getStep();
  const engine = new Engine(steps);
  const callback = jest.fn(() => {
    engine.cancel();
  });
  lazy(callback);
  engine.start();
  setTimeout(() => {
    expect(callback).toBeCalled();
    expect(process.exitCode).toBe(2);
    done();
  }, 3001);
});
