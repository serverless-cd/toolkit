import Engine, { IStepOptions } from '../src';
import { lodash } from '@serverless-cd/core';
import * as path from 'path';
const { find } = lodash;
const logPrefix = path.join(__dirname, 'logs');

test('hashFile test', async () => {
  const steps = [
    {
      plugin: path.join(__dirname, 'fixtures', 'hash-file'),
      id: 'xuse',
      inputs: {
        key: '${{env.name}}-${{hashFile("package-lock.json")}}',
      }
    }
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: {
      env: {
        name: 'test'
      }
    }
  });
  const res = await engine.start();
  console.log(res);
  expect(res?.status).toEqual('success');
});

test('contains: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ contains(github.ref, 'engine')}}", id: 'contains' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/engine',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'contains' });
  expect(obj?.status).toEqual('success');
});

test('contains: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ contains(github.ref, 'engine')}}", id: 'contains' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/main',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'contains' });
  expect(obj?.status).toEqual('skipped');
});

test('startsWith: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ startsWith(github.ref, 'refs/heads')}}", id: 'startsWith' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/main',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'startsWith' });
  expect(obj?.status).toEqual('success');
});

test('startsWith: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ startsWith(github.ref, 'engine')}}", id: 'startsWith' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/main',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'startsWith' });
  expect(obj?.status).toEqual('skipped');
});

test('endsWith: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ endsWith(github.ref, 'engine')}}", id: 'endsWith' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/engine',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'endsWith' });
  expect(obj?.status).toEqual('success');
});

test('endsWith: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ endsWith(github.ref, 'engine')}}", id: 'endsWith' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    events: {
      onCompleted: async function (context) {
        throw new Error('onCompleted error');
      },
    },
    inputs: {
      github: {
        ref: 'refs/heads/main',
      },
    },
  });
  const res = await engine.start();
  console.log(res);
  const obj = find(res.steps, { id: 'endsWith' });
  expect(obj?.status).toEqual('skipped');
});

test('toJSON git', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo ${{toJSON(git)}}', id: 'toJSON' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: {
      git: {
        token: '1234567890123456789',
        provider: 'gitee',
        owner: 'shihuali',
        cloneUrl: 'https://gitee.com/shihuali/checkout.git',
        ref: 'refs/heads/test',
      },
    },
  });
  const res = await engine.start();
  expect(res.status).toBe('success');
});

test('toJSON secrets', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo ${{toJSON(secrets)}}', id: 'toJSON' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: {
      secrets: {
        token: '1234567890123456789',
        provider: 'gitee',
        owner: 'shihuali',
        cloneUrl: 'https://gitee.com/shihuali/checkout.git',
        ref: 'refs/heads/test',
      },
    },
  });
  const res = await engine.start();
  expect(res.status).toBe('success');
});

test('toJSON env', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      run: 'echo ${{toJSON(env)}}',
      id: 'toJSON',
      env: {
        token: '1234567890123456789',
        provider: 'gitee',
        owner: 'shihuali',
        cloneUrl: 'https://gitee.com/shihuali/checkout.git',
        ref: 'refs/heads/test',
      },
    },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
  });
  const res = await engine.start();
  expect(res.status).toBe('success');
});

test('toJSON inputs', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    {
      run: 'echo inputs is ${{toJSON(inputs)}}',
      id: 'toJSON',
    },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: {
      secrets: {
        token: '1234567890123456789',
        provider: 'gitee',
        owner: 'shihuali',
        cloneUrl: 'https://gitee.com/shihuali/checkout.git',
        ref: 'refs/heads/test',
      },
    },
  });
  const res = await engine.start();
  expect(res.status).toBe('success');
});
