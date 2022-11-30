import Engine, { IStepOptions, IContext } from '../src';
import { get, map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test.skip('logger oss', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { plugin: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: {
      logPrefix,
      ossConfig: {
        accessKeyId: 'xxx',
        accessKeySecret: 'xxx',
        bucket: 'shl-test',
        region: 'cn-chengdu',
      },
    },
  });
  const res: IContext | undefined = await engine.start();
  expect(res?.status).toBe('success');
});

test('自定义logger', async () => {
  const steps = [{ run: 'echo "hello"', id: 'xhello' }, { run: 'echo "world"' }] as IStepOptions[];

  const customLogger = {
    info: (msg: string) => {
      console.log('customLogger info', msg);
    },
    warn: (msg: string) => {
      console.log('customLogger warn', msg);
    },
    debug: (msg: string) => {
      console.log('customLogger debug', msg);
    },
  };

  const engine = new Engine({ steps, logConfig: { customLogger } });
  const res: IContext | undefined = await engine.start();
  expect(res?.status).toBe('success');
});

test('获取某一步的outputs', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { plugin: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix, logLevel: 'DEBUG' } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item) => ({
    status: item.status,
    outputs: item.outputs,
  }));

  expect(res?.status).toBe('success');
  expect(data).toEqual([
    { status: 'success', outputs: {} },
    { status: 'success', outputs: { success: true } },
    { status: 'success', outputs: {} },
    { status: 'success', outputs: { success: true } },
  ]);
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
  const engine = new Engine({ steps, logConfig: { logPrefix } });
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
    { plugin: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item) => ({
    status: item.status,
    id: item.id,
    outputs: item.outputs,
  }));
  expect(data).toEqual([
    {
      status: 'success',
      id: 'xhello',
      outputs: {},
    },
    {
      status: 'success',
      id: 'xuse',
      outputs: {
        success: true,
      },
    },
    {
      status: 'success',
      id: 'xuse',
      outputs: {
        success: true,
      },
    },
  ]);
});

test('script 测试', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      script: 'await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);\n',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('inputs测试', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world', id: 'xworld', if: '${{name==="xiaoming"}}' },
    { run: 'echo ${{name}}', id: 'xname' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix, logLevel: 'DEBUG' },
    inputs: { name: 'xiaoming' },
  });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item) => ({
    status: item.status,
    id: item.id,
  }));
  expect(data).toEqual([
    { status: 'success', id: 'xhello' },
    { status: 'success', id: 'xworld' },
    { status: 'success', id: 'xname' },
  ]);
});

test('inputs测试 env', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo ${{env.name}}', id: 'xname', env: { name: 'xiaohong' } },
    { run: 'echo ${{env.name}}', id: 'xname' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix, logLevel: 'DEBUG' },
    inputs: { env: { name: 'xiaoming' } },
  });
  const res: IContext | undefined = await engine.start();
  const data = map(res?.steps, (item) => ({
    status: item.status,
    id: item.id,
  }));
  expect(data).toEqual([
    { status: 'success', id: 'xhello' },
    { status: 'success', id: 'xname' },
    { status: 'success', id: 'xname' },
  ]);
});
