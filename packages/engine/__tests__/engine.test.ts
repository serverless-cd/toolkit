import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test.skip('logger oss', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logPrefix,
    ossConfig: {
      accessKeyId: 'xxx',
      accessKeySecret: 'xxx',
      bucket: 'shl-test',
      region: 'cn-chengdu',
    },
  });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
});

test('获取某一步的outputs', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
});

test('cancel测试', (done) => {
  const lazy = (fn: any) => {
    setTimeout(() => {
      console.log('3s后执行 callback');
      fn();
    }, 3000);
  };
  const steps = [
    { run: 'echo "hello"' },
    { run: 'node packages/engine/__tests__/cancel-test.js' },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const callback = jest.fn(() => {
    engine.cancel();
  });
  lazy(callback);
  engine.start();
  setTimeout(() => {
    expect(callback).toBeCalled();
    done();
  }, 3001);
});

test('uses：应用测试返回值', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', inputs: { milliseconds: 10 } },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
  // error case
  // expect(get(res, 'steps.xuse.errorMessage').toString()).toMatch('Error');
});

test('script 测试', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      script: 'await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);\n',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xscript.status')).toBe('success');
});

test('inputs测试', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world', id: 'xworld', if: '{{name==="xiaoming"}}' },
    { run: 'echo {{name}}', id: 'xname' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logPrefix,
    inputs: { name: 'xiaoming', env: { name: 'xiaoming' } },
  });
  const res = await engine.start();
  expect(get(res, 'steps.xname.status')).toBe('success');
});
