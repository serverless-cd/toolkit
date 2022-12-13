import Engine, { IStepOptions, IContext } from '../src';
import { lodash } from '@serverless-cd/core';
import * as path from 'path';
const { map } = lodash;
const logPrefix = path.join(__dirname, 'logs');

test('某一步执行失败，错误信息记录在context.error', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  expect(res.error).toBeInstanceOf(Error);
});

test('某一步执行失败，后续步骤执行状态为skip', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'skipped',
      run: 'echo "world"',
    },
  ]);
});

test('某一步执行失败，但该步骤添加了continue-on-error: true，后续步骤正常执行', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
    { run: 'echo "world"', id: 'xworld' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'error-with-continue',
      run: 'npm run error',
    },
    {
      status: 'success',
      run: 'echo "world"',
    },
  ]);
});

test('某一步执行失败，但该步骤添加了continue-on-error: true，但执行步骤的终态是success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect.assertions(2);
  console.log(JSON.stringify(data, null, 2));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'error-with-continue',
      run: 'npm run error',
    },
  ]);
  expect(res?.status).toBe('success');
});

test('某一步执行失败，后续某步骤标记了if: ${{ failure() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    { run: 'echo "end"', id: 'xend', if: '${{ failure() }}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'skipped',
      run: 'echo "world"',
    },
    {
      status: 'success',
      run: 'echo "end"',
    },
  ]);
});

test('某一步执行失败，后续多个步骤标记了if: ${{ failure() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld', if: '${{ failure() }}' },
    { run: 'echo "end"', id: 'xend', if: '${{ failure() }}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'success',
      run: 'echo "world"',
    },
    {
      status: 'success',
      run: 'echo "end"',
    },
  ]);
});

test("某一步执行失败，后续某步骤标记了if: ${{ failure() && steps.xerror.status === 'failure' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      id: 'xend',
      if: "${{ failure() && steps.xerror.status === 'failure' }}",
    },
  ] as IStepOptions[];

  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'skipped',
      run: 'echo "world"',
    },
    {
      status: 'success',
      run: 'echo "end"',
    },
  ]);
});

test("某一步执行失败，后续某步骤标记了if: ${{ failure() && steps.xerror.status !== 'failure' }}", async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', id: 'xworld' },
    {
      run: 'echo "end"',
      id: 'xend',
      if: "${{ failure() && steps.xerror.status !== 'failure' }}",
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'skipped',
      run: 'echo "world"',
    },
    {
      status: 'skipped',
      run: 'echo "end"',
    },
  ]);
});

test('某一步执行失败，后续某步骤标记了if: ${{ success() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', if: '${{ success() }}', id: 'xworld' },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'skipped',
      run: 'echo "world"',
    },
    {
      status: 'skipped',
      run: 'echo "end"',
    },
  ]);
});

test('某一步执行失败，后续某步骤标记了if: ${{ always() }}', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'npm run error', id: 'xerror' },
    { run: 'echo "world"', if: '${{ always() }}', id: 'xworld' },
    { run: 'echo "end"', id: 'xend' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    {
      status: 'success',
    },
    {
      status: 'success',
      run: 'echo "hello"',
    },
    {
      status: 'failure',
      run: 'npm run error',
    },
    {
      status: 'success',
      run: 'echo "world"',
    },
    {
      status: 'skipped',
      run: 'echo "end"',
    },
  ]);
});
