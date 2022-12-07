import Engine, { IStepOptions, IContext } from '../src';
import { map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs');

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
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    { status: 'success' },
    {
      status: 'success',
      run: 'echo "hello"',
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
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    { status: 'success' },
    {
      status: 'success',
      run: 'echo "hello"',
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
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    { status: 'success' },
    {
      status: 'success',
      run: 'echo "hello"',
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
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    { status: 'success' },
    {
      status: 'success',
      run: 'echo "hello"',
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
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    status: item.status,
    run: item.run,
  }));
  expect(data).toEqual([
    { status: 'success' },
    {
      status: 'skipped',
      run: 'echo "hello"',
    },
    {
      status: 'success',
      run: 'echo "world"',
    },
  ]);
});
