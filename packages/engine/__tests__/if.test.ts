import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test('模版可以识别${{steps.xhello.status === "success"}}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      run: 'echo "world"',
      if: '${{ steps.xhello.status === "success" }}',
      id: 'xworld',
    },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  // 获取步骤1的status
  expect(get(res, 'steps.xhello.status')).toBe('success');
  // 步骤2执行成功说明模版识别成功
  expect(get(res, 'steps.xworld.status')).toBe('success');
});

test('模版可以识别${{steps.xhello.status !== "success"}}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      run: 'echo "world"',
      if: '${{ steps.xhello.status !== "success" }}',
      id: 'xworld',
    },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  // 获取步骤1的status
  expect(get(res, 'steps.xhello.status')).toBe('success');
  // 步骤2的执行状态为skip，说明模版识别成功
  expect(get(res, 'steps.xworld.status')).toBe('skipped');
});

test("模版可以识别${{ steps.xhello.status === 'success' && steps.xworld.status === 'success' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      if: "${{ steps.xhello.status === 'success' && steps.xworld.status === 'success' }}",
      id: 'xend',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  // 获取步骤1的状态
  expect(get(res, 'steps.xhello.status')).toBe('success');
  // 获取步骤2的状态
  expect(get(res, 'steps.xworld.status')).toBe('success');
  // 步骤3执行成功说明模版识别成功
  expect(get(res, 'steps.xend.status')).toBe('success');
});

test("模版可以识别${{ steps.xhello.status === 'success' && steps.xworld.status !== 'success' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      if: "${{ steps.xhello.status === 'success' && steps.xworld.status !== 'success' }}",
      id: 'xend',
    },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  // 获取步骤1的状态
  expect(get(res, 'steps.xhello.status')).toBe('success');
  // 获取步骤2的状态
  expect(get(res, 'steps.xworld.status')).toBe('success');
  // 步骤3的执行状态为skip，说明模版识别成功
  expect(get(res, 'steps.xend.status')).toBe('skipped');
});
test('模版可以识别 ${{env.name === "xiaoming"}}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello', if: '${{ env.name === "xiaoming" }}' },
    {
      run: 'echo "world"',
      id: 'xworld',
      if: '${{ env.name === "xiaoming" }}',
      env: { name: 'xiaoming' },
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'steps')).toEqual({
    xhello: { status: 'skipped' },
    xworld: { status: 'success', outputs: {} },
  });
});
