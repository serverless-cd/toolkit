import Engine, { IStepOptions, IContext } from '../src';
import { SERVERLESS_CD_KEY, SERVERLESS_CD_VALUE } from '../src/constants';
import { lodash, parseSpec } from '@serverless-cd/core';
import * as path from 'path';
const { get, find } = lodash;
const logPrefix = path.join(__dirname, 'logs');

test('模版可以识别 ${{env.name}}', async () => {
  const steps = [
    { run: 'echo ${{env.name}}', env: { name: 'xiaoming' } },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('模版可以识别 ${{steps.xuse.outputs.success}}', async () => {
  const steps = [
    { plugin: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo ${{steps.xuse.outputs.success}}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = find(res?.steps, (item) => item.stepCount === res?.stepCount);
  expect(data?.outputs).toEqual({ success: true });
});

test('shell 指令支持多个指令执行 && ', async () => {
  const steps = [{ run: 'echo aa && echo bb' }] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('shell 指令支持多个指令执行 >  ', async () => {
  const steps = [{ run: `echo aa > ${logPrefix}/pipe.txt` }] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('环境变量测试', async () => {
  const steps = [{ run: `echo hello` }];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(process.env[SERVERLESS_CD_KEY]).toBe(SERVERLESS_CD_VALUE);
});

test('post run add runStepCount', async () => {
  const steps = [
    { plugin: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo ${{steps.xuse.outputs.success}}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  expect(res.status).toBe('success');
});

test('plugin支持指定版本', async () => {
  const steps = [{ plugin: '@serverless-cd/cache@0.0.8' }] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  expect(res.status).toBe('success');
});

test('plugin安装最新版本', async () => {
  const steps = [{ plugin: '@serverless-cd/cache' }] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  expect(res.status).toBe('success');
});

test('测试postRun多个case', async () => {
  const steps = [{ plugin: '@serverless-cd/cache', name: 'A' }, { plugin: '@serverless-cd/cache', name: 'B' }, { run: 'npm run error' }] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  console.log(res);
  expect(res.status).toBe('failure');
});

test.only('run 包含多个脚本', async () => {
  const engine = new Engine({
    logConfig: { logPrefix },
    inputs: {
      sts: {
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret',
        securityToken: 'securityToken',
      }
    },
    events: {
      onInit: async (ctx) => {
        return parseSpec(path.join(__dirname, 'mock', './run.yaml'));
      },
    },
  });
  const res: IContext | undefined = await engine.start();
  expect(res.status).toBe('success');
});
