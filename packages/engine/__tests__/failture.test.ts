import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test('某一步执行失败，后续步骤执行状态为skip', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
});

test('某一步执行失败，但该步骤添加了continue-on-error: true，后续步骤正常执行', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
    { run: 'echo "world"', id: 'xworld' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 error-with-continue
  expect(get(res, 'steps.xerror.status')).toBe('error-with-continue');
  // 步骤3 依然会执行
  expect(get(res, 'steps.xworld.status')).toBe('success');
});

test('某一步执行失败，但该步骤添加了continue-on-error: true，但执行步骤的终态是success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 error-with-continue
  expect(get(res, 'steps.xerror.status')).toBe('error-with-continue');
  // 步骤3 依然会执行
  expect(get(res, 'status')).toBe('success');
});

test('某一步执行失败，后续某步骤标记了if: {{ failure() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    { run: 'echo "end"', id: 'xend', if: '{{ failure() }}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
  // 步骤4 执行成功, 状态为 success
  expect(get(res, 'steps.xend.status')).toBe('success');
});

test('某一步执行失败，后续多个步骤标记了if: {{ failure() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld', if: '{{ failure() }}' },
    { run: 'echo "end"', id: 'xend', if: '{{ failure() }}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('success');
  // 步骤4 执行成功, 状态为 success
  expect(get(res, 'steps.xend.status')).toBe('success');
});

test("某一步执行失败，后续某步骤标记了if: {{ failure() && steps.xerror.status === 'failure' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      id: 'xend',
      if: "{{ failure() && steps.xerror.status === 'failure' }}",
    },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
  // 步骤4 执行成功, 状态为 success
  expect(get(res, 'steps.xend.status')).toBe('success');
});

test("某一步执行失败，后续某步骤标记了if: {{ failure() && steps.xerror.status !== 'failure' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      id: 'xend',
      if: "{{ failure() && steps.xerror.status !== 'failure' }}",
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
  // 步骤4 未执行, 状态为 skipped
  expect(get(res, 'steps.xend.status')).toBe('skipped');
});

test('某一步执行失败，后续某步骤标记了if: {{ success() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', if: '{{ success() }}', id: 'xworld' },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 未执行, 状态为 skipped
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
  // 步骤4 未执行, 状态为 skipped
  expect(get(res, 'steps.xend.status')).toBe('skipped');
});

test('某一步执行失败，后续某步骤标记了if: {{ always() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', if: '{{ always() }}', id: 'xworld' },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  // 步骤2 状态是 failure
  expect(get(res, 'steps.xerror.status')).toBe('failure');
  // 步骤3 依然执行
  expect(get(res, 'steps.xworld.status')).toBe('success');
  // 步骤4 未执行, 状态为 skipped
  expect(get(res, 'steps.xend.status')).toBe('skipped');
});
