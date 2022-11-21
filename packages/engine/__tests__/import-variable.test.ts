import Engine, { IStepOptions } from '../src';
import * as path from 'path';
import { get } from 'lodash';
const logPrefix = path.join(__dirname, 'logs');

test('contains: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ contains(github.ref, 'engine')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('success');
});

test('contains: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ contains(github.ref, 'engine')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('skipped');
});

test('startsWith: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ startsWith(github.ref, 'refs/heads')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('success');
});

test('startsWith: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ startsWith(github.ref, 'engine')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('skipped');
});

test.only('endsWith: if success', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ endsWith(github.ref, 'engine')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('success');
});

test.only('endsWith: if fail', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { run: 'echo "world"', if: "${{ endsWith(github.ref, 'engine')}}" },
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
  expect(get(res, 'steps[1].status')).toEqual('skipped');
});
