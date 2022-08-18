import Engine from '../src';
import { IStepOptions } from '../src/types';
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

describe('执行step全部成功', () => {
  test('获取某一步的output', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'serverless-pipeline.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    expect(get(res, 'steps.xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
  });

  test('模版可以识别{{steps.xhello.output.code === 0}}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'if-condition-true.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的output
    expect(get(res, 'steps.xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
    // 步骤2执行成功说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('success');
  });

  test('模版可以识别{{steps.xhello.output.code !== 0}}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'if-condition-false.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的output
    expect(get(res, 'steps.xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
    // 步骤2的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
  });

  test('模版可以识别{{steps.xhello.output.code === 0 && steps.xworld.output.code === 0}}', async () => {
    core.setServerlessCdVariable(
      'TEMPLATE_PATH',
      path.join(__dirname, 'if-many-condition-true.yaml'),
    );
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的output
    expect(get(res, 'steps.xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
    // 获取步骤2的output
    expect(get(res, 'steps.xworld.output')).toEqual({ code: 0, stdout: '"world"\n' });
    // 步骤3执行成功说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('模版可以识别{{steps.xhello.output.code === 0 && steps.xworld.output.code !== 0}}', async () => {
    core.setServerlessCdVariable(
      'TEMPLATE_PATH',
      path.join(__dirname, 'if-many-condition-false.yaml'),
    );
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的output
    expect(get(res, 'steps.xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
    // 获取步骤2的output
    expect(get(res, 'steps.xworld.output')).toEqual({ code: 0, stdout: '"world"\n' });
    // 步骤3的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });
});

describe('某一步执行失败', () => {
  test('后续步骤执行状态为skip', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'error.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
  });

  test('但该步骤添加了continue-on-error: true，后续步骤正常执行', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'continue-on-error.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 error-with-continue
    expect(get(res, 'steps.xerror.status')).toBe('error-with-continue');
    // 步骤3 依然会执行
    expect(get(res, 'steps.xworld.status')).toBe('success');
  });

  test('后续某步骤标记了if: {{ failure() }}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'failure.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('后续多个步骤标记了if: {{ failure() }}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'many-failure.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('后续某步骤标记了if: {{ failure() && steps.xerror.output.code !== 0 }}', async () => {
    core.setServerlessCdVariable(
      'TEMPLATE_PATH',
      path.join(__dirname, 'failure-and-output-true.yaml'),
    );
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('后续某步骤标记了if: {{ failure() && steps.xerror.output.code === 0 }}', async () => {
    core.setServerlessCdVariable(
      'TEMPLATE_PATH',
      path.join(__dirname, 'failure-and-output-false.yaml'),
    );
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });

  test('后续某步骤标记了if: {{ success() }}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'success.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });

  test.only('后续某步骤标记了if: {{ always() }}', async () => {
    core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'always.yaml'));
    const steps = getStep();
    const engine = new Engine(steps);
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 依然执行
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });
});
