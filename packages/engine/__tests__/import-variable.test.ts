import Engine, { IStepOptions } from '../src';
import * as path from 'path';
import { get, find } from 'lodash';
const logPrefix = path.join(__dirname, 'logs');

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
