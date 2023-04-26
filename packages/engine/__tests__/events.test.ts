import Engine, { IStepOptions } from '../src';
import { lodash, parseSpec } from '@serverless-cd/core';
import * as path from 'path';
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { map } = lodash;
const logPrefix = path.join(__dirname, 'logs');
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('执行终态emit测试', () => {
  test('completed', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"' },
    ] as IStepOptions[];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      events: {
        onCompleted: async function (context) {
          const newData = map(context.steps, (item: any) => ({
            run: item.run,
            status: item.status,
          }));
          expect(newData).toEqual([
            { run: 'echo "hello"', status: 'success' },
            { run: 'echo "world"', status: 'success' },
          ]);
        },
      },
    });
    await engine.start();
  });
});

describe('步骤执行过程中emit测试', () => {
  test('plugin success on process', async () => {
    const steps = [
      {
        plugin: path.join(__dirname, 'fixtures', 'success'),
        id: 'xapp',
        inputs: { milliseconds: 10 },
      },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const newData: any = [];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      events: {
        async onPostRun(data) {
          const obj: any = {
            status: data.status,
          };
          if (data.errorMessage) {
            obj['errorMessage'] = data.errorMessage;
          }
          if (data.outputs) {
            obj['outputs'] = data.outputs;
          }
          newData.push(obj);
        },
      },
      inputs: {
        ak: 123,
      },
    });
    await engine.start();
    expect(newData).toEqual([
      { status: 'success', outputs: { success: true } },
      { status: 'success', outputs: {} },
    ]);
  });
  test('plugin success on process', async () => {
    const steps = [
      {
        plugin: path.join(__dirname, 'fixtures', 'success'),
        id: 'xapp',
        inputs: { milliseconds: 10 },
      },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const newData: any = [];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      events: {
        async onPreRun(data) {
          const obj: any = {
            status: data.status,
          };
          if (data.errorMessage) {
            obj['errorMessage'] = data.errorMessage;
          }
          if (data.outputs) {
            obj['outputs'] = data.outputs;
          }
          newData.push(obj);
        },
        async onInit(context) {
          expect(context.status).toBe('running');
        },
      },
    });
    await engine.start();
    expect(newData).toEqual([{ status: 'running' }, { status: 'running' }]);
  });
  test('onPreRun throw error', async () => {
    const steps = [
      {
        run: "echo 'Hi {{ env.name }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ task_id }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ app.user_name }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ git.event_name }}'",
        env: {},
      },
    ] as IStepOptions[];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      inputs: {
        env: { name: 'xiaoming' },
        task_id: 123,
        app: { user_name: 'xiaohong' },
        git: {
          event_name: 'push',
        },
      },
      events: {
        onPreRun(data, context) {
          console.log('onPreRun', data);
          throw new Error('onPreRun');
        },
        async onPostRun(data, context) {
          console.log('onPostRun', data);
        },
        onCompleted: async function (context) {
          console.log('onCompleted', context);
        },
      },
    });
    const context = await engine.start();
    console.log(context);

    expect(context?.status).toBe('failure');
  });
  test('onPostRun throw error', async () => {
    const steps = [
      {
        run: "echo 'Hi {{ env.name }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ task_id }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ app.user_name }}'",
        env: {},
      },
      {
        run: "echo 'Hi {{ git.event_name }}'",
        env: {},
      },
    ] as IStepOptions[];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      inputs: {
        env: { name: 'xiaoming' },
        task_id: 123,
        app: { user_name: 'xiaohong' },
        git: {
          event_name: 'push',
        },
      },
      events: {
        async onPreRun(data, context) {
          console.log('onPreRun', data);
        },
        onPostRun(data, context) {
          console.log('onPostRun');
          throw new Error('onPostRun');
        },
        onCompleted: async function (context) {
          console.log('onCompleted', context);
        },
      },
    });
    const context = await engine.start();
    console.log(context);

    expect(context?.status).toBe('success');
  });
});

test('测试context status(task status)', async () => {
  const steps = [{ run: 'echo "hello"', id: 'xhello' }, { run: 'echo "world"' }] as IStepOptions[];
  const statusList: string[] = [];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onInit: async function (context) {
        statusList.push(context.status);
      },
      onCompleted: async function (context) {
        statusList.push(context.status);
      },
    },
  });
  await engine.start();
  expect(statusList).toEqual(['running', 'success']);
});

test('测试onInit 成功 返回steps数据', async () => {
  const engine = new Engine({
    logConfig: {
      logPrefix,
      // ossConfig: {
      //   accessKeyId: 'xx',
      //   accessKeySecret: 'xx',
      //   bucket: 'xxx',
      //   region: 'xxx',
      // },
    },
    events: {
      onInit: async function (context, logger) {
        await sleep(2000);
        // logger.info(`this is a test on init`, context);
        return {
          steps: [
            { run: 'echo "hello from onInit"', id: 'xhello' },
            { run: 'echo "world from onInit"' },
          ],
        };
      },
      async onPreRun(data, context, logger) {
        // logger.info('onPreRun', data);
      },
      async onPostRun(data, context, logger) {
        logger.info('onPostRun', data);
      },
      onCompleted: async function (context, logger) {
        await sleep(2000);
        logger.info('onCompleted', context);
      },
    },
  });
  const res = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    run: item.run || item.name,
    status: item.status,
  }));
  expect(data).toEqual([
    { run: 'Set up task', status: 'success' },
    { run: 'echo "hello from onInit"', status: 'success' },
    { run: 'echo "world from onInit"', status: 'success' },
  ]);
});

test('测试onInit执行失败', async () => {
  const steps = [{ run: 'echo "hello"', id: 'xhello' }, { run: 'echo "world"' }] as IStepOptions[];

  const engine = new Engine({
    steps,
    logConfig: {
      logPrefix,
      ossConfig: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        accessKeySecret: process.env.ACCESS_KEY_SECRET as string,
        bucket: process.env.BUCKET as string,
        region: process.env.REGION as string,
      },
    },
    events: {
      onInit: async function (context, logger) {
        await sleep(2000);
        logger.info(`this is a test on init, ${JSON.stringify(context)}`);
        throw new Error('onInit error');
      },
      async onPreRun(data, context, logger) {
        logger.info('onPreRun', data);
      },
      async onPostRun(data, context, logger) {
        logger.info('onPostRun', data);
      },
      onCompleted: async function (context, logger) {
        await sleep(2000);
        logger.info('onCompleted', context);
        throw new Error('onCompleted error');
      },
    },
  });
  const res = await engine.start();
  const data = map(res?.steps, (item: any) => ({
    run: item.run || item.name,
    status: item.status,
  }));
  expect(data).toEqual([
    { run: 'Set up task', status: 'failure' },
    { run: 'echo "hello"', status: 'skipped' },
    { run: 'echo "world"', status: 'skipped' },
  ]);
});


test.only('测试onInit获取yaml格式不正确，日志上报问题', async () => {
  const engine = new Engine({
    logConfig: {
      logPrefix,
      ossConfig: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        accessKeySecret: process.env.ACCESS_KEY_SECRET as string,
        bucket: process.env.BUCKET as string,
        region: process.env.REGION as string,
      },
    },
    events: {
      onInit: async function (context, logger) {
        await sleep(2000);
        logger.info(`this is a test on init, ${JSON.stringify(context)}`);
        return parseSpec(path.join(__dirname, 'mock', './serverless-pipeline-error.yaml'));
      },
      onCompleted: async function (context, logger) {
        logger.info('onCompleted', context);
      }
    },
  });
  const res = await engine.start();
  console.log(res);
  expect(res.error.toString()).toMatch('Error: serverless-pipeline-error.yaml format is incorrect: bad indentation of a mapping entry');
});

test('测试context completed(task status)', async () => {
  const steps = [{ run: 'echo "hello"', id: 'xhello' }, { run: 'echo "world"' }] as IStepOptions[];
  const statusList: boolean[] = [];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onInit: async function (context) {
        statusList.push(context.completed);
      },
      onCompleted: async function (context) {
        statusList.push(context.completed);
      },
    },
  });
  await engine.start();
  expect(statusList).toEqual([false, true]);
});

test('自定义logger时，日志debug级别输出', async () => {
  const steps = [{ run: 'echo "hello"', id: 'xhello' }, { run: 'echo "world"' }] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix, customLogger: console },
    events: {
      onInit: async function (context) {
        throw new Error('onInit error');
      },
    },
  });
  const res = await engine.start();
  expect(res.status).toEqual('failure');
});